<?php

namespace App\Http\Controllers\User;

use App\Enums\OrderStatus;
use App\Events\OrderCancelled;
use App\Events\ReturnRequested;
use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ReturnRequest;
use App\Models\User;
use App\Models\UserAddress;
use App\Services\ShippingService;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
	protected ShippingService $shippingService;

	public function __construct(ShippingService $shippingService)
	{
		$this->middleware('auth');
		$this->shippingService = $shippingService;
	}

	public function index(Request $request): Response
	{
		$this->authorize('viewAny', Order::class);

		/** @var User $user */
		$user = Auth::user();

		$allowedStatuses = OrderStatus::values();
		$statusAliases = [
			'pending_confirmation' => [OrderStatus::PENDING_CONFIRMATION->value],
			'processing' => [
				OrderStatus::PROCESSING->value,
				OrderStatus::PENDING_ASSIGNMENT->value,
			],
			'shipped' => [
				OrderStatus::ASSIGNED_TO_SHIPPER->value,
				OrderStatus::DELIVERING->value,
			],
			'delivered' => [
				OrderStatus::DELIVERED->value,
				OrderStatus::COMPLETED->value,
			],
			'cancelled' => [OrderStatus::CANCELLED->value],
			'returned_refunded' => [OrderStatus::RETURNED->value],
		];
		$validStatusValues = array_merge($allowedStatuses, array_keys($statusAliases));

		$request->validate([
			'date_from' => ['nullable', 'date'],
			'date_to' => ['nullable', 'date', 'after_or_equal:date_from'],
			'search' => ['nullable', 'string', 'max:120'],
			'sort' => ['nullable', Rule::in(['newest', 'oldest', 'total_asc', 'total_desc'])],
		]);

		$statusInput = $request->input('status');
		if (is_array($statusInput)) {
			$request->validate(['status.*' => ['string', Rule::in($validStatusValues)]]);
			$statuses = $statusInput;
		} elseif ($statusInput !== null && $statusInput !== '') {
			$request->validate(['status' => ['string', Rule::in($validStatusValues)]]);
			$statuses = [$statusInput];
		} else {
			$statuses = null;
		}

		$filters = $request->only(['status', 'date_from', 'date_to', 'search', 'sort']);

		$ordersQuery = Order::query()
			->where('customer_id', $user->id)
			->with([
				'items.variant.product.images' => fn($query) => $query->where('is_primary', true),
			]);

		if ($statuses) {
			$normalizedStatuses = [];
			foreach ($statuses as $statusValue) {
				if (isset($statusAliases[$statusValue])) {
					$normalizedStatuses = array_merge($normalizedStatuses, $statusAliases[$statusValue]);
				} else {
					$normalizedStatuses[] = $statusValue;
				}
			}

			$ordersQuery->whereIn('status', array_unique($normalizedStatuses));
		}

		if ($request->filled('date_from')) {
			$ordersQuery->whereDate('created_at', '>=', Carbon::parse($request->input('date_from'))->startOfDay());
		}

		if ($request->filled('date_to')) {
			$ordersQuery->whereDate('created_at', '<=', Carbon::parse($request->input('date_to'))->endOfDay());
		}

		if ($request->filled('search')) {
			$searchTerm = '%' . $request->input('search') . '%';
			$ordersQuery->where(function ($query) use ($searchTerm) {
				$query->where('order_number', 'like', $searchTerm)
					->orWhereHas('items.variant.product', fn($q) => $q->where('name', 'like', $searchTerm))
					->orWhereHas('items.variant.product.seller', fn($q) => $q->where('name', 'like', $searchTerm));
			});
		}

		switch ($request->input('sort', 'newest')) {
			case 'oldest':
				$ordersQuery->orderBy('created_at', 'asc');
				break;
			case 'total_asc':
				$ordersQuery->orderBy('total_amount', 'asc');
				break;
			case 'total_desc':
				$ordersQuery->orderBy('total_amount', 'desc');
				break;
			default:
				$ordersQuery->orderBy('created_at', 'desc');
		}

		$orders = $ordersQuery->paginate(15)->withQueryString();

		$statusCounts = DB::table('orders')
			->select('status', DB::raw('count(*) as count'))
			->where('customer_id', $user->id)
			->groupBy('status')
			->pluck('count', 'status')
			->map(fn($count) => (int) $count)
			->toArray();

		$tabDefinitions = array_merge(['all' => $allowedStatuses], $statusAliases);

		$tabCounts = [];
		foreach ($tabDefinitions as $tabKey => $statusGroup) {
			if ($tabKey === 'all') {
				$tabCounts[$tabKey] = array_sum($statusCounts);
				continue;
			}

			$tabCounts[$tabKey] = array_sum(array_map(
				fn(string $status) => $statusCounts[$status] ?? 0,
				$statusGroup
			));
		}

		$totalSpent = Order::where('customer_id', $user->id)
			->whereIn('status', [
				OrderStatus::DELIVERED->value,
				OrderStatus::COMPLETED->value,
			])
			->sum('total_amount');

		// Frontend uses tabCounts to render Shopee-style status tabs and filters to persist user search state.
		return Inertia::render('Customer/Orders/Index', [
			'orders' => $orders,
			'filters' => array_merge($filters, ['status' => $statuses ?? []]),
			'tabCounts' => $tabCounts,
			'totalSpent' => $totalSpent,
		]);
	}

	public function show(int $orderId): Response
	{
		$order = Order::with([
				'items.variant.product.images',
				'shippingAddress',
			])
			->findOrFail($orderId);

		$this->authorize('view', $order);

		return Inertia::render('Customer/Orders/Show', [
			'order' => $order,
			'trackingData' => $this->resolveTrackingData($order),
		]);
	}

	public function store(Request $request): RedirectResponse
	{
		$this->authorize('create', Order::class);

		/** @var User $user */
		$user = Auth::user();

		$validated = $request->validate([
			'address_id' => ['required', 'integer', Rule::exists('user_addresses', 'id')->where(fn($query) => $query->where('user_id', $user->id))],
			'payment_method' => ['required', Rule::in(['cod', 'online'])],
		]);

		$cartItems = CartItem::where('user_id', $user->id)
			->with(['variant.product'])
			->get();

		if ($cartItems->isEmpty()) {
			return redirect()->back()->withErrors(['cart' => 'Giỏ hàng trống, không thể tạo đơn hàng.']);
		}

		try {
			$order = DB::transaction(function () use ($cartItems, $user, $validated) {
				$address = UserAddress::where('id', $validated['address_id'])
					->where('user_id', $user->id)
					->firstOrFail();

				$totalAmount = $cartItems->sum(function ($item) {
					$unitPrice = $item->variant->discount_price ?? $item->variant->price;
					return $item->quantity * $unitPrice;
				});

				$order = Order::create([
					'customer_id' => $user->id,
					'order_number' => $this->generateOrderNumber(),
					'sub_total' => $totalAmount,
					'shipping_fee' => 0,
					'discount_amount' => 0,
					'total_amount' => $totalAmount,
					'currency' => 'VND',
					'exchange_rate' => 1,
					'total_amount_base' => $totalAmount,
					'status' => OrderStatus::PENDING_CONFIRMATION->value,
					'shipping_address_id' => $address->id,
					'payment_method' => $validated['payment_method'],
				]);

				foreach ($cartItems as $cartItem) {
					$unitPrice = $cartItem->variant->discount_price ?? $cartItem->variant->price;
					$totalPrice = $unitPrice * $cartItem->quantity;

					OrderItem::create([
						'order_id' => $order->order_id,
						'variant_id' => $cartItem->variant_id,
						'quantity' => $cartItem->quantity,
						'unit_price' => $unitPrice,
						'total_price' => $totalPrice,
						'original_currency' => 'VND',
						'original_unit_price' => $unitPrice,
						'original_total_price' => $totalPrice,
					]);
				}

				CartItem::where('user_id', $user->id)->delete();

				return $order;
			});
		} catch (\Throwable $exception) {
			Log::error('Không thể tạo đơn hàng', [
				'user_id' => $user->id,
				'message' => $exception->getMessage(),
			]);

			return redirect()->back()->withErrors(['order' => 'Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại.']);
		}

		return redirect()->route('user.orders.show', $order->order_id)->with('success', 'Đơn hàng đã được tạo thành công.');
	}

	public function cancel(int $orderId, Request $request): RedirectResponse
	{
		$order = Order::findOrFail($orderId);

		$this->authorize('view', $order);

		$this->authorize('cancel', $order);

		$validated = $request->validate([
			'reason' => ['nullable', 'string', 'max:255'],
		]);

		$order->update(['status' => OrderStatus::CANCELLED->value]);
		OrderCancelled::dispatch($order, $validated['reason'] ?? 'User requested cancellation');

		return redirect()->route('user.orders.show', $order->order_id)->with('success', 'Đơn hàng đã được hủy.');
	}

	public function reorder(int $orderId): RedirectResponse
	{
		$order = Order::with('items')->findOrFail($orderId);

		$this->authorize('reorder', $order);

		foreach ($order->items as $item) {
			$cartItem = CartItem::firstOrNew([
				'user_id' => Auth::id(),
				'variant_id' => $item->variant_id,
			]);

			$cartItem->quantity = ($cartItem->quantity ?? 0) + $item->quantity;
			$cartItem->save();
		}

		return redirect()->route('cart.index')->with('success', 'Sản phẩm đã được thêm vào giỏ hàng.');
	}

		public function update(int $orderId, Request $request): RedirectResponse
		{
			$order = Order::findOrFail($orderId);

			$this->authorize('update', $order);

			$validated = $request->validate([
				'address_id' => ['required', 'integer', Rule::exists('user_addresses', 'id')->where(fn($query) => $query->where('user_id', Auth::id()))],
				'notes' => ['nullable', 'string', 'max:500'],
			]);

			$order->update([
				'shipping_address_id' => $validated['address_id'],
				'notes' => $validated['notes'] ?? $order->notes,
			]);

			return redirect()->route('user.orders.show', $order->order_id)->with('success', 'Đơn hàng đã được cập nhật địa chỉ giao hàng.');
		}

		public function trackDelivery(int $orderId): JsonResponse
		{
			$order = Order::findOrFail($orderId);

			$this->authorize('track', $order);

			$trackingData = $this->resolveTrackingData($order);

			if ($trackingData === null) {
				return response()->json([
					'message' => 'Không tìm thấy thông tin vận chuyển cho đơn hàng này.',
				], 404);
			}

			return response()->json(['data' => $trackingData]);
		}

	public function downloadInvoice(int $orderId)
	{
		$order = Order::findOrFail($orderId);

		$pdf = Pdf::loadView('pdf.invoice', ['order' => $order]);

		return $pdf->download('invoice-' . $order->order_number . '.pdf');
	}

	public function requestReturn(int $orderId, Request $request): RedirectResponse
	{
		$order = Order::where('customer_id', Auth::id())->findOrFail($orderId);

		$this->authorize('requestReturn', $order);

		$validated = $request->validate([
			'reason' => ['required', 'string', 'max:255'],
			'description' => ['nullable', 'string', 'max:2000'],
			'proof' => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'],
		]);

		$proofPath = null;
		if ($request->hasFile('proof')) {
			$proofPath = $request->file('proof')->store('returns/proofs', ['disk' => 'public']);
		}

		$returnRequest = DB::transaction(function () use ($order, $validated, $proofPath) {
			$returnRequest = ReturnRequest::create([
				'order_id' => $order->order_id,
				'customer_id' => $order->customer_id,
				'status' => 'pending',
				'reason' => $validated['reason'],
				'description' => $validated['description'] ?? null,
				'proof_attachment_path' => $proofPath,
			]);

			$order->update(['status' => OrderStatus::RETURNED->value]);

			return $returnRequest;
		});

		ReturnRequested::dispatch($returnRequest);

		return redirect()->back()->with('success', 'Yêu cầu trả hàng đã được gửi.');
	}

	protected function generateOrderNumber(): string
	{
		return 'ORD-' . now()->format('YmdHis') . '-' . random_int(1000, 9999);
	}

	protected function resolveTrackingData(Order $order): ?array
	{
		if (!$order->tracking_number || !$order->shipping_provider) {
			return null;
		}

		$cacheKey = sprintf('orders:%s:tracking:%s', $order->order_id, $order->tracking_number);

		return Cache::remember($cacheKey, now()->addHour(), function () use ($order) {
			try {
				return $this->shippingService->getTrackingData($order->tracking_number, $order->shipping_provider);
			} catch (\Throwable $exception) {
				Log::warning('Không thể lấy thông tin tracking cho đơn hàng.', [
					'order_id' => $order->order_id,
					'error' => $exception->getMessage(),
				]);

				return null;
			}
		});
	}
}
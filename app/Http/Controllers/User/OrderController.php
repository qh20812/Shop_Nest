<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Order; // assuming Order model exists
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
	public function index(Request $request)
	{
		$user = $request->user();
		$search = trim($request->get('search', ''));
		$status = $request->get('status', 'all');

		// Map textual status/payment filters to integer codes used in DB
		$statusMap = [
			'pending' => 0,
			'processing' => 1,
			'shipped' => 2,
			'delivered' => 3,
			'canceled' => 4,
		];
		$paymentStatusMap = [
			0 => 'unpaid',
			1 => 'paid',
			2 => 'failed',
		];

		$query = Order::query()->where('customer_id', $user->id);

		if ($search !== '') {
			$query->where(function ($q) use ($search) {
				$q->where('order_number', 'LIKE', "%$search%");
			});
		}

		if ($status !== 'all' && isset($statusMap[$status])) {
			$query->where('status', $statusMap[$status]);
		}

		$orders = $query->latest()->limit(50)->get()->map(function ($order) use ($paymentStatusMap) {
			return [
				'id' => $order->getKey(),
				'code' => $order->order_number,
				'status' => array_search($order->status, [0,1,2,3,4]) !== false ? match($order->status){0=>'pending',1=>'processing',2=>'shipped',3=>'delivered',4=>'canceled',default=>'unknown'} : 'unknown',
				'payment_status' => $paymentStatusMap[$order->payment_status] ?? 'unknown',
				'total' => (int) $order->total_amount,
				'created_at' => $order->created_at?->format('d/m/Y H:i'),
				'can_cancel' => in_array($order->status, [0,1]),
			];
		});

		return Inertia::render('Customer/Orders/Index', [
			'orders' => $orders,
			'filters' => [
				'search' => $search,
				'status' => $status,
			],
		]);
	}

	public function show(Request $request, Order $order)
	{
		$this->authorizeOrder($order, $request->user());
		$order->load(['items.variant.product']);

		$paymentStatusMap = [
			0 => 'unpaid',
			1 => 'paid',
			2 => 'failed',
		];

		$statusText = match($order->status){0=>'pending',1=>'processing',2=>'shipped',3=>'delivered',4=>'canceled',default=>'unknown'};
		$detail = [
			'id' => $order->getKey(),
			'code' => $order->order_number,
			'status' => $statusText,
			'payment_status' => $paymentStatusMap[$order->payment_status] ?? 'unknown',
			'subtotal' => (int) $order->sub_total,
			'shipping_fee' => (int) $order->shipping_fee,
			'discount_total' => (int) $order->discount_amount,
			'total' => (int) $order->total_amount,
			'can_cancel' => in_array($order->status, [0,1]),
			'items' => $order->items->map(function ($item) {
				return [
					'id' => $item->getKey(),
					'product_name' => $item->variant?->product?->name ?? 'Sản phẩm',
					'product_image' => $item->variant?->product?->image_url ?? null,
					'quantity' => (int) $item->quantity,
					'price' => (int) $item->unit_price,
				];
			}),
		];

		return Inertia::render('Customer/Orders/Show', [
			'order' => $detail,
		]);
	}

	protected function authorizeOrder(Order $order, $user)
	{
		if ($order->customer_id !== $user->id) {
			abort(403);
		}
	}
}

<?php

namespace App\Http\Controllers\User;

use App\Events\OrderCancelled;
use App\Events\ReturnRequested;
use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ReturnRequest;
use App\Services\ShippingService;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    /**
     * Display a listing of the user's orders with advanced filtering and search.
     */
    public function index(Request $request): Response
    {
        $user = Auth::user();
        $filters = $request->only(['status', 'date_from', 'date_to', 'search', 'sort']);

        $ordersQuery = Order::query()
            ->where('customer_id', $user->id)
            ->with(['items.variant.product.images' => fn($query) => $query->where('is_primary', true)]);

        // Filter by status (can be an array)
        if ($request->filled('status')) {
            $statuses = is_array($request->input('status')) ? $request->input('status') : [$request->input('status')];
            $ordersQuery->whereIn('status', $statuses);
        }

        // Date range filtering
        if ($request->filled('date_from')) {
            $ordersQuery->whereDate('created_at', '>=', Carbon::parse($request->input('date_from')));
        }
        if ($request->filled('date_to')) {
            $ordersQuery->whereDate('created_at', '<=', Carbon::parse($request->input('date_to')));
        }

        // Search by order number or product name
        if ($request->filled('search')) {
            $searchTerm = '%' . $request->input('search') . '%';
            $ordersQuery->where(function ($query) use ($searchTerm) {
                $query->where('order_number', 'like', $searchTerm)
                    ->orWhereHas('items.variant.product', fn($q) => $q->where('name', 'like', $searchTerm));
            });
        }

        // Sort options
        match ($request->input('sort', 'newest')) {
            'oldest' => $ordersQuery->orderBy('created_at', 'asc'),
            'total_asc' => $ordersQuery->orderBy('total_amount', 'asc'),
            'total_desc' => $ordersQuery->orderBy('total_amount', 'desc'),
            default => $ordersQuery->orderBy('created_at', 'desc'),
        };

        $orders = $ordersQuery->paginate(15)->withQueryString();

        // Aggregated data for the view
        $baseUserOrdersQuery = Order::where('customer_id', $user->id);
        $totalSpent = (clone $baseUserOrdersQuery)->where('status', Order::STATUS_DELIVERED)->sum('total_amount');
        $statusCounts = (clone $baseUserOrdersQuery)
            ->select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get()
            ->pluck('count', 'status');

        return Inertia::render('User/Dashboard/Orders/Index', [
            'orders' => $orders,
            'filters' => $filters,
            'statusCounts' => $statusCounts,
            'totalSpent' => $totalSpent,
        ]);
    }

    /**
     * Display the specified order.
     */
    public function show(Order $order): Response
    {
        $this->authorize('view', $order);

        $order->load([
            'items.variant.product.images',
            'items.variant.attributeValues.attribute',
            'shippingAddress',
            // 'statusHistories', // To track status changes
            // 'paymentTransactions', // To show payment details
        ]);

        return Inertia::render('User/Dashboard/Orders/Show', [
            'order' => $order,
            'canCancel' => $this->canCancelOrder($order),
            'canReturn' => $this->canReturnOrder($order),
            'trackingInfo' => $this->getTrackingInfo($order),
        ]);
    }

    /**
     * Cancel the specified order.
     */
    public function cancel(Order $order, Request $request): RedirectResponse
    {
        $this->authorize('cancel', $order);

        $request->validate(['cancellation_reason' => 'required|string|max:500']);

        if (!$this->canCancelOrder($order)) {
            return back()->with('error', 'Order cannot be cancelled at this stage.');
        }

        try {
            DB::transaction(function () use ($order, $request) {
                $order->update(['status' => Order::STATUS_CANCELLED]);

                // Restore inventory
                foreach ($order->items as $item) {
                    $item->variant()->increment('stock', $item->quantity);
                }

                // Process refund if already paid
                if ($order->payment_status === Order::PAYMENT_STATUS_PAID) {
                    // Trigger a refund service/job here
                    $order->update(['payment_status' => Order::PAYMENT_STATUS_REFUNDED]);
                }

                // Log status change
                // $order->statusHistories()->create([...]);

                event(new OrderCancelled($order, $request->input('cancellation_reason')));
            });
        } catch (\Exception $e) {
            Log::error('Order cancellation failed', ['order_id' => $order->id, 'error' => $e->getMessage()]);
            return redirect()->route('user.orders.show', $order)->with('error', 'An unexpected error occurred.');
        }

        return redirect()->route('user.orders.show', $order)
            ->with('success', 'Order cancelled successfully. Your refund will be processed shortly.');
    }

    /**
     * Add items from a previous order to the cart again.
     */
    public function reorder(Order $order): RedirectResponse
    {
        $this->authorize('view', $order);

        $unavailableItems = [];
        $availableItemsCount = 0;

        try {
            DB::transaction(function () use ($order, &$unavailableItems, &$availableItemsCount) {
                foreach ($order->items as $item) {
                    $variant = $item->variant()->with('product')->first();

                    if ($variant && $variant->product->is_active && $variant->stock >= $item->quantity) {
                        CartItem::updateOrCreate(
                            ['user_id' => Auth::id(), 'variant_id' => $item->variant_id],
                            ['quantity' => DB::raw("quantity + {$item->quantity}")]
                        );
                        $availableItemsCount++;
                    } else {
                        $unavailableItems[] = [
                            'name' => $variant ? $variant->product->name : 'Unknown Product',
                            'reason' => !$variant || !$variant->product->is_active ? 'discontinued' : 'out_of_stock'
                        ];
                    }
                }
            });
        } catch (\Exception $e) {
            Log::error('Reorder failed', ['order_id' => $order->id, 'error' => $e->getMessage()]);
            return redirect()->route('user.orders.show', $order)->with('error', 'Could not process reorder.');
        }

        $message = $availableItemsCount > 0 ? "{$availableItemsCount} items added to your cart." : 'No available items could be reordered.';

        return redirect()->route('cart.index')->with([
            'success' => $message,
            'unavailable_items' => $unavailableItems,
        ]);
    }

    /**
     * Generate and download a PDF invoice for the order.
     */
    public function downloadInvoice(Order $order)
    {
        $this->authorize('view', $order);

        if (!in_array($order->status, [Order::STATUS_DELIVERED, Order::STATUS_COMPLETED])) {
            abort(403, 'Invoice not available for this order status.');
        }

        try {
            // Assumes a view at 'resources/views/invoices/order.blade.php'
            $pdf = Pdf::loadView('invoices.order', ['order' => $order]);
            return $pdf->download("invoice-{$order->order_number}.pdf");
        } catch (\Exception $e) {
            Log::error('PDF Invoice generation failed', ['order_id' => $order->id, 'error' => $e->getMessage()]);
            return back()->with('error', 'Could not generate invoice.');
        }
    }

    /**
     * Display real-time delivery tracking information.
     */
    public function trackDelivery(Order $order, ShippingService $shippingService): Response
    {
        $this->authorize('view', $order);

        if (!$order->shippingDetail?->tracking_number) {
            return Inertia::render('User/Dashboard/Orders/Tracking', [
                'order' => $order, 'tracking' => null, 'error' => 'Tracking information is not yet available.'
            ]);
        }

        try {
            $trackingData = $shippingService->getTrackingData($order->shippingDetail->tracking_number, $order->shippingDetail->shipping_provider);
        } catch (\Exception $e) {
            Log::error('Failed to fetch tracking data', ['order_id' => $order->id, 'error' => $e->getMessage()]);
            $trackingData = ['error' => 'Could not retrieve tracking information from the carrier.'];
        }

        return Inertia::render('User/Dashboard/Orders/Tracking', [
            'order' => $order,
            'tracking' => $trackingData,
        ]);
    }

    /**
     * Submit a return/refund request for an order.
     */
    public function requestReturn(Order $order, Request $request): RedirectResponse
    {
        $this->authorize('view', $order);

        if (!$this->canReturnOrder($order)) {
            return back()->with('error', 'This order is not eligible for return.');
        }

        $validated = $request->validate([
            'return_items' => 'required|array|min:1',
            'return_items.*.order_item_id' => ['required', Rule::exists('order_items', 'id')->where('order_id', $order->id)],
            'return_items.*.quantity' => 'required|integer|min:1',
            'return_items.*.reason' => 'required|string|in:defective,wrong_item,not_as_described,changed_mind',
            'return_images' => 'nullable|array|max:5',
            'return_images.*' => 'image|mimes:jpg,jpeg,png|max:2048',
            'return_reason_detail' => 'nullable|string|max:1000',
        ]);

        // Additional validation for quantity
        foreach ($validated['return_items'] as $returnItem) {
            $orderItem = OrderItem::find($returnItem['order_item_id']);
            if ($returnItem['quantity'] > $orderItem->quantity) {
                return back()->withErrors(['return_items' => 'Return quantity cannot exceed ordered quantity.']);
            }
        }

        try {
            DB::transaction(function () use ($order, $validated, $request) {
                // Create return request record
                $returnRequest = ReturnRequest::create([
                    'customer_id' => Auth::id(),
                    'order_id' => $order->id,
                    'return_number' => 'RTN-' . strtoupper(uniqid()),
                    'reason' => $validated['return_items'][0]['reason'], // Simplified
                    'description' => $validated['return_reason_detail'],
                    'status' => ReturnRequest::STATUS_PENDING,
                    'type' => 1, // 1: Refund
                ]);

                // TODO: Create ReturnItem records, calculate refund amount, and handle image uploads.

                event(new ReturnRequested($returnRequest));
            });
        } catch (\Exception $e) {
            Log::error('Return request failed', ['order_id' => $order->id, 'error' => $e->getMessage()]);
            return back()->with('error', 'An unexpected error occurred.');
        }

        return back()->with('success', 'Return request submitted successfully.');
    }

    // --- Helper Methods ---

    private function canCancelOrder(Order $order): bool
    {
        // Allow cancellation for pending/confirmed orders within a 2-hour window.
        return in_array($order->status, [Order::STATUS_PENDING, Order::STATUS_CONFIRMED])
               && $order->created_at->diffInHours(now()) < 2;
    }

    private function canReturnOrder(Order $order): bool
    {
        // Allow returns for delivered orders within a 30-day window.
        // TODO: Could also check for non-returnable product categories.
        return $order->status === Order::STATUS_DELIVERED
               && $order->delivered_at
               && $order->delivered_at->diffInDays(now()) <= 30;
    }

    private function getTrackingInfo(Order $order): ?array
    {
        // Mock implementation. In a real app, this would call a ShippingService.
        if (!$order->shippingDetail?->tracking_number) {
            return null;
        }

        return [
            'provider' => $order->shippingDetail->shipping_provider,
            'tracking_number' => $order->shippingDetail->tracking_number,
            'status' => 'In Transit',
            'estimated_delivery' => $order->created_at?->addDays(5)->toFormattedDateString(),
            'history' => [
                ['status' => 'In Transit', 'location' => 'City, State', 'timestamp' => now()->subDay()->toDateTimeString()],
                ['status' => 'Package picked up', 'location' => 'Origin City, State', 'timestamp' => now()->subDays(2)->toDateTimeString()],
            ]
        ];
    }
}
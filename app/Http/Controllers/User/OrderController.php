<?php

namespace App\Http\Controllers\User;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia; // assuming Order model exists

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $search = trim($request->get('search', ''));
        $status = $request->get('status', 'all');

        // Map textual status/payment filters to integer codes used in DB
        $statusMap = [
            'pending' => OrderStatus::PENDING_CONFIRMATION->value,
            'processing' => OrderStatus::PROCESSING->value,
            'shipped' => OrderStatus::DELIVERING->value,
            'delivered' => OrderStatus::DELIVERED->value,
            'canceled' => OrderStatus::CANCELLED->value,
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

        $orders = $query->latest()->limit(50)->get()->map(function ($order) {
            return [
                'id' => $order->getKey(),
                'code' => $order->order_number,
                'status' => $order->status?->value ?? 'unknown',
                'payment_status' => $order->payment_status?->value ?? 'unknown',
                'total' => (int) $order->total_amount,
                'created_at' => $order->created_at?->format('d/m/Y H:i'),
                'can_cancel' => in_array($order->status, [OrderStatus::PENDING_CONFIRMATION, OrderStatus::PROCESSING], true),
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

        $statusText = $order->status?->value ?? 'unknown';
        $detail = [
            'id' => $order->getKey(),
            'code' => $order->order_number,
            'status' => $statusText,
            'payment_status' => $order->payment_status?->value ?? 'unknown',
            'subtotal' => (int) $order->sub_total,
            'shipping_fee' => (int) $order->shipping_fee,
            'discount_total' => (int) $order->discount_amount,
            'total' => (int) $order->total_amount,
            'can_cancel' => in_array($order->status, [OrderStatus::PENDING_CONFIRMATION, OrderStatus::PROCESSING], true),
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

<?php

namespace App\Http\Controllers\User;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Exceptions\CartException;
use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderReview;
use App\Services\CartService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

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
        $order->load(['items.variant.product', 'shippingAddress.province', 'shippingAddress.ward', 'shippingAddress.district', 'shippingAddress.country', 'reviews']);

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
            'created_at' => $order->created_at?->format('d/m/Y H:i'),
            'can_cancel' => in_array($order->status, [OrderStatus::PENDING_CONFIRMATION, OrderStatus::PROCESSING], true),
            'can_review' => in_array($order->status, [OrderStatus::DELIVERED, OrderStatus::COMPLETED], true),
            'shipping_address' => $order->shippingAddress ? [
                'name' => $order->shippingAddress->full_name,
                'phone' => $order->shippingAddress->phone_number,
                'full_address' => $order->shippingAddress->full_address,
            ] : null,
            'items' => $order->items->map(function ($item) {
                return [
                    'id' => $item->getKey(),
                    'product_name' => $item->variant?->product?->name ?? 'Sản phẩm',
                    'product_image' => $item->variant?->product?->image_url ?? null,
                    'sku' => $item->variant?->sku,
                    'quantity' => (int) $item->quantity,
                    'price' => (int) $item->unit_price,
                ];
            }),
            'reviews' => $order->reviews->map(fn ($review) => [
                'id' => $review->getKey(),
                'rating' => (int) $review->rating,
                'comment' => $review->comment,
                'created_at' => $review->created_at?->format('d/m/Y'),
            ]),
        ];

        return Inertia::render('Customer/Orders/Show', [
            'order' => $detail,
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'address_id' => [
                'required',
                'integer',
                Rule::exists('user_addresses', 'id')->where('user_id', $user->id),
            ],
            'payment_method' => ['required', 'string', Rule::in(['cod', 'stripe'])],
            'notes' => ['nullable', 'string', 'max:500'],
        ]);

        try {
            $order = app(CartService::class)->createOrderFromCart($user);
        } catch (CartException $exception) {
            return back()->withErrors(['cart' => $exception->getMessage()]);
        }

        $order->update([
            'shipping_address_id' => $data['address_id'],
            'payment_method' => $data['payment_method'] === 'cod' ? 1 : 3,
            'notes' => $data['notes'] ?? $order->notes,
        ]);

        return redirect()->route('user.orders.show', $order->order_id);
    }

    public function cancel(Request $request, Order $order)
    {
        $this->authorizeOrder($order, $request->user());

        if (! in_array($order->status, [OrderStatus::PENDING_CONFIRMATION, OrderStatus::PROCESSING], true)) {
            return back()->withErrors(['order' => 'This order can no longer be cancelled.']);
        }

        $data = $request->validate([
            'reason' => ['nullable', 'string', 'max:500'],
        ]);

        $order->update([
            'status' => OrderStatus::CANCELLED,
            'notes' => trim(($order->notes ?? '')."\nCancel reason: ".($data['reason'] ?? 'N/A')),
        ]);

        if ($order->payment_status === PaymentStatus::PAID) {
            $order->transactions()->create([
                'type' => 'refund',
                'amount' => $order->total_amount,
                'currency' => $order->currency ?? 'VND',
                'gateway' => $order->payment_method === 1 ? 'cod' : 'stripe',
                'status' => 'pending',
            ]);
        }

        return redirect()->route('user.orders.show', $order->order_id);
    }

    public function reorder(Request $request, Order $order)
    {
        $this->authorizeOrder($order, $request->user());

        $order->loadMissing('items');

        DB::transaction(function () use ($order, $request) {
            foreach ($order->items as $item) {
                $cartItem = CartItem::firstOrNew([
                    'user_id' => $request->user()->id,
                    'variant_id' => $item->variant_id,
                ]);

                $cartItem->quantity = (int) ($cartItem->quantity ?? 0) + (int) $item->quantity;
                $cartItem->save();
            }
        });

        return redirect()->route('cart.index');
    }

    public function review(Request $request, Order $order)
    {
        $this->authorizeOrder($order, $request->user());

        if (! in_array($order->status, [OrderStatus::DELIVERED, OrderStatus::COMPLETED], true)) {
            return back()->withErrors(['review' => 'Only delivered orders can be reviewed.']);
        }

        $data = $request->validate([
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['nullable', 'string', 'max:1000'],
        ]);

        OrderReview::updateOrCreate(
            [
                'order_id' => $order->order_id,
                'customer_id' => $request->user()->id,
            ],
            [
                'rating' => $data['rating'],
                'comment' => $data['comment'] ?? null,
            ]
        );

        return redirect()->route('user.orders.show', $order->order_id);
    }

    protected function authorizeOrder(Order $order, $user)
    {
        if ($order->customer_id !== $user->id) {
            abort(403);
        }
    }
}

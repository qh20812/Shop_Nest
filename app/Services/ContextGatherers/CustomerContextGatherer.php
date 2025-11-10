<?php

namespace App\Services\ContextGatherers;

use App\Enums\OrderStatus;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\App;

class CustomerContextGatherer implements ContextGathererInterface
{
    public function gather(?User $user = null): array
    {
        if (!$user) {
            return [];
        }

        $locale = App::getLocale();

        $recentOrders = $user->orders()
            ->latest('created_at')
            ->with(['items.variant.product'])
            ->take(3)
            ->get();

        $cartItems = CartItem::query()
            ->where('user_id', $user->getKey())
            ->with('variant.product')
            ->take(5)
            ->get();

        $favoriteCategoryIds = $recentOrders->flatMap(function (Order $order) {
            return $order->items->map(fn (OrderItem $item) => $item->variant?->product?->category_id)->filter();
        })->unique()->values()->all();

        $recommendations = Product::query()
            ->with(['category', 'brand'])
            ->when($favoriteCategoryIds, function ($query, $categoryIds) {
                $query->whereIn('category_id', $categoryIds);
            })
            ->latest('updated_at')
            ->take(5)
            ->get();

        return [
            'recent_orders' => $recentOrders->map(function (Order $order) use ($locale) {
                return [
                    'order_number' => $order->order_number,
                    'status' => $order->status instanceof OrderStatus ? $order->status->value : (string) $order->status,
                    'total' => (float) $order->total_amount,
                    'placed_at' => optional($order->created_at)->toDateString(),
                    'top_items' => $order->items->take(2)->map(function (OrderItem $item) use ($locale) {
                        return [
                            'sku' => $item->variant?->sku,
                            'product' => $item->variant?->product?->getTranslation('name', $locale),
                            'quantity' => (int) $item->quantity,
                        ];
                    })->values()->all(),
                ];
            })->values()->all(),
            'cart_preview' => $cartItems->map(function (CartItem $item) use ($locale) {
                return [
                    'sku' => $item->variant?->sku,
                    'product' => $item->variant?->product?->getTranslation('name', $locale),
                    'quantity' => (int) $item->quantity,
                    'price' => (float) ($item->variant?->price ?? 0),
                ];
            })->values()->all(),
            'recommendations' => $recommendations->map(function (Product $product) use ($locale) {
                return [
                    'product' => $product->getTranslation('name', $locale),
                    'category' => $product->category?->getTranslation('name', $locale),
                    'brand' => $product->brand?->getTranslation('name', $locale),
                ];
            })->values()->all(),
        ];
    }
}
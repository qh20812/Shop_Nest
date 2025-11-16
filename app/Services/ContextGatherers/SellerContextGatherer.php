<?php

namespace App\Services\ContextGatherers;

use App\Models\InventoryLog;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\DB;

class SellerContextGatherer implements ContextGathererInterface
{
    public function gather(?User $user = null): array
    {
        if (!$user) {
            return [];
        }

        $locale = App::getLocale();
        $now = Carbon::now();

        $ordersQuery = Order::query()->whereHas('items.variant.product', function ($query) use ($user) {
            $query->where('seller_id', $user->getKey());
        });

        $ordersLast7DaysQuery = (clone $ordersQuery)
            ->where('created_at', '>=', $now->copy()->subDays(7));

        $topProducts = OrderItem::query()
            ->select('variant_id', DB::raw('SUM(quantity) as total_quantity'))
            ->whereHas('variant.product', function ($query) use ($user) {
                $query->where('seller_id', $user->getKey());
            })
            ->groupBy('variant_id')
            ->orderByDesc('total_quantity')
            ->with(['variant.product.category'])
            ->take(5)
            ->get();

        $recentInventory = InventoryLog::query()
            ->whereHas('variant.product', function ($query) use ($user) {
                $query->where('seller_id', $user->getKey());
            })
            ->latest('created_at')
            ->take(5)
            ->get();

        return [
            'summary' => [
                'active_products' => $user->products()->count(),
                'orders_last_7_days' => (clone $ordersLast7DaysQuery)->count(),
                'revenue_last_7_days' => (float) (clone $ordersLast7DaysQuery)->sum('total_amount'),
                'total_orders' => $ordersQuery->count(),
            ],
            'top_products' => $topProducts->map(function (OrderItem $item) use ($locale) {
                $product = $item->variant?->product;

                return [
                    'sku' => $item->variant?->sku,
                    'product' => $product?->getTranslation('name', $locale),
                    'category' => $product?->category?->getTranslation('name', $locale),
                    'sold_quantity' => (int) $item->total_quantity,
                ];
            })->values()->all(),
            'inventory_updates' => $recentInventory->map(function (InventoryLog $log) use ($locale) {
                return [
                    'sku' => $log->variant?->sku,
                    'product' => $log->variant?->product?->getTranslation('name', $locale),
                    'change' => (int) $log->quantity_change,
                    'reason' => $log->reason,
                    'updated_at' => optional($log->created_at)->toDateTimeString(),
                ];
            })->values()->all(),
        ];
    }
}
<?php

namespace App\Services\Admin;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;

class ShopStatisticsService
{
    private const CACHE_TTL = 3600;

    public function compileStatistics(User $shop, ?Carbon $from = null, ?Carbon $to = null, bool $detailed = false): array
    {
        $productQuery = $shop->products();
        $totalProducts = (clone $productQuery)->count();
        $activeProducts = (clone $productQuery)->where('is_active', true)->count();
        $disabledProducts = $totalProducts - $activeProducts;

        $variantQuery = ProductVariant::query()
            ->whereHas('product', fn ($q) => $q->where('seller_id', $shop->id));

        $lowStockVariants = (clone $variantQuery)->where('stock_quantity', '<=', ProductVariant::LOW_STOCK_THRESHOLD)->count();
        $outOfStockVariants = (clone $variantQuery)->where('stock_quantity', '=', 0)->count();

        $orderMetrics = $this->orderMetricsForShop($shop, $from, $to);
        $recentCustomers = $this->recentCustomersForShop($shop, 10);

        $data = [
            'products' => [
                'total' => $totalProducts,
                'active' => $activeProducts,
                'inactive' => $disabledProducts,
                'lowStockVariants' => $lowStockVariants,
                'outOfStockVariants' => $outOfStockVariants,
            ],
            'orders' => $orderMetrics,
            'recentCustomers' => $recentCustomers,
        ];

        if ($detailed) {
            $data['trend'] = $this->buildShopMonthlyTrend($shop, $from, $to);
        }

        return $data;
    }

    public function buildGlobalMetrics(): array
    {
        $base = User::sellers();

        $topShops = User::sellers()
            ->select('users.id', 'users.username', 'users.shop_status')
            ->selectSub($this->orderRevenueSubquery(), 'total_revenue')
            ->orderByDesc('total_revenue')
            ->limit(5)
            ->get();

        return [
            'totalShops' => (clone $base)->count(),
            'activeShops' => (clone $base)->shopStatus('active')->count(),
            'pendingShops' => (clone $base)->shopStatus('pending')->count(),
            'suspendedShops' => (clone $base)->shopStatus('suspended')->count(),
            'rejectedShops' => (clone $base)->shopStatus('rejected')->count(),
            'totalRevenue' => $this->globalRevenue(),
            'topShops' => $topShops,
        ];
    }

    public function buildRevenueTrend(int $months): array
    {
        $start = now()->startOfMonth()->subMonths($months - 1);
        $period = CarbonPeriod::create($start, '1 month', now()->startOfMonth());

        $data = [];
        foreach ($period as $month) {
            $from = $month->copy();
            $to = $month->copy()->endOfMonth();
            $revenue = $this->globalRevenue($from, $to);

            $data[] = [
                'month' => $month->format('M Y'),
                'revenue' => $revenue,
            ];
        }

        return $data;
    }

    public function getCachedStatistics(User $shop): array
    {
        return Cache::remember("shop_statistics_{$shop->id}", self::CACHE_TTL, fn () => $this->compileStatistics($shop));
    }

    private function orderMetricsForShop(User $shop, ?Carbon $from = null, ?Carbon $to = null): array
    {
        $query = OrderItem::query()
            ->join('product_variants', 'order_items.variant_id', '=', 'product_variants.variant_id')
            ->join('products', 'product_variants.product_id', '=', 'products.product_id')
            ->join('orders', 'order_items.order_id', '=', 'orders.order_id')
            ->where('products.seller_id', $shop->id);

        if ($from) {
            $query->whereDate('orders.created_at', '>=', $from->toDateString());
        }

        if ($to) {
            $query->whereDate('orders.created_at', '<=', $to->toDateString());
        }

        $ordersQuery = clone $query;
        $itemsQuery = clone $query;
        $revenueQuery = clone $query;

        $orders = (int) $ordersQuery->distinct('orders.order_id')->count('orders.order_id');
        $items = (int) $itemsQuery->sum('order_items.quantity');
        $revenue = (float) $revenueQuery->sum('order_items.total_price');

        return [
            'orders' => $orders,
            'itemsSold' => $items,
            'revenue' => $revenue,
        ];
    }

    private function recentCustomersForShop(User $shop, int $limit = 10): Collection
    {
        return Order::query()
            ->select('orders.customer_id')
            ->join('order_items', 'orders.order_id', '=', 'order_items.order_id')
            ->join('product_variants', 'order_items.variant_id', '=', 'product_variants.variant_id')
            ->join('products', 'product_variants.product_id', '=', 'products.product_id')
            ->where('products.seller_id', $shop->id)
            ->latest('orders.created_at')
            ->distinct()
            ->take($limit)
            ->with('customer:id,username,first_name,last_name,email')
            ->get()
            ->map(fn ($order) => $order->customer);
    }

    private function buildShopMonthlyTrend(User $shop, ?Carbon $from = null, ?Carbon $to = null): array
    {
        $start = $from?->copy()->startOfMonth() ?? now()->startOfMonth()->subMonths(5);
        $end = $to?->copy()->endOfMonth() ?? now()->endOfMonth();
        $period = CarbonPeriod::create($start, '1 month', $end);

        $trend = [];
        foreach ($period as $month) {
            $metrics = $this->orderMetricsForShop($shop, $month->copy()->startOfMonth(), $month->copy()->endOfMonth());
            $trend[] = [
                'month' => $month->format('M Y'),
                'orders' => $metrics['orders'],
                'revenue' => $metrics['revenue'],
            ];
        }

        return $trend;
    }

    private function orderRevenueSubquery()
    {
        return OrderItem::query()
            ->selectRaw('COALESCE(SUM(order_items.total_price), 0)')
            ->join('product_variants', 'order_items.variant_id', '=', 'product_variants.variant_id')
            ->join('products', 'product_variants.product_id', '=', 'products.product_id')
            ->whereColumn('products.seller_id', 'users.id');
    }

    private function globalRevenue(?Carbon $from = null, ?Carbon $to = null): float
    {
        $query = OrderItem::query()
            ->join('product_variants', 'order_items.variant_id', '=', 'product_variants.variant_id')
            ->join('products', 'product_variants.product_id', '=', 'products.product_id')
            ->join('orders', 'order_items.order_id', '=', 'orders.order_id');

        if ($from) {
            $query->whereDate('orders.created_at', '>=', $from->toDateString());
        }

        if ($to) {
            $query->whereDate('orders.created_at', '<=', $to->toDateString());
        }

        return (float) $query->sum('order_items.total_price');
    }
}
<?php

namespace App\Http\Controllers\Seller;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductVariant;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $seller = Auth::user();

        if (!$seller) {
            abort(403, 'Seller authentication required');
        }

        $cacheKey = "seller_dashboard_{$seller->id}";

        $dashboardData = Cache::remember($cacheKey, 900, function () use ($seller) {
            $stockAlerts = $this->getStockAlerts($seller->id);

            return [
                'shopStats' => $this->getShopStats($seller->id, $stockAlerts),
                'recentOrders' => $this->getRecentShopOrders($seller->id),
                'topSellingProducts' => $this->getTopSellingProducts($seller->id),
                'stockAlerts' => $stockAlerts,
            ];
        });

        return Inertia::render('Seller/Dashboard/Index', $dashboardData);
    }

    private function getShopStats(int $sellerId, int $initialLowStockCount = 0): array
    {
        $defaultStats = [
            'total_revenue' => 0.0,
            'total_orders' => 0,
            'average_order_value' => 0.0,
            'low_stock_alerts' => $initialLowStockCount,
            'monthly_revenue_growth' => 0.0,
            'pending_orders_count' => 0,
            'unique_customers' => 0,
            'top_selling_product' => null,
        ];

        try {
            $variantIds = ProductVariant::query()
                ->whereHas('product', fn ($query) => $query->where('seller_id', $sellerId))
                ->pluck('variant_id')
                ->all();

            if (empty($variantIds)) {
                return $defaultStats;
            }

            $completedOrderIds = Order::query()
                ->where('status', OrderStatus::COMPLETED->value)
                ->whereHas('items', fn ($query) => $query->whereIn('variant_id', $variantIds))
                ->pluck('order_id')
                ->all();

            $defaultStats['low_stock_alerts'] = $initialLowStockCount ?: $this->getStockAlerts($sellerId);
            $defaultStats['pending_orders_count'] = $this->getPendingOrdersCount($sellerId);

            if (empty($completedOrderIds)) {
                return $defaultStats;
            }

            $totalRevenue = (float) OrderItem::query()
                ->whereIn('variant_id', $variantIds)
                ->whereIn('order_id', $completedOrderIds)
                ->sum('total_price');

            $totalOrders = count(array_unique($completedOrderIds));
            $averageOrderValue = $totalOrders > 0 ? round($totalRevenue / $totalOrders, 2) : 0.0;

            $uniqueCustomers = Order::query()
                ->whereIn('order_id', $completedOrderIds)
                ->distinct('customer_id')
                ->count('customer_id');

            $monthlyRevenueGrowth = $this->calculateMonthlyRevenueGrowth($variantIds);

            $topProduct = $this->fetchTopSellingProductsData($sellerId, 1)->first();

            return [
                'total_revenue' => $totalRevenue,
                'total_orders' => $totalOrders,
                'average_order_value' => $averageOrderValue,
                'low_stock_alerts' => $defaultStats['low_stock_alerts'],
                'monthly_revenue_growth' => $monthlyRevenueGrowth,
                'pending_orders_count' => $defaultStats['pending_orders_count'],
                'unique_customers' => $uniqueCustomers,
                'top_selling_product' => $topProduct['name'] ?? null,
            ];
        } catch (\Throwable $e) {
            Log::error('Failed to build seller stats', [
                'sellerId' => $sellerId,
                'error' => $e->getMessage(),
            ]);

            return $defaultStats;
        }
    }

    private function getRecentShopOrders(int $sellerId): Collection
    {
        try {
            return Order::query()
                ->select(['order_id', 'order_number', 'total_amount', 'status', 'customer_id', 'created_at'])
                ->where('status', OrderStatus::COMPLETED->value)
                ->whereHas('items.variant.product', fn ($query) => $query->where('seller_id', $sellerId))
                ->with([
                    'customer:id,first_name,last_name,username,email',
                    'items' => function ($query) use ($sellerId) {
                        $query->select(['order_item_id', 'order_id', 'variant_id', 'quantity', 'total_price'])
                            ->whereHas('variant.product', fn ($subQuery) => $subQuery->where('seller_id', $sellerId))
                            ->with([
                                'variant:id,variant_id,product_id,sku',
                                'variant.product:id,product_id,name',
                            ]);
                    },
                ])
                ->orderByDesc('created_at')
                ->limit(10)
                ->get();
        } catch (\Throwable $e) {
            Log::error('Failed to fetch recent seller orders', [
                'sellerId' => $sellerId,
                'error' => $e->getMessage(),
            ]);

            return collect();
        }
    }

    private function getTopSellingProducts(int $sellerId): array
    {
        try {
            return $this->fetchTopSellingProductsData($sellerId)->toArray();
        } catch (\Throwable $e) {
            Log::error('Failed to fetch top selling products', [
                'sellerId' => $sellerId,
                'error' => $e->getMessage(),
            ]);

            return [];
        }
    }

    private function getStockAlerts(int $sellerId): int
    {
        try {
            return ProductVariant::query()
                ->whereHas('product', fn ($query) => $query->where('seller_id', $sellerId))
                ->where('stock_quantity', '<=', ProductVariant::LOW_STOCK_THRESHOLD)
                ->count();
        } catch (\Throwable $e) {
            Log::error('Failed to fetch stock alerts', [
                'sellerId' => $sellerId,
                'error' => $e->getMessage(),
            ]);

            return 0;
        }
    }

    private function getPendingOrdersCount(int $sellerId): int
    {
        try {
            $pendingStatuses = [
                OrderStatus::PENDING_CONFIRMATION->value,
                OrderStatus::PROCESSING->value,
                OrderStatus::PENDING_ASSIGNMENT->value,
                OrderStatus::ASSIGNED_TO_SHIPPER->value,
                OrderStatus::DELIVERING->value,
            ];

            return Order::query()
                ->whereIn('status', $pendingStatuses)
                ->whereHas('items.variant.product', fn ($query) => $query->where('seller_id', $sellerId))
                ->count();
        } catch (\Throwable $e) {
            Log::warning('Failed to fetch pending orders count', [
                'sellerId' => $sellerId,
                'error' => $e->getMessage(),
            ]);

            return 0;
        }
    }

    private function calculateMonthlyRevenueGrowth(array $variantIds): float
    {
        if (empty($variantIds)) {
            return 0.0;
        }

        try {
            $now = Carbon::now();
            $currentStart = (clone $now)->startOfMonth();
            $previousStart = (clone $currentStart)->subMonth();
            $previousEnd = (clone $previousStart)->endOfMonth();

            $currentRevenue = (float) OrderItem::query()
                ->whereIn('variant_id', $variantIds)
                ->whereIn('order_id', function ($query) use ($currentStart, $now) {
                    $query->select('order_id')
                        ->from('orders')
                        ->where('status', OrderStatus::COMPLETED->value)
                        ->whereBetween('created_at', [$currentStart, $now]);
                })
                ->sum('total_price');

            $previousRevenue = (float) OrderItem::query()
                ->whereIn('variant_id', $variantIds)
                ->whereIn('order_id', function ($query) use ($previousStart, $previousEnd) {
                    $query->select('order_id')
                        ->from('orders')
                        ->where('status', OrderStatus::COMPLETED->value)
                        ->whereBetween('created_at', [$previousStart, $previousEnd]);
                })
                ->sum('total_price');

            if ($previousRevenue == 0.0) {
                return $currentRevenue > 0 ? 100.0 : 0.0;
            }

            return round((($currentRevenue - $previousRevenue) / $previousRevenue) * 100, 2);
        } catch (\Throwable $e) {
            Log::warning('Failed to calculate monthly revenue growth', [
                'variantIds' => $variantIds,
                'error' => $e->getMessage(),
            ]);

            return 0.0;
        }
    }

    private function fetchTopSellingProductsData(int $sellerId, int $limit = 5): Collection
    {
        $locale = app()->getLocale();

        $results = OrderItem::query()
            ->selectRaw('product_variants.product_id, SUM(order_items.quantity) as total_quantity, SUM(order_items.total_price) as total_revenue')
            ->join('product_variants', 'order_items.variant_id', '=', 'product_variants.variant_id')
            ->join('orders', 'order_items.order_id', '=', 'orders.order_id')
            ->join('products', 'product_variants.product_id', '=', 'products.product_id')
            ->where('orders.status', OrderStatus::COMPLETED->value)
            ->where('products.seller_id', $sellerId)
            ->groupBy('product_variants.product_id')
            ->orderByDesc('total_quantity')
            ->limit($limit)
            ->get();

        if ($results->isEmpty()) {
            return collect();
        }

        $products = Product::query()
            ->select(['product_id', 'name'])
            ->whereIn('product_id', $results->pluck('product_id'))
            ->get()
            ->keyBy('product_id');

        return $results->map(function ($row) use ($products, $locale) {
            $product = $products->get($row->product_id);

            return [
                'product_id' => $row->product_id,
                'name' => $product ? ($product->getTranslation('name', $locale) ?? $product->name) : null,
                'total_quantity' => (int) $row->total_quantity,
                'total_revenue' => (float) $row->total_revenue,
            ];
        });
    }
}
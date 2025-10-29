<?php

namespace App\Services;

use App\DataTransferObjects\Analytics\AnalyticsKpiData;
use App\DataTransferObjects\Analytics\OrderAnalyticsData;
use App\DataTransferObjects\Analytics\ProductAnalyticsData;
use App\DataTransferObjects\Analytics\ReportResult;
use App\DataTransferObjects\Analytics\RevenueAnalyticsData;
use App\DataTransferObjects\Analytics\UserAnalyticsData;
use App\Enums\OrderStatus;
use App\Http\Controllers\Admin\Concerns\AnalyticsQueryTrait;
use App\Models\AnalyticsReport;
use App\Models\CustomerSegment;
use App\Models\CustomerSegmentMembership;
use App\Models\Dispute;
use App\Models\Order;
use App\Models\ProductVariant;
use App\Models\User;
use App\Models\UserEvent;
use Carbon\Carbon;
use Carbon\CarbonImmutable;
use Carbon\CarbonInterval;
use Illuminate\Cache\TaggableStore;
use Illuminate\Database\Query\Builder as QueryBuilder;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use RuntimeException;

class AnalyticsService
{
    use AnalyticsQueryTrait;

    private const KPI_CACHE_TTL = 600;
    private const REVENUE_CACHE_TTL = 900;
    private const USER_CACHE_TTL = 600;
    private const PRODUCT_CACHE_TTL = 300;
    private const ORDER_CACHE_TTL = 600;

    /**
     * Calculate high-level KPIs for the analytics overview dashboard.
     */
    public function calculateKPIs(): AnalyticsKpiData
    {
        $now = CarbonImmutable::now();
        $startOfMonth = $now->startOfMonth();
        $previousMonthStart = $startOfMonth->subMonth()->startOfMonth();
        $previousMonthEnd = $startOfMonth->subMonth()->endOfMonth();

        $filters = [
            'date_from' => $startOfMonth,
            'date_to' => $now,
        ];

        $cacheKey = $this->buildCacheKey('analytics:kpis', $filters);

        return $this->remember($cacheKey, self::KPI_CACHE_TTL, function () use ($filters, $previousMonthStart, $previousMonthEnd, $now, $startOfMonth) {
            $revenueQuery = $this->scopeRevenueQueries($filters);
            $totalRevenue = (float) (clone $revenueQuery)
                ->selectRaw('SUM(COALESCE(total_amount_base, total_amount)) as aggregate')
                ->value('aggregate') ?? 0.0;

            $pendingOrders = Order::query()
                ->where('status', OrderStatus::PENDING_CONFIRMATION)
                ->count();

            $currentMonthUsers = $this->scopeUserQueries([
                'date_from' => $startOfMonth,
                'date_to' => $now,
            ])->count();

            $previousMonthUsers = $this->scopeUserQueries([
                'date_from' => $previousMonthStart,
                'date_to' => $previousMonthEnd,
            ])->count();

            $userGrowth = [
                'current' => $currentMonthUsers,
                'previous' => $previousMonthUsers,
                'change' => $previousMonthUsers > 0
                    ? round((($currentMonthUsers - $previousMonthUsers) / $previousMonthUsers) * 100, 2)
                    : ($currentMonthUsers > 0 ? 100.0 : 0.0),
            ];

            $totalOrders = Order::query()
                ->whereBetween('created_at', [$startOfMonth, $now])
                ->count();

            $successfulOrders = Order::query()
                ->whereBetween('created_at', [$startOfMonth, $now])
                ->whereIn('status', [
                    OrderStatus::COMPLETED,
                    OrderStatus::DELIVERED,
                ])
                ->count();

            $systemHealth = $totalOrders > 0
                ? round(($successfulOrders / $totalOrders) * 100, 2)
                : 100.0;

            return new AnalyticsKpiData(
                totalRevenue: round($totalRevenue, 2),
                pendingOrders: $pendingOrders,
                userGrowth: $userGrowth,
                systemHealth: $systemHealth
            );
        }, ['analytics', 'kpis']);
    }

    /**
     * Get revenue analytics including trends and breakdowns.
     */
    public function getRevenueTrends(string $period, array $filters = []): RevenueAnalyticsData
    {
        [$start, $end, $groupBy] = $this->resolvePeriod($period, $filters);

        $filters = array_merge($filters, [
            'date_from' => $filters['date_from'] ?? $start,
            'date_to' => $filters['date_to'] ?? $end,
        ]);

        $cacheKey = $this->buildCacheKey('analytics:revenue:' . $period, $filters);

        return $this->remember($cacheKey, self::REVENUE_CACHE_TTL, function () use ($filters, $groupBy, $start, $end) {
            $baseQuery = $this->scopeRevenueQueries($filters);
            $monetaryExpression = 'COALESCE(total_amount_base, total_amount)';

            $timeSeriesRaw = (clone $baseQuery)
                ->selectRaw($this->timeGroupingExpression($groupBy) . ' as period')
                ->selectRaw('SUM(' . $monetaryExpression . ') as revenue')
                ->groupBy('period')
                ->orderBy('period')
                ->get()
                ->mapWithKeys(fn ($row) => [$row->period => (float) $row->revenue]);

            $timeSeries = $this->buildTimeSeries($timeSeriesRaw, $start, $end, $groupBy);

            $categoryRows = $this->buildCategoryRevenue($filters);
            $sellerRows = $this->buildSellerRevenue($filters);
            $productRows = $this->buildTopProductRevenue($filters);

            return new RevenueAnalyticsData(
                timeSeries: $timeSeries,
                byCategory: $categoryRows,
                bySeller: $sellerRows,
                topProducts: $productRows,
                filters: $this->stringifyFilters($filters)
            );
        }, ['analytics', 'revenue']);
    }

    /**
     * Get user analytics including growth, segmentation, and retention metrics.
     */
    public function getUserAnalytics(array $filters = []): UserAnalyticsData
    {
        [$start, $end, $groupBy] = $this->resolveUserRange($filters);

        $filters = array_merge($filters, [
            'date_from' => $filters['date_from'] ?? $start,
            'date_to' => $filters['date_to'] ?? $end,
        ]);

        $cacheKey = $this->buildCacheKey('analytics:users:' . $groupBy, $filters);

        return $this->remember($cacheKey, self::USER_CACHE_TTL, function () use ($filters, $groupBy, $start, $end) {
            $userQuery = $this->scopeUserQueries($filters);

            $growthRows = (clone $userQuery)
                ->selectRaw($this->timeGroupingExpression($groupBy, 'created_at') . ' as period')
                ->selectRaw('COUNT(*) as total')
                ->groupBy('period')
                ->orderBy('period')
                ->get()
                ->mapWithKeys(fn ($row) => [$row->period => (int) $row->total]);

            $growthSeries = $this->buildTimeSeries($growthRows, $start, $end, $groupBy, true);

            $segments = $this->buildSegmentDistribution($filters);
            $retention = $this->buildRetentionMetrics($start, $end);
            $activeUsers = $this->buildActiveUserMetrics($start, $end);

            return new UserAnalyticsData(
                growthSeries: $growthSeries,
                segments: $segments,
                retention: $retention,
                activeUsers: $activeUsers,
                filters: $this->stringifyFilters($filters)
            );
        }, ['analytics', 'users']);
    }

    /**
     * Get product analytics: performance, category metrics, inventory signals.
     */
    public function getProductAnalytics(array $filters = []): ProductAnalyticsData
    {
        [$start, $end] = $this->resolveDateRange($filters, CarbonImmutable::now()->subDays(30), CarbonImmutable::now());
        $filters = array_merge($filters, [
            'date_from' => $filters['date_from'] ?? $start,
            'date_to' => $filters['date_to'] ?? $end,
        ]);

        $cacheKey = $this->buildCacheKey('analytics:products', $filters);

        return $this->remember($cacheKey, self::PRODUCT_CACHE_TTL, function () use ($filters) {
            $topProducts = $this->buildTopProductRevenue($filters, limit: 15);
            $categoryPerformance = $this->buildCategoryRevenue($filters);
            $inventoryTurnover = $this->buildInventoryTurnover($filters);
            $lowStock = $this->buildLowStockList($filters);

            return new ProductAnalyticsData(
                topProducts: $topProducts,
                categoryPerformance: $categoryPerformance,
                inventoryTurnover: $inventoryTurnover,
                lowStock: $lowStock,
                filters: $this->stringifyFilters($filters)
            );
        }, ['analytics', 'products']);
    }

    /**
     * Get order analytics including status distribution and fulfillment insights.
     */
    public function getOrderAnalytics(array $filters = []): OrderAnalyticsData
    {
        [$start, $end] = $this->resolveDateRange($filters, CarbonImmutable::now()->subDays(30), CarbonImmutable::now());
        $filters = array_merge($filters, [
            'date_from' => $filters['date_from'] ?? $start,
            'date_to' => $filters['date_to'] ?? $end,
        ]);

        $cacheKey = $this->buildCacheKey('analytics:orders', $filters);

        return $this->remember($cacheKey, self::ORDER_CACHE_TTL, function () use ($filters, $start, $end) {
            $orderQuery = $this->scopeOrderQueries($filters);

            $statusRows = (clone $orderQuery)
                ->selectRaw('status')
                ->selectRaw('COUNT(*) as total')
                ->groupBy('status')
                ->get()
                ->map(fn ($row) => [
                    'status' => (string) $row->status,
                    'label' => $this->formatOrderStatus((string) $row->status),
                    'value' => (int) $row->total,
                ])->values()->all();

            $averageOrderValue = (float) (clone $orderQuery)
                ->selectRaw('AVG(COALESCE(total_amount_base, total_amount)) as average_value')
                ->value('average_value') ?? 0.0;

            $fulfillment = $this->buildFulfillmentMetrics($filters);
            $disputeRate = $this->buildDisputeRate($start, $end);
            $conversion = $this->buildConversionMetrics($start, $end);

            return new OrderAnalyticsData(
                statusDistribution: $statusRows,
                averageOrderValue: round($averageOrderValue, 2),
                fulfillment: $fulfillment,
                disputeRate: $disputeRate,
                conversion: $conversion,
                filters: $this->stringifyFilters($filters)
            );
        }, ['analytics', 'orders']);
    }

    /**
     * Generate a custom analytics report with optional export.
     */
    public function generateReport(string $type, array $filters = []): ReportResult
    {
        $type = strtolower($type);
        $normalizedFilters = $this->stringifyFilters($filters);

        $data = match ($type) {
            AnalyticsReport::TYPE_REVENUE => $this->getRevenueTrends($filters['period'] ?? '30days', $filters)->toArray(),
            AnalyticsReport::TYPE_USERS => $this->getUserAnalytics($filters)->toArray(),
            AnalyticsReport::TYPE_PRODUCTS => $this->getProductAnalytics($filters)->toArray(),
            AnalyticsReport::TYPE_ORDERS => $this->getOrderAnalytics($filters)->toArray(),
            AnalyticsReport::TYPE_CUSTOM => [
                'message' => 'Custom reports are not implemented yet.',
            ],
            default => throw new RuntimeException('Unsupported report type: ' . $type),
        };

        $exportPath = null;
        $exportFormat = null;

        if (!empty($filters['export_format'])) {
            $exportFormat = strtolower((string) $filters['export_format']);
            if ($exportFormat === 'csv') {
                $exportPath = $this->generateCsvExport($type, $data);
            } elseif ($exportFormat === 'json') {
                $exportPath = $this->generateJsonExport($type, $data);
            } elseif ($exportFormat === 'pdf') {
                Log::warning('PDF export requested but not implemented yet for analytics reports.');
            }
        }

        return new ReportResult(
            type: $type,
            filters: $normalizedFilters,
            data: $data,
            exportPath: $exportPath,
            exportFormat: $exportFormat
        );
    }

    /**
     * Remember values with cache tags when supported.
     */
    private function remember(string $key, int $ttl, callable $callback, array $tags = []): mixed
    {
        $store = Cache::getStore();
        if (!empty($tags) && $store instanceof TaggableStore) {
            return Cache::tags($tags)->remember($key, $ttl, $callback);
        }

        return Cache::remember($key, $ttl, $callback);
    }

    /**
     * Determine the period configuration for analytics queries.
     */
    private function resolvePeriod(string $period, array $filters = []): array
    {
        $end = isset($filters['date_to']) ? CarbonImmutable::parse($filters['date_to']) : CarbonImmutable::now();

        return match ($period) {
            '7days' => [$end->subDays(6)->startOfDay(), $end, 'day'],
            '14days' => [$end->subDays(13)->startOfDay(), $end, 'day'],
            '30days' => [$end->subDays(29)->startOfDay(), $end, 'day'],
            '90days' => [$end->subDays(89)->startOfDay(), $end, 'week'],
            '12months' => [$end->subMonths(11)->startOfMonth(), $end, 'month'],
            default => $this->resolveDateRange($filters, $end->subDays(29)->startOfDay(), $end),
        };
    }

    /**
     * Resolve generic date range filters.
     */
    private function resolveDateRange(array $filters, CarbonImmutable $defaultStart, CarbonImmutable $defaultEnd): array
    {
        $start = isset($filters['date_from']) ? CarbonImmutable::parse($filters['date_from']) : $defaultStart;
        $end = isset($filters['date_to']) ? CarbonImmutable::parse($filters['date_to']) : $defaultEnd;

        if ($start->greaterThan($end)) {
            [$start, $end] = [$end, $start];
        }

        return [$start->startOfDay(), $end->endOfDay(), 'day'];
    }

    /**
     * Resolve range and grouping preference for user analytics.
     */
    private function resolveUserRange(array $filters): array
    {
        $range = strtolower((string) ($filters['range'] ?? '6months'));
        $end = isset($filters['date_to']) ? CarbonImmutable::parse($filters['date_to']) : CarbonImmutable::now();

        return match ($range) {
            '4weeks' => [$end->subWeeks(3)->startOfWeek(), $end, 'week'],
            '6months' => [$end->subMonths(5)->startOfMonth(), $end, 'month'],
            '12months' => [$end->subMonths(11)->startOfMonth(), $end, 'month'],
            default => $this->resolveDateRange($filters, $end->subMonths(5)->startOfMonth(), $end),
        };
    }

    /**
     * Build time series structure from grouped rows.
     */
    private function buildTimeSeries(Collection $rows, CarbonImmutable $start, CarbonImmutable $end, string $groupBy, bool $integer = false): array
    {
        $series = [];
        $cursor = $start;
        $interval = match ($groupBy) {
            'week' => CarbonInterval::week(),
            'month' => CarbonInterval::month(),
            default => CarbonInterval::day(),
        };

        while ($cursor <= $end) {
            $key = $this->formatAggregationKey($cursor, $groupBy);
            $value = (float) ($rows[$key] ?? 0);
            $series[] = [
                'label' => $this->formatDisplayLabel($cursor, $groupBy),
                'value' => $integer ? (int) round($value) : round($value, 2),
            ];
            $cursor = $cursor->add($interval);
        }

        return $series;
    }

    /**
     * Build revenue grouped by categories.
     */
    private function buildCategoryRevenue(array $filters): array
    {
        $query = DB::table('order_items as oi')
            ->join('orders as o', 'oi.order_id', '=', 'o.order_id')
            ->join('product_variants as pv', 'oi.variant_id', '=', 'pv.variant_id')
            ->join('products as p', 'pv.product_id', '=', 'p.product_id')
            ->leftJoin('categories as c', 'p.category_id', '=', 'c.category_id')
            ->selectRaw('c.category_id as id')
            ->selectRaw('c.name as name')
            ->selectRaw('SUM(oi.total_price) as revenue')
            ->whereIn('o.status', [
                OrderStatus::COMPLETED->value,
                OrderStatus::DELIVERED->value,
            ]);

        $this->applyOrderFilters($query, $filters);

        return $query
            ->groupBy('c.category_id', 'c.name')
            ->orderByDesc(DB::raw('revenue'))
            ->limit(20)
            ->get()
            ->map(function ($row) {
                return [
                    'categoryId' => $row->id ? (int) $row->id : null,
                    'label' => $this->resolveTranslatable($row->name, 'Uncategorized'),
                    'value' => round((float) $row->revenue, 2),
                ];
            })
            ->all();
    }

    /**
     * Build revenue grouped by seller.
     */
    private function buildSellerRevenue(array $filters): array
    {
        $query = DB::table('order_items as oi')
            ->join('orders as o', 'oi.order_id', '=', 'o.order_id')
            ->join('product_variants as pv', 'oi.variant_id', '=', 'pv.variant_id')
            ->join('products as p', 'pv.product_id', '=', 'p.product_id')
            ->leftJoin('users as u', 'p.seller_id', '=', 'u.id')
            ->selectRaw('p.seller_id as seller_id')
            ->selectRaw('u.first_name')
            ->selectRaw('u.last_name')
            ->selectRaw('u.username')
            ->selectRaw('SUM(oi.total_price) as revenue')
            ->whereIn('o.status', [
                OrderStatus::COMPLETED->value,
                OrderStatus::DELIVERED->value,
            ]);

        $this->applyOrderFilters($query, $filters);

        return $query
            ->groupBy('p.seller_id', 'u.first_name', 'u.last_name', 'u.username')
            ->orderByDesc(DB::raw('revenue'))
            ->limit(20)
            ->get()
            ->map(function ($row) {
                $label = trim(($row->first_name ?? '') . ' ' . ($row->last_name ?? ''));
                $label = $label !== '' ? $label : ($row->username ?? 'Unknown Seller');

                return [
                    'sellerId' => $row->seller_id ? (int) $row->seller_id : null,
                    'label' => $label,
                    'value' => round((float) $row->revenue, 2),
                ];
            })
            ->all();
    }

    /**
     * Build top product revenue list.
     */
    private function buildTopProductRevenue(array $filters, int $limit = 10): array
    {
        $query = DB::table('order_items as oi')
            ->join('orders as o', 'oi.order_id', '=', 'o.order_id')
            ->join('product_variants as pv', 'oi.variant_id', '=', 'pv.variant_id')
            ->join('products as p', 'pv.product_id', '=', 'p.product_id')
            ->selectRaw('p.product_id as product_id')
            ->selectRaw('p.name as product_name')
            ->selectRaw('pv.variant_id as variant_id')
            ->selectRaw('pv.sku as sku')
            ->selectRaw('SUM(oi.total_price) as revenue')
            ->selectRaw('SUM(oi.quantity) as quantity')
            ->whereIn('o.status', [
                OrderStatus::COMPLETED->value,
                OrderStatus::DELIVERED->value,
            ]);

        $this->applyOrderFilters($query, $filters);

        return $query
            ->groupBy('p.product_id', 'p.name', 'pv.variant_id', 'pv.sku')
            ->orderByDesc(DB::raw('revenue'))
            ->limit($limit)
            ->get()
            ->map(function ($row) {
                return [
                    'productId' => (int) $row->product_id,
                    'variantId' => (int) $row->variant_id,
                    'label' => $this->resolveTranslatable($row->product_name, 'Unknown Product'),
                    'sku' => $row->sku,
                    'revenue' => round((float) $row->revenue, 2),
                    'quantity' => (int) $row->quantity,
                ];
            })
            ->all();
    }

    /**
     * Build customer segment distribution.
     */
    private function buildSegmentDistribution(array $filters): array
    {
        $query = CustomerSegmentMembership::query()
            ->select(['segment_id'])
            ->selectRaw('COUNT(*) as total');

        if (!empty($filters['segment_id'])) {
            $query->where('segment_id', (int) $filters['segment_id']);
        }

        $rows = $query
            ->groupBy('segment_id')
            ->orderByDesc('total')
            ->limit(15)
            ->get();

        $segments = CustomerSegment::query()
            ->whereIn('segment_id', $rows->pluck('segment_id'))
            ->get()
            ->keyBy('segment_id');

        return $rows
            ->map(function ($row) use ($segments) {
                $segment = $segments->get($row->segment_id);
                return [
                    'segmentId' => (int) $row->segment_id,
                    'label' => $segment?->name ?? 'Segment #' . $row->segment_id,
                    'value' => (int) $row->total,
                ];
            })
            ->values()
            ->all();
    }

    /**
     * Build retention metrics (orders within recent periods).
     */
    private function buildRetentionMetrics(CarbonImmutable $start, CarbonImmutable $end): array
    {
        $thirtyDaysAgo = $end->subDays(29);
        $ninetyDaysAgo = $end->subDays(89);

        $thirtyDayCustomers = User::query()
            ->whereHas('orders', fn ($q) => $q->where('created_at', '>=', $thirtyDaysAgo))
            ->count();

        $ninetyDayCustomers = User::query()
            ->whereHas('orders', fn ($q) => $q->where('created_at', '>=', $ninetyDaysAgo))
            ->count();

        $totalCustomers = User::query()->count();

        return [
            'thirtyDay' => $totalCustomers > 0 ? round(($thirtyDayCustomers / $totalCustomers) * 100, 2) : 0.0,
            'ninetyDay' => $totalCustomers > 0 ? round(($ninetyDayCustomers / $totalCustomers) * 100, 2) : 0.0,
            'totalCustomers' => $totalCustomers,
        ];
    }

    /**
     * Build active user metrics using events and orders.
     */
    private function buildActiveUserMetrics(CarbonImmutable $start, CarbonImmutable $end): array
    {
        $last24Hours = $end->subHours(24);
        $last7Days = $end->subDays(6);

        $active24h = UserEvent::query()
            ->whereNotNull('user_id')
            ->where('created_at', '>=', $last24Hours)
            ->distinct('user_id')
            ->count('user_id');

        $active7d = UserEvent::query()
            ->whereNotNull('user_id')
            ->where('created_at', '>=', $last7Days)
            ->distinct('user_id')
            ->count('user_id');

        $buyers30d = User::query()
            ->whereHas('orders', fn ($q) => $q->where('created_at', '>=', $end->subDays(29)))
            ->count();

        return [
            'last24h' => $active24h,
            'last7d' => $active7d,
            'ordersLast30d' => $buyers30d,
        ];
    }

    /**
     * Build inventory turnover metrics.
     */
    private function buildInventoryTurnover(array $filters): array
    {
        $query = DB::table('inventory_logs as il')
            ->join('product_variants as pv', 'il.variant_id', '=', 'pv.variant_id')
            ->join('products as p', 'pv.product_id', '=', 'p.product_id')
            ->selectRaw('il.variant_id')
            ->selectRaw('p.product_id')
            ->selectRaw('p.name as product_name')
            ->selectRaw('pv.sku as sku')
            ->selectRaw('SUM(il.quantity_change) as net_quantity')
            ->selectRaw('SUM(CASE WHEN il.quantity_change < 0 THEN ABS(il.quantity_change) ELSE 0 END) as units_sold');

        $this->applyInventoryFilters($query, $filters);

        return $query
            ->groupBy('il.variant_id', 'p.product_id', 'p.name', 'pv.sku')
            ->orderByDesc(DB::raw('units_sold'))
            ->limit(15)
            ->get()
            ->map(function ($row) {
                return [
                    'variantId' => (int) $row->variant_id,
                    'productId' => (int) $row->product_id,
                    'label' => $this->resolveTranslatable($row->product_name, 'Unknown Product'),
                    'sku' => $row->sku,
                    'unitsSold' => (int) $row->units_sold,
                    'netChange' => (int) $row->net_quantity,
                ];
            })
            ->all();
    }

    /**
     * Build low stock variant list.
     */
    private function buildLowStockList(array $filters): array
    {
        $threshold = (int) ($filters['low_stock_threshold'] ?? ProductVariant::LOW_STOCK_THRESHOLD);

        $query = ProductVariant::query()
            ->with(['product'])
            ->where('stock_quantity', '<=', $threshold)
            ->orderBy('stock_quantity')
            ->limit(20);

        if (!empty($filters['seller_id'])) {
            $query->whereHas('product', fn ($q) => $q->where('seller_id', (int) $filters['seller_id']));
        }

        if (!empty($filters['category_id'])) {
            $query->whereHas('product', fn ($q) => $q->where('category_id', (int) $filters['category_id']));
        }

        return $query->get()->map(function (ProductVariant $variant) {
            return [
                'variantId' => $variant->variant_id,
                'productId' => $variant->product_id,
                'label' => $variant->product ? $this->resolveTranslatable($variant->product->name, 'Unknown Product') : 'Unknown Product',
                'sku' => $variant->sku,
                'stock' => (int) $variant->stock_quantity,
            ];
        })->all();
    }

    /**
     * Build fulfillment metrics from orders.
     */
    private function buildFulfillmentMetrics(array $filters): array
    {
        $query = DB::table('orders')
            ->selectRaw('AVG(TIMESTAMPDIFF(HOUR, created_at, shipped_at)) as avg_to_ship')
            ->selectRaw('AVG(TIMESTAMPDIFF(HOUR, shipped_at, delivered_at)) as avg_ship_to_deliver')
            ->whereNotNull('shipped_at')
            ->whereNotNull('delivered_at');

        $this->applyOrderFilters($query, $filters);

        $row = $query->first();

        return [
            'avgToShipHours' => $row && $row->avg_to_ship ? round((float) $row->avg_to_ship, 2) : 0.0,
            'avgShipToDeliverHours' => $row && $row->avg_ship_to_deliver ? round((float) $row->avg_ship_to_deliver, 2) : 0.0,
            'avgTotalHours' => $row && $row->avg_to_ship && $row->avg_ship_to_deliver
                ? round((float) $row->avg_to_ship + (float) $row->avg_ship_to_deliver, 2)
                : 0.0,
        ];
    }

    /**
     * Build dispute rate statistics.
     */
    private function buildDisputeRate(CarbonImmutable $start, CarbonImmutable $end): float
    {
        $totalOrders = Order::query()
            ->whereBetween('created_at', [$start, $end])
            ->count();

        if ($totalOrders === 0) {
            return 0.0;
        }

        $disputes = Dispute::query()
            ->whereBetween('created_at', [$start, $end])
            ->count();

        return round(($disputes / $totalOrders) * 100, 2);
    }

    /**
     * Build conversion metrics using user events.
     */
    private function buildConversionMetrics(CarbonImmutable $start, CarbonImmutable $end): array
    {
        $cartAdds = UserEvent::query()
            ->where('event_type', UserEvent::EVENT_ADD_TO_CART)
            ->whereBetween('created_at', [$start, $end])
            ->count();

        $checkoutStarts = UserEvent::query()
            ->where('event_type', UserEvent::EVENT_CHECKOUT_START)
            ->whereBetween('created_at', [$start, $end])
            ->count();

        $checkoutCompletes = UserEvent::query()
            ->where('event_type', UserEvent::EVENT_CHECKOUT_COMPLETE)
            ->whereBetween('created_at', [$start, $end])
            ->count();

        $orders = Order::query()
            ->whereBetween('created_at', [$start, $end])
            ->count();

        $cartToCheckout = $cartAdds > 0 ? round(($checkoutStarts / $cartAdds) * 100, 2) : 0.0;
        $checkoutToOrder = $checkoutStarts > 0 ? round(($orders / $checkoutStarts) * 100, 2) : 0.0;

        return [
            'cartAdds' => $cartAdds,
            'checkoutStarts' => $checkoutStarts,
            'checkoutCompletes' => $checkoutCompletes,
            'orders' => $orders,
            'cartToCheckoutRate' => $cartToCheckout,
            'checkoutToOrderRate' => $checkoutToOrder,
        ];
    }

    /**
     * Build SQL expression for grouping by time.
     */
    private function timeGroupingExpression(string $groupBy, string $column = 'orders.created_at'): string
    {
        return match ($groupBy) {
            'week' => "DATE_FORMAT($column, '%x-%v')",
            'month' => "DATE_FORMAT($column, '%Y-%m')",
            default => "DATE_FORMAT($column, '%Y-%m-%d')",
        };
    }

    /**
     * Format aggregation key for collections.
     */
    private function formatAggregationKey(CarbonImmutable $date, string $groupBy): string
    {
        return match ($groupBy) {
            'week' => $date->format('o-W'),
            'month' => $date->format('Y-m'),
            default => $date->format('Y-m-d'),
        };
    }

    /**
     * Format labels for charts.
     */
    private function formatDisplayLabel(CarbonImmutable $date, string $groupBy): string
    {
        return match ($groupBy) {
            'week' => 'W' . $date->format('W') . ' ' . $date->format('Y'),
            'month' => $date->format('M Y'),
            default => $date->format('d M'),
        };
    }

    /**
     * Apply order-related filters to raw queries.
     */
    private function applyOrderFilters(QueryBuilder $query, array $filters): void
    {
        if (!empty($filters['date_from'])) {
            $query->where('o.created_at', '>=', Carbon::parse($filters['date_from'])->startOfDay());
        }

        if (!empty($filters['date_to'])) {
            $query->where('o.created_at', '<=', Carbon::parse($filters['date_to'])->endOfDay());
        }

        if (!empty($filters['seller_id'])) {
            $query->where('p.seller_id', (int) $filters['seller_id']);
        }

        if (!empty($filters['category_id'])) {
            $query->where('p.category_id', (int) $filters['category_id']);
        }
    }

    /**
     * Apply inventory filters to raw queries.
     */
    private function applyInventoryFilters(QueryBuilder $query, array $filters): void
    {
        if (!empty($filters['date_from'])) {
            $query->where('il.created_at', '>=', Carbon::parse($filters['date_from'])->startOfDay());
        }

        if (!empty($filters['date_to'])) {
            $query->where('il.created_at', '<=', Carbon::parse($filters['date_to'])->endOfDay());
        }

        if (!empty($filters['seller_id'])) {
            $query->where('p.seller_id', (int) $filters['seller_id']);
        }

        if (!empty($filters['category_id'])) {
            $query->where('p.category_id', (int) $filters['category_id']);
        }
    }

    /**
     * Convert filters to stable string representation for cache keys.
     */
    private function stringifyFilters(array $filters): array
    {
        return collect($filters)
            ->filter(fn ($value) => $value !== null && $value !== '')
            ->map(function ($value) {
                if ($value instanceof Carbon) {
                    return $value->toIso8601String();
                }

                if ($value instanceof CarbonImmutable) {
                    return $value->toIso8601String();
                }

                if ($value instanceof \DateTimeInterface) {
                    return CarbonImmutable::instance($value)->toIso8601String();
                }

                if (is_array($value)) {
                    return array_values($value);
                }

                return $value;
            })
            ->toArray();
    }

    /**
     * Build cache key using normalized filters.
     */
    private function buildCacheKey(string $prefix, array $filters): string
    {
        $normalized = $this->stringifyFilters($filters);
        ksort($normalized);

        return $prefix . ':' . md5(json_encode($normalized));
    }

    /**
     * Resolve multilingual names stored as JSON.
     */
    private function resolveTranslatable(?string $value, string $default = 'Unknown'): string
    {
        if ($value === null) {
            return $default;
        }

        $decoded = json_decode($value, true);
        if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
            $locale = app()->getLocale();
            return $decoded[$locale] ?? $decoded['en'] ?? reset($decoded) ?? $default;
        }

        return $value !== '' ? $value : $default;
    }

    /**
     * Format order status for display.
     */
    private function formatOrderStatus(string $status): string
    {
        return match ($status) {
            OrderStatus::PENDING_CONFIRMATION->value => 'Pending Confirmation',
            OrderStatus::PROCESSING->value => 'Processing',
            OrderStatus::PENDING_ASSIGNMENT->value => 'Pending Assignment',
            OrderStatus::ASSIGNED_TO_SHIPPER->value => 'Assigned to Shipper',
            OrderStatus::DELIVERING->value => 'Delivering',
            OrderStatus::DELIVERED->value => 'Delivered',
            OrderStatus::COMPLETED->value => 'Completed',
            OrderStatus::CANCELLED->value => 'Cancelled',
            OrderStatus::RETURNED->value => 'Returned',
            default => Str::title(str_replace('_', ' ', $status)),
        };
    }

    /**
     * Generate CSV export for analytics data.
     */
    private function generateCsvExport(string $type, array $data): string
    {
        $path = 'reports/' . $type . '_report_' . now()->format('Ymd_His') . '.csv';
        $handle = fopen('php://temp', 'w+');

        if ($handle === false) {
            throw new RuntimeException('Unable to open temporary stream for CSV export.');
        }

        fputcsv($handle, ['Key', 'Value']);
        $this->writeFlattenedCsv($handle, $data);
        rewind($handle);

        Storage::disk('local')->put($path, stream_get_contents($handle) ?: '');
        fclose($handle);

        return $path;
    }

    /**
     * Generate JSON export for analytics data.
     */
    private function generateJsonExport(string $type, array $data): string
    {
        $path = 'reports/' . $type . '_report_' . now()->format('Ymd_His') . '.json';
        Storage::disk('local')->put($path, json_encode($data, JSON_PRETTY_PRINT));

        return $path;
    }

    /**
     * Write nested array data to CSV.
     */
    private function writeFlattenedCsv(mixed $handle, array $data, string $prefix = ''): void
    {
        foreach ($data as $key => $value) {
            $composedKey = $prefix !== '' ? $prefix . '.' . $key : (string) $key;

            if (is_array($value)) {
                if ($this->isAssoc($value)) {
                    $this->writeFlattenedCsv($handle, $value, $composedKey);
                } else {
                    foreach ($value as $index => $item) {
                        if (is_array($item)) {
                            $this->writeFlattenedCsv($handle, $item, $composedKey . '[' . $index . ']');
                        } else {
                            fputcsv($handle, [$composedKey . '[' . $index . ']', (string) $item]);
                        }
                    }
                }
            } else {
                fputcsv($handle, [$composedKey, (string) $value]);
            }
        }
    }

    /**
     * Determine if array is associative.
     */
    private function isAssoc(array $array): bool
    {
        return array_keys($array) !== range(0, count($array) - 1);
    }
}

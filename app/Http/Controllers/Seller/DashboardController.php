<?php

namespace App\Http\Controllers\Seller;

use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Services\SellerDashboardService;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    private SellerDashboardService $dashboardService;

    /**
     * DashboardController constructor.
     *
     * @param SellerDashboardService $dashboardService The service handling dashboard business logic
     */
    public function __construct(SellerDashboardService $dashboardService)
    {
        $this->dashboardService = $dashboardService;
    }

    /**
     * Display the seller dashboard with comprehensive statistics and data.
     *
     * This method handles the main dashboard view, including:
     * - Authentication and authorization checks
     * - Rate limiting to prevent abuse
     * - Caching for performance optimization
     * - Comprehensive error handling with fallback data
     *
     * @return Response Inertia response with dashboard data
     *
     * @throws \Symfony\Component\HttpKernel\Exception\HttpException When user lacks seller privileges
     * @throws \Symfony\Component\HttpKernel\Exception\TooManyRequestsHttpException When rate limit exceeded
     */
    public function index(): Response
    {
        $seller = Auth::user();

        if (!$seller || !$seller->isSeller()) {
            Log::warning('Dashboard access denied: User is not a seller', [
                'user_id' => $seller?->id,
                'ip' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);
            abort(403, 'Access denied. Seller privileges required.');
        }

        $rateLimitKey = 'dashboard_access_' . $seller->id;
        $rateLimitConfig = config('dashboard.rate_limiting.dashboard_access');

        if (RateLimiter::tooManyAttempts($rateLimitKey, $rateLimitConfig['max_attempts'])) {
            $secondsUntilAvailable = RateLimiter::availableIn($rateLimitKey);
            Log::warning('Dashboard rate limit exceeded', [
                'user_id' => $seller->id,
                'seconds_until_available' => $secondsUntilAvailable,
                'ip' => request()->ip(),
            ]);
            abort(429, 'Too many dashboard requests. Please try again in ' . $secondsUntilAvailable . ' seconds.');
        }

        RateLimiter::hit($rateLimitKey, $rateLimitConfig['decay_minutes'] * 60);

        $cacheKey = config('dashboard.cache.key_prefix') . "_{$seller->id}";

        $dashboardData = Cache::remember($cacheKey, config('dashboard.cache.ttl'), function () use ($seller) {
            $stockAlerts = $this->dashboardService->getStockAlerts($seller->id);
            $stockAlertsCount = $this->dashboardService->getStockAlertsCount($seller->id);

            return [
                'shopStats' => $this->getShopStats($seller->id, $stockAlertsCount),
                'recentOrders' => $this->getRecentShopOrders($seller->id),
                'topSellingProducts' => $this->getTopSellingProducts($seller->id),
                'stockAlerts' => $stockAlerts,
            ];
        });

        return Inertia::render('Seller/Dashboard/Index', $dashboardData);
    }

    /**
     * Build comprehensive shop statistics from various metric sources.
     *
     * Aggregates data from multiple metric methods to create a complete
     * statistics array for the dashboard. Includes error handling with
     * fallback to default values.
     *
     * @param int $sellerId The authenticated seller's ID
     * @param int $initialLowStockCount Initial count of low stock items
     * @return array Complete shop statistics array
     */
    private function getShopStats(int $sellerId, int $initialLowStockCount = 0): array
    {
        try {
            return [
                ...$this->getRevenueMetrics($sellerId),
                ...$this->getOrderMetrics($sellerId),
                ...$this->getCustomerMetrics($sellerId),
                ...$this->getGrowthMetrics($sellerId),
                ...$this->getAlertMetrics($sellerId, $initialLowStockCount),
                'top_selling_product' => $this->getTopSellingProductName($sellerId),
            ];
        } catch (\Throwable $e) {
            Log::error('Failed to build seller stats', [
                'sellerId' => $sellerId,
                'error' => $e->getMessage(),
            ]);

            return $this->getDefaultStats($initialLowStockCount);
        }
    }

    /**
     * Retrieve recent completed orders for the seller's dashboard.
     *
     * Fetches the most recent completed orders with full customer and product details.
     * Includes comprehensive error handling with logging.
     *
     * @param int $sellerId The authenticated seller's ID
     * @return Collection Collection of recent orders with relationships loaded
     */
    private function getRecentShopOrders(int $sellerId): Collection
    {
        try {
            return $this->dashboardService->getRecentShopOrders($sellerId);
        } catch (\Throwable $e) {
            Log::error('Failed to fetch recent seller orders', [
                'sellerId' => $sellerId,
                'error' => $e->getMessage(),
            ]);

            return collect();
        }
    }

    /**
     * Retrieve top selling products data for the dashboard.
     *
     * Gets the best performing products by sales volume with error handling.
     *
     * @param int $sellerId The authenticated seller's ID
     * @return array Array of top selling product data
     */
    private function getTopSellingProducts(int $sellerId): array
    {
        try {
            return $this->dashboardService->getTopSellingProductsData($sellerId)->toArray();
        } catch (\Throwable $e) {
            Log::error('Failed to fetch top selling products', [
                'sellerId' => $sellerId,
                'error' => $e->getMessage(),
            ]);

            return [];
        }
    }

    /**
     * Get default statistics values for error fallback scenarios.
     *
     * Provides safe default values when dashboard data cannot be retrieved
     * due to errors or missing data.
     *
     * @param int $initialLowStockCount Initial low stock count value
     * @return array Default statistics array
     */
    private function getDefaultStats(int $initialLowStockCount = 0): array
    {
        return [
            'total_revenue' => config('dashboard.defaults.revenue'),
            'total_orders' => config('dashboard.defaults.orders_count'),
            'average_order_value' => config('dashboard.defaults.average_order_value'),
            'low_stock_alerts' => $initialLowStockCount,
            'monthly_revenue_growth' => config('dashboard.defaults.growth_percentage'),
            'pending_orders_count' => config('dashboard.defaults.pending_orders'),
            'unique_customers' => config('dashboard.defaults.customers_count'),
            'top_selling_product' => null,
        ];
    }

    /**
     * Extract revenue-related metrics from aggregated statistics.
     *
     * @param int $sellerId The authenticated seller's ID
     * @return array Revenue metrics (total_revenue, average_order_value)
     */
    private function getRevenueMetrics(int $sellerId): array
    {
        $aggregatedStats = $this->dashboardService->getAggregatedSellerStats($sellerId);

        return [
            'total_revenue' => $aggregatedStats['total_revenue'],
            'average_order_value' => $aggregatedStats['average_order_value'],
        ];
    }

    /**
     * Extract order-related metrics from aggregated statistics.
     *
     * @param int $sellerId The authenticated seller's ID
     * @return array Order metrics (total_orders)
     */
    private function getOrderMetrics(int $sellerId): array
    {
        $aggregatedStats = $this->dashboardService->getAggregatedSellerStats($sellerId);

        return [
            'total_orders' => $aggregatedStats['total_orders'],
        ];
    }

    /**
     * Extract customer-related metrics from aggregated statistics.
     *
     * @param int $sellerId The authenticated seller's ID
     * @return array Customer metrics (unique_customers)
     */
    private function getCustomerMetrics(int $sellerId): array
    {
        $aggregatedStats = $this->dashboardService->getAggregatedSellerStats($sellerId);

        return [
            'unique_customers' => $aggregatedStats['unique_customers'],
        ];
    }

    /**
     * Calculate growth metrics for the seller.
     *
     * @param int $sellerId The authenticated seller's ID
     * @return array Growth metrics (monthly_revenue_growth)
     */
    private function getGrowthMetrics(int $sellerId): array
    {
        return [
            'monthly_revenue_growth' => $this->dashboardService->calculateMonthlyRevenueGrowth($sellerId),
        ];
    }

    /**
     * Get alert-related metrics including stock alerts and pending orders.
     *
     * @param int $sellerId The authenticated seller's ID
     * @param int $initialLowStockCount Initial low stock count
     * @return array Alert metrics (low_stock_alerts, pending_orders_count)
     */
    private function getAlertMetrics(int $sellerId, int $initialLowStockCount = 0): array
    {
        return [
            'low_stock_alerts' => $initialLowStockCount ?: $this->dashboardService->getStockAlerts($sellerId),
            'pending_orders_count' => $this->dashboardService->getPendingOrdersCount($sellerId),
        ];
    }

    /**
     * Get the name of the top-selling product for display.
     *
     * @param int $sellerId The authenticated seller's ID
     * @return string|null Name of the top-selling product or null if none found
     */
    private function getTopSellingProductName(int $sellerId): ?string
    {
        $topProduct = $this->dashboardService->getTopSellingProductsData($sellerId, config('dashboard.limits.top_selling_product_single'))->first();
        return $topProduct['name'] ?? null;
    }
}
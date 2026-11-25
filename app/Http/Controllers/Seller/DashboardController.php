<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Services\SellerDashboardService;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\TooManyRequestsHttpException;

class DashboardController extends Controller
{
    private SellerDashboardService $dashboardService;

    /**
     * DashboardController constructor.
     *
     * @param  SellerDashboardService  $dashboardService  The service handling dashboard business logic
     *                                                    Constructor của DashboardController.
     * @param  SellerDashboardService  $dashboardService  Dịch vụ xử lý logic nghiệp vụ của dashboard
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
     * @return Response Phản hồi Inertia với dữ liệu dashboard
     *
     * @throws HttpException When user lacks seller privileges
     * @throws TooManyRequestsHttpException When rate limit exceeded
     *                                      Hiển thị dashboard của người bán với thống kê và dữ liệu toàn diện.
     *                                      Phương thức này xử lý view dashboard chính, bao gồm:
     *                                      - Kiểm tra xác thực và ủy quyền
     *                                      - Giới hạn tốc độ để ngăn chặn lạm dụng
     *                                      - Lưu cache để tối ưu hiệu suất
     *                                      - Xử lý lỗi toàn diện với dữ liệu dự phòng
     * @throws HttpException Khi người dùng thiếu quyền seller
     * @throws TooManyRequestsHttpException Khi vượt quá giới hạn tốc độ
     */
    public function index(): Response
    {
        $seller = Auth::user();

        if (! $seller || ! $seller->isSeller()) {
            Log::warning('Dashboard access denied: User is not a seller', [
                'user_id' => $seller?->id,
                'ip' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);
            abort(403, 'Access denied. Seller privileges required.');
        }

        $rateLimitKey = 'dashboard_access_'.$seller->id;
        $rateLimitConfig = config('dashboard.rate_limiting.dashboard_access');

        if (RateLimiter::tooManyAttempts($rateLimitKey, $rateLimitConfig['max_attempts'])) {
            $secondsUntilAvailable = RateLimiter::availableIn($rateLimitKey);
            Log::warning('Dashboard rate limit exceeded', [
                'user_id' => $seller->id,
                'seconds_until_available' => $secondsUntilAvailable,
                'ip' => request()->ip(),
            ]);
            abort(429, 'Too many dashboard requests. Please try again in '.$secondsUntilAvailable.' seconds.');
        }

        RateLimiter::hit($rateLimitKey, $rateLimitConfig['decay_minutes'] * 60);

        $cacheKey = config('dashboard.cache.key_prefix')."_{$seller->id}";

        $dashboardData = Cache::remember($cacheKey, config('dashboard.cache.ttl'), function () use ($seller) {
            $stockAlerts = $this->dashboardService->getStockAlerts($seller->id);
            $stockAlertsCount = $this->dashboardService->getStockAlertsCount($seller->id);
            $topSellingProducts = $this->getTopSellingProducts($seller->id);

            return [
                'shopStats' => $this->getShopStats(
                    $seller->id,
                    $stockAlertsCount,
                    $stockAlerts,
                    $topSellingProducts,
                ),
                'recentOrders' => $this->getRecentShopOrders($seller->id),
                'topSellingProducts' => $topSellingProducts,
                'stockAlerts' => $stockAlerts,
            ];
        });

        return Inertia::render('Seller/Dashboard/Index', $dashboardData);
    }

    /**
     * Build comprehensive shop statistics from one aggregated metrics query.
     *
     * The aggregated statistics and alert/product data are reused instead of
     * re-querying them for each metric, which keeps the dashboard query count low
     * even when the database is remote.
     *
     * @param  int  $sellerId  The authenticated seller's ID
     * @param  int  $initialLowStockCount  Initial count of low stock items
     * @param  Collection|null  $stockAlerts  Already-loaded low stock alerts
     * @param  array  $topSellingProducts  Already-loaded top selling products
     * @return array Complete shop statistics array
     */
    private function getShopStats(
        int $sellerId,
        int $initialLowStockCount = 0,
        ?Collection $stockAlerts = null,
        array $topSellingProducts = [],
    ): array {
        try {
            $aggregatedStats = $this->dashboardService->getAggregatedSellerStats($sellerId);

            return [
                'total_revenue' => $aggregatedStats['total_revenue'],
                'average_order_value' => $aggregatedStats['average_order_value'],
                'total_orders' => $aggregatedStats['total_orders'],
                'unique_customers' => $aggregatedStats['unique_customers'],
                'monthly_revenue_growth' => $this->dashboardService->calculateMonthlyRevenueGrowth($sellerId),
                'low_stock_alerts' => $initialLowStockCount ?: ($stockAlerts?->count() ?? 0),
                'pending_orders_count' => $this->dashboardService->getPendingOrdersCount($sellerId),
                'top_selling_product' => $topSellingProducts[0]['name'] ?? null,
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
     * @param  int  $sellerId  The authenticated seller's ID
     * @param  int  $sellerId  ID của người bán đã xác thực
     * @return Collection Collection of recent orders with relationships loaded
     *                    Lấy các đơn hàng đã hoàn thành gần đây cho dashboard của người bán.
     *                    Lấy các đơn hàng đã hoàn thành gần đây nhất với chi tiết đầy đủ về khách hàng và sản phẩm.
     *                    Bao gồm xử lý lỗi toàn diện với ghi log.
     * @return Collection Bộ sưu tập các đơn hàng gần đây với quan hệ đã tải
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
     * @param  int  $sellerId  The authenticated seller's ID
     * @param  int  $sellerId  ID của người bán đã xác thực
     * @return array Array of top selling product data
     *               Lấy dữ liệu sản phẩm bán chạy nhất cho dashboard.
     *               Lấy các sản phẩm hoạt động tốt nhất theo khối lượng bán hàng với xử lý lỗi.
     * @return array Mảng dữ liệu sản phẩm bán chạy nhất
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
     * @param  int  $initialLowStockCount  Initial low stock count value
     * @param  int  $initialLowStockCount  Giá trị số lượng hàng tồn kho thấp ban đầu
     * @return array Default statistics array
     *               Lấy giá trị thống kê mặc định cho các tình huống dự phòng lỗi.
     *               Cung cấp giá trị mặc định an toàn khi không thể lấy dữ liệu dashboard
     *               do lỗi hoặc dữ liệu thiếu.
     * @return array Mảng thống kê mặc định
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
}

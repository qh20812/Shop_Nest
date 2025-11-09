<?php

namespace App\Services;

use App\Enums\OrderStatus;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Traits\SellerQueryScopes;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Validation\ValidationException;

/**
 * Service class for seller dashboard queries and calculations.
 *
 * This service centralizes all seller-specific dashboard business logic,
 * including data aggregation, query optimization, and metric calculations.
 * It provides a clean interface for the DashboardController while maintaining
 * separation of concerns and testability.
 *
 * Key features:
 * - Optimized database queries with aggregation
 * - Input validation and security checks
 * - Comprehensive error handling
 * - Configurable limits and thresholds
 * - Memory-efficient data processing
 *
 * @package App\Services
 */
class SellerDashboardService
{
    use SellerQueryScopes;

    /**
     * Validate seller ID parameter for security and data integrity.
     *
     * Ensures the seller ID is a positive integer to prevent invalid data access.
     *
     * @param int $sellerId The seller ID to validate
     * @return void
     * @throws \Illuminate\Validation\ValidationException When seller ID is invalid
     */
    private function validateSellerId(int $sellerId): void
    {
        if ($sellerId <= 0) {
            throw ValidationException::withMessages([
                'seller_id' => 'Seller ID must be a positive integer.',
            ]);
        }
    }

    /**
     * Validate and sanitize limit parameter for database queries.
     *
     * Ensures query limits are within safe bounds to prevent performance issues
     * and potential DoS attacks through excessive data retrieval.
     *
     * @param int|null $limit The requested limit or null for default
     * @param int $maxLimit Maximum allowed limit (default: 100)
     * @return int Validated limit value
     * @throws \Illuminate\Validation\ValidationException When limit is invalid
     */
    private function validateLimit(?int $limit, int $maxLimit = 100): int
    {
        if ($limit === null) {
            return config('dashboard.limits.top_selling_products');
        }

        if ($limit <= 0 || $limit > $maxLimit) {
            throw ValidationException::withMessages([
                'limit' => "Limit must be between 1 and {$maxLimit}.",
            ]);
        }

        return $limit;
    }

    /**
     * Get aggregated seller statistics in a single optimized database query.
     *
     * Performs a comprehensive aggregation query that calculates multiple metrics
     * in one database call to minimize performance overhead. Uses conditional
     * aggregation with CASE statements for efficient data processing.
     *
     * Metrics calculated:
     * - Total revenue from completed orders
     * - Total number of completed orders
     * - Number of unique customers
     * - Average order value (calculated from totals)
     *
     * @param int $sellerId The seller's unique identifier
     * @return array Associative array with aggregated statistics
     * @throws \Illuminate\Validation\ValidationException When seller ID is invalid
     */
    public function getAggregatedSellerStats(int $sellerId): array
    {
        $this->validateSellerId($sellerId);
        $completedStatus = OrderStatus::COMPLETED->value;

        $result = OrderItem::query()
            ->selectRaw('
                COALESCE(SUM(CASE WHEN orders.status = ? THEN order_items.total_price ELSE 0 END), 0) as total_revenue,
                COUNT(DISTINCT CASE WHEN orders.status = ? THEN orders.order_id ELSE NULL END) as total_orders,
                COUNT(DISTINCT CASE WHEN orders.status = ? THEN orders.customer_id ELSE NULL END) as unique_customers
            ', [$completedStatus, $completedStatus, $completedStatus])
            ->join('orders', 'order_items.order_id', '=', 'orders.order_id')
            ->join('product_variants', 'order_items.variant_id', '=', 'product_variants.variant_id')
            ->join('products', 'product_variants.product_id', '=', 'products.product_id')
            ->where('products.seller_id', $sellerId)
            ->first();

        $totalRevenue = (float) $result->total_revenue;
        $totalOrders = (int) $result->total_orders;
        $uniqueCustomers = (int) $result->unique_customers;
        $averageOrderValue = $totalOrders > 0 ? round($totalRevenue / $totalOrders, 2) : 0.0;

        return [
            'total_revenue' => $totalRevenue,
            'total_orders' => $totalOrders,
            'average_order_value' => $averageOrderValue,
            'unique_customers' => $uniqueCustomers,
        ];
    }

    /**
     * Get recent completed orders for a seller with full relationship data.
     *
     * Retrieves the most recent completed orders for dashboard display,
     * including customer information and order items with product variants.
     * Uses optimized queries with eager loading to minimize database calls.
     *
     * @param int $sellerId The seller's unique identifier
     * @return Collection Collection of Order models with relationships loaded
     * @throws \Illuminate\Validation\ValidationException When seller ID is invalid
     */
    public function getRecentShopOrders(int $sellerId): Collection
    {
        $this->validateSellerId($sellerId);
        $sellerProductIds = self::getSellerProductIdsSubquery($sellerId);

        return Order::query()
            ->select(['order_id', 'order_number', 'total_amount', 'status', 'customer_id', 'created_at'])
            ->where('status', OrderStatus::COMPLETED->value)
            ->whereExists(function ($query) use ($sellerProductIds) {
                $query->selectRaw('1')
                    ->from('order_items')
                    ->join('product_variants', 'order_items.variant_id', '=', 'product_variants.variant_id')
                    ->whereColumn('order_items.order_id', 'orders.order_id')
                    ->whereIn('product_variants.product_id', $sellerProductIds);
            })
            ->with([
                'customer:id,first_name,last_name,username,email',
                'items' => function ($query) use ($sellerProductIds) {
                    $query->select(['order_item_id', 'order_id', 'variant_id', 'quantity', 'total_price'])
                        ->join('product_variants', 'order_items.variant_id', '=', 'product_variants.variant_id')
                        ->whereIn('product_variants.product_id', $sellerProductIds)
                        ->with([
                            'variant:id,variant_id,product_id,sku',
                            'variant.product:id,product_id,name',
                        ]);
                },
            ])
            ->orderByDesc('created_at')
            ->limit(config('dashboard.limits.recent_orders'))
            ->get();
    }

    /**
     * Get top selling products data for a seller with sales metrics.
     *
     * Retrieves products ranked by total quantity sold, including revenue data.
     * Supports configurable limits and includes localization for product names.
     * Uses aggregation queries for optimal performance.
     *
     * @param int $sellerId The seller's unique identifier
     * @param int|null $limit Maximum number of products to return (null uses config default)
     * @return Collection Collection of product data with sales metrics
     * @throws \Illuminate\Validation\ValidationException When parameters are invalid
     */
    public function getTopSellingProductsData(int $sellerId, int $limit = null): Collection
    {
        $this->validateSellerId($sellerId);
        $limit = $this->validateLimit($limit);
        $locale = app()->getLocale();

        $results = OrderItem::query()
            ->selectRaw('
                product_variants.product_id,
                products.name as product_name,
                SUM(order_items.quantity) as total_quantity,
                SUM(order_items.total_price) as total_revenue
            ')
            ->join('product_variants', 'order_items.variant_id', '=', 'product_variants.variant_id')
            ->join('products', 'product_variants.product_id', '=', 'products.product_id')
            ->join('orders', 'order_items.order_id', '=', 'orders.order_id')
            ->where('orders.status', OrderStatus::COMPLETED->value)
            ->where('products.seller_id', $sellerId)
            ->groupBy('product_variants.product_id', 'products.name')
            ->orderByDesc('total_quantity')
            ->limit($limit)
            ->get();

        if ($results->isEmpty()) {
            return collect();
        }

        return $results->map(function ($row) use ($locale) {
            return [
                'product_id' => $row->product_id,
                'name' => $row->product_name ? (Product::find($row->product_id)?->getTranslation('name', $locale) ?? $row->product_name) : null,
                'total_quantity' => (int) $row->total_quantity,
                'total_revenue' => (float) $row->total_revenue,
            ];
        });
    }

    /**
     * Get count of products with low stock alerts for a seller.
     *
     * Counts product variants that have stock levels below the configured
     * low stock threshold, helping sellers identify inventory needs.
     *
     * @param int $sellerId The seller's unique identifier
     * @return int Number of products with low stock
     * @throws \Illuminate\Validation\ValidationException When seller ID is invalid
     */
    public function getStockAlertsCount(int $sellerId): int
    {
        $this->validateSellerId($sellerId);
        return ProductVariant::query()
            ->join('products', 'product_variants.product_id', '=', 'products.product_id')
            ->where('products.seller_id', $sellerId)
            ->where('product_variants.stock_quantity', '<=', ProductVariant::LOW_STOCK_THRESHOLD)
            ->count();
    }

    /**
     * Get detailed stock alerts data for products with low inventory levels.
     *
     * Returns detailed information about products that have fallen below
     * the low stock threshold to alert sellers about potential stock shortages.
     *
     * @param int $sellerId The seller's unique identifier
     * @return \Illuminate\Support\Collection Collection of products with low stock details
     * @throws \Illuminate\Validation\ValidationException When seller ID is invalid
     */
    public function getStockAlertsData(int $sellerId): Collection
    {
        $this->validateSellerId($sellerId);

        return ProductVariant::query()
            ->join('products', 'product_variants.product_id', '=', 'products.product_id')
            ->where('products.seller_id', $sellerId)
            ->where('products.is_active', true)
            ->where('product_variants.stock_quantity', '<=', ProductVariant::LOW_STOCK_THRESHOLD)
            ->where('product_variants.stock_quantity', '>', 0) // Only show items that are not out of stock
            ->select([
                'products.product_id',
                'products.name',
                'product_variants.variant_id',
                'product_variants.stock_quantity'
            ])
            ->selectRaw('JSON_UNQUOTE(JSON_EXTRACT(products.name, "$.en")) as product_name_en')
            ->get()
            ->map(function ($item) {
                return [
                    'product_name' => $item->product_name_en ?? 'Unknown Product',
                    'stock_quantity' => $item->stock_quantity,
                    'variant_id' => $item->variant_id,
                    'product_id' => $item->product_id,
                ];
            });
    }

    /**
     * Get count of pending orders requiring seller attention.
     *
     * Counts orders in various pending states that may need processing,
     * including orders pending confirmation, processing, assignment, and delivery.
     *
     * @param int $sellerId The seller's unique identifier
     * @return int Number of pending orders
     * @throws \Illuminate\Validation\ValidationException When seller ID is invalid
     */
    public function getPendingOrdersCount(int $sellerId): int
    {
        $this->validateSellerId($sellerId);
        $pendingStatuses = [
            OrderStatus::PENDING_CONFIRMATION->value,
            OrderStatus::PROCESSING->value,
            OrderStatus::PENDING_ASSIGNMENT->value,
            OrderStatus::ASSIGNED_TO_SHIPPER->value,
            OrderStatus::DELIVERING->value,
        ];

        $sellerProductIds = self::getSellerProductIdsSubquery($sellerId);

        return Order::query()
            ->whereIn('status', $pendingStatuses)
            ->whereExists(function ($query) use ($sellerProductIds) {
                $query->selectRaw('1')
                    ->from('order_items')
                    ->join('product_variants', 'order_items.variant_id', '=', 'product_variants.variant_id')
                    ->whereColumn('order_items.order_id', 'orders.order_id')
                    ->whereIn('product_variants.product_id', $sellerProductIds);
            })
            ->count();
    }

    /**
     * Calculate monthly revenue growth percentage for a seller.
     *
     * Compares current month revenue against previous month revenue
     * to calculate growth rate. Handles edge cases like zero previous revenue.
     * Uses Carbon for accurate month boundary calculations.
     *
     * @param int $sellerId The seller's unique identifier
     * @return float Growth percentage (positive for growth, negative for decline)
     * @throws \Illuminate\Validation\ValidationException When seller ID is invalid
     */
    public function calculateMonthlyRevenueGrowth(int $sellerId): float
    {
        $this->validateSellerId($sellerId);
        $now = Carbon::now();
        $currentStart = (clone $now)->startOfMonth();
        $previousStart = (clone $currentStart)->subMonth();
        $previousEnd = (clone $previousStart)->endOfMonth();

        $completedStatus = OrderStatus::COMPLETED->value;

        // Current month revenue
        $currentRevenue = (float) OrderItem::query()
            ->join('orders', 'order_items.order_id', '=', 'orders.order_id')
            ->join('product_variants', 'order_items.variant_id', '=', 'product_variants.variant_id')
            ->join('products', 'product_variants.product_id', '=', 'products.product_id')
            ->where('products.seller_id', $sellerId)
            ->where('orders.status', $completedStatus)
            ->whereBetween('orders.created_at', [$currentStart, $now])
            ->sum('order_items.total_price');

        // Previous month revenue
        $previousRevenue = (float) OrderItem::query()
            ->join('orders', 'order_items.order_id', '=', 'orders.order_id')
            ->join('product_variants', 'order_items.variant_id', '=', 'product_variants.variant_id')
            ->join('products', 'product_variants.product_id', '=', 'products.product_id')
            ->where('products.seller_id', $sellerId)
            ->where('orders.status', $completedStatus)
            ->whereBetween('orders.created_at', [$previousStart, $previousEnd])
            ->sum('order_items.total_price');

        if ($previousRevenue == 0.0) {
            return $currentRevenue > 0 ? 100.0 : 0.0;
        }

        return round((($currentRevenue - $previousRevenue) / $previousRevenue) * 100, 2);
    }

    /**
     * Get stock alerts for products with low inventory levels.
     *
     * Identifies products that have fallen below the low stock threshold
     * to alert sellers about potential stock shortages.
     *
     * @param int $sellerId The seller's unique identifier
     * @return \Illuminate\Support\Collection Collection of products with low stock
     * @throws \Illuminate\Validation\ValidationException When seller ID is invalid
     */
    public function getStockAlerts(int $sellerId): Collection
    {
        $this->validateSellerId($sellerId);

        return ProductVariant::query()
            ->join('products', 'product_variants.product_id', '=', 'products.product_id')
            ->where('products.seller_id', $sellerId)
            ->where('products.is_active', true)
            ->where('product_variants.stock_quantity', '<=', ProductVariant::LOW_STOCK_THRESHOLD)
            ->where('product_variants.stock_quantity', '>', 0) // Only show items that are not out of stock
            ->select([
                'products.name',
                'product_variants.stock_quantity',
                'product_variants.variant_id',
                'products.product_id'
            ])
            ->with('product:id,name')
            ->get()
            ->map(function ($variant) {
                return [
                    'product_name' => $variant->product->name ?? 'Unknown Product',
                    'stock_quantity' => $variant->stock_quantity,
                    'variant_id' => $variant->variant_id,
                    'product_id' => $variant->product_id,
                ];
            });
    }
}

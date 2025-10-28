<?php

namespace App\Services;

use App\Models\OrderItem;
use App\Models\ProductVariant;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class InventoryReportService
{
    private const CACHE_PREFIX = 'inventory_report_';
    private const CACHE_TTL_SECONDS = 3600; // 1 hour

    /**
     * Build report data arrays using cached segments where possible.
     *
     * @return array<string, mixed>
     */
    public function buildReportData(): array
    {
        return [
            'statsBySeller' => $this->getStatsBySeller(),
            'statsByCategory' => $this->getStatsByCategory(),
            'lowStockVariants' => $this->getLowStockVariants(),
            'outOfStockVariants' => $this->getOutOfStockVariants(),
            'agingVariants' => $this->getAgingVariants(),
            'forecast' => $this->getForecastData(),
        ];
    }

    /**
     * Retrieve aggregated stock totals grouped by seller.
     */
    public function getStatsBySeller(): Collection
    {
        return Cache::remember(
            $this->cacheKey('stats_by_seller'),
            $this->ttl(),
            fn () => ProductVariant::select(
                'users.id as seller_id',
                DB::raw("CONCAT(users.first_name, ' ', users.last_name) as seller_name"),
                DB::raw('SUM(product_variants.stock_quantity) as total_stock')
            )
                ->join('products', 'product_variants.product_id', '=', 'products.product_id')
                ->join('users', 'products.seller_id', '=', 'users.id')
                ->groupBy('users.id', 'users.first_name', 'users.last_name')
                ->orderByDesc('total_stock')
                ->get()
        );
    }

    /**
     * Retrieve stock totals grouped by category with localized category names.
     */
    public function getStatsByCategory(): Collection
    {
        return Cache::remember(
            $this->cacheKey('stats_by_category'),
            $this->ttl(),
            fn () => ProductVariant::select(
                'categories.category_id',
                'categories.name',
                DB::raw('SUM(product_variants.stock_quantity) as total_stock')
            )
                ->join('products', 'product_variants.product_id', '=', 'products.product_id')
                ->join('categories', 'products.category_id', '=', 'categories.category_id')
                ->groupBy('categories.category_id', 'categories.name')
                ->orderByDesc('total_stock')
                ->get()
                ->map(function ($row) {
                    $translations = is_array($row->name)
                        ? $row->name
                        : json_decode($row->name, true) ?? [];

                    $locale = app()->getLocale();
                    $row->category_name = $translations[$locale] ?? reset($translations) ?: __('Unknown category');

                    return $row;
                })
        );
    }

    /**
     * Retrieve low-stock variants with sellers eager loaded.
     */
    public function getLowStockVariants(): Collection
    {
        return Cache::remember(
            $this->cacheKey('low_stock'),
            $this->ttl(),
            fn () => ProductVariant::with('product.seller')
                ->lowStock()
                ->orderBy('stock_quantity')
                ->get()
        );
    }

    /**
     * Retrieve out-of-stock variants with sellers eager loaded.
     */
    public function getOutOfStockVariants(): Collection
    {
        return Cache::remember(
            $this->cacheKey('out_of_stock'),
            $this->ttl(),
            fn () => ProductVariant::with('product.seller')
                ->outOfStock()
                ->get()
        );
    }

    /**
     * Retrieve variants that have had no inventory movement in the last 90 days.
     */
    public function getAgingVariants(): Collection
    {
        $ninetyDaysAgo = Carbon::now()->subDays(90);

        return Cache::remember(
            $this->cacheKey('aging'),
            $this->ttl(),
            fn () => ProductVariant::with('product.seller')
                ->where('stock_quantity', '>', 0)
                ->whereDoesntHave('inventoryLogs', fn ($query) => $query->where('created_at', '>', $ninetyDaysAgo))
                ->get()
        );
    }

    /**
     * Retrieve demand forecast data based on recent orders while avoiding N+1 issues.
     */
    public function getForecastData(): Collection
    {
        $thirtyDaysAgo = Carbon::now()->subDays(30);

        return Cache::remember(
            $this->cacheKey('forecast'),
            $this->ttl(),
            fn () => OrderItem::select(
                'order_items.variant_id',
                'product_variants.sku',
                DB::raw('SUM(order_items.quantity) as total_quantity'),
                DB::raw('COUNT(DISTINCT DATE(orders.created_at)) as active_days')
            )
                ->join('orders', 'order_items.order_id', '=', 'orders.order_id')
                ->leftJoin('product_variants', 'order_items.variant_id', '=', 'product_variants.variant_id')
                ->where('orders.created_at', '>=', $thirtyDaysAgo)
                ->groupBy('order_items.variant_id', 'product_variants.sku')
                ->get()
                ->map(function ($row) {
                    $days = max(1, (int) ($row->active_days ?: 30));
                    $row->avg_daily_demand = round($row->total_quantity / $days, 2);

                    return $row;
                })
        );
    }

    /**
     * Clear the cached segments used for inventory reporting.
     */
    public function invalidateCache(): void
    {
        foreach ($this->cacheSegments() as $segment) {
            Cache::forget($this->cacheKey($segment));
        }
    }

    /**
     * Build the full cache key for a given segment.
     */
    private function cacheKey(string $segment): string
    {
        return self::CACHE_PREFIX . $segment;
    }

    /**
     * Cache TTL helper to keep Carbon usage centralized.
     */
    private function ttl(): \DateTimeInterface
    {
        return Carbon::now()->addSeconds(self::CACHE_TTL_SECONDS);
    }

    /**
     * All cache segments used by this service.
     *
     * @return array<int, string>
     */
    private function cacheSegments(): array
    {
        return [
            'stats_by_seller',
            'stats_by_category',
            'low_stock',
            'out_of_stock',
            'aging',
            'forecast',
        ];
    }
}

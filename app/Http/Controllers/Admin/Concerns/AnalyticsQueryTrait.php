<?php

namespace App\Http\Controllers\Admin\Concerns;

use App\Enums\OrderStatus;
use App\Models\InventoryLog;
use App\Models\Order;
use App\Models\ProductVariant;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;

trait AnalyticsQueryTrait
{
    /**
     * Base revenue query with shared filters.
     */
    protected function scopeRevenueQueries(array $filters = []): Builder
    {
        $query = Order::query()->whereIn('status', [
            OrderStatus::COMPLETED,
            OrderStatus::DELIVERED,
        ]);

        if (!empty($filters['date_from'])) {
            $query->where('orders.created_at', '>=', Carbon::parse($filters['date_from'])->startOfDay());
        }

        if (!empty($filters['date_to'])) {
            $query->where('orders.created_at', '<=', Carbon::parse($filters['date_to'])->endOfDay());
        }

        if (!empty($filters['seller_id']) || !empty($filters['category_id']) || !empty($filters['brand_id'])) {
            $query->whereHas('items.variant.product', function (Builder $productQuery) use ($filters) {
                if (!empty($filters['seller_id'])) {
                    $productQuery->where('seller_id', (int) $filters['seller_id']);
                }

                if (!empty($filters['category_id'])) {
                    $productQuery->where('category_id', (int) $filters['category_id']);
                }

                if (!empty($filters['brand_id'])) {
                    $productQuery->where('brand_id', (int) $filters['brand_id']);
                }
            });
        }

        return $query;
    }

    /**
     * Base user query with optional filters.
     */
    protected function scopeUserQueries(array $filters = []): Builder
    {
        $query = User::query();

        if (!empty($filters['date_from'])) {
            $query->where('created_at', '>=', Carbon::parse($filters['date_from'])->startOfDay());
        }

        if (!empty($filters['date_to'])) {
            $query->where('created_at', '<=', Carbon::parse($filters['date_to'])->endOfDay());
        }

        if (!empty($filters['role'])) {
            $query->whereHas('role', fn (Builder $roleQuery) => $roleQuery->where('name->en', $filters['role']));
        }

        return $query;
    }

    /**
     * Base product query with optional filters.
     */
    protected function scopeProductQueries(array $filters = []): Builder
    {
        $query = ProductVariant::query()->with(['product.category', 'product.brand']);

        if (!empty($filters['seller_id'])) {
            $query->whereHas('product', fn (Builder $productQuery) => $productQuery->where('seller_id', (int) $filters['seller_id']));
        }

        if (!empty($filters['category_id'])) {
            $query->whereHas('product', fn (Builder $productQuery) => $productQuery->where('category_id', (int) $filters['category_id']));
        }

        if (!empty($filters['brand_id'])) {
            $query->whereHas('product', fn (Builder $productQuery) => $productQuery->where('brand_id', (int) $filters['brand_id']));
        }

        return $query;
    }

    /**
     * Base order query with optional filters.
     */
    protected function scopeOrderQueries(array $filters = []): Builder
    {
        $query = Order::query()->with(['customer', 'items']);

        if (!empty($filters['status'])) {
            $statuses = (array) $filters['status'];
            $query->whereIn('status', array_map(fn ($status) => is_string($status) ? $status : (string) $status, $statuses));
        }

        if (!empty($filters['date_from'])) {
            $query->where('orders.created_at', '>=', Carbon::parse($filters['date_from'])->startOfDay());
        }

        if (!empty($filters['date_to'])) {
            $query->where('orders.created_at', '<=', Carbon::parse($filters['date_to'])->endOfDay());
        }

        if (!empty($filters['seller_id'])) {
            $query->whereHas('items.variant.product', fn (Builder $productQuery) => $productQuery->where('seller_id', (int) $filters['seller_id']));
        }

        if (!empty($filters['category_id'])) {
            $query->whereHas('items.variant.product', fn (Builder $productQuery) => $productQuery->where('category_id', (int) $filters['category_id']));
        }

        if (!empty($filters['customer_id'])) {
            $query->where('customer_id', (int) $filters['customer_id']);
        }

        return $query;
    }

    /**
     * Base inventory log query for turnover metrics.
     */
    protected function scopeInventoryLogQueries(array $filters = []): Builder
    {
        $query = InventoryLog::query()->with(['variant.product']);

        if (!empty($filters['date_from'])) {
            $query->where('created_at', '>=', Carbon::parse($filters['date_from'])->startOfDay());
        }

        if (!empty($filters['date_to'])) {
            $query->where('created_at', '<=', Carbon::parse($filters['date_to'])->endOfDay());
        }

        if (!empty($filters['seller_id'])) {
            $query->whereHas('variant.product', fn (Builder $productQuery) => $productQuery->where('seller_id', (int) $filters['seller_id']));
        }

        if (!empty($filters['category_id'])) {
            $query->whereHas('variant.product', fn (Builder $productQuery) => $productQuery->where('category_id', (int) $filters['category_id']));
        }

        return $query;
    }
}

<?php

namespace App\Http\Controllers\Admin\Concerns;

use App\Models\ProductVariant;
use App\Services\InventoryService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

trait InventoryQueryTrait
{
    /**
     * Build the paginated product variant listing with applied filters.
     *
     * @param array<string, mixed> $filters
     */
    protected function getVariantInventoryListing(array $filters): LengthAwarePaginator
    {
        return ProductVariant::query()
            ->with(['product.seller', 'product.category', 'product.brand'])
            ->select('product_variants.*')
            ->join('products', 'product_variants.product_id', '=', 'products.product_id')
            ->search($filters['search'] ?? null)
            ->forSeller(isset($filters['seller_id']) ? (int) $filters['seller_id'] : null)
            ->forCategory(isset($filters['category_id']) ? (int) $filters['category_id'] : null)
            ->forBrand(isset($filters['brand_id']) ? (int) $filters['brand_id'] : null)
            ->when($filters['stock_status'] ?? null, function ($query, $status) {
                return match ($status) {
                    'in_stock' => $query->where('product_variants.stock_quantity', '>', InventoryService::IN_STOCK_THRESHOLD),
                    'low_stock' => $query->whereBetween('product_variants.stock_quantity', [1, InventoryService::LOW_STOCK_THRESHOLD]),
                    'out_of_stock' => $query->where('product_variants.stock_quantity', '=', 0),
                    default => $query,
                };
            })
            ->orderBy('products.product_id')
            ->orderBy('product_variants.variant_id')
            ->paginate($this->paginationPerPage())
            ->withQueryString();
    }

    /**
     * Determine pagination size, allowing the host class to override via constant.
     */
    protected function paginationPerPage(): int
    {
        return defined('static::PAGINATION_PER_PAGE') ? (int) constant('static::PAGINATION_PER_PAGE') : 20;
    }
}

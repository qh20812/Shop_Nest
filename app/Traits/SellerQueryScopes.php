<?php

namespace App\Traits;

use App\Models\Product;
use Illuminate\Database\Eloquent\Builder;

/**
 * Trait for queries related to seller-specific data
 * Provides reusable query scopes and methods for filtering by seller
 */
trait SellerQueryScopes
{
    /**
     * Scope to filter orders that belong to a specific seller
     */
    public function scopeForSeller(Builder $query, int $sellerId): Builder
    {
        return $query->whereExists(function ($subQuery) use ($sellerId) {
            $subQuery->selectRaw('1')
                ->from('order_items')
                ->join('product_variants', 'order_items.variant_id', '=', 'product_variants.variant_id')
                ->join('products', 'product_variants.product_id', '=', 'products.product_id')
                ->whereColumn('order_items.order_id', $this->getTable() . '.order_id')
                ->where('products.seller_id', $sellerId);
        });
    }

    /**
     * Scope to filter order items that belong to a specific seller
     */
    public function scopeForSellerItems(Builder $query, int $sellerId): Builder
    {
        return $query->join('product_variants', 'order_items.variant_id', '=', 'product_variants.variant_id')
            ->join('products', 'product_variants.product_id', '=', 'products.product_id')
            ->where('products.seller_id', $sellerId);
    }

    /**
     * Scope to filter product variants that belong to a specific seller
     */
    public function scopeForSellerVariants(Builder $query, int $sellerId): Builder
    {
        return $query->join('products', 'product_variants.product_id', '=', 'products.product_id')
            ->where('products.seller_id', $sellerId);
    }

    /**
     * Get subquery for seller product IDs
     */
    public static function getSellerProductIdsSubquery(int $sellerId)
    {
        return Product::query()
            ->where('seller_id', $sellerId)
            ->select('product_id');
    }

    /**
     * Get subquery for seller variant IDs
     */
    public static function getSellerVariantIdsSubquery(int $sellerId)
    {
        return Product::query()
            ->join('product_variants', 'products.product_id', '=', 'product_variants.product_id')
            ->where('products.seller_id', $sellerId)
            ->select('product_variants.variant_id');
    }
}
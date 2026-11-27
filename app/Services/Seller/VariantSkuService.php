<?php

namespace App\Services\Seller;

use App\Models\ProductVariant;

/**
 * Frees unique columns when a variant is removed from a product.
 *
 * ProductVariant uses soft deletes, but the `sku` and
 * `(product_id, option_signature)` unique indexes still include trashed rows.
 * Rewriting the SKU and clearing the signature lets sellers reuse the values
 * later while keeping the historical row for orders.
 */
class VariantSkuService
{
    public function releaseUniqueValues(ProductVariant $variant): void
    {
        $suffix = '-del-'.$variant->variant_id;
        $base = mb_substr((string) $variant->sku, 0, max(1, 100 - mb_strlen($suffix)));

        $variant->forceFill([
            'sku' => $base.$suffix,
            'option_signature' => null,
        ])->save();
    }
}

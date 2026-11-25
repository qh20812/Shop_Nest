<?php

namespace App\Services;

use App\Models\Product;
use App\Services\Seller\StoreImagesService;
use App\Services\Seller\VariantSkuService;
use Illuminate\Support\Facades\DB;

/**
 * Single deletion path for products so seller and admin behave identically.
 */
class ProductDeletionService
{
    public function __construct(
        private StoreImagesService $storeImagesService,
        private VariantSkuService $variantSkuService,
    ) {}

    public function delete(Product $product): void
    {
        DB::transaction(function () use ($product): void {
            $product->loadMissing(['images', 'variants']);

            $this->storeImagesService->deleteProductImages($product);

            foreach ($product->variants as $variant) {
                $this->variantSkuService->releaseUniqueValues($variant);
                $variant->delete();
            }

            $product->delete();
        });
    }
}

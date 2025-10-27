<?php

namespace App\Observers;

use App\Models\ProductVariant;
use App\Services\ProductCacheService;

class ProductVariantObserver
{
    public function __construct(private ProductCacheService $cacheService)
    {
    }

    public function saved(ProductVariant $variant): void
    {
        $this->flushCaches($variant);
    }

    public function deleted(ProductVariant $variant): void
    {
        $this->flushCaches($variant);
    }

    public function restored(ProductVariant $variant): void
    {
        $this->flushCaches($variant);
    }

    private function flushCaches(ProductVariant $variant): void
    {
        if ($variant->product_id) {
            $this->cacheService->forgetProductDetailCaches((int) $variant->product_id);
        }
    }
}

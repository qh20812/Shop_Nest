<?php

namespace App\Services;

use Illuminate\Contracts\Cache\Repository as CacheRepository;

class ProductCacheService
{
    public function __construct(private CacheRepository $cache)
    {
    }

    public function forgetProductDetailCaches(int $productId): void
    {
        foreach ($this->locales() as $locale) {
            $this->cache->forget("product_detail_{$productId}_{$locale}");
            $this->cache->forget("product_detail_related_{$productId}_{$locale}");
        }
    }

    private function locales(): array
    {
        $configured = config('app.supported_locales', []);
        if (empty($configured)) {
            $configured = [config('app.locale'), config('app.fallback_locale')];
        }

        return array_values(array_unique(array_filter($configured)));
    }
}

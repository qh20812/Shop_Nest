<?php

namespace App\Services\Seller;

use App\Models\Product;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class ProductViewService
{
    public function prepareForView(Product $product): array
    {
        $product->loadMissing([
            'category',
            'brand',
            'images' => fn ($query) => $query->orderBy('display_order')->orderBy('image_id'),
            'variants' => fn ($query) => $query->orderBy('created_at'),
            'reviews' => function ($query) use ($product) {
                $cacheKey = "product_reviews_{$product->id}";
                return Cache::remember(
                    $cacheKey,
                    1800, // 30 minutes, assuming reviews change infrequently
                    fn () => $query->latest()->limit((int) config('app.reviews.limit', 5))->get()
                );
            },
        ]);

        $primaryVariant = $product->variants->firstWhere('is_primary', true) ?? $product->variants->first();

        $productArray = $product->toArray();

        // Transform images to include full URLs
        if (isset($productArray['images']) && is_array($productArray['images'])) {
            $productArray['images'] = array_map(function ($image) {
                if (isset($image['image_url'])) {
                    $image['image_url'] = \Illuminate\Support\Facades\Storage::url($image['image_url']);
                }
                return $image;
            }, $productArray['images']);
        }

        return array_merge($productArray, [
            'name_en' => $product->getTranslation('name', 'en'),
            'description_en' => $product->getTranslation('description', 'en'),
        ]);
    }
}
<?php

namespace App\Services\Seller;

use App\Models\Product;
use Illuminate\Support\Facades\Storage;

class ProductViewService
{
    public function prepareForView(Product $product): array
    {
        $product->loadMissing([
            'category',
            'brand',
            'images' => fn ($query) => $query->orderBy('display_order')->orderBy('image_id'),
            'variants' => fn ($query) => $query->orderBy('created_at'),
            'reviews' => fn ($query) => $query->latest()->limit(
                (int) config('app.reviews.limit', 5)
            ),
        ]);

        $productArray = $product->toArray();

        // Transform images to include full URLs
        if (isset($productArray['images']) && is_array($productArray['images'])) {
            $productArray['images'] = array_map(function ($image) {
                if (isset($image['image_url'])) {
                    $image['image_url'] = Storage::url($image['image_url']);
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

<?php

namespace App\Services\Seller;

use App\Models\Product;
use App\Services\ImageValidationService;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class StoreImagesService
{
    protected ImageValidationService $imageValidationService;

    public function __construct(ImageValidationService $imageValidationService)
    {
        $this->imageValidationService = $imageValidationService;
    }

    public function storeImages(Product $product, array $images): void
    {
        if (empty($images)) {
            return;
        }

        $existingCount = $product->images()->count();
        $hasExistingPrimary = $product->images()->where('is_primary', true)->exists();

        foreach ($images as $index => $image) {
            // Validate image before storing to guarantee uniform constraints
            $this->imageValidationService->validateImage($image, ImageValidationService::TYPE_PRODUCT);

            $path = $image->store('products', 'public');
            $product->images()->create([
                'image_url' => $path,
                'alt_text' => null,
                'is_primary' => $hasExistingPrimary ? false : ($existingCount + $index === 0),
                'display_order' => $existingCount + $index,
            ]);
        }

        Log::info('Images stored for product', [
            'product_id' => $product->product_id,
            'seller_id' => $product->seller_id,
            'image_count' => count($images),
        ]);
    }

    public function deleteProductImages(Product $product): void
    {
        foreach ($product->images as $image) {
            if (!empty($image->image_url)) {
                Storage::disk('public')->delete($image->image_url);
            }

            $image->delete();
        }

        Log::info('Images deleted for product', [
            'product_id' => $product->product_id,
            'seller_id' => $product->seller_id,
            'deleted_count' => $product->images->count(),
        ]);
    }
}

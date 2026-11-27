<?php

namespace App\Services\Seller;

use App\Models\Product;
use App\Services\ImageValidationService;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

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

        // Validate the whole batch first so a bad file cannot leave earlier
        // uploads behind when the transaction is rolled back.
        foreach ($images as $image) {
            $this->imageValidationService->validateImage($image, ImageValidationService::TYPE_PRODUCT);
        }

        $existingCount = $product->images()->count();
        $hasExistingPrimary = $product->images()->where('is_primary', true)->exists();
        $storedPaths = [];

        try {
            foreach ($images as $index => $image) {
                $path = $image->store('products', 'public');
                $storedPaths[] = $path;

                $product->images()->create([
                    'image_url' => $path,
                    'alt_text' => null,
                    'is_primary' => $hasExistingPrimary ? false : $index === 0,
                    'display_order' => $existingCount + $index,
                ]);
            }
        } catch (\Throwable $exception) {
            foreach ($storedPaths as $storedPath) {
                Storage::disk('public')->delete($storedPath);
            }

            throw $exception;
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
            if (! empty($image->image_url)) {
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

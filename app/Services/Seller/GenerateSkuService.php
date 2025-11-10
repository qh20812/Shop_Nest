<?php

namespace App\Services\Seller;

use App\Models\ProductVariant;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class GenerateSkuService
{
    private static array $generatedSkus = [];

    public function generateSku(): string
    {
        do {
            $sku = 'SKU-' . Str::upper(Str::random(8));
        } while (in_array($sku, self::$generatedSkus, true) || ProductVariant::where('sku', $sku)->exists());

        self::$generatedSkus[] = $sku;

        Log::info('SKU generated', ['sku' => $sku]);

        return $sku;
    }
}

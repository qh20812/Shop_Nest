<?php

namespace App\Http\Controllers\Debug;

use App\Http\Controllers\Controller;
use App\Models\ProductVariant;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InventoryDebugController extends Controller
{
    public function show(Request $request, ProductVariant $variant): JsonResponse
    {
        if (!app()->environment(['local', 'testing']) && !config('app.debug')) {
            abort(404);
        }

        $calculatedAvailable = $variant->available_quantity ?? max(0, (int) $variant->stock_quantity - (int) ($variant->reserved_quantity ?? 0));

        return response()->json([
            'variant_id' => $variant->variant_id,
            'sku' => $variant->sku,
            'product_id' => $variant->product_id,
            'track_inventory' => (bool) ($variant->track_inventory ?? true),
            'stock_quantity' => (int) $variant->stock_quantity,
            'reserved_quantity' => (int) ($variant->reserved_quantity ?? 0),
            'available_quantity' => $variant->available_quantity,
            'calculated_available' => $calculatedAvailable,
            'minimum_stock_level' => (int) ($variant->minimum_stock_level ?? 0),
            'timestamp' => now()->toIso8601String(),
        ]);
    }
}

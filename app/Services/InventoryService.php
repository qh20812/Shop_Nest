<?php

namespace App\Services;

use App\Models\Order;
use App\Models\ProductVariant;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use RuntimeException;

class InventoryService
{
    public function __construct(private ProductCacheService $productCacheService)
    {
    }

    /**
     * Adjust inventory for an order after successful payment.
     * 
     * @param Order $order
     * @return void
     * @throws RuntimeException
     */
    public function adjustInventoryForOrder(Order $order): void
    {
        $order->loadMissing('items.variant');

        foreach ($order->items as $item) {
            $variant = ProductVariant::lockForUpdate()->find($item->variant_id);

            if (!$variant) {
                Log::error('inventory.variant_not_found', [
                    'order_id' => $order->order_id,
                    'order_item_id' => $item->order_item_id,
                    'variant_id' => $item->variant_id,
                ]);
                throw new RuntimeException("Variant not found for order item {$item->order_item_id}");
            }

            if ($variant->track_inventory && !$variant->allow_backorder) {
                $available = $variant->available_quantity 
                    ?? max(0, (int) $variant->stock_quantity - (int) $variant->reserved_quantity);

                if ($available < $item->quantity) {
                    Log::error('inventory.insufficient_stock', [
                        'order_id' => $order->order_id,
                        'variant_id' => $variant->variant_id,
                        'available' => $available,
                        'requested' => $item->quantity,
                    ]);
                    throw new RuntimeException("Insufficient stock for variant {$variant->variant_id}");
                }
            }

            $this->reduceStock($variant, $item->quantity);

            Log::info('inventory.adjusted', [
                'order_id' => $order->order_id,
                'variant_id' => $variant->variant_id,
                'quantity_reduced' => $item->quantity,
                'new_stock' => $variant->stock_quantity,
            ]);
        }
    }

    /**
     * Restore inventory for an order (e.g., after payment failure or cancellation).
     * 
     * @param Order $order
     * @return void
     */
    public function restoreInventoryForOrder(Order $order): void
    {
        $order->loadMissing('items.variant');

        DB::transaction(function () use ($order) {
            foreach ($order->items as $item) {
                $variant = ProductVariant::lockForUpdate()->find($item->variant_id);

                if (!$variant) {
                    Log::warning('inventory.restore_variant_not_found', [
                        'order_id' => $order->order_id,
                        'variant_id' => $item->variant_id,
                    ]);
                    continue;
                }

                $this->increaseStock($variant, $item->quantity);

                Log::info('inventory.restored', [
                    'order_id' => $order->order_id,
                    'variant_id' => $variant->variant_id,
                    'quantity_restored' => $item->quantity,
                    'new_stock' => $variant->stock_quantity,
                ]);
            }
        });
    }

    /**
     * Reduce stock quantity for a variant.
     * 
     * @param ProductVariant $variant
     * @param int $quantity
     * @return void
     */
    private function reduceStock(ProductVariant $variant, int $quantity): void
    {
        $newStock = max(0, (int) $variant->stock_quantity - (int) $quantity);
        $newReserved = max(0, (int) $variant->reserved_quantity - (int) $quantity);

        $variant->forceFill([
            'stock_quantity' => $newStock,
            'reserved_quantity' => $newReserved,
        ])->save();

        $this->productCacheService->forgetProductDetailCaches((int) $variant->product_id);
    }

    /**
     * Increase stock quantity for a variant.
     * 
     * @param ProductVariant $variant
     * @param int $quantity
     * @return void
     */
    private function increaseStock(ProductVariant $variant, int $quantity): void
    {
        $newStock = (int) $variant->stock_quantity + (int) $quantity;
        $newReserved = max(0, (int) $variant->reserved_quantity - (int) $quantity);

        $variant->forceFill([
            'stock_quantity' => $newStock,
            'reserved_quantity' => $newReserved,
        ])->save();

        $this->productCacheService->forgetProductDetailCaches((int) $variant->product_id);
    }
}

<?php

namespace App\Services;

use App\Exceptions\InventoryException;
use App\Models\InventoryLog;
use App\Models\Order;
use App\Models\ProductVariant;
use App\Notifications\LowStockNotification;
use Illuminate\Database\Eloquent\Collection as EloquentCollection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use RuntimeException;
use Throwable;

class InventoryService
{
    public const LOW_STOCK_THRESHOLD = 10;
    public const IN_STOCK_THRESHOLD = 10;

    private const REPORT_CACHE_KEYS = [
        'statsBySeller' => 'inventory_report_stats_by_seller',
        'statsByCategory' => 'inventory_report_stats_by_category',
        'lowStock' => 'inventory_report_low_stock',
        'outOfStock' => 'inventory_report_out_of_stock',
        'aging' => 'inventory_report_aging',
        'forecast' => 'inventory_report_forecast',
    ];

    public function __construct(private ProductCacheService $productCacheService)
    {
    }

    /**
     * Adjust inventory for an order after successful payment.
     *
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
     * Increase or decrease stock quantity by the given change value.
     */
    public function adjustStock(int $variantId, int $quantityChange, string $reason, ?int $userId = null): InventoryLog
    {
        return $this->runWithinTransaction(function () use ($variantId, $quantityChange, $reason, $userId) {
            $variant = ProductVariant::lockForUpdate()->findOrFail($variantId);

            return $this->applyAdjustment($variant, $quantityChange, $reason, $userId);
        });
    }

    /**
     * Set stock to a specific quantity.
     */
    public function setStock(int $variantId, int $targetQuantity, string $reason, ?int $userId = null): InventoryLog
    {
        return $this->runWithinTransaction(function () use ($variantId, $targetQuantity, $reason, $userId) {
            $variant = ProductVariant::lockForUpdate()->findOrFail($variantId);
            $quantityChange = $targetQuantity - (int) $variant->stock_quantity;

            if ($quantityChange === 0) {
                throw new InventoryException(__('Stock quantity remains unchanged.'));
            }

            return $this->applyAdjustment($variant, $quantityChange, $reason, $userId);
        });
    }

    /**
     * Bulk adjust multiple variants in a single transaction.
     *
     * @param array<int, array<string, mixed>> $payload
     * @return Collection<int, InventoryLog>
     */
    public function bulkAdjust(array $payload, string $reason, ?int $userId = null): Collection
    {
        if (empty($payload)) {
            throw InventoryException::invalidBulkPayload();
        }

        return $this->runWithinTransaction(function () use ($payload, $reason, $userId) {
            $ids = collect($payload)
                ->map(fn ($item) => (int) Arr::get($item, 'variant_id'))
                ->unique()
                ->filter()
                ->values();

            if ($ids->isEmpty()) {
                throw InventoryException::invalidBulkPayload();
            }

            /** @var EloquentCollection<int, ProductVariant> $variants */
            $variants = ProductVariant::lockForUpdate()->whereIn('variant_id', $ids)->get()->keyBy('variant_id');

            if ($variants->count() !== $ids->count()) {
                throw new ModelNotFoundException(__('One or more variants could not be found.'));
            }

            $logs = collect();

            foreach ($payload as $item) {
                $variantId = (int) Arr::get($item, 'variant_id');
                $quantityChange = (int) Arr::get($item, 'quantity_change', 0);

                if ($quantityChange === 0) {
                    continue;
                }

                $variant = $variants->get($variantId);
                $logs->push($this->applyAdjustment($variant, $quantityChange, $reason, $userId));
            }

            return $logs->filter();
        });
    }

    /**
     * Forget expensive report cache entries.
     */
    public function flushReportCache(): void
    {
        foreach (self::REPORT_CACHE_KEYS as $cacheKey) {
            Cache::forget($cacheKey);
        }
    }

    /**
     * Reduce stock quantity for a variant.
     */
    private function reduceStock(ProductVariant $variant, int $quantity): InventoryLog
    {
        $newStock = max(0, (int) $variant->stock_quantity - (int) $quantity);
        $newReserved = max(0, (int) $variant->reserved_quantity - (int) $quantity);

        $variant->forceFill([
            'stock_quantity' => $newStock,
            'reserved_quantity' => $newReserved,
        ])->save();

        $this->productCacheService->forgetProductDetailCaches((int) $variant->product_id);

        $log = $variant->inventoryLogs()->create([
            'user_id' => Auth::id(),
            'quantity_change' => -$quantity,
            'reason' => 'Order fulfillment',
        ]);

        DB::afterCommit(function () use ($variant) {
            $this->flushReportCache();
            $this->dispatchAlerts($variant);
        });

        return $log;
    }

    /**
     * Increase stock quantity for a variant.
     */
    private function increaseStock(ProductVariant $variant, int $quantity): InventoryLog
    {
        $newStock = (int) $variant->stock_quantity + (int) $quantity;
        $newReserved = max(0, (int) $variant->reserved_quantity - (int) $quantity);

        $variant->forceFill([
            'stock_quantity' => $newStock,
            'reserved_quantity' => $newReserved,
        ])->save();

        $this->productCacheService->forgetProductDetailCaches((int) $variant->product_id);

        $log = $variant->inventoryLogs()->create([
            'user_id' => Auth::id(),
            'quantity_change' => $quantity,
            'reason' => 'Order cancellation/restock',
        ]);

        DB::afterCommit(function () use ($variant) {
            $this->flushReportCache();
            $this->dispatchAlerts($variant);
        });

        return $log;
    }

    /**
     * Wrapper to ensure cache flush happens after successful transaction commit.
     */
    private function runWithinTransaction(callable $callback): mixed
    {
        try {
            return DB::transaction(function () use ($callback) {
                $result = $callback();

                DB::afterCommit(function () use ($result) {
                    $this->flushReportCache();

                    if ($result instanceof InventoryLog) {
                        $this->dispatchAlerts($result->variant);
                    }

                    if ($result instanceof Collection) {
                        $result->each(function ($log) {
                            if ($log instanceof InventoryLog) {
                                $this->dispatchAlerts($log->variant);
                            }
                        });
                    }
                });

                return $result;
            });
        } catch (Throwable $exception) {
            Log::error('inventory.adjustment_failed', [
                'message' => $exception->getMessage(),
                'trace' => $exception->getTraceAsString(),
            ]);

            if ($exception instanceof InventoryException) {
                throw $exception;
            }

            throw new InventoryException($exception->getMessage(), previous: $exception);
        }
    }

    private function applyAdjustment(ProductVariant $variant, int $quantityChange, string $reason, ?int $userId = null): InventoryLog
    {
        $userId = $userId ?? Auth::id();

        $newQuantity = (int) $variant->stock_quantity + $quantityChange;

        if ($newQuantity < 0) {
            throw InventoryException::negativeStock();
        }

        $variant->update(['stock_quantity' => $newQuantity]);

        return $variant->inventoryLogs()->create([
            'user_id' => $userId,
            'quantity_change' => $quantityChange,
            'reason' => $reason,
        ]);
    }

    private function dispatchAlerts(?ProductVariant $variant): void
    {
        if (!$variant || app()->environment('testing')) {
            return;
        }

        $variant->refresh();

        if ($variant->stock_quantity <= self::LOW_STOCK_THRESHOLD && $variant->product && $variant->product->seller) {
            $variant->product->seller->notify(new LowStockNotification($variant));
        }
    }
}

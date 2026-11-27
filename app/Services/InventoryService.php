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

    public function __construct(private ProductCacheService $productCacheService) {}

    /**
     * Reserve stock for every item of an order.
     *
     * Reservations are created when the order is placed and later converted to
     * a real stock decrement on successful payment, or released when the order
     * is cancelled/failed.
     */
    public function reserveForOrder(Order $order): void
    {
        if ($order->inventory_reserved_at !== null || $order->inventory_committed_at !== null) {
            return;
        }

        DB::transaction(function () use ($order) {
            $order->loadMissing('items.variant');

            foreach ($order->items as $item) {
                $variant = ProductVariant::lockForUpdate()->find($item->variant_id);

                if (! $variant) {
                    throw new InventoryException("Variant not found for order item {$item->order_item_id}");
                }

                $quantity = (int) $item->quantity;

                if ($variant->track_inventory && ! $variant->allow_backorder) {
                    $available = $variant->available_quantity
                        ?? max(0, (int) $variant->stock_quantity - (int) $variant->reserved_quantity);

                    if ($available < $quantity) {
                        throw new InventoryException("Insufficient stock for variant {$variant->variant_id}");
                    }
                }

                $variant->increment('reserved_quantity', $quantity);
                $this->productCacheService->forgetProductDetailCaches((int) $variant->product_id);
            }

            $order->forceFill(['inventory_reserved_at' => now()])->save();
        });
    }

    /**
     * Convert an existing reservation (or a direct order line) into a real
     * stock decrement. Safe to call more than once.
     */
    public function commitReservedForOrder(Order $order): void
    {
        if ($order->inventory_committed_at !== null) {
            return;
        }

        DB::transaction(function () use ($order) {
            $order->loadMissing('items.variant');

            foreach ($order->items as $item) {
                $variant = ProductVariant::lockForUpdate()->find($item->variant_id);

                if (! $variant) {
                    throw new RuntimeException("Variant not found for order item {$item->order_item_id}");
                }

                $quantity = (int) $item->quantity;

                if ($variant->track_inventory && ! $variant->allow_backorder) {
                    $available = $variant->available_quantity
                        ?? max(0, (int) $variant->stock_quantity - (int) $variant->reserved_quantity);

                    if ($available < $quantity) {
                        throw new RuntimeException("Insufficient stock for variant {$variant->variant_id}");
                    }
                }

                $this->reduceStock($variant, $quantity);
            }

            $order->forceFill(['inventory_committed_at' => now()])->save();
        });
    }

    /**
     * Release reservations without touching physical stock.
     */
    public function releaseReservedForOrder(Order $order): void
    {
        if ($order->inventory_committed_at !== null || $order->inventory_reserved_at === null) {
            return;
        }

        DB::transaction(function () use ($order) {
            $order->loadMissing('items.variant');

            foreach ($order->items as $item) {
                $variant = ProductVariant::lockForUpdate()->find($item->variant_id);

                if (! $variant) {
                    continue;
                }

                $release = min((int) $item->quantity, (int) $variant->reserved_quantity);

                if ($release > 0) {
                    $variant->decrement('reserved_quantity', $release);
                    $this->productCacheService->forgetProductDetailCaches((int) $variant->product_id);
                }
            }

            $order->forceFill(['inventory_reserved_at' => null])->save();
        });
    }

    /**
     * Release whatever inventory state the order currently holds.
     */
    public function handleOrderRelease(Order $order): void
    {
        if ($order->inventory_committed_at !== null) {
            $this->restoreInventoryForOrder($order);
            $order->forceFill(['inventory_committed_at' => null, 'inventory_reserved_at' => null])->save();

            return;
        }

        $this->releaseReservedForOrder($order);
    }

    /**
     * Adjust inventory for an order after successful payment.
     *
     * @throws RuntimeException
     */
    public function adjustInventoryForOrder(Order $order): void
    {
        $this->commitReservedForOrder($order);
    }

    /**
     * Release reservations for orders whose payment was never completed.
     */
    public function releaseStaleReservations(int $hours = 24): int
    {
        $orders = Order::query()
            ->whereNotNull('inventory_reserved_at')
            ->whereNull('inventory_committed_at')
            ->where('inventory_reserved_at', '<=', now()->subHours($hours))
            ->where('status', 'pending_confirmation')
            ->get();

        foreach ($orders as $order) {
            $order->update([
                'status' => 'cancelled',
                'payment_status' => 'failed',
            ]);
        }

        return $orders->count();
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

                if (! $variant) {
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
     * @param  array<int, array<string, mixed>>  $payload
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
        if (! $variant) {
            return;
        }

        $variant->refresh();

        $quantity = (int) $variant->stock_quantity;
        $threshold = (int) self::LOW_STOCK_THRESHOLD;

        // Đã nhập thêm hàng lên trên ngưỡng → mở lại chu kỳ cảnh báo.
        if ($quantity > $threshold) {
            if ($variant->low_stock_notified_at !== null) {
                $variant->forceFill(['low_stock_notified_at' => null])->saveQuietly();
            }

            return;
        }

        // Mỗi lần "sắp hết hàng" chỉ gửi 1 email (trước đây gửi mỗi đơn hàng).
        if ($variant->low_stock_notified_at !== null) {
            return;
        }

        $seller = $variant->product?->seller;

        if (! $seller || ! $seller->email) {
            return;
        }

        $variant->forceFill(['low_stock_notified_at' => now()])->saveQuietly();
        $seller->notify(new LowStockNotification($variant));
    }
}

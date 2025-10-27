<?php

namespace Tests\Unit\Services;

use App\Exceptions\InventoryException;
use App\Models\InventoryLog;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ProductVariant;
use App\Models\User;
use App\Notifications\LowStockNotification;
use App\Services\InventoryService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
use RuntimeException;
use Tests\TestCase;

class InventoryServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_adjust_stock_creates_log_and_updates_quantity(): void
    {
        Notification::fake();

        $variant = ProductVariant::factory()->create(['stock_quantity' => 5]);

        /** @var InventoryService $service */
        $service = app(InventoryService::class);

        $log = $service->adjustStock($variant->variant_id, 3, 'Test increase');

        $this->assertInstanceOf(InventoryLog::class, $log);
        $this->assertEquals(3, $log->quantity_change);
        $this->assertEquals(8, $variant->fresh()->stock_quantity);
    }

    public function test_adjust_stock_throws_exception_when_negative(): void
    {
        $variant = ProductVariant::factory()->create(['stock_quantity' => 2]);

        $service = app(InventoryService::class);

        $this->expectException(InventoryException::class);
        $service->adjustStock($variant->variant_id, -5, 'Attempt negative');
    }

    public function test_bulk_adjust_updates_multiple_variants(): void
    {
        Notification::fake();

        $variantA = ProductVariant::factory()->create(['stock_quantity' => 10]);
        $variantB = ProductVariant::factory()->create(['stock_quantity' => 2]);

        $service = app(InventoryService::class);

        $service->bulkAdjust([
            ['variant_id' => $variantA->variant_id, 'quantity_change' => -4],
            ['variant_id' => $variantB->variant_id, 'quantity_change' => 6],
        ], 'Bulk update');

        $this->assertEquals(6, $variantA->fresh()->stock_quantity);
        $this->assertEquals(8, $variantB->fresh()->stock_quantity);
        $this->assertCount(2, InventoryLog::all());
    }

    public function test_low_stock_notification_is_not_sent_in_testing(): void
    {
        Notification::fake();

        $admin = User::factory()->create();
        $variant = ProductVariant::factory()->create([
            'stock_quantity' => InventoryService::LOW_STOCK_THRESHOLD + 5,
        ]);

        // Assign seller to product to receive notification
        $variant->product->update(['seller_id' => $admin->id]);

        $service = app(InventoryService::class);
        $service->adjustStock(
            $variant->variant_id,
            -(InventoryService::LOW_STOCK_THRESHOLD + 4),
            'Reduce to low stock'
        );

        // Notifications are disabled in testing environment
        Notification::assertNotSentTo($admin, LowStockNotification::class);
    }

    public function test_set_stock_updates_to_specific_quantity(): void
    {
        Notification::fake();

        $variant = ProductVariant::factory()->create(['stock_quantity' => 10]);

        $service = app(InventoryService::class);
        $log = $service->setStock($variant->variant_id, 25, 'Manual adjustment');

        $this->assertInstanceOf(InventoryLog::class, $log);
        $this->assertEquals(15, $log->quantity_change); // 25 - 10 = 15
        $this->assertEquals(25, $variant->fresh()->stock_quantity);
    }

    public function test_set_stock_throws_exception_when_no_change(): void
    {
        $variant = ProductVariant::factory()->create(['stock_quantity' => 10]);

        $service = app(InventoryService::class);

        $this->expectException(InventoryException::class);
        $service->setStock($variant->variant_id, 10, 'No change');
    }

    public function test_adjust_inventory_for_order_reduces_stock(): void
    {
        Notification::fake();

        $variant = ProductVariant::factory()->create(['stock_quantity' => 10]);
        $order = Order::factory()->create();
        OrderItem::factory()->create([
            'order_id' => $order->order_id,
            'variant_id' => $variant->variant_id,
            'quantity' => 3,
        ]);

        $service = app(InventoryService::class);
        $service->adjustInventoryForOrder($order);

        $this->assertEquals(7, $variant->fresh()->stock_quantity);
        $this->assertDatabaseHas('inventory_logs', [
            'variant_id' => $variant->variant_id,
            'quantity_change' => -3,
        ]);
    }

    public function test_adjust_inventory_for_order_throws_exception_when_insufficient_stock(): void
    {
        $variant = ProductVariant::factory()->create([
            'stock_quantity' => 2,
            'track_inventory' => true,
            'allow_backorder' => false,
        ]);
        $order = Order::factory()->create();
        OrderItem::factory()->create([
            'order_id' => $order->order_id,
            'variant_id' => $variant->variant_id,
            'quantity' => 5,
        ]);

        $service = app(InventoryService::class);

        $this->expectException(RuntimeException::class);
        $this->expectExceptionMessage('Insufficient stock');
        $service->adjustInventoryForOrder($order);
    }

    public function test_restore_inventory_for_order_increases_stock(): void
    {
        Notification::fake();

        $variant = ProductVariant::factory()->create(['stock_quantity' => 5]);
        $order = Order::factory()->create();
        OrderItem::factory()->create([
            'order_id' => $order->order_id,
            'variant_id' => $variant->variant_id,
            'quantity' => 3,
        ]);

        $service = app(InventoryService::class);
        $service->restoreInventoryForOrder($order);

        $this->assertEquals(8, $variant->fresh()->stock_quantity);
        $this->assertDatabaseHas('inventory_logs', [
            'variant_id' => $variant->variant_id,
            'quantity_change' => 3,
        ]);
    }

    public function test_bulk_adjust_with_empty_payload_throws_exception(): void
    {
        $service = app(InventoryService::class);

        $this->expectException(InventoryException::class);
        $service->bulkAdjust([], 'Test bulk');
    }

    public function test_bulk_adjust_with_invalid_variant_ids_throws_exception(): void
    {
        $service = app(InventoryService::class);

        $this->expectException(InventoryException::class);
        $service->bulkAdjust([
            ['variant_id' => 99999, 'quantity_change' => 5],
        ], 'Test bulk');
    }

    public function test_bulk_adjust_with_zero_quantity_changes_skips_items(): void
    {
        Notification::fake();

        $variant = ProductVariant::factory()->create(['stock_quantity' => 10]);

        $service = app(InventoryService::class);
        $logs = $service->bulkAdjust([
            ['variant_id' => $variant->variant_id, 'quantity_change' => 0],
            ['variant_id' => $variant->variant_id, 'quantity_change' => 5],
        ], 'Test bulk');

        $this->assertCount(1, $logs);
        $this->assertEquals(15, $variant->fresh()->stock_quantity);
    }

    public function test_bulk_adjust_rolls_back_on_error(): void
    {
        $variant1 = ProductVariant::factory()->create(['stock_quantity' => 10]);
        $variant2 = ProductVariant::factory()->create(['stock_quantity' => 1]);

        $service = app(InventoryService::class);

        // This should fail because variant2 would go negative
        try {
            $service->bulkAdjust([
                ['variant_id' => $variant1->variant_id, 'quantity_change' => 5],
                ['variant_id' => $variant2->variant_id, 'quantity_change' => -5],
            ], 'Test bulk');
        } catch (InventoryException $e) {
            // Expected
        }

        // Both variants should remain unchanged due to transaction rollback
        $this->assertEquals(10, $variant1->fresh()->stock_quantity);
        $this->assertEquals(1, $variant2->fresh()->stock_quantity);
        $this->assertCount(0, InventoryLog::all());
    }

    public function test_flush_report_cache_clears_all_cache_keys(): void
    {
        // Set some cache values
        Cache::put('inventory_report_stats_by_seller', 'test_data');
        Cache::put('inventory_report_stats_by_category', 'test_data');
        Cache::put('inventory_report_low_stock', 'test_data');

        $service = app(InventoryService::class);
        $service->flushReportCache();

        $this->assertFalse(Cache::has('inventory_report_stats_by_seller'));
        $this->assertFalse(Cache::has('inventory_report_stats_by_category'));
        $this->assertFalse(Cache::has('inventory_report_low_stock'));
    }

    public function test_adjust_stock_with_custom_user_id(): void
    {
        Notification::fake();

        $admin = User::factory()->create();
        $variant = ProductVariant::factory()->create(['stock_quantity' => 5]);

        $service = app(InventoryService::class);
        $log = $service->adjustStock($variant->variant_id, 3, 'Test increase', $admin->id);

        $this->assertEquals($admin->id, $log->user_id);
    }

    public function test_adjust_stock_creates_log_with_correct_data(): void
    {
        Notification::fake();

        $user = User::factory()->create();
        $variant = ProductVariant::factory()->create(['stock_quantity' => 5]);

        $service = app(InventoryService::class);
        $log = $service->adjustStock($variant->variant_id, -2, 'Sale transaction', $user->id);

        $this->assertEquals($variant->variant_id, $log->variant_id);
        $this->assertEquals(-2, $log->quantity_change);
        $this->assertEquals('Sale transaction', $log->reason);
        $this->assertEquals($user->id, $log->user_id);
    }

    public function test_adjust_stock_handles_concurrent_access(): void
    {
        Notification::fake();

        $variant = ProductVariant::factory()->create(['stock_quantity' => 10]);

        $service = app(InventoryService::class);

        // Simulate concurrent access by locking the variant first
        DB::transaction(function () use ($variant, $service) {
            $variant->lockForUpdate()->first();

            // This should still work within the same transaction
            $log = $service->adjustStock($variant->variant_id, 5, 'Concurrent test');
            $this->assertEquals(15, $variant->fresh()->stock_quantity);
        });
    }

    public function test_set_stock_handles_negative_target_quantity(): void
    {
        $variant = ProductVariant::factory()->create(['stock_quantity' => 10]);

        $service = app(InventoryService::class);

        $this->expectException(InventoryException::class);
        $service->setStock($variant->variant_id, -5, 'Invalid negative stock');
    }

    public function test_bulk_adjust_preserves_order_of_operations(): void
    {
        Notification::fake();

        $variant = ProductVariant::factory()->create(['stock_quantity' => 10]);

        $service = app(InventoryService::class);
        $logs = $service->bulkAdjust([
            ['variant_id' => $variant->variant_id, 'quantity_change' => 5],
            ['variant_id' => $variant->variant_id, 'quantity_change' => -3],
        ], 'Multiple adjustments');

        $this->assertCount(2, $logs);
        $this->assertEquals(5, $logs->first()->quantity_change);
        $this->assertEquals(-3, $logs->last()->quantity_change);
        $this->assertEquals(12, $variant->fresh()->stock_quantity); // 10 + 5 - 3 = 12
    }

    public function test_adjust_inventory_for_order_handles_missing_variant(): void
    {
        $order = Order::factory()->create();
        $variant = ProductVariant::factory()->create();
        OrderItem::factory()->create([
            'order_id' => $order->order_id,
            'variant_id' => $variant->variant_id,
            'quantity' => 1,
        ]);

        // Manually delete the variant to simulate missing variant
        $variant->delete();

        $service = app(InventoryService::class);

        $this->expectException(RuntimeException::class);
        $this->expectExceptionMessage('Variant not found');
        $service->adjustInventoryForOrder($order);
    }

    public function test_restore_inventory_for_order_handles_missing_variant_gracefully(): void
    {
        $order = Order::factory()->create();
        $variant = ProductVariant::factory()->create();
        OrderItem::factory()->create([
            'order_id' => $order->order_id,
            'variant_id' => $variant->variant_id,
            'quantity' => 1,
        ]);

        // Manually delete the variant to simulate missing variant
        $variant->delete();

        $service = app(InventoryService::class);

        // Should not throw exception, just log warning
        $service->restoreInventoryForOrder($order);

        $this->assertCount(0, InventoryLog::all());
    }
}

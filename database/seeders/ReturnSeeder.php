<?php

namespace Database\Seeders;

use App\Enums\ReturnStatus;
use App\Models\Order;
use App\Models\ReturnRequest;
use Illuminate\Database\Seeder;

class ReturnSeeder extends Seeder
{
    public function run(): void
    {
        // Chỉ tạo yêu cầu đổi trả cho các đơn hàng đã giao.
        $deliveredOrders = Order::whereIn('status', ['delivered', 'completed', 'returned'])
            ->with('items.variant')
            ->get();

        if ($deliveredOrders->isEmpty()) {
            $this->command?->info('Không có đơn hàng đã giao để tạo yêu cầu đổi trả.');

            return;
        }

        if (ReturnRequest::query()->exists()) {
            $this->command?->info('Returns already seeded, skipping.');

            return;
        }

        // Tạo khoảng 50 yêu cầu đổi trả
        for ($i = 0; $i < 50; $i++) {
            $order = $deliveredOrders->random();

            if ($order->items->isEmpty()) {
                continue;
            }

            $itemToReturn = $order->items->random();
            $status = fake()->randomElement(ReturnStatus::values());
            $type = fake()->numberBetween(1, 2); // 1: Refund, 2: Exchange

            $processedAt = $status === ReturnStatus::PENDING->value
                ? null
                : now()->subDays(rand(0, 10));

            $refundedAt = $status === ReturnStatus::REFUNDED->value
                ? now()->subDays(rand(0, 5))
                : null;

            $return = ReturnRequest::create([
                'order_id' => $order->order_id,
                'customer_id' => $order->customer_id,
                'return_number' => 'RTN-'.fake()->unique()->randomNumber(8),
                'reason' => fake()->numberBetween(1, 5),
                'description' => fake()->paragraph(),
                'status' => $status,
                'refund_amount' => $itemToReturn->total_price,
                'type' => $type,
                'admin_note' => $status === ReturnStatus::REJECTED->value ? fake()->sentence() : null,
                'processed_at' => $processedAt,
                'refunded_at' => $refundedAt,
            ]);

            $return->items()->create([
                'variant_id' => $itemToReturn->variant_id,
                'quantity' => $itemToReturn->quantity,
                'unit_price' => $itemToReturn->unit_price,
                'total_price' => $itemToReturn->total_price,
                'reason' => fake()->sentence(),
            ]);
        }
    }
}

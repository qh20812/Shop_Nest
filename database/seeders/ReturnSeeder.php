<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\ReturnRequest;
use Illuminate\Database\Seeder;

class ReturnSeeder extends Seeder
{
    public function run(): void
    {
        // Chỉ tạo yêu cầu đổi trả cho các đơn hàng đã giao (status = 3)
        $deliveredOrders = Order::where('status', 3)->with('items')->get();

        // Tạo khoảng 50 yêu cầu đổi trả
        for ($i = 0; $i < 50; $i++) {
            $order = $deliveredOrders->random();
            $itemToReturn = $order->items->random();

            ReturnRequest::create([
                'order_id' => $order->order_id,
                'customer_id' => $order->customer_id,
                'return_number' => 'RTN-' . fake()->unique()->randomNumber(8),
                'reason' => fake()->numberBetween(1, 5),
                'description' => fake()->paragraph(),
                'status' => fake()->numberBetween(1, 5),
                'refund_amount' => $itemToReturn->total_price,
                'type' => fake()->numberBetween(1, 2), // 1: Refund, 2: Exchange
                'processed_at' => now(),
            ]);
        }
    }
}
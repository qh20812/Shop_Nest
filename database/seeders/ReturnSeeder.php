<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\ReturnRequest;
use App\Enums\ReturnStatus;
use Illuminate\Database\Seeder;

class ReturnSeeder extends Seeder
{
    public function run(): void
    {
        // Chỉ tạo yêu cầu đổi trả cho các đơn hàng đã giao (status = 'delivered')
        $deliveredOrders = Order::where('status', 'delivered')->with('items')->get();

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
                'status' => fake()->randomElement(ReturnStatus::cases())->value,
                'refund_amount' => $itemToReturn->total_price,
                'type' => fake()->numberBetween(1, 2), // 1: Refund, 2: Exchange
                'processed_at' => now(),
            ]);
        }
    }
}
<?php

namespace Database\Seeders;

use App\Models\Dispute;
use App\Models\Order;
use App\Models\Role;
use Illuminate\Database\Seeder;

class DisputeSeeder extends Seeder
{
    public function run(): void
    {
        // Chỉ lấy các đơn hàng có ít nhất 1 item và có status phù hợp
        $orders = Order::whereHas('items')->whereIn('status', [2, 3, 4])->with('customer', 'items.variant.product')->get();
        $admins = Role::where('name->en', 'Admin')->first()?->users;

        if ($orders->count() < 30 || $admins->isEmpty()) {
             $this->command->info('Không đủ đơn hàng hoặc admin để tạo khiếu nại.');
             return;
        }

        // Tạo khoảng 30 khiếu nại
        foreach ($orders->random(30) as $order) {
            $dispute = Dispute::create([
                'order_id' => $order->order_id,
                'customer_id' => $order->customer_id,
                'seller_id' => $order->items->first()->variant->product->seller_id,
                'subject' => 'Khiếu nại về đơn hàng ' . $order->order_number,
                'description' => fake()->paragraph,
                'status' => fake()->randomElement(['open', 'under_review', 'resolved', 'closed']),
                'type' => fake()->numberBetween(1, 3),
                'assigned_admin_id' => $admins->random()->id,
            ]);

            // Tạo tin nhắn khiếu nại
            $dispute->messages()->create([
                'sender_id' => $order->customer_id,
                'content' => 'Tôi muốn khiếu nại về chất lượng sản phẩm trong đơn hàng này.',
            ]);
        }
    }
}
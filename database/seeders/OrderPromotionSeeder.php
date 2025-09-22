<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\Promotion;
use Illuminate\Database\Seeder;

class OrderPromotionSeeder extends Seeder
{
    public function run(): void
    {
        $orders = Order::all();
        $promotions = Promotion::where('is_active', true)->get();

        if ($promotions->isEmpty()) {
            return;
        }

        foreach ($orders as $order) {
            // 30% cơ hội một đơn hàng áp dụng khuyến mãi
            if (rand(1, 100) <= 30) {
                $promotion = $promotions->random();

                // Kiểm tra điều kiện tối thiểu
                if ($order->sub_total >= $promotion->min_order_amount) {
                    $discountAmount = 0;
                    if ($promotion->type == 1) { // Percentage
                        $discountAmount = ($order->sub_total * $promotion->value) / 100;
                        if ($discountAmount > $promotion->max_discount_amount) {
                            $discountAmount = $promotion->max_discount_amount;
                        }
                    } else { // Fixed Amount
                        $discountAmount = $promotion->value;
                    }

                    // Cập nhật đơn hàng
                    $order->discount_amount = $discountAmount;
                    $order->total_amount = ($order->sub_total + $order->shipping_fee) - $discountAmount;
                    $order->save();

                    // Gán vào bảng pivot
                    $order->promotions()->attach($promotion->promotion_id, ['discount_applied' => $discountAmount]);
                }
            }
        }
    }
}
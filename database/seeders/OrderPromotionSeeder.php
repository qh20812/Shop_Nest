<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\Promotion;
use Illuminate\Database\Seeder;

class OrderPromotionSeeder extends Seeder
{
    public function run(): void
    {
        if (Order::whereHas('promotions')->exists()) {
            $this->command?->info('Order promotions already seeded, skipping.');

            return;
        }

        $orders = Order::with('items')->get();
        $promotions = Promotion::where('is_active', true)
            ->where('start_date', '<=', now())
            ->where('end_date', '>=', now())
            ->get();

        if ($promotions->isEmpty() || $orders->isEmpty()) {
            return;
        }

        foreach ($orders as $order) {
            // 30% cơ hội một đơn hàng áp dụng khuyến mãi
            if (rand(1, 100) > 30 || $order->promotions()->exists()) {
                continue;
            }

            $promotion = $promotions->random();
            $subTotal = (float) $order->sub_total;
            $shippingFee = (float) $order->shipping_fee;
            $minOrderAmount = (float) ($promotion->min_order_amount ?? 0);

            // Kiểm tra điều kiện tối thiểu
            if ($subTotal < $minOrderAmount) {
                continue;
            }

            if ((int) $promotion->type === 1) { // Percentage
                $discountAmount = $subTotal * ((float) $promotion->value) / 100;

                if ($promotion->max_discount_amount !== null) {
                    $discountAmount = min($discountAmount, (float) $promotion->max_discount_amount);
                }
            } else { // Fixed amount
                $discountAmount = (float) $promotion->value;
            }

            // Không cho giảm giá vượt quá giá trị đơn hàng.
            $discountAmount = min($discountAmount, $subTotal + $shippingFee);
            $totalAmount = $subTotal + $shippingFee - $discountAmount;

            $order->update([
                'discount_amount' => $discountAmount,
                'total_amount' => $totalAmount,
                'total_amount_base' => $totalAmount,
            ]);

            $order->promotions()->attach($promotion->promotion_id, [
                'discount_applied' => $discountAmount,
            ]);

            $promotion->apply($discountAmount);
        }
    }
}

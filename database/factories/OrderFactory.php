<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\UserAddress;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderFactory extends Factory
{
    public function definition(): array
    {
        // ✅ SỬA LẠI: Tạo giá trị subTotal theo thang USD hợp lý (ví dụ: từ 50 đến 2000 USD)
        $subTotal = fake()->randomFloat(2, 50, 2000);
        $shippingFee = fake()->randomFloat(2, 5, 50);
        $totalAmount = $subTotal + $shippingFee;

        return [
            'customer_id' => User::factory(),
            'order_number' => 'ORD-' . fake()->unique()->randomNumber(8),
            'sub_total' => $subTotal,
            'shipping_fee' => $shippingFee,
            'discount_amount' => 0,
            'total_amount' => $totalAmount,
            'status' => fake()->numberBetween(1, 4), // Bắt đầu từ 1 để có đơn hàng hợp lệ
            'payment_method' => fake()->numberBetween(1, 3),
            'payment_status' => fake()->numberBetween(1, 2), // Bắt đầu từ 1
            'shipping_address_id' => UserAddress::factory(),
            'notes' => fake()->sentence(),
            
            // Dữ liệu tiền tệ bây giờ đã đúng
            'currency' => 'USD',
            'exchange_rate' => 1.0,
            'total_amount_base' => $totalAmount,
        ];
    }
}
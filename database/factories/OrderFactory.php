<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $subTotal = fake()->numberBetween(100000, 10000000);
        $shippingFee = fake()->numberBetween(15000, 50000);
        
        return [
            'customer_id' => User::factory(),
            'order_number' => 'ORD-' . fake()->unique()->randomNumber(8),
            'sub_total' => $subTotal,
            'shipping_fee' => $shippingFee,
            'discount_amount' => 0,
            'total_amount' => $subTotal + $shippingFee,
            'status' => fake()->numberBetween(0, 4),
            'payment_method' => fake()->numberBetween(1, 3),
            'payment_status' => fake()->numberBetween(0, 2),
            'shipping_address_id' => UserAddress::factory(),
            'notes' => fake()->sentence(),
        ];
    }
}

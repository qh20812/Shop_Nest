<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\ProductVariant;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OrderItem>
 */
class OrderItemFactory extends Factory
{
    public function definition(): array
    {
        $quantity = fake()->numberBetween(1, 5);
        $price = fake()->randomFloat(2, 10, 500);
        $currency = fake()->randomElement(['USD', 'VND']);

        return [
            'order_id' => Order::factory(),
            'variant_id' => ProductVariant::factory(),
            'quantity' => $quantity,
            'unit_price' => $price,
            'total_price' => $quantity * $price,
            'original_currency' => $currency,
            'original_unit_price' => $price,
            'original_total_price' => $quantity * $price,
        ];
    }
}

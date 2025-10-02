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
        $price = fake()->numberBetween(100000, 1000000);

        return [
            'order_id' => Order::factory(),
            'variant_id' => ProductVariant::factory(),
            'quantity' => $quantity,
            'price' => $price,
            'total' => $quantity * $price,
        ];
    }
}

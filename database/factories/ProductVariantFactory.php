<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProductVariant>
 */
class ProductVariantFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $price = fake()->numberBetween(100000,50000000);
        return [
            'product_id'=>Product::factory(),
            'sku'=>fake()->unique()->bothify('SKU-#####??'),
            'price'=>$price,
            'discount_price'=>$price - fake()->numberBetween(10000,100000),
            'stock_quantity'=>fake()->numberBetween(0,100),
        ];
    }
}

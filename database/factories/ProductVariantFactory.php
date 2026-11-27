<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProductVariant>
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
        $price = fake()->numberBetween(10000, 1000000);

        return [
            'product_id' => Product::factory(),
            'variant_name' => fake()->words(2, true),
            'option_values' => [],
            'option_signature' => fake()->unique()->bothify('SIG-####??'),
            'sku' => fake()->unique()->bothify('SKU-#####??'),
            'price' => $price,
            'discount_price' => fake()->numberBetween(1000, $price),
            'stock_quantity' => fake()->numberBetween(0, 100),
        ];
    }
}

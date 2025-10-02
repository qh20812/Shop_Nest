<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductImageFactory extends Factory
{
    public function definition(): array
    {
        return [
            'product_id' => Product::factory(),
            'image_url' => 'https://picsum.photos/seed/' . fake()->uuid() . '/800/800',
            'alt_text' => fake()->sentence(3),
            'is_primary' => false,
            'display_order' => fake()->numberBetween(1, 10),
        ];
    }
}
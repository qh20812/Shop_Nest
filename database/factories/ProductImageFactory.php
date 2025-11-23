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
            'image_url' => 'https://dummyimage.com/300x300/666266/ffffff&text=Product',
            'alt_text' => fake()->sentence(3),
            'is_primary' => false,
            'display_order' => fake()->numberBetween(1, 10),
        ];
    }
}
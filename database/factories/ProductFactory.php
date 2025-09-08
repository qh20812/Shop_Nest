<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name'=>fake()->word(4,true),
            'description'=>fake()->paragraph(),
            'category_id'=>Category::factory(),
            'brand_id'=>Brand::factory(),
            'seller_id'=>User::factory(),
            'status'=>fake()->numberBetween(1,3),
            'is_active'=>true,
        ];
    }
}

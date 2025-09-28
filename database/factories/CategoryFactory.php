<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class CategoryFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => [
                'en' => $this->faker->words(2, true),
                'vi' => $this->faker->words(2, true),
            ],
            'description' => [
                'en' => $this->faker->sentence(),
                'vi' => fake()->sentence(),
            ],
            'image_url' => 'https://via.placeholder.com/600x400.png/00aa88?text=Category',
            'is_active' => true,
        ];
    }
}
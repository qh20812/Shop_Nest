<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Role>
 */
class RoleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => [
                'en' => fake()->unique()->word(),
                'vi' => fake()->unique()->word(),
            ],
            'description' => [
                'en' => fake()->sentence(),
                'vi' => fake()->sentence(),
            ],
        ];
    }
}

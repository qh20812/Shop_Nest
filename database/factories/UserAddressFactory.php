<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\UserAddress>
 */
class UserAddressFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'full_name' => fake()->name(),
            'phone_number' => fake()->phoneNumber(),
            'street' => fake()->streetAddress(),
            'ward' => fake()->word(),
            'district' => fake()->word(),
            'city' => fake()->city(),
            'is_default' => false,
        ];
    }
}

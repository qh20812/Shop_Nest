<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ShipperProfile>
 */
class ShipperProfileFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'id_card_number' => fake()->numerify('###########'), // 11-digit ID card number
            'id_card_front_url' => 'https://via.placeholder.com/600x400.png/009944?text=id-front',
            'id_card_back_url' => 'https://via.placeholder.com/600x400.png/009944?text=id-back',
            'driver_license_number' => fake()->bothify('##-########'), // Driver's license format
            'driver_license_front_url' => 'https://via.placeholder.com/600x400.png/0077bb?text=license',
            'vehicle_type' => fake()->randomElement(['Motorbike', 'Bicycle', 'Car', 'Van']),
            'license_plate' => fake()->bothify('##?-####'), // Vietnamese license plate format
            'status' => 'pending',
        ];
    }

    /**
     * Create an approved shipper profile.
     */
    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'approved',
        ]);
    }

    /**
     * Create a rejected shipper profile.
     */
    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'rejected',
        ]);
    }
}

<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ReturnRequest>
 */
class ReturnRequestFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'order_id' => Order::factory(),
            'customer_id' => User::factory(),
            'return_number' => 'RTN-' . $this->faker->unique()->randomNumber(8),
            'reason' => $this->faker->numberBetween(1, 5),
            'description' => $this->faker->paragraph(),
            'status' => 1, // Default: Pending
            'refund_amount' => $this->faker->randomFloat(2, 10, 1000),
            'type' => $this->faker->numberBetween(1, 2), // 1: Refund, 2: Exchange
            'admin_note' => null,
            'processed_at' => null,
            'refunded_at' => null,
        ];
    }
}

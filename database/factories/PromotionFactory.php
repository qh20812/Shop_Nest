<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;

class PromotionFactory extends Factory
{
    public function definition(): array
    {
        $type = fake()->numberBetween(1, 2); // 1: Percentage, 2: Fixed Amount
        $value = ($type === 1) ? fake()->numberBetween(5, 50) : fake()->numberBetween(10000, 200000);
        $maxDiscount = ($type === 1) ? fake()->numberBetween(20000, 100000) : $value;

        return [
            'name' => 'Khuyến mãi ' . fake()->words(3, true),
            'description' => fake()->sentence(),
            'type' => $type,
            'value' => $value,
            'min_order_amount' => fake()->randomElement([null, 50000, 100000, 200000]),
            'max_discount_amount' => $maxDiscount,
            'start_date' => Carbon::now()->subDays(rand(1, 10)),
            'end_date' => Carbon::now()->addDays(rand(15, 60)),
            'usage_limit' => fake()->randomElement([null, 100, 200, 500]),
            'is_active' => true,
        ];
    }
}
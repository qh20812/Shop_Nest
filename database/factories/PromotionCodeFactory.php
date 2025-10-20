<?php

namespace Database\Factories;

use App\Models\Promotion;
use App\Models\PromotionCode;
use Illuminate\Database\Eloquent\Factories\Factory;

class PromotionCodeFactory extends Factory
{
    protected $model = PromotionCode::class;

    public function definition(): array
    {
        return [
            'promotion_id' => Promotion::factory(),
            'code' => strtoupper(fake()->unique()->bothify('SAVE###')),
            'usage_limit' => null,
            'used_count' => 0,
            'is_active' => true,
        ];
    }
}

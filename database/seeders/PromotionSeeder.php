<?php

namespace Database\Seeders;

use App\Models\Promotion;
use App\Models\PromotionCode;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PromotionSeeder extends Seeder
{
    public function run(): void
    {
        // Tạo 10 khuyến mãi chung
        Promotion::factory(10)->create();

        // Tạo 5 khuyến mãi có mã riêng
        Promotion::factory(5)->create()->each(function (Promotion $promotion) {
            // Mỗi khuyến mãi này tạo 10 mã code
            for ($i = 0; $i < 10; $i++) {
                PromotionCode::create([
                    'promotion_id' => $promotion->promotion_id,
                    'code' => strtoupper(Str::random(8)),
                    'usage_limit' => rand(1, 5), // Mỗi code chỉ dùng được vài lần
                ]);
            }
        });
    }
}
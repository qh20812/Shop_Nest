<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FlashSaleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\FlashSaleEvent::create([
            'name' => 'Flash Sale',
            'description' => 'Amazing flash sale event',
            'status' => 'active',
            'start_time' => now()->subHours(1),
            'end_time' => now()->addHours(2),
            'banner_image' => '/images/flash-sale-banner.jpg',
        ]);

        // Assuming there are products and variants seeded
        $event = \App\Models\FlashSaleEvent::first();
        if ($event) {
            $variants = \App\Models\ProductVariant::take(5)->get();
            foreach ($variants as $variant) {
                \App\Models\FlashSaleProduct::create([
                    'flash_sale_event_id' => $event->id,
                    'product_variant_id' => $variant->variant_id,
                    'flash_sale_price' => $variant->price * 0.8, // 20% off
                    'quantity_limit' => 100,
                    'sold_count' => rand(0, 50),
                    'max_quantity_per_user' => 5,
                ]);
            }
        }
    }
}

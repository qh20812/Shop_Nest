<?php

namespace Database\Seeders;

use App\Models\FlashSaleEvent;
use App\Models\FlashSaleProduct;
use App\Models\ProductVariant;
use Illuminate\Database\Seeder;

class FlashSaleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (FlashSaleEvent::query()->exists()) {
            $this->command?->info('Flash sale events already seeded, skipping.');

            return;
        }

        $event = FlashSaleEvent::create([
            'name' => 'Flash Sale',
            'description' => 'Amazing flash sale event',
            'status' => 'active',
            'start_time' => now()->subHours(1),
            'end_time' => now()->addHours(2),
            'banner_image' => '/images/flash-sale-banner.jpg',
        ]);

        $variants = ProductVariant::query()
            ->whereHas('product', fn ($query) => $query->where('status', 'published')->where('is_active', true))
            ->inRandomOrder()
            ->take(5)
            ->get();

        foreach ($variants as $variant) {
            FlashSaleProduct::create([
                'flash_sale_event_id' => $event->id,
                'product_variant_id' => $variant->variant_id,
                'flash_sale_price' => round((float) $variant->price * 0.8, 2), // 20% off
                'quantity_limit' => 100,
                'sold_count' => rand(0, 50),
                'discount_percentage' => 20,
                'max_quantity_per_user' => 5,
            ]);
        }
    }
}

<?php

namespace Database\Seeders;

use App\Models\Shop;
use App\Models\User;
use Illuminate\Database\Seeder;

class ShopSeeder extends Seeder
{
    public function run(): void
    {
        $shops = require database_path('seeders/data/demo_shops.php');

        foreach ($shops as $index => $data) {
            $owner = User::where('email', $data['owner_email'])->first();

            if (! $owner) {
                $this->command?->warn("Không tìm thấy seller {$data['owner_email']}");

                continue;
            }

            $isActive = $data['status'] === 'active';

            Shop::updateOrCreate(
                ['slug' => $data['slug']],
                [
                    'owner_id' => $owner->id,
                    'name' => $data['name'],
                    'description' => $data['description'],
                    'logo' => $data['logo'],
                    'banner' => $data['banner'],
                    'phone' => $data['phone'],
                    'email' => $data['email'],
                    'website' => 'https://'.$data['slug'].'.shopnest.vn',
                    'business_type' => 'Công ty TNHH',
                    'tax_id' => str_pad((string) (1000000000 + $index), 10, '0', STR_PAD_LEFT),
                    'business_license' => 'GPKD-2026-'.str_pad((string) ($index + 1), 3, '0', STR_PAD_LEFT),
                    'address' => $data['address'],
                    'city' => $data['city'],
                    'state' => $data['city'],
                    'postal_code' => '700000',
                    'country' => 'Việt Nam',
                    'status' => $data['status'],
                    'is_verified' => $data['is_verified'],
                    'commission_rate' => 8.50,
                    'shipping_policies' => [
                        'free_shipping_threshold' => 300000,
                        'standard_delivery_days' => 3,
                        'express_delivery_days' => 1,
                        'international_shipping' => false,
                        'shipping_zones' => ['VN'],
                    ],
                    'return_policy' => [
                        'return_window_days' => 7,
                        'free_returns' => true,
                        'conditions' => 'Sản phẩm còn nguyên tem, hộp và chưa qua sử dụng.',
                    ],
                    'social_media' => [
                        'facebook' => 'https://facebook.com/'.$data['slug'],
                        'instagram' => 'https://instagram.com/'.$data['slug'],
                    ],
                    'rating' => 4.60 + ($index % 4) * 0.1,
                    'total_reviews' => 40 + $index * 17,
                    'total_sales' => 120 + $index * 43,
                    'total_revenue' => 25000000 + $index * 7500000,
                    'meta_title' => $data['name'].' | ShopNest',
                    'meta_description' => $data['description'],
                    'keywords' => [$data['name'], $data['city'], 'shopnest', 'mua sắm online'],
                    'verified_at' => $isActive ? now() : null,
                    'last_active_at' => now(),
                ]
            );

            $owner->update([
                'shop_status' => $isActive ? 'active' : 'pending',
                'approved_at' => $isActive ? ($owner->approved_at ?? now()) : null,
            ]);
        }

        $this->command?->info('Seeded '.count($shops).' curated shops.');
    }
}

<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\Shop;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ShopSeeder extends Seeder
{
    public function run(): void
    {
        // Shop demo cố định cho testseller - dùng updateOrCreate để luôn sạch dữ liệu JSON.
        $testSeller = User::where('username', 'testseller')->first();

        if ($testSeller) {
            Shop::updateOrCreate(
                ['slug' => 'test-shop-pro'],
                [
                    'owner_id' => $testSeller->id,
                    'name' => 'Test Shop Pro',
                    'description' => 'Cửa hàng demo chuyên cung cấp các sản phẩm công nghệ chất lượng cao với giá cả phải chăng. Chúng tôi cam kết mang đến trải nghiệm mua sắm tốt nhất cho khách hàng.',
                    'logo' => 'logos/test-shop-logo.png',
                    'banner' => 'banners/test-shop-banner.jpg',
                    'phone' => '+84 123 456 789',
                    'email' => 'contact@testshoppro.com',
                    'website' => 'https://testshoppro.com',

                    // Business information
                    'business_type' => 'LLC',
                    'tax_id' => '123456789',
                    'business_license' => 'LIC-2024-TEST',

                    // Address
                    'address' => '123 Đường ABC, Phường XYZ',
                    'city' => 'Hồ Chí Minh',
                    'state' => 'Hồ Chí Minh',
                    'postal_code' => '700000',
                    'country' => 'Việt Nam',

                    // Shop settings
                    'status' => 'active',
                    'is_verified' => true,
                    'commission_rate' => 8.50,

                    // Policies
                    'shipping_policies' => [
                        'free_shipping_threshold' => 150000,
                        'standard_delivery_days' => 3,
                        'express_delivery_days' => 1,
                        'international_shipping' => true,
                        'shipping_zones' => ['VN', 'US', 'EU'],
                    ],
                    'return_policy' => [
                        'return_window_days' => 14,
                        'free_returns' => true,
                        'conditions' => 'Sản phẩm phải còn nguyên seal, không bị hư hỏng do người dùng',
                    ],
                    'social_media' => [
                        'facebook' => 'https://facebook.com/testshoppro',
                        'instagram' => 'https://instagram.com/testshoppro',
                        'twitter' => 'https://twitter.com/testshoppro',
                        'tiktok' => 'https://tiktok.com/@testshoppro',
                    ],

                    // Performance metrics
                    'rating' => 4.80,
                    'total_reviews' => 245,
                    'total_sales' => 1250,
                    'total_revenue' => 87500000.00,

                    // SEO
                    'meta_title' => 'Test Shop Pro - Cửa hàng công nghệ chất lượng cao',
                    'meta_description' => 'Mua sắm các sản phẩm công nghệ mới nhất với giá tốt nhất tại Test Shop Pro. Giao hàng tận nơi, bảo hành chính hãng.',
                    'keywords' => [
                        'điện thoại', 'laptop', 'phụ kiện', 'công nghệ', 'mua sắm online',
                        'điện tử', 'smartphone', 'computer', 'accessories', 'technology',
                    ],

                    // Timestamps
                    'verified_at' => now(),
                    'last_active_at' => now(),
                ]
            );

            $testSeller->update([
                'shop_status' => 'active',
                'approved_at' => $testSeller->approved_at ?? now(),
            ]);

            $this->command?->info('Created/updated shop for testseller: Test Shop Pro');
        } else {
            $this->command?->error('User testseller not found. Please run UserSeeder first.');
        }

        $sellerRole = Role::where('name->en', 'Seller')->first();

        if (! $sellerRole) {
            return;
        }

        $sellers = User::whereHas('roles', function ($query) {
            $query->where('name->en', 'Seller');
        })->where('username', '!=', 'testseller')->take(20)->get();

        // Nếu thiếu seller (ví dụ DB được seed một phần), tạo thêm seller kèm role.
        if ($sellers->count() < 20) {
            $missing = 20 - $sellers->count();

            for ($i = 0; $i < $missing; $i++) {
                $seller = User::factory()->create([
                    'phone_number' => fake()->unique()->phoneNumber(),
                ]);
                $seller->roles()->syncWithoutDetaching([$sellerRole->id]);
                $sellers->push($seller);
            }
        }

        foreach ($sellers->values() as $index => $seller) {
            if (Shop::where('owner_id', $seller->id)->exists()) {
                continue;
            }

            // 15 shop đầu phân bố trạng thái, 5 shop cuối là pending để test luồng duyệt.
            $status = $index < 15
                ? collect(['pending', 'active', 'active', 'active'])->random()
                : 'pending';

            $isActive = $status === 'active';

            Shop::factory()->create([
                'owner_id' => $seller->id,
                'slug' => Str::slug(fake()->unique()->company().'-'.$seller->id),
                'status' => $status,
                'is_verified' => $isActive,
                'verified_at' => $isActive ? now() : null,
            ]);

            $seller->update([
                'shop_status' => $status === 'active' ? 'active' : 'pending',
                'approved_at' => $isActive ? now() : null,
            ]);
        }

        $this->command?->info('Created '.Shop::count().' shops total');
    }
}

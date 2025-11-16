<?php

namespace Database\Seeders;

use App\Models\Shop;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ShopSeeder extends Seeder
{
    public function run(): void
    {
        // Tìm user testseller đã được tạo trong UserSeeder
        $testSeller = User::where('username', 'testseller')->first();

        if ($testSeller) {
            // Tạo shop cụ thể cho testseller - chỉ tạo nếu chưa tồn tại
            $existingShop = Shop::where('slug', 'test-shop-pro')->first();
            if (!$existingShop) {
                Shop::create([
                    'owner_id' => $testSeller->id,
                    'name' => 'Test Shop Pro',
                    'slug' => 'test-shop-pro',
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
                    'shipping_policies' => json_encode([
                        'free_shipping_threshold' => 150000,
                        'standard_delivery_days' => 3,
                        'express_delivery_days' => 1,
                        'international_shipping' => true,
                        'shipping_zones' => ['VN', 'US', 'EU']
                    ]),
                    'return_policy' => json_encode([
                        'return_window_days' => 14,
                        'free_returns' => true,
                        'conditions' => 'Sản phẩm phải còn nguyên seal, không bị hư hỏng do người dùng'
                    ]),
                    'social_media' => json_encode([
                        'facebook' => 'https://facebook.com/testshoppro',
                        'instagram' => 'https://instagram.com/testshoppro',
                        'twitter' => 'https://twitter.com/testshoppro',
                        'tiktok' => 'https://tiktok.com/@testshoppro'
                    ]),

                    // Performance metrics
                    'rating' => 4.80,
                    'total_reviews' => 245,
                    'total_sales' => 1250,
                    'total_revenue' => 87500000.00,

                    // SEO
                    'meta_title' => 'Test Shop Pro - Cửa hàng công nghệ chất lượng cao',
                    'meta_description' => 'Mua sắm các sản phẩm công nghệ mới nhất với giá tốt nhất tại Test Shop Pro. Giao hàng tận nơi, bảo hành chính hãng.',
                    'keywords' => json_encode([
                        'điện thoại', 'laptop', 'phụ kiện', 'công nghệ', 'mua sắm online',
                        'điện tử', 'smartphone', 'computer', 'accessories', 'technology'
                    ]),

                    // Timestamps
                    'verified_at' => now(),
                    'last_active_at' => now(),
                ]);

                $this->command->info('Created shop for testseller: Test Shop Pro');
            } else {
                $this->command->info('Shop for testseller already exists: Test Shop Pro');
            }
        } else {
            $this->command->error('User testseller not found. Please run UserSeeder first.');
        }

        // Tạo thêm 15 shops ngẫu nhiên cho các sellers khác
        $sellers = User::whereHas('roles', function($query) {
            $query->where('name->en', 'Seller');
        })->where('username', '!=', 'testseller')->take(15)->get();

        foreach ($sellers as $seller) {
            Shop::factory()->create([
                'owner_id' => $seller->id,
                'status' => collect(['pending', 'active', 'active', 'active'])->random(), // 75% active
                'is_verified' => collect([false, true, true, true])->random(), // 75% verified
            ]);
        }

        // Tạo thêm 5 shops pending để test admin approval
        Shop::factory(5)->pending()->create();

        $this->command->info('Created ' . (1 + $sellers->count() + 5) . ' shops total');
    }
}
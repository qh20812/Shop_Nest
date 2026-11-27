<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Bọc toàn bộ seed trong một transaction để tránh dữ liệu dở dang
        // nếu một seeder phía sau gặp lỗi (đặc biệt khi chạy trên DB remote).
        DB::transaction(function (): void {
            $this->call([
                CountrySeeder::class,
                AdministrativeDivisionSeeder::class,

                // 1. Core & Auth
                RoleSeeder::class,
                PermissionSeeder::class,
                UserSeeder::class,
                WalletSeeder::class,
                ShopSeeder::class,
                ShipperSeeder::class,

                // 2. Product Catalog
                CategorySeeder::class,
                BrandSeeder::class,
                AttributeSeeder::class,

                // 3. Products & Carts
                ProductSeeder::class,
                FlashSaleSeeder::class,
                CartSeeder::class,

                // 4. Orders & Related Data
                OrderSeeder::class,
                ShippingDetailSeeder::class,
                ReturnSeeder::class,

                // 5. Promotions
                PromotionSeeder::class,
                OrderPromotionSeeder::class,

                // 6. Interactions & User Activities
                ReviewSeeder::class,
                WishlistSeeder::class,
                ChatSeeder::class,
                DisputeSeeder::class,
                UserActivitySeeder::class,
            ]);
        });
    }
}

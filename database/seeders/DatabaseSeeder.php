<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            CountrySeeder::class,
            AdministrativeDivisionSeeder::class,

            // 1. Core & Auth
            RoleSeeder::class,
            PermissionSeeder::class,
            UserSeeder::class,
            ShipperSeeder::class,

            // 2. Product Catalog
            CategorySeeder::class,
            BrandSeeder::class,
            AttributeSeeder::class,

            // 3. Products & Carts
            ProductSeeder::class,
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
            ChatSeeder::class,
            DisputeSeeder::class,
            UserActivitySeeder::class,
        ]);
    }
}
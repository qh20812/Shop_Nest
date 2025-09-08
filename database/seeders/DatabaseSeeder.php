<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Chạy các seeder theo thứ tự phụ thuộc
        // Roles phải có trước Users
        // Users (Sellers) và Categories/Brands phải có trước Products
        // Users (Customers) và Products phải có trước Orders

        $this->call([
            RoleSeeder::class,
            UserSeeder::class,
            ProductSeeder::class,
            OrderSeeder::class,
        ]);
    }
}

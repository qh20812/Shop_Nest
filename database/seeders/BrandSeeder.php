<?php

namespace Database\Seeders;

use App\Models\Brand;
use Illuminate\Database\Seeder;

class BrandSeeder extends Seeder
{
    public function run(): void
    {
        $brands = [
            'Apple', 'Samsung', 'Xiaomi', 'Sony', 'LG', 'Nike', 'Adidas', 'Puma',
            'Uniqlo', 'H&M', 'Zara', 'Dell', 'HP', 'Asus', 'Lenovo', 'Canon',
            'Nikon', 'Casio', 'Logitech', 'Anker', 'Simple', 'La Roche-Posay', 'Nhã Nam'
        ];

        foreach ($brands as $brand) {
            Brand::factory()->create(['name' => $brand]);
        }
    }
}
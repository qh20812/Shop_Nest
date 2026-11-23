<?php

namespace Database\Seeders;

use App\Models\Brand;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BrandSeeder extends Seeder
{
    public function run(): void
    {
        $brands = [
            'Apple', 'Samsung', 'Xiaomi', 'Sony', 'LG', 'Nike', 'Adidas', 'Puma',
            'Uniqlo', 'H&M', 'Zara', 'Dell', 'HP', 'Asus', 'Lenovo', 'Canon',
            'Nikon', 'Casio', 'Logitech', 'Anker', 'Simple', 'La Roche-Posay', 'Nhã Nam',
        ];

        foreach ($brands as $brand) {
            $exists = Brand::where('name->vi', $brand)
                ->orWhere('name->en', $brand)
                ->exists();

            if ($exists) {
                continue;
            }

            Brand::create([
                'name' => $brand,
                'description' => "Thương hiệu {$brand}",
                'logo_url' => 'https://dummyimage.com/300x300/666266/ffffff&text='.urlencode(Str::limit($brand, 10, '')),
                'is_active' => true,
            ]);
        }
    }
}

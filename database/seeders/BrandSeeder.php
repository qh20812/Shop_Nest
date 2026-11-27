<?php

namespace Database\Seeders;

use App\Models\Brand;
use Illuminate\Database\Seeder;

class BrandSeeder extends Seeder
{
    public function run(): void
    {
        $brands = [
            'Apple', 'Samsung', 'Xiaomi', 'Sony', 'JBL', 'Dell', 'Asus', 'Casio',
            'Nike', 'Adidas', 'Puma', 'Uniqlo', "Levi's", 'Zara', 'H&M', 'Simple',
            'Philips', 'La Roche-Posay', 'Cetaphil', 'The Ordinary', 'MAC', 'Chanel',
            'Dior', 'Blackmores', 'innisfree', 'Maybelline', 'Nhã Nam', 'Moleskine',
            'Thiên Long', 'Parker', 'Decathlon',
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
                'logo_url' => null,
                'is_active' => true,
            ]);
        }
    }
}

<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // Tạo 10 danh mục và 10 thương hiệu
        $categories = Category::factory(10)->create();
        $brands = Brand::factory(10)->create();
        
        // Lấy tất cả người bán
        $sellers = Role::where('name', 'Seller')->first()->users;

        // Tạo 50 sản phẩm, mỗi sản phẩm có từ 1-3 biến thể
        Product::factory(50)->create([
            'seller_id' => $sellers->random()->id,
            'category_id' => $categories->random()->category_id,
            'brand_id' => $brands->random()->brand_id,
        ])->each(function ($product) {
            ProductVariant::factory(rand(1, 3))->create([
                'product_id' => $product->product_id,
            ]);
        });
    }
}
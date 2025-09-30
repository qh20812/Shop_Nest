<?php

namespace Database\Seeders;

use App\Models\Attribute;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Models\Role;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $sellers = Role::where('name->en', 'Seller')->first()?->users;
        $categories = Category::whereNotNull('parent_category_id')->get(); // Chỉ lấy danh mục con
        $brands = Brand::all();
        $attributes = Attribute::with('values')->get();

        if ($sellers->isEmpty() || $categories->isEmpty() || $brands->isEmpty()) {
            $this->command->info('Vui lòng chạy các seeder cho Role, User, Category, Brand trước.');
            return;
        }

        Product::factory(100)->create([
            'seller_id' => fn() => $sellers->random()->id,
            'category_id' => fn() => $categories->random()->category_id,
            'brand_id' => fn() => $brands->random()->brand_id,
        ])->each(function (Product $product) use ($attributes) {
            // Tạo 3-5 ảnh cho mỗi sản phẩm
            ProductImage::factory(rand(3, 5))->create(['product_id' => $product->product_id]);
            // Đặt ảnh đầu tiên làm ảnh chính
            $product->images()->first()->update(['is_primary' => true]);

            // Lấy ngẫu nhiên 1 hoặc 2 thuộc tính để tạo biến thể (ví dụ: Màu sắc, Kích thước)
            $variantAttributes = $attributes->random(rand(1, 2));
            $colorAttribute = $variantAttributes->firstWhere('name', 'Màu sắc');
            $sizeAttribute = $variantAttributes->firstWhere('name', 'Kích thước');
            $colors = $colorAttribute ? $colorAttribute->values->shuffle()->take(rand(1, 3)) : collect([null]);
            $sizes = $sizeAttribute ? $sizeAttribute->values->shuffle()->take(rand(1, 3)) : collect([null]);

            // Tạo biến thể từ các kết hợp thuộc tính
            foreach ($colors as $color) {
                foreach ($sizes as $size) {
                    if (!$color && !$size) continue; // Bỏ qua nếu không có thuộc tính nào

                    $variant = ProductVariant::factory()->create([
                        'product_id' => $product->product_id,
                    ]);

                    // Gán thuộc tính cho biến thể
                    if ($color) {
                        $variant->attributeValues()->attach($color->attribute_value_id);
                    }
                    if ($size) {
                        $variant->attributeValues()->attach($size->attribute_value_id);
                    }
                }
            }
        });
    }
}
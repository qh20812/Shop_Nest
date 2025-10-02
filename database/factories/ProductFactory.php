<?php

namespace Database\Factories;

use App\Models\Brand;
use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $englishName = fake()->words(2, true);
        $vietnameseName = $this->generateVietnameseName();
        
        $englishDescription = fake()->paragraph();
        $vietnameseDescription = $this->generateVietnameseDescription();
        
        return [
            'name' => [
                'en' => $englishName,
                'vi' => $vietnameseName
            ],
            'description' => [
                'en' => $englishDescription,
                'vi' => $vietnameseDescription
            ],
            'category_id' => Category::factory(),
            'brand_id' => Brand::factory(),
            'seller_id' => User::factory(),
            'status' => fake()->numberBetween(1, 3),
            'is_active' => true,
        ];
    }

    /**
     * Generate Vietnamese product name
     */
    private function generateVietnameseName(): string
    {
        $vietnameseProducts = [
            'Áo sơ mi',
            'Quần jeans',
            'Giày thể thao',
            'Túi xách',
            'Đồng hồ',
            'Máy tính',
            'Điện thoại',
            'Tai nghe',
            'Balo',
            'Kính mát',
            'Ví da',
            'Áo khoác',
            'Giày boot',
            'Váy đầm',
            'Áo len'
        ];
        
        $adjectives = ['cao cấp', 'thời trang', 'hiện đại', 'sang trọng', 'tiện dụng', 'chất lượng'];
        
        return fake()->randomElement($vietnameseProducts) . ' ' . fake()->randomElement($adjectives);
    }

    /**
     * Generate Vietnamese product description
     */
    private function generateVietnameseDescription(): string
    {
        $descriptions = [
            'Sản phẩm chất lượng cao, được thiết kế với phong cách hiện đại và tiện dụng.',
            'Được làm từ chất liệu cao cấp, đảm bảo độ bền và tính thẩm mỹ.',
            'Phù hợp cho mọi lứa tuổi, mang lại sự thoải mái và phong cách.',
            'Thiết kế độc đáo, màu sắc đa dạng, phù hợp với xu hướng thời trang.',
            'Sản phẩm được kiểm tra chất lượng nghiêm ngặt trước khi đến tay khách hàng.'
        ];
        
        return fake()->randomElement($descriptions);
    }
}

<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class CategoryFactory extends Factory
{
    public function definition(): array
    {
        $englishName = fake()->words(2, true);
        $vietnameseName = $this->generateVietnameseCategoryName();
        
        $englishDescription = fake()->sentence();
        $vietnameseDescription = $this->generateVietnameseCategoryDescription();
        
        return [
            'name' => json_encode([
                'en' => $englishName,
                'vi' => $vietnameseName
            ]),
            'description' => json_encode([
                'en' => $englishDescription,
                'vi' => $vietnameseDescription
            ]),
            'image_url' => 'https://via.placeholder.com/600x400.png/00aa88?text=Category',
            'is_active' => true,
        ];
    }

    /**
     * Generate Vietnamese category name
     */
    private function generateVietnameseCategoryName(): string
    {
        $vietnameseCategories = [
            'Thời trang nam',
            'Thời trang nữ',
            'Điện tử',
            'Gia dụng',
            'Sách',
            'Thể thao',
            'Sức khỏe',
            'Làm đẹp',
            'Đồ chơi',
            'Nội thất',
            'Xe cộ',
            'Thú cưng',
            'Công nghệ',
            'Du lịch'
        ];
        
        return fake()->randomElement($vietnameseCategories);
    }

    /**
     * Generate Vietnamese category description
     */
    private function generateVietnameseCategoryDescription(): string
    {
        $descriptions = [
            'Danh mục sản phẩm chất lượng cao.',
            'Tuyển chọn những sản phẩm tốt nhất.',
            'Đa dạng mẫu mã và thiết kế.',
            'Phù hợp với mọi nhu cầu của khách hàng.',
            'Sản phẩm được nhập khẩu từ các thương hiệu uy tín.'
        ];
        
        return fake()->randomElement($descriptions);
    }
}
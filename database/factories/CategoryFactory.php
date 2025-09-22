<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class CategoryFactory extends Factory
{
    public function definition(): array
    {
        // Sử dụng một mảng các danh mục thực tế để dữ liệu có ý nghĩa hơn
        $categories = [
            'Thời trang Nam', 'Thời trang Nữ', 'Điện thoại & Phụ kiện', 'Thiết bị điện tử',
            'Máy tính & Laptop', 'Máy ảnh & Máy quay phim', 'Đồng hồ', 'Giày dép Nam',
            'Giày dép Nữ', 'Túi ví', 'Mẹ & Bé', 'Nhà cửa & Đời sống', 'Sắc đẹp',
            'Sức khỏe', 'Thể thao & Du lịch', 'Sách', 'Đồ chơi'
        ];

        return [
            'name' => $this->faker->unique()->randomElement($categories),
            'description' => fake()->sentence(),
            'is_active' => true,
        ];
    }
}
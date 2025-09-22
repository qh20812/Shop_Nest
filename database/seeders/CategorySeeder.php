<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'Thời trang' => ['Áo Nam', 'Quần Nam', 'Áo Nữ', 'Váy Nữ', 'Phụ kiện'],
            'Điện tử' => ['Điện thoại', 'Máy tính bảng', 'Laptop', 'Tai nghe', 'Loa'],
            'Nhà cửa & Đời sống' => ['Đồ dùng nhà bếp', 'Trang trí nhà cửa', 'Nội thất', 'Cây cảnh'],
            'Sức khỏe & Sắc đẹp' => ['Chăm sóc da', 'Trang điểm', 'Nước hoa', 'Thực phẩm chức năng'],
            'Sách & Văn phòng phẩm' => ['Sách văn học', 'Sách kinh tế', 'Sổ tay', 'Bút viết'],
        ];

        foreach ($categories as $parentName => $children) {
            $parent = Category::create([
                'name' => $parentName,
                'description' => "Các sản phẩm thuộc danh mục ${parentName}",
            ]);

            foreach ($children as $childName) {
                Category::create([
                    'name' => $childName,
                    'description' => "Các sản phẩm thuộc danh mục ${childName}",
                    'parent_category_id' => $parent->category_id,
                ]);
            }
        }
    }
}
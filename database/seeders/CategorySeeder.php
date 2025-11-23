<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'parent' => ['en' => 'Fashion', 'vi' => 'Thời trang'],
                'children' => [
                    ['en' => 'Men\'s Clothing', 'vi' => 'Áo Nam'],
                    ['en' => 'Men\'s Pants', 'vi' => 'Quần Nam'],
                    ['en' => 'Women\'s Clothing', 'vi' => 'Áo Nữ'],
                    ['en' => 'Women\'s Dresses', 'vi' => 'Váy Nữ'],
                    ['en' => 'Accessories', 'vi' => 'Phụ kiện']
                ]
            ],
            [
                'parent' => ['en' => 'Electronics', 'vi' => 'Điện tử'],
                'children' => [
                    ['en' => 'Mobile Phones', 'vi' => 'Điện thoại'],
                    ['en' => 'Tablets', 'vi' => 'Máy tính bảng'],
                    ['en' => 'Laptops', 'vi' => 'Laptop'],
                    ['en' => 'Headphones', 'vi' => 'Tai nghe'],
                    ['en' => 'Speakers', 'vi' => 'Loa']
                ]
            ],
            [
                'parent' => ['en' => 'Home & Living', 'vi' => 'Nhà cửa & Đời sống'],
                'children' => [
                    ['en' => 'Kitchen Appliances', 'vi' => 'Đồ dùng nhà bếp'],
                    ['en' => 'Home Decor', 'vi' => 'Trang trí nhà cửa'],
                    ['en' => 'Furniture', 'vi' => 'Nội thất'],
                    ['en' => 'Plants', 'vi' => 'Cây cảnh']
                ]
            ],
            [
                'parent' => ['en' => 'Health & Beauty', 'vi' => 'Sức khỏe & Sắc đẹp'],
                'children' => [
                    ['en' => 'Skincare', 'vi' => 'Chăm sóc da'],
                    ['en' => 'Makeup', 'vi' => 'Trang điểm'],
                    ['en' => 'Perfume', 'vi' => 'Nước hoa'],
                    ['en' => 'Supplements', 'vi' => 'Thực phẩm chức năng']
                ]
            ],
            [
                'parent' => ['en' => 'Books & Stationery', 'vi' => 'Sách & Văn phòng phẩm'],
                'children' => [
                    ['en' => 'Literature', 'vi' => 'Sách văn học'],
                    ['en' => 'Economics', 'vi' => 'Sách kinh tế'],
                    ['en' => 'Notebooks', 'vi' => 'Sổ tay'],
                    ['en' => 'Pens', 'vi' => 'Bút viết']
                ]
            ]
        ];

        foreach ($categories as $categoryData) {
            $parentName = $categoryData['parent'];
            $children = $categoryData['children'];
            
            $parent = Category::create([
                'name' => $parentName,
                'description' => [
                    'en' => "Products in {$parentName['en']} category",
                    'vi' => "Các sản phẩm thuộc danh mục {$parentName['vi']}"
                ],
                'image_url' => 'https://dummyimage.com/300x300/666266/ffffff&text=Category',
                'is_active' => true,
            ]);

            foreach ($children as $childName) {
                Category::create([
                    'name' => $childName,
                    'description' => [
                        'en' => "Products in {$childName['en']} category",
                        'vi' => "Các sản phẩm thuộc danh mục {$childName['vi']}"
                    ],
                    'parent_category_id' => $parent->category_id,
                    'image_url' => 'https://dummyimage.com/300x300/666266/ffffff&text=Category',
                    'is_active' => true,
                ]);
            }
        }
    }
}
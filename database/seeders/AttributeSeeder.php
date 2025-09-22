<?php

namespace Database\Seeders;

use App\Models\Attribute;
use Illuminate\Database\Seeder;

class AttributeSeeder extends Seeder
{
    public function run(): void
    {
        $attributes = [
            'Màu sắc' => ['Đỏ', 'Xanh dương', 'Vàng', 'Trắng', 'Đen', 'Hồng', 'Xám'],
            'Kích thước' => ['S', 'M', 'L', 'XL', 'XXL', 'Free size'],
            'Dung lượng' => ['64GB', '128GB', '256GB', '512GB', '1TB'],
            'Chất liệu' => ['Cotton', 'Vải lụa', 'Nhựa', 'Kim loại', 'Da'],
        ];

        foreach ($attributes as $attributeName => $values) {
            $attribute = Attribute::create(['name' => $attributeName]);
            foreach ($values as $value) {
                $attribute->values()->create(['value' => $value]);
            }
        }
    }
}
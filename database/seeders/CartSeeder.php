<?php

namespace Database\Seeders;

use App\Models\CartItem;
use App\Models\ProductVariant;
use App\Models\Role;
use Illuminate\Database\Seeder;

class CartSeeder extends Seeder
{
    public function run(): void
    {
        $customers = Role::where('name', 'Customer')->first()->users;
        $variants = ProductVariant::where('stock_quantity', '>', 0)->get();

        if ($variants->isEmpty()) return;

        // Tạo giỏ hàng cho khoảng 15 khách hàng
        foreach ($customers->random(15) as $customer) {
            // Mỗi giỏ hàng có 1-5 sản phẩm
            $items = $variants->random(rand(1, 5))->unique('variant_id');
            foreach ($items as $item) {
                CartItem::create([
                    'user_id' => $customer->id,
                    'variant_id' => $item->variant_id,
                    'quantity' => rand(1, 2),
                ]);
            }
        }
    }
}
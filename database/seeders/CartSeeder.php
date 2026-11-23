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
        $customers = Role::where('name->en', 'Customer')->first()?->users;
        $variants = ProductVariant::where('stock_quantity', '>', 0)->get();

        if (! $customers || $customers->isEmpty() || $variants->isEmpty()) {
            return;
        }

        if (CartItem::query()->exists()) {
            $this->command?->info('Cart items already seeded, skipping.');

            return;
        }

        // Tạo giỏ hàng cho khoảng 15 khách hàng
        $cartOwners = $customers->random(min(15, $customers->count()));

        foreach ($cartOwners as $customer) {
            // Mỗi giỏ hàng có 1-5 sản phẩm
            $maxItems = min(5, $variants->count());
            $items = $variants->random(rand(1, $maxItems))->unique('variant_id');
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

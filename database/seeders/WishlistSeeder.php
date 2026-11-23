<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\User;
use App\Models\Wishlist;
use App\Models\WishlistItem;
use Illuminate\Database\Seeder;

class WishlistSeeder extends Seeder
{
    public function run(): void
    {
        $customer = User::where('email', 'lan.nguyen@gmail.com')->first();

        if (! $customer) {
            return;
        }

        $wishlist = Wishlist::where('user_id', $customer->id)
            ->where('is_default', true)
            ->first();

        if (! $wishlist) {
            $wishlist = new Wishlist(['user_id' => $customer->id]);
            $wishlist->forceFill([
                'name' => 'Danh sách yêu thích',
                'description' => 'Những sản phẩm khách hàng đang quan tâm.',
                'privacy' => 'private',
                'is_default' => true,
            ])->save();
        }

        $products = Product::query()
            ->where('status', 'published')
            ->where('is_active', true)
            ->with('variants')
            ->take(5)
            ->get();

        foreach ($products as $product) {
            $variant = $product->variants->first();

            WishlistItem::firstOrCreate(
                [
                    'wishlist_id' => $wishlist->id,
                    'product_id' => $product->product_id,
                ],
                [
                    'product_variant' => $variant ? [
                        'variant_id' => $variant->variant_id,
                        'variant_name' => $variant->variant_name,
                        'price' => (float) $variant->price,
                    ] : null,
                    'price_when_added' => $variant?->price,
                    'priority' => 1,
                    'notify_price_drop' => true,
                ]
            );
        }

        $wishlist->forceFill([
            'items_count' => $wishlist->wishlistItems()->count(),
        ])->save();
    }
}

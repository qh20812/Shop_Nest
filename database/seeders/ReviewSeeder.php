<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\Review;
use App\Models\Role;
use Illuminate\Database\Seeder;

class ReviewSeeder extends Seeder
{
    public function run(): void
    {
        $customers = Role::where('name->en', 'Customer')->first()?->users;
        $products = Product::all();

        if ($customers->isEmpty() || $products->isEmpty()) {
            return;
        }

        foreach ($products as $product) {
            // Mỗi sản phẩm có 0-10 đánh giá
            if (rand(0, 1)) {
                $reviewCount = rand(1, 10);
                // Lấy ngẫu nhiên một số khách hàng để đánh giá
                $reviewers = $customers->random($reviewCount < $customers->count() ? $reviewCount : $customers->count())->unique('id');

                foreach ($reviewers as $reviewer) {
                    Review::factory()->create([
                        'product_id' => $product->product_id,
                        'user_id' => $reviewer->id,
                    ]);
                }
            }
        }
    }
}
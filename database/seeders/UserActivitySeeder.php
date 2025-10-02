<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductView;
use App\Models\Role;
use App\Models\SearchHistory;
use App\Models\UserPreference;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UserActivitySeeder extends Seeder
{
    public function run(): void
    {
        $customers = Role::where('name->en', 'Customer')->first()?->users; 
        $products = Product::all();
        $categories = Category::all();
        $searchTerms = ['iphone 15 pro max', 'áo thun nam', 'kem chống nắng la roche posay', 'sách đắc nhân tâm', 'giày nike air force 1'];

        if ($customers->isEmpty() || $products->isEmpty() || $categories->isEmpty()) {
            return;
        }

        foreach ($customers as $customer) {
            // 1. Lịch sử xem sản phẩm
            foreach ($products->random(rand(20, 50)) as $product) {
                ProductView::updateOrCreate(
                    [
                        'user_id' => $customer->id,
                        'product_id' => $product->product_id,
                    ],
                    [
                        'view_count' => DB::raw('view_count + 1'),
                        'last_viewed' => now(),
                    ]
                );
            }

            // 2. Lịch sử tìm kiếm
            for ($i = 0; $i < rand(5, 15); $i++) {
                SearchHistory::updateOrCreate(
                    [
                        'user_id' => $customer->id,
                        'search_term' => $searchTerms[array_rand($searchTerms)],
                    ],
                    [
                        'search_count' => DB::raw('search_count + 1'),
                        'last_searched' => now(),
                    ]
                );
            }

            // 3. Sở thích người dùng (sử dụng updateOrCreate để tránh lỗi nếu user đã có)
            UserPreference::updateOrCreate(
                ['user_id' => $customer->id],
                ['preferred_category_id' => $categories->random()->category_id]
            );
        }
    }
}
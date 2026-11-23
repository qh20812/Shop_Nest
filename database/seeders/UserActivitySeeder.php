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
        $products = Product::where('is_active', true)->get();
        $categories = Category::all();
        $searchTerms = ['iphone 15 pro max', 'áo thun nam', 'kem chống nắng la roche posay', 'sách đắc nhân tâm', 'giày nike air force 1'];

        if (! $customers || $customers->isEmpty() || $products->isEmpty() || $categories->isEmpty()) {
            return;
        }

        if (ProductView::query()->exists()) {
            $this->command?->info('User activity already seeded, skipping.');

            return;
        }

        foreach ($customers as $customer) {
            $now = now();

            // 1. Lịch sử xem sản phẩm - upsert theo lô để tránh N+1 khi seed trên DB remote.
            $viewedProducts = $products->random(min(rand(20, 50), $products->count()));
            $viewRows = $viewedProducts->map(fn (Product $product) => [
                'user_id' => $customer->id,
                'product_id' => $product->product_id,
                'view_count' => 1,
                'last_viewed' => $now,
            ])->values()->all();

            foreach (array_chunk($viewRows, 500) as $chunk) {
                ProductView::upsert(
                    $chunk,
                    ['user_id', 'product_id'],
                    [
                        'view_count' => DB::raw('view_count + 1'),
                        'last_viewed' => $now,
                    ]
                );
            }

            // 2. Lịch sử tìm kiếm - gộp số lần theo từ khoá rồi cộng dồn.
            $termCounts = [];
            for ($i = 0; $i < rand(5, 15); $i++) {
                $term = $searchTerms[array_rand($searchTerms)];
                $termCounts[$term] = ($termCounts[$term] ?? 0) + 1;
            }

            foreach ($termCounts as $term => $count) {
                $history = SearchHistory::firstOrNew([
                    'user_id' => $customer->id,
                    'search_term' => $term,
                ]);
                $history->search_count = ($history->search_count ?? 0) + $count;
                $history->last_searched = $now;
                $history->save();
            }

            // 3. Sở thích người dùng
            UserPreference::updateOrCreate(
                ['user_id' => $customer->id],
                ['preferred_category_id' => $categories->random()->category_id]
            );
        }
    }
}

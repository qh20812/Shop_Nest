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

        if (! $customers || $customers->isEmpty() || $products->isEmpty()) {
            return;
        }

        if (Review::query()->exists()) {
            $this->command?->info('Reviews already seeded, skipping.');

            return;
        }

        $comments = [
            ['rating' => 5, 'comment' => 'Sản phẩm đúng mô tả, đóng gói cẩn thận, giao hàng nhanh. Sẽ ủng hộ shop tiếp.'],
            ['rating' => 5, 'comment' => 'Chất lượng tốt hơn mong đợi, giá hợp lý. Nhân viên tư vấn rất nhiệt tình.'],
            ['rating' => 5, 'comment' => 'Hàng chính hãng, dùng ổn định. Đóng gói kỹ, có hoá đơn đầy đủ.'],
            ['rating' => 4, 'comment' => 'Sản phẩm ổn, đúng màu. Giao hàng hơi chậm một chút nhưng shop có báo trước.'],
            ['rating' => 4, 'comment' => 'Chất lượng ổn trong tầm giá. Sẽ cân nhắc mua thêm sản phẩm khác.'],
            ['rating' => 4, 'comment' => 'Mẫu mã đẹp, chất liệu thoải mái. Kích thước hơi rộng so với dự kiến.'],
            ['rating' => 3, 'comment' => 'Sản phẩm tạm ổn, đóng gói chưa được chắc chắn lắm.'],
            ['rating' => 3, 'comment' => 'Dùng được nhưng chưa thật sự nổi bật so với giá tiền.'],
        ];

        foreach ($products as $product) {
            if (rand(0, 1) === 0) {
                continue;
            }

            $reviewCount = rand(2, 8);
            $reviewers = $customers
                ->random(min($reviewCount, $customers->count()))
                ->unique('id');

            foreach ($reviewers as $reviewer) {
                $review = fake()->randomElement($comments);

                Review::create([
                    'product_id' => $product->product_id,
                    'user_id' => $reviewer->id,
                    'rating' => $review['rating'],
                    'comment' => $review['comment'],
                    'is_approved' => true,
                ]);
            }
        }
    }
}

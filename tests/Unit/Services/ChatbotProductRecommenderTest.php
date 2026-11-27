<?php

namespace Tests\Unit\Services;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Models\Review;
use App\Models\Shop;
use App\Models\User;
use App\Services\ChatbotProductRecommender;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class ChatbotProductRecommenderTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function recommends_matching_published_products_from_database(): void
    {
        $product = $this->createProduct([
            'name' => ['vi' => 'Kem chống nắng La Roche-Posay', 'en' => 'La Roche-Posay Sunscreen'],
            'price' => 300000,
        ]);

        $recommender = $this->app->make(ChatbotProductRecommender::class);
        $products = $recommender->recommend(
            $this->makeCustomer(),
            'Gợi ý sản phẩm chăm sóc da dưới 500k'
        );

        $this->assertCount(1, $products);
        $this->assertSame($product->product_id, $products[0]['id']);
        $this->assertSame('Kem chống nắng La Roche-Posay', $products[0]['name']);
        $this->assertSame(300000.0, $products[0]['price']);
        $this->assertSame('/product/'.$product->product_id, $products[0]['url']);
    }

    #[Test]
    public function excludes_draft_out_of_stock_and_inactive_shop_products(): void
    {
        $this->createProduct([
            'name' => ['vi' => 'Sản phẩm hợp lệ', 'en' => 'Valid product'],
            'status' => 'published',
        ]);

        $this->createProduct([
            'name' => ['vi' => 'Sản phẩm nháp', 'en' => 'Draft product'],
            'status' => 'draft',
        ]);

        $this->createProduct([
            'name' => ['vi' => 'Sản phẩm hết hàng', 'en' => 'Out of stock product'],
            'status' => 'published',
            'stock' => 0,
        ]);

        $this->createProduct([
            'name' => ['vi' => 'Sản phẩm shop pending', 'en' => 'Pending shop product'],
            'status' => 'published',
            'shop_status' => 'pending',
        ]);

        $products = $this->app->make(ChatbotProductRecommender::class)
            ->recommend($this->makeCustomer(), 'Gợi ý sản phẩm chăm sóc da');

        $this->assertCount(1, $products);
        $this->assertSame('Sản phẩm hợp lệ', $products[0]['name']);
    }

    #[Test]
    public function does_not_recommend_products_for_non_product_intent(): void
    {
        $this->createProduct([
            'name' => ['vi' => 'Kem chống nắng', 'en' => 'Sunscreen'],
        ]);

        $products = $this->app->make(ChatbotProductRecommender::class)
            ->recommend($this->makeCustomer(), 'Đơn hàng của tôi đang ở đâu?');

        $this->assertSame([], $products);
    }

    #[Test]
    public function respects_price_filter(): void
    {
        $this->createProduct([
            'name' => ['vi' => 'Kem chống nắng cao cấp', 'en' => 'Premium sunscreen'],
            'price' => 700000,
        ]);

        $products = $this->app->make(ChatbotProductRecommender::class)
            ->recommend($this->makeCustomer(), 'Gợi ý sản phẩm chăm sóc da dưới 500k');

        $this->assertSame([], $products);
    }

    #[Test]
    public function does_not_recommend_products_that_only_share_a_generic_token(): void
    {
        $this->createProduct([
            'name' => ['vi' => 'Giày Nike Air Force 1', 'en' => 'Nike Air Force 1'],
            'category_name' => ['vi' => 'Giày dép', 'en' => 'Shoes'],
            'brand_name' => 'Nike',
            'rating' => 4.2,
        ]);

        $this->createProduct([
            'name' => ['vi' => 'Bộ chăn ga gối cotton', 'en' => 'Cotton Bedding Set'],
            'category_name' => ['vi' => 'Trang trí nhà cửa', 'en' => 'Home Decor'],
            'brand_name' => 'Simple',
            'rating' => 4.1,
        ]);

        $this->createProduct([
            'name' => ['vi' => 'Bộ tạ tay 10kg', 'en' => '10kg Dumbbell Set'],
            'category_name' => ['vi' => 'Dụng cụ tập luyện', 'en' => 'Sports Equipment'],
            'brand_name' => 'Decathlon',
            'rating' => null,
        ]);

        $runningShoe = $this->createProduct([
            'name' => ['vi' => 'Giày chạy bộ Nike Revolution 7', 'en' => 'Nike Revolution 7 Running Shoes'],
            'category_name' => ['vi' => 'Giày dép', 'en' => 'Shoes'],
            'brand_name' => 'Nike',
            'rating' => null,
        ]);

        $products = $this->app->make(ChatbotProductRecommender::class)
            ->recommend($this->makeCustomer(), 'Gợi ý giày chạy bộ');

        $this->assertCount(1, $products);
        $this->assertSame($runningShoe->product_id, $products[0]['id']);
    }

    #[Test]
    public function ranks_products_by_keyword_coverage_before_rating(): void
    {
        $partiallyMatching = $this->createProduct([
            'name' => ['vi' => 'Son dưỡng môi', 'en' => 'Lip Balm'],
            'category_name' => ['vi' => 'Trang điểm', 'en' => 'Makeup'],
            'rating' => 5,
        ]);

        $fullyMatching = $this->createProduct([
            'name' => ['vi' => 'Son môi hồng', 'en' => 'Pink Lipstick'],
            'category_name' => ['vi' => 'Trang điểm', 'en' => 'Makeup'],
            'rating' => 3,
        ]);

        $products = $this->app->make(ChatbotProductRecommender::class)
            ->recommend($this->makeCustomer(), 'Gợi ý son môi hồng');

        $this->assertCount(2, $products);
        $this->assertSame($fullyMatching->product_id, $products[0]['id']);
        $this->assertSame($partiallyMatching->product_id, $products[1]['id']);
    }

    #[Test]
    public function does_not_recommend_when_only_generic_tokens_somewhat_match(): void
    {
        $this->createProduct([
            'name' => ['vi' => 'Bộ chăn ga gối cotton', 'en' => 'Cotton Bedding Set'],
            'category_name' => ['vi' => 'Trang trí nhà cửa', 'en' => 'Home Decor'],
        ]);

        $products = $this->app->make(ChatbotProductRecommender::class)
            ->recommend($this->makeCustomer(), 'Gợi ý quà tặng sinh nhật');

        $this->assertSame([], $products);
    }

    #[Test]
    public function does_not_match_category_inside_another_word(): void
    {
        $this->createProduct([
            'name' => ['vi' => 'Loa Bluetooth JBL Flip 6', 'en' => 'JBL Flip 6 Speaker'],
            'category_name' => ['vi' => 'Loa', 'en' => 'Speakers'],
            'brand_name' => 'JBL',
        ]);

        $runningShoe = $this->createProduct([
            'name' => ['vi' => 'Giày chạy bộ Nike Revolution 7', 'en' => 'Nike Revolution 7 Running Shoes'],
            'category_name' => ['vi' => 'Giày dép', 'en' => 'Shoes'],
            'brand_name' => 'Nike',
        ]);

        $products = $this->app->make(ChatbotProductRecommender::class)
            ->recommend($this->makeCustomer(), 'Gợi ý loại giày chạy bộ');

        $this->assertCount(1, $products);
        $this->assertSame($runningShoe->product_id, $products[0]['id']);
    }

    #[Test]
    public function does_not_match_brand_across_word_boundaries(): void
    {
        $dress = $this->createProduct([
            'name' => ['vi' => 'Váy hoa nhí nữ', 'en' => 'Floral Dress'],
            'category_name' => ['vi' => 'Váy Nữ', 'en' => "Women's Dresses"],
            'brand_name' => 'H&M',
        ]);

        $shirt = $this->createProduct([
            'name' => ['vi' => 'Áo thun cotton', 'en' => 'Cotton T-Shirt'],
            'category_name' => ['vi' => 'Áo Nam', 'en' => "Men's Clothing"],
            'brand_name' => 'Zara',
        ]);

        $products = $this->app->make(ChatbotProductRecommender::class)
            ->recommend($this->makeCustomer(), 'Mình muốn xem áo');

        $this->assertCount(1, $products);
        $this->assertSame($shirt->product_id, $products[0]['id']);
        $this->assertNotSame($dress->product_id, $products[0]['id']);
    }

    #[Test]
    public function does_not_treat_generic_questions_as_product_intent(): void
    {
        $this->createProduct([
            'name' => ['vi' => 'MacBook Air 13 M3', 'en' => 'MacBook Air 13 M3'],
            'category_name' => ['vi' => 'Laptop', 'en' => 'Laptops'],
            'brand_name' => 'Apple',
        ]);

        $this->createProduct([
            'name' => ['vi' => 'Áo thể thao Nike', 'en' => 'Nike Sport Shirt'],
            'category_name' => ['vi' => 'Quần áo thể thao', 'en' => 'Sportswear'],
            'brand_name' => 'Nike',
        ]);

        $recommender = $this->app->make(ChatbotProductRecommender::class);

        $this->assertSame([], $recommender->recommend($this->makeCustomer(), 'Bạn là ai'));
        $this->assertSame([], $recommender->recommend($this->makeCustomer(), 'Bạn có thể giúp gì'));
    }

    #[Test]
    public function ignores_shopping_verbs_when_matching_keywords(): void
    {
        $shoe = $this->createProduct([
            'name' => ['vi' => 'Giày chạy bộ Nike', 'en' => 'Nike Running Shoes'],
            'category_name' => ['vi' => 'Giày dép', 'en' => 'Shoes'],
            'brand_name' => 'Nike',
        ]);

        $products = $this->app->make(ChatbotProductRecommender::class)
            ->recommend($this->makeCustomer(), 'Cho mình xem giày');

        $this->assertCount(1, $products);
        $this->assertSame($shoe->product_id, $products[0]['id']);
    }

    #[Test]
    public function matches_keywords_on_whole_tokens_only(): void
    {
        $this->createProduct([
            'name' => ['vi' => 'MacBook Air 13 M3', 'en' => 'MacBook Air 13 M3'],
            'category_name' => ['vi' => 'Laptop', 'en' => 'Laptops'],
            'brand_name' => 'Apple',
        ]);

        $products = $this->app->make(ChatbotProductRecommender::class)
            ->recommend($this->makeCustomer(), 'Gợi ý sản phẩm ai');

        $this->assertSame([], $products);
    }

    #[Test]
    public function parses_decimal_millions_in_price_filter(): void
    {
        $affordable = $this->createProduct([
            'name' => ['vi' => 'Kem chống nắng A', 'en' => 'Sunscreen A'],
            'price' => 1200000,
        ]);

        $this->createProduct([
            'name' => ['vi' => 'Kem chống nắng B', 'en' => 'Sunscreen B'],
            'price' => 15000000,
        ]);

        $products = $this->app->make(ChatbotProductRecommender::class)
            ->recommend($this->makeCustomer(), 'Gợi ý kem chống nắng 1.5 triệu');

        $this->assertCount(1, $products);
        $this->assertSame($affordable->product_id, $products[0]['id']);
    }

    #[Test]
    public function parses_price_range_with_units(): void
    {
        $this->createProduct([
            'name' => ['vi' => 'Giày dưới giá', 'en' => 'Shoes below range'],
            'price' => 500000,
        ]);

        $inRange = $this->createProduct([
            'name' => ['vi' => 'Giày trong khoảng', 'en' => 'Shoes in range'],
            'price' => 1800000,
        ]);

        $this->createProduct([
            'name' => ['vi' => 'Giày trên giá', 'en' => 'Shoes above range'],
            'price' => 3000000,
        ]);

        $products = $this->app->make(ChatbotProductRecommender::class)
            ->recommend($this->makeCustomer(), 'Gợi ý giày từ 1 triệu đến 2 triệu');

        $this->assertCount(1, $products);
        $this->assertSame($inRange->product_id, $products[0]['id']);
    }

    #[Test]
    public function parses_abbreviated_millions(): void
    {
        $affordable = $this->createProduct([
            'name' => ['vi' => 'Kem chống nắng A', 'en' => 'Sunscreen A'],
            'price' => 1400000,
        ]);

        $this->createProduct([
            'name' => ['vi' => 'Kem chống nắng B', 'en' => 'Sunscreen B'],
            'price' => 2000000,
        ]);

        $products = $this->app->make(ChatbotProductRecommender::class)
            ->recommend($this->makeCustomer(), 'Gợi ý kem chống nắng 1tr5');

        $this->assertCount(1, $products);
        $this->assertSame($affordable->product_id, $products[0]['id']);
    }

    #[Test]
    public function does_not_treat_metres_as_millions(): void
    {
        $cable = $this->createProduct([
            'name' => ['vi' => 'Cáp sạc Type-C 2m', 'en' => 'Type-C Charging Cable 2m'],
            'price' => 3000000,
        ]);

        $products = $this->app->make(ChatbotProductRecommender::class)
            ->recommend($this->makeCustomer(), 'Gợi ý cáp sạc 2m');

        $this->assertCount(1, $products);
        $this->assertSame($cable->product_id, $products[0]['id']);
    }

    #[Test]
    public function strips_price_abbreviation_from_keywords(): void
    {
        $shoe = $this->createProduct([
            'name' => ['vi' => 'Giày chạy bộ Nike Revolution 7', 'en' => 'Nike Revolution 7 Running Shoes'],
            'category_name' => ['vi' => 'Giày dép', 'en' => 'Shoes'],
            'brand_name' => 'Nike',
            'price' => 1400000,
        ]);

        $this->createProduct([
            'name' => ['vi' => 'Giày chạy bộ Nike Pegasus', 'en' => 'Nike Pegasus Running Shoes'],
            'category_name' => ['vi' => 'Giày dép', 'en' => 'Shoes'],
            'brand_name' => 'Nike',
            'price' => 2000000,
        ]);

        $products = $this->app->make(ChatbotProductRecommender::class)
            ->recommend($this->makeCustomer(), 'Gợi ý giày 1tr5');

        $this->assertCount(1, $products);
        $this->assertSame($shoe->product_id, $products[0]['id']);
    }

    #[Test]
    public function price_filter_ignores_out_of_stock_variants(): void
    {
        $product = $this->createProduct([
            'name' => ['vi' => 'Kem chống nắng', 'en' => 'Sunscreen'],
            'price' => 700000,
        ]);

        ProductVariant::factory()->create([
            'product_id' => $product->product_id,
            'price' => 300000,
            'discount_price' => null,
            'stock_quantity' => 0,
        ]);

        $products = $this->app->make(ChatbotProductRecommender::class)
            ->recommend($this->makeCustomer(), 'Gợi ý kem chống nắng dưới 500k');

        $this->assertSame([], $products);
    }

    #[Test]
    public function product_card_price_uses_an_available_variant(): void
    {
        $product = $this->createProduct([
            'name' => ['vi' => 'Kem chống nắng', 'en' => 'Sunscreen'],
            'price' => 700000,
        ]);

        ProductVariant::factory()->create([
            'product_id' => $product->product_id,
            'price' => 300000,
            'discount_price' => null,
            'stock_quantity' => 0,
        ]);

        $products = $this->app->make(ChatbotProductRecommender::class)
            ->recommend($this->makeCustomer(), 'Gợi ý kem chống nắng');

        $this->assertCount(1, $products);
        $this->assertSame(700000.0, $products[0]['price']);
    }

    #[Test]
    public function excludes_fully_reserved_products(): void
    {
        $product = $this->createProduct([
            'name' => ['vi' => 'Kem chống nắng', 'en' => 'Sunscreen'],
            'stock' => 5,
        ]);

        $variant = ProductVariant::query()->where('product_id', $product->product_id)->firstOrFail();
        $variant->reserved_quantity = 5;
        $variant->save();

        $products = $this->app->make(ChatbotProductRecommender::class)
            ->recommend($this->makeCustomer(), 'Gợi ý kem chống nắng');

        $this->assertSame([], $products);
    }

    #[Test]
    public function recommends_for_english_queries(): void
    {
        $product = $this->createProduct([
            'name' => ['vi' => 'Kem chống nắng', 'en' => 'Sunscreen'],
        ]);

        $products = $this->app->make(ChatbotProductRecommender::class)
            ->recommend($this->makeCustomer(), 'Find sunscreen');

        $this->assertCount(1, $products);
        $this->assertSame($product->product_id, $products[0]['id']);
    }

    #[Test]
    public function english_product_advice_quick_reply_returns_suggestions(): void
    {
        $this->createProduct([
            'name' => ['vi' => 'Kem chống nắng', 'en' => 'Sunscreen'],
        ]);

        $products = $this->app->make(ChatbotProductRecommender::class)
            ->recommend($this->makeCustomer(), 'Product advice');

        $this->assertCount(1, $products);
    }

    private function makeCustomer(): User
    {
        return User::factory()->create();
    }

    /**
     * @param  array<string, mixed>  $overrides
     */
    private function createProduct(array $overrides = []): Product
    {
        $shop = Shop::factory()->create([
            'status' => $overrides['shop_status'] ?? 'active',
            'is_verified' => ($overrides['shop_status'] ?? 'active') === 'active',
        ]);

        $category = Category::create([
            'name' => $overrides['category_name'] ?? ['vi' => 'Chăm sóc da', 'en' => 'Skincare'],
            'is_active' => true,
        ]);

        $brand = Brand::create([
            'name' => $overrides['brand_name'] ?? 'La Roche-Posay',
            'description' => 'Skincare brand',
            'is_active' => true,
        ]);

        $product = Product::factory()->create([
            'shop_id' => $shop->id,
            'seller_id' => $shop->owner_id,
            'category_id' => $category->category_id,
            'brand_id' => $brand->brand_id,
            'status' => $overrides['status'] ?? 'published',
            'is_active' => $overrides['is_active'] ?? true,
            'name' => $overrides['name'] ?? ['vi' => 'Kem chống nắng', 'en' => 'Sunscreen'],
        ]);

        ProductImage::factory()->create([
            'product_id' => $product->product_id,
            'image_url' => 'https://example.com/product.jpg',
            'is_primary' => true,
            'display_order' => 0,
        ]);

        ProductVariant::factory()->create([
            'product_id' => $product->product_id,
            'price' => $overrides['price'] ?? 300000,
            'discount_price' => $overrides['discount_price'] ?? null,
            'stock_quantity' => $overrides['stock'] ?? 20,
        ]);

        $rating = array_key_exists('rating', $overrides) ? $overrides['rating'] : 5;

        if ($rating !== null) {
            Review::factory()->create([
                'product_id' => $product->product_id,
                'user_id' => User::factory()->create()->id,
                'rating' => $rating,
                'is_approved' => true,
            ]);
        }

        return $product;
    }
}

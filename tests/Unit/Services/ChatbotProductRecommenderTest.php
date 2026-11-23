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
            'name' => ['vi' => 'Chăm sóc da', 'en' => 'Skincare'],
            'is_active' => true,
        ]);

        $brand = Brand::create([
            'name' => 'La Roche-Posay',
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

        Review::factory()->create([
            'product_id' => $product->product_id,
            'user_id' => User::factory()->create()->id,
            'rating' => 5,
            'is_approved' => true,
        ]);

        return $product;
    }
}

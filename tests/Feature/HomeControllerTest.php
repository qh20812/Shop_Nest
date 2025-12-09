<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Brand;
use App\Models\Category;
use App\Models\FlashSaleEvent;
use App\Models\FlashSaleProduct;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use App\Models\Review;
use App\Models\User;
use App\Models\UserPreference;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class HomeControllerTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        config(['cache.default' => 'array']);
        Cache::flush();
        app()->setLocale('en');
    }

    protected function tearDown(): void
    {
        Cache::flush();

        parent::tearDown();
    }

    public function test_home_page_loads_successfully()
    {
        $response = $this->get('/');
        $response->assertStatus(200);
    }

    public function test_home_page_returns_categories()
    {
        Category::factory()->create([
            'name' => ['vi' => 'Electronics', 'en' => 'Electronics'],
            'image_url' => 'test-image.jpg',
            'is_active' => true,
        ]);

        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
            $page->has('categories')
                ->where('categories.0.name', 'Electronics')
                ->where('categories.0.icon', '📱')
                ->where('categories.0.image_url', 'test-image.jpg')
        );
    }

    public function test_home_page_returns_flash_sale_data()
    {
        $event = FlashSaleEvent::create([
            'name' => 'Flash Sale',
            'status' => 'active',
            'start_time' => now()->subHour(),
            'end_time' => now()->addHour(),
            'banner_image' => 'banner.jpg',
        ]);

        $category = Category::factory()->create(['is_active' => true]);
        $product = Product::factory()->create([
            'category_id' => $category->category_id,
            'is_active' => true,
            'status' => 'published',
        ]);

        $variant = ProductVariant::factory()->create([
            'product_id' => $product->product_id,
            'price' => 100000,
        ]);

        ProductImage::create([
            'product_id' => $product->product_id,
            'image_url' => 'test-product.jpg',
            'is_primary' => true,
            'display_order' => 1,
        ]);

        FlashSaleProduct::create([
            'flash_sale_event_id' => $event->id,
            'product_variant_id' => $variant->variant_id,
            'flash_sale_price' => 80000,
            'discount_percentage' => 20,
            'quantity_limit' => 100,
            'sold_count' => 0,
            'max_quantity_per_user' => 5,
        ]);

        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
            $page->has('flashSale')
                ->where('flashSale.event.name', 'Flash Sale')
                ->has('flashSale.products')
                ->has('flashSale.products.0.price')
                ->has('flashSale.products.0.oldPrice')
        );
    }

    public function test_home_page_returns_suggested_products_for_guest()
    {
        $category = Category::factory()->create(['is_active' => true]);
        $products = Product::factory()->count(5)->create([
            'category_id' => $category->category_id,
            'is_active' => true,
            'status' => 'published',
        ]);

        foreach ($products as $product) {
            ProductVariant::factory()->create([
                'product_id' => $product->product_id,
                'price' => 50000,
            ]);

            ProductImage::create([
                'product_id' => $product->product_id,
                'image_url' => 'test-image.jpg',
                'is_primary' => true,
                'display_order' => 1,
            ]);
        }

        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
            $page->has('suggestedProducts')
                ->has('bestSellers')
        );
    }

    public function test_home_page_returns_personalized_suggested_products_for_user()
    {
        /** @var User $user */
        $user = User::factory()->createOne();
        $category = Category::factory()->create(['is_active' => true]);

        UserPreference::create([
            'user_id' => $user->id,
            'preferred_category_id' => $category->category_id,
        ]);

        $products = Product::factory()->count(3)->create([
            'category_id' => $category->category_id,
            'is_active' => true,
            'status' => 'published',
        ]);

        foreach ($products as $product) {
            ProductVariant::factory()->create([
                'product_id' => $product->product_id,
                'price' => 75000,
            ]);

            ProductImage::create([
                'product_id' => $product->product_id,
                'image_url' => 'test-image.jpg',
                'is_primary' => true,
                'display_order' => 1,
            ]);
        }

        $response = $this->actingAs($user)->get('/');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
            $page->has('suggestedProducts')
                ->has('bestSellers')
        );
    }

    public function test_home_page_caches_categories_data()
    {
        Cache::flush();

        $category = Category::factory()->create([
            'name' => ['en' => 'Cached Category', 'vi' => 'Danh mục'],
            'image_url' => 'cached-image.jpg',
            'is_active' => true,
        ]);

        $this->get('/');

        $category->update([
            'name' => ['en' => 'Updated Category', 'vi' => 'Danh mục mới'],
        ]);

        $response = $this->get('/');

        $response->assertInertia(fn ($page) =>
            $page->where('categories.0.name', 'Cached Category')
        );
    }

    public function test_home_page_caches_flash_sale_event()
    {
        Cache::flush();

        $event = FlashSaleEvent::create([
            'name' => 'Initial Event',
            'status' => 'active',
            'start_time' => now()->subHour(),
            'end_time' => now()->addHour(),
            'banner_image' => 'initial-banner.jpg',
        ]);

        $category = Category::factory()->create(['is_active' => true]);
        $product = Product::factory()->create([
            'category_id' => $category->category_id,
            'is_active' => true,
            'status' => 'published',
        ]);

        $variant = ProductVariant::factory()->create([
            'product_id' => $product->product_id,
            'price' => 100000,
        ]);

        ProductImage::create([
            'product_id' => $product->product_id,
            'image_url' => 'test-product.jpg',
            'is_primary' => true,
            'display_order' => 1,
        ]);

        FlashSaleProduct::create([
            'flash_sale_event_id' => $event->id,
            'product_variant_id' => $variant->variant_id,
            'flash_sale_price' => 80000,
            'discount_percentage' => 20,
            'quantity_limit' => 100,
            'sold_count' => 0,
            'max_quantity_per_user' => 5,
        ]);

        $this->get('/');

        $event->update(['name' => 'Updated Event']);

        $response = $this->get('/');

        $response->assertInertia(fn ($page) =>
            $page->where('flashSale.event.name', 'Initial Event')
        );
    }

    public function test_suggested_products_returns_computed_metrics()
    {
        /** @var User $user */
        $user = User::factory()->createOne();
        $category = Category::factory()->create(['is_active' => true]);

        $product = Product::factory()->create([
            'category_id' => $category->category_id,
            'is_active' => true,
            'status' => 'published',
        ]);

        $variant = ProductVariant::factory()->create([
            'product_id' => $product->product_id,
            'price' => 100000,
            'discount_price' => 90000,
        ]);

        ProductImage::create([
            'product_id' => $product->product_id,
            'image_url' => 'https://example.com/image.jpg',
            'alt_text' => 'Primary image',
            'is_primary' => true,
            'display_order' => 1,
        ]);

        Review::factory()->create([
            'product_id' => $product->product_id,
            'rating' => 5,
            'is_approved' => true,
        ]);

        Review::factory()->create([
            'product_id' => $product->product_id,
            'rating' => 4,
            'is_approved' => true,
        ]);

        UserPreference::create([
            'user_id' => $user->id,
            'preferred_category_id' => $category->category_id,
        ]);

        $response = $this->actingAs($user)->get('/');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
            $page->where('suggestedProducts.0.rating', 4.5)
                ->where('suggestedProducts.0.reviews', 2)
                ->has('suggestedProducts.0.price')
                ->has('suggestedProducts.0.oldPrice')
        );
    }

    public function test_home_page_returns_empty_flash_sale_when_no_active_event()
    {
        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
            $page->where('flashSale', null)
        );
    }

    public function test_home_page_returns_best_sellers()
    {
        $category = Category::factory()->create(['is_active' => true]);
        $user = User::factory()->create();
        
        $product = Product::factory()->create([
            'category_id' => $category->category_id,
            'is_active' => true,
            'status' => 'published',
        ]);

        $variant = ProductVariant::factory()->create([
            'product_id' => $product->product_id,
            'price' => 50000,
        ]);

        ProductImage::create([
            'product_id' => $product->product_id,
            'image_url' => 'test-image.jpg',
            'is_primary' => true,
            'display_order' => 1,
        ]);

        $order = Order::create([
            'customer_id' => $user->id,
            'order_number' => 'ORD-' . Str::upper(Str::random(8)),
            'sub_total' => 50000,
            'shipping_fee' => 0,
            'discount_amount' => 0,
            'total_amount' => 50000,
            'status' => OrderStatus::COMPLETED->value,
            'payment_method' => 1,
            'payment_status' => PaymentStatus::PAID->value,
        ]);

        OrderItem::create([
            'order_id' => $order->order_id,
            'variant_id' => $variant->variant_id,
            'quantity' => 5,
            'unit_price' => 50000,
            'total_price' => 250000,
        ]);

        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
            $page->has('bestSellers')
        );
    }

    public function test_home_page_returns_banners()
    {
        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
            $page->has('banners')
        );
    }
}

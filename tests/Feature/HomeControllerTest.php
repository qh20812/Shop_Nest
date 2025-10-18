<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Category;
use App\Models\FlashSaleEvent;
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
use Mockery;

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
        Mockery::close();

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
            'name' => ['vi' => 'Test Category', 'en' => 'Test Category'],
            'image_url' => 'test-image.jpg',
            'is_active' => true,
        ]);

        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
            $page->has('categories')
                ->where('categories.0.name', 'Test Category')
        );
    }

    public function test_home_page_returns_flash_sale_data()
    {
        FlashSaleEvent::create([
            'name' => 'Flash Sale',
            'status' => 'active',
            'start_time' => now()->subHour(),
            'end_time' => now()->addHour(),
            'banner_image' => 'banner.jpg',
        ]);

        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
            $page->has('flashSale')
                ->where('flashSale.event.name', 'Flash Sale')
        );
    }

    public function test_home_page_returns_daily_discover_for_guest()
    {
        Product::factory()->count(5)->create([
            'is_active' => true,
            'status' => 'published',
        ]);

        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
            $page->has('dailyDiscover')
        );
    }

    public function test_home_page_returns_personalized_daily_discover_for_user()
    {
    /** @var User $user */
    $user = User::factory()->createOne();
        $category = Category::factory()->create();

        UserPreference::create([
            'user_id' => $user->id,
            'preferred_category_id' => $category->category_id,
        ]);

        Product::factory()->count(3)->create([
            'category_id' => $category->category_id,
            'is_active' => true,
            'status' => 'published',
        ]);

        $response = $this->actingAs($user)->get('/');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
            $page->has('dailyDiscover')
                ->has('user')
                ->where('user.id', $user->id)
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

        $this->get('/');

        $event->update(['name' => 'Updated Event']);

        $response = $this->get('/');

        $response->assertInertia(fn ($page) =>
            $page->where('flashSale.event.name', 'Initial Event')
        );
    }

    public function test_daily_discover_returns_computed_metrics_for_user()
    {
    /** @var User $user */
    $user = User::factory()->createOne();
        $category = Category::factory()->create();

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
        ]);

        Review::factory()->create([
            'product_id' => $product->product_id,
            'rating' => 4,
        ]);

        $order = Order::create([
            'customer_id' => $user->id,
            'order_number' => 'ORD-' . Str::upper(Str::random(8)),
            'sub_total' => 200000,
            'shipping_fee' => 10000,
            'discount_amount' => 0,
            'total_amount' => 210000,
            'status' => OrderStatus::PROCESSING->value,
            'payment_method' => 1,
            'payment_status' => PaymentStatus::PAID->value,
            'notes' => null,
        ]);

        OrderItem::create([
            'order_id' => $order->order_id,
            'variant_id' => $variant->variant_id,
            'quantity' => 3,
            'unit_price' => 70000,
            'total_price' => 210000,
        ]);

        UserPreference::create([
            'user_id' => $user->id,
            'preferred_category_id' => $category->category_id,
        ]);

        $response = $this->actingAs($user)->get('/');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
            $page->where('dailyDiscover.0.rating', 4.5)
                ->where('dailyDiscover.0.sold_count', 3)
        );
    }

    public function test_home_page_handles_flash_sale_query_exception_gracefully()
    {
        Cache::flush();
        Log::spy();

        $mock = Mockery::mock('alias:' . FlashSaleEvent::class);
        $mock->shouldReceive('where')->andThrow(new \Exception('DB error'));

        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
            $page->where('flashSale', null)
        );

        Log::shouldHaveReceived('error')
            ->once()
            ->withArgs(function ($message, $context) {
                return str_contains($message, 'Error in getFlashSaleData')
                    && array_key_exists('exception', $context);
            });
    }

    public function test_daily_discover_handles_exception_gracefully()
    {
        Cache::flush();
        Log::spy();

        $mock = Mockery::mock('alias:' . Product::class);
        $mock->shouldReceive('with')->andThrow(new \Exception('DB error'));

        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
            $page->where('dailyDiscover', [])
        );

        Log::shouldHaveReceived('error')
            ->once()
            ->withArgs(function ($message, $context) {
                return str_contains($message, 'Error in getDailyDiscoverProducts')
                    && array_key_exists('exception', $context);
            });
    }

    public function test_home_page_returns_null_user_for_guest()
    {
        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
            $page->where('user', null)
        );
    }

    public function test_home_page_returns_user_data_for_authenticated_user()
    {
    /** @var User $user */
    $user = User::factory()->createOne([
            'username' => 'testuser',
            'email' => 'test@example.com',
        ]);

        $response = $this->actingAs($user)->get('/');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
            $page->has('user')
                ->where('user.username', 'testuser')
                ->where('user.email', 'test@example.com')
        );
    }
}

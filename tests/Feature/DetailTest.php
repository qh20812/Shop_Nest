<?php

namespace Tests\Feature;

use App\Enums\ProductStatus;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Review;
use App\Models\User;
use App\Services\CartService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\Cache;
use Tests\TestCase;

class DetailTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected function setUp(): void
    {
        parent::setUp();
        Cache::flush(); // Clear cache for tests
    }

    public function test_show_product_detail_returns_correct_data()
    {
        $user = User::factory()->create();
        $product = Product::factory()->create([
            'status' => ProductStatus::PUBLISHED,
            'is_active' => true,
        ]);
        $variant = ProductVariant::factory()->create([
            'product_id' => $product->product_id,
            'price' => 100.0,
            'stock_quantity' => 10,
        ]);
        Review::factory()->count(3)->create([
            'product_id' => $product->product_id,
            'rating' => 5,
            'is_approved' => true,
        ]);

        $response = $this->actingAs($user)->get("/product/{$product->product_id}");

        $response->assertStatus(200);
    }

    public function test_show_product_detail_404_for_nonexistent_product()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/product/99999');

        $response->assertStatus(404);
    }

    public function test_show_product_detail_404_for_unpublished_product()
    {
        $user = User::factory()->create();
        $product = Product::factory()->create([
            'status' => ProductStatus::DRAFT,
            'is_active' => true,
        ]);

        $response = $this->actingAs($user)->get("/product/{$product->product_id}");

        $response->assertStatus(404);
    }

    public function test_add_to_cart_success()
    {
        $user = User::factory()->create();
        $product = Product::factory()->create([
            'status' => ProductStatus::PUBLISHED,
            'is_active' => true,
        ]);
        $variant = ProductVariant::factory()->create([
            'product_id' => $product->product_id,
            'stock_quantity' => 10,
        ]);

        $data = [
            'variant_id' => $variant->variant_id,
            'quantity' => 2,
        ];

        $response = $this->actingAs($user)->postJson("/product/{$product->product_id}/add-to-cart", $data);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Đã thêm sản phẩm vào giỏ hàng.',
                'cartCount' => 1,
            ]);
    }

    public function test_add_to_cart_validation_fails()
    {
        $user = User::factory()->create();
        $product = Product::factory()->create([
            'status' => ProductStatus::PUBLISHED,
            'is_active' => true,
        ]);

        $data = [
            'variant_id' => 99999, // Invalid variant
            'quantity' => 0, // Invalid quantity
        ];

        $response = $this->actingAs($user)->postJson("/product/{$product->product_id}/add-to-cart", $data);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['variant_id', 'quantity']);
    }

    public function test_add_to_cart_invalid_variant()
    {
        $user = User::factory()->create();
        $product = Product::factory()->create([
            'status' => ProductStatus::PUBLISHED,
            'is_active' => true,
        ]);

        $data = [
            'variant_id' => 99999,
            'quantity' => 1,
        ];

        $response = $this->actingAs($user)->postJson("/product/{$product->product_id}/add-to-cart", $data);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['variant_id']);
    }

    public function test_buy_now_success_for_authenticated_user()
    {
        $user = User::factory()->create();
        $product = Product::factory()->create([
            'status' => ProductStatus::PUBLISHED,
            'is_active' => true,
        ]);
        $variant = ProductVariant::factory()->create([
            'product_id' => $product->product_id,
            'stock_quantity' => 10,
        ]);

        $data = [
            'variant_id' => $variant->variant_id,
            'quantity' => 1,
        ];

        $response = $this->actingAs($user)->postJson("/product/{$product->product_id}/buy-now", $data);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Chuyển đến trang thanh toán.',
                'redirect' => route('cart.checkout'),
            ]);
    }

    public function test_buy_now_redirects_to_login_for_guest()
    {
        $product = Product::factory()->create([
            'status' => ProductStatus::PUBLISHED,
            'is_active' => true,
        ]);
        $variant = ProductVariant::factory()->create([
            'product_id' => $product->product_id,
            'stock_quantity' => 10,
        ]);

        $data = [
            'variant_id' => $variant->variant_id,
            'quantity' => 1,
        ];

        $response = $this->postJson("/product/{$product->product_id}/buy-now", $data);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Vui lòng đăng nhập để tiếp tục thanh toán.',
                'redirect' => route('login'),
            ]);
    }

    public function test_buy_now_validation_fails()
    {
        $user = User::factory()->create();
        $product = Product::factory()->create([
            'status' => ProductStatus::PUBLISHED,
            'is_active' => true,
        ]);

        $data = [
            'variant_id' => null,
            'quantity' => 100, // Exceeds max
        ];

        $response = $this->actingAs($user)->postJson("/product/{$product->product_id}/buy-now", $data);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['variant_id', 'quantity']);
    }
}

<?php

namespace Tests\Feature\Customer;

use Tests\TestCase;
use App\Models\User;
use App\Models\Product;
use App\Models\Order;
use App\Models\Review;
use App\Models\Role;
use App\Models\ProductVariant;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ReviewControllerTest extends TestCase
{
    use RefreshDatabase;

    protected $user;
    protected $product;
    protected $variant;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Seed roles for proper functionality
        $this->seed(RoleSeeder::class);
        
        // Create customer user
        $this->user = User::factory()->create();
        $this->user->roles()->attach(Role::where('name->en', 'Customer')->first());

        $this->product = Product::factory()->create();
        $this->variant = ProductVariant::factory()->create([
            'product_id' => $this->product->product_id,
        ]);
    }

    public function test_tra_ve_danh_gia_cho_nguoi_dung_da_dang_nhap()
    {
        Review::factory()->create([
            'user_id' => $this->user->id,
            'product_id' => $this->product->product_id,
        ]);

        $response = $this->actingAs($this->user)
            ->getJson('/dashboard/reviews');

        $response->assertStatus(200)
                 ->assertJsonStructure(['data']);
    }

    public function test_tra_ve_danh_sach_rong_neu_khong_co_danh_gia()
    {
        $response = $this->actingAs($this->user)
            ->getJson('/dashboard/reviews');

        $response->assertStatus(200)
                 ->assertJson(['data' => []]);
    }

    public function test_yeu_cau_xac_thuc_cho_danh_sach_danh_gia()
    {
        $response = $this->getJson('/dashboard/reviews');
        $response->assertStatus(401);
    }

    public function test_co_the_tao_form_danh_gia_neu_don_hang_va_san_pham_hop_le()
    {
        $order = Order::factory()->create(['customer_id' => $this->user->id]);

        $order->items()->create([
            'order_id' => $order->order_id,
            'variant_id' => $this->variant->variant_id,
            'quantity' => 1,
            'unit_price' => 100000,
            'total_price' => 100000,
            'original_currency' => $order->currency ?? 'VND',
            'original_unit_price' => 100000,
            'original_total_price' => 100000,
        ]);

        $response = $this->actingAs($this->user)
            ->getJson("/dashboard/reviews/create/{$order->order_id}/{$this->product->product_id}");

        $response->assertStatus(200)
                 ->assertJsonStructure(['order', 'product']);
    }

    public function test_that_bai_neu_khong_tim_thay_don_hang()
    {
        $response = $this->actingAs($this->user)
            ->getJson("/dashboard/reviews/create/999/{$this->product->product_id}");

        $response->assertStatus(404);
    }

    public function test_that_bai_neu_don_hang_khong_thuoc_ve_nguoi_dung()
    {
        $otherUser = User::factory()->create();
        $order = Order::factory()->create(['customer_id' => $otherUser->id]);

        $response = $this->actingAs($this->user)
            ->getJson("/dashboard/reviews/create/{$order->order_id}/{$this->product->product_id}");

        $response->assertStatus(404);
    }

    public function test_that_bai_neu_khong_tim_thay_san_pham()
    {
        $order = Order::factory()->create(['customer_id' => $this->user->id]);

        $response = $this->actingAs($this->user)
            ->getJson("/dashboard/reviews/create/{$order->order_id}/999999");

        $response->assertStatus(404);
    }

    public function test_that_bai_neu_san_pham_khong_co_trong_don_hang()
    {
        $order = Order::factory()->create(['customer_id' => $this->user->id]);

        $response = $this->actingAs($this->user)
            ->getJson("/dashboard/reviews/create/{$order->order_id}/{$this->product->product_id}");

        $response->assertStatus(403);
    }

    public function test_co_the_luu_danh_gia_thanh_cong()
    {
        $order = Order::factory()->create(['customer_id' => $this->user->id]);

        $order->items()->create([
            'order_id' => $order->order_id,
            'variant_id' => $this->variant->variant_id,
            'quantity' => 1,
            'unit_price' => 100000,
            'total_price' => 100000,
            'original_currency' => $order->currency ?? 'VND',
            'original_unit_price' => 100000,
            'original_total_price' => 100000,
        ]);

        $response = $this->actingAs($this->user)
            ->postJson("/dashboard/reviews/{$order->order_id}/{$this->product->product_id}", [
                'rating' => 5,
                'comment' => 'Good product'
            ]);

        $response->assertStatus(201)
                 ->assertJsonFragment(['is_approved' => false]);
    }

    public function test_that_bai_neu_da_danh_gia_san_pham()
    {
        Review::factory()->create([
            'user_id' => $this->user->id,
            'product_id' => $this->product->product_id,
        ]);

        $order = Order::factory()->create(['customer_id' => $this->user->id]);

        $response = $this->actingAs($this->user)
            ->postJson("/dashboard/reviews/{$order->order_id}/{$this->product->product_id}", [
                'rating' => 4,
                'comment' => 'Duplicate'
            ]);

        $response->assertStatus(400);
    }

    public function test_yeu_cau_diem_danh_gia_khi_luu()
    {
        $order = Order::factory()->create(['customer_id' => $this->user->id]);

        $response = $this->actingAs($this->user)
            ->postJson("/dashboard/reviews/{$order->order_id}/{$this->product->product_id}", []);

        $response->assertStatus(422);
    }

    public function test_kiem_tra_diem_danh_gia_toi_thieu_va_toi_da()
    {
        $order = Order::factory()->create(['customer_id' => $this->user->id]);

        $response = $this->actingAs($this->user)
            ->postJson("/dashboard/reviews/{$order->order_id}/{$this->product->product_id}", ['rating' => 0]);
        $response->assertStatus(422);

        $response = $this->actingAs($this->user)
            ->postJson("/dashboard/reviews/{$order->order_id}/{$this->product->product_id}", ['rating' => 6]);
        $response->assertStatus(422);
    }

    public function test_kiem_tra_do_dai_binh_luan()
    {
        $order = Order::factory()->create(['customer_id' => $this->user->id]);
        $longComment = str_repeat('a', 2001);

        $response = $this->actingAs($this->user)
            ->postJson("/dashboard/reviews/{$order->order_id}/{$this->product->product_id}", [
                'rating' => 4,
                'comment' => $longComment
            ]);

        $response->assertStatus(422);
    }

    public function test_cho_phep_binh_luan_rong()
    {
        $order = Order::factory()->create(['customer_id' => $this->user->id]);

        $response = $this->actingAs($this->user)
            ->postJson("/dashboard/reviews/{$order->order_id}/{$this->product->product_id}", [
                'rating' => 5,
                'comment' => null
            ]);

        $response->assertStatus(201);
    }

    public function test_that_bai_neu_san_pham_khong_ton_tai()
    {
        $order = Order::factory()->create(['customer_id' => $this->user->id]);

        $response = $this->actingAs($this->user)
            ->postJson("/dashboard/reviews/{$order->order_id}/999999", ['rating' => 5]);

        $response->assertStatus(404);
    }

    public function test_yeu_cau_xac_thuc_cho_luu_danh_gia()
    {
        $order = Order::factory()->create(['customer_id' => $this->user->id]);

        $response = $this->postJson("/dashboard/reviews/{$order->order_id}/{$this->product->product_id}", ['rating' => 5]);
        $response->assertStatus(401);
    }

    public function test_tra_ve_chi_tiet_danh_gia_neu_nguoi_dung_so_huu()
    {
        $review = Review::factory()->create([
            'user_id' => $this->user->id,
            'product_id' => $this->product->product_id,
        ]);

        $response = $this->actingAs($this->user)
            ->getJson("/dashboard/reviews/{$review->review_id}");

        $response->assertStatus(200)
                 ->assertJsonFragment(['review_id' => $review->review_id]);
    }

    public function test_that_bai_neu_danh_gia_khong_ton_tai_hoac_khong_so_huu()
    {
        $otherReview = Review::factory()->create();

        $response = $this->actingAs($this->user)
            ->getJson("/dashboard/reviews/{$otherReview->review_id}");

        $response->assertStatus(404);
    }
}

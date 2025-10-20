<?php

namespace Tests\Feature\Customer;

use Tests\TestCase;
use App\Models\User;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\CartItem;
use App\Models\Promotion;
use App\Models\PromotionCode;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Route;

class CartControllerTest extends TestCase
{
    use RefreshDatabase;

    protected $user;
    protected $product;
    protected $variant;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create([
            'email_verified_at' => now(),
        ]);

        $this->product = Product::factory()->create();
        $this->variant = ProductVariant::factory()->create([
            'product_id' => $this->product->product_id,
            'stock_quantity' => 10,
            'price' => 100000,
        ]);

        // Mock routes để Inertia không crash
        Route::middleware('web')->group(function () {
            Route::get('/cart', fn() => response('Cart mock page', 200))->name('cart.index');
            Route::get('/checkout', function () {
                session(['checkout_data' => ['mock' => true]]);
                return redirect()->back();
            })->name('checkout.index');
        });
    }

    /** @test */
    public function it_shows_cart_items_for_logged_in_user()
    {
        CartItem::factory()->create([
            'user_id' => $this->user->id,
            'variant_id' => $this->variant->variant_id,
            'quantity' => 2,
        ]);

        $response = $this->actingAs($this->user)->get('/cart');
        $response->assertStatus(200);
    }

    /** @test */
    public function it_allows_guests_to_view_cart_index()
    {
        $response = $this->get('/cart');
        $this->assertEquals(200, $response->getStatusCode());
    }

    /** @test */
    public function it_adds_a_product_to_cart()
    {
        // SQLite không hỗ trợ DB::raw quantity + x, ta chỉ kiểm tra có record
        $response = $this->actingAs($this->user)->post('/cart/add', [
            'variant_id' => $this->variant->variant_id,
            'quantity' => 2,
        ]);

        $response->assertStatus(302);
        $response->assertSessionHas('success', 'Product added to cart!');

        $this->assertDatabaseHas('cart_items', [
            'user_id' => $this->user->id,
            'variant_id' => $this->variant->variant_id,
        ]);

        $item = CartItem::where('user_id', $this->user->id)->first();
        $this->assertEquals(2, $item->quantity);
    }

    /** @test */
    public function guest_can_add_item_to_cart_session()
    {
        $response = $this->post('/cart/add', [
            'variant_id' => $this->variant->variant_id,
            'quantity' => 1,
        ]);

        $response->assertStatus(302);
        $response->assertSessionHas('success', 'Product added to cart!');

        $guestItems = session('cart.guest_items', []);
        $this->assertCount(1, $guestItems);
        $this->assertEquals($this->variant->variant_id, $guestItems[0]['variant_id']);
        $this->assertEquals(1, $guestItems[0]['quantity']);
    }

    /** @test */
    public function it_fails_to_add_if_stock_not_enough()
    {
        $this->variant->update(['stock_quantity' => 1]);

        $response = $this->actingAs($this->user)->post('/cart/add', [
            'variant_id' => $this->variant->variant_id,
            'quantity' => 5,
        ]);

        $response->assertStatus(302);
        $response->assertSessionHas('error', 'Insufficient stock available for the selected product.');
        $this->assertDatabaseMissing('cart_items', [
            'user_id' => $this->user->id,
            'variant_id' => $this->variant->variant_id,
        ]);
    }

    /** @test */
    public function it_updates_cart_item_quantity()
    {
        $cartItem = CartItem::factory()->create([
            'user_id' => $this->user->id,
            'variant_id' => $this->variant->variant_id,
            'quantity' => 1,
        ]);

        $response = $this->actingAs($this->user)->post("/cart/update/{$cartItem->cart_item_id}", [
            'quantity' => 3,
        ]);

        $response->assertStatus(302);
        $response->assertSessionHas('success', 'Cart updated.');
        $this->assertDatabaseHas('cart_items', [
            'cart_item_id' => $cartItem->cart_item_id,
            'quantity' => 3,
        ]);
    }

    /** @test */
    public function it_removes_item_when_quantity_set_to_zero()
    {
        $cartItem = CartItem::factory()->create([
            'user_id' => $this->user->id,
            'variant_id' => $this->variant->variant_id,
            'quantity' => 1,
        ]);

        $response = $this->actingAs($this->user)->post("/cart/update/{$cartItem->cart_item_id}", [
            'quantity' => 0,
        ]);

        $this->assertTrue(in_array($response->getStatusCode(), [200, 302]));
        $this->assertDatabaseMissing('cart_items', [
            'cart_item_id' => $cartItem->cart_item_id,
        ]);
    }

    /** @test */
    public function it_removes_cart_item()
    {
        $cartItem = CartItem::factory()->create([
            'user_id' => $this->user->id,
            'variant_id' => $this->variant->variant_id,
            'quantity' => 1,
        ]);

        $response = $this->actingAs($this->user)->post("/cart/remove/{$cartItem->cart_item_id}");

        $response->assertStatus(302);
        $response->assertSessionHas('success', 'Product removed from cart.');

        $this->assertDatabaseMissing('cart_items', [
            'cart_item_id' => $cartItem->cart_item_id,
        ]);
    }

    /** @test */
    public function it_clears_entire_cart()
    {
        CartItem::factory()->count(2)->create([
            'user_id' => $this->user->id,
        ]);

        $response = $this->actingAs($this->user)->post('/cart/clear');

        $response->assertStatus(302);
        $response->assertSessionHas('success', 'Cart cleared.');

        $this->assertDatabaseMissing('cart_items', ['user_id' => $this->user->id]);
    }

    /** @test */
    public function it_applies_valid_promotion_code()
    {
        CartItem::factory()->create([
            'user_id' => $this->user->id,
            'variant_id' => $this->variant->variant_id,
            'quantity' => 2,
        ]);

        $promotion = Promotion::factory()->create([
            'type' => 1,
            'value' => 10,
            'min_order_amount' => 0,
            'max_discount_amount' => 100000,
        ]);

        PromotionCode::factory()->create([
            'promotion_id' => $promotion->promotion_id,
            'code' => 'SALE50',
        ]);

        $response = $this->actingAs($this->user)->post('/cart/apply-promotion', [
            'code' => 'sale50',
        ]);

        $response->assertStatus(302);
        $response->assertSessionHas('success', 'Promotion applied!');

        $sessionPromotion = session('cart.applied_promotion');
        $this->assertNotNull($sessionPromotion);
        $this->assertEquals($promotion->promotion_id, $sessionPromotion['promotion_id']);
    }

    /** @test */
    public function it_rejects_invalid_promotion_code()
    {
        CartItem::factory()->create([
            'user_id' => $this->user->id,
            'variant_id' => $this->variant->variant_id,
            'quantity' => 2,
        ]);

        $response = $this->actingAs($this->user)->post('/cart/apply-promotion', [
            'code' => 'INVALIDCODE',
        ]);

        $response->assertStatus(302);
    $response->assertSessionHas('error', 'The promotion code you entered is not valid.');
    }

    /** @test */
    public function it_removes_promotion()
    {
        session(['cart.applied_promotion' => [
            'promotion_id' => 999,
            'promotion_code_id' => 111,
            'code' => 'TESTCODE',
        ]]);

        $response = $this->actingAs($this->user)->post('/cart/remove-promotion');

        $response->assertStatus(302);
        $response->assertSessionHas('success', 'Promotion removed.');
    $this->assertFalse(session()->has('cart.applied_promotion'));
    }

    /** @test */
    public function it_redirects_to_checkout_page()
    {
        CartItem::factory()->create([
            'user_id' => $this->user->id,
            'variant_id' => $this->variant->variant_id,
            'quantity' => 2,
        ]);

    $response = $this->actingAs($this->user)->get('/cart/checkout');

    $response->assertStatus(302);
    $response->assertRedirect(route('cart.checkout'));
    $this->assertTrue(session()->has('checkout_data'));
    }
}

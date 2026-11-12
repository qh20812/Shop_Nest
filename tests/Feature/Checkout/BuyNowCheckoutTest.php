<?php

namespace Tests\Feature\Checkout;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use App\Payments\Gateways\StripeGateway;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class BuyNowCheckoutTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    private Order $order;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();

        $product = Product::factory()->create([
            'seller_id' => $this->user->id,
            'status' => 1,
        ]);

        $variant = ProductVariant::factory()->create([
            'product_id' => $product->product_id,
            'stock_quantity' => 30,
            'reserved_quantity' => 0,
        ]);

        $this->order = Order::factory()->create([
            'customer_id' => $this->user->id,
            'status' => OrderStatus::PENDING_CONFIRMATION,
            'payment_status' => PaymentStatus::UNPAID,
            'sub_total' => 150000,
            'shipping_fee' => 0,
            'discount_amount' => 0,
            'total_amount' => 150000,
            'total_amount_base' => 150000,
            'currency' => 'VND',
        ]);

        DB::table('order_items')->insert([
            'order_id' => $this->order->order_id,
            'variant_id' => $variant->variant_id,
            'quantity' => 3,
            'unit_price' => 50000,
            'total_price' => 150000,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function test_buy_now_checkout_returns_stripe_payment_url(): void
    {
        $mockGateway = \Mockery::mock(StripeGateway::class);
        $mockGateway->shouldReceive('createPayment')
            ->once()
            ->withArgs(fn (Order $order) => $order->order_id === $this->order->order_id)
            ->andReturn('https://checkout.stripe.com/buy-now-session');

        app()->instance(StripeGateway::class, $mockGateway);

        $response = $this->actingAs($this->user)
            ->postJson("/buy-now/checkout/{$this->order->order_id}", [
                'provider' => 'stripe',
            ]);

        $response->assertOk()->assertJson([
            'success' => true,
            'payment_url' => 'https://checkout.stripe.com/buy-now-session',
        ]);

        $this->assertSame(3, (int) $this->order->fresh()->payment_method);
    }

    public function test_buy_now_checkout_supports_cod(): void
    {
        $response = $this->actingAs($this->user)
            ->postJson("/buy-now/checkout/{$this->order->order_id}", [
                'provider' => 'cod',
            ]);

        $response->assertOk()->assertJson([
            'success' => true,
            'payment_url' => route('user.orders.show', $this->order->order_id),
        ]);

        $this->assertSame(1, (int) $this->order->fresh()->payment_method);
        $this->assertSame(PaymentStatus::UNPAID, $this->order->fresh()->payment_status);
    }

    public function test_buy_now_checkout_rejects_removed_providers(): void
    {
        foreach (['paypal', 'vnpay', 'momo'] as $provider) {
            $this->actingAs($this->user)
                ->postJson("/buy-now/checkout/{$this->order->order_id}", ['provider' => $provider])
                ->assertStatus(422);
        }
    }
}

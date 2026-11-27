<?php

namespace Tests\Feature\Checkout;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Promotion;
use App\Models\PromotionCode;
use App\Models\User;
use App\Models\UserAddress;
use App\Payments\Gateways\StripeGateway;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CheckoutInventoryLifecycleTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    private UserAddress $address;

    private Product $product;

    private ProductVariant $variant;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->address = UserAddress::factory()->create([
            'user_id' => $this->user->id,
            'is_default' => true,
        ]);

        $this->product = Product::factory()->create([
            'status' => 'published',
            'is_active' => true,
        ]);

        $this->variant = ProductVariant::factory()->create([
            'product_id' => $this->product->product_id,
            'price' => 100000,
            'discount_price' => null,
            'stock_quantity' => 10,
            'reserved_quantity' => 0,
            'track_inventory' => true,
            'allow_backorder' => false,
        ]);

        CartItem::factory()->for($this->user)->for($this->variant, 'variant')->create(['quantity' => 2]);
    }

    public function test_cod_checkout_commits_stock_and_clears_cart(): void
    {
        $this->actingAs($this->user)->postJson(route('checkout.store'), [
            'provider' => 'cod',
            'address_id' => $this->address->id,
        ])->assertOk();

        $order = Order::where('customer_id', $this->user->id)->firstOrFail();

        $this->assertSame(8, (int) $this->variant->fresh()->stock_quantity);
        $this->assertSame(0, (int) $this->variant->fresh()->reserved_quantity);
        $this->assertNotNull($order->inventory_committed_at);
        $this->assertDatabaseCount('cart_items', 0);
    }

    public function test_stripe_reserves_stock_until_webhook_completes_payment(): void
    {
        $this->mock(StripeGateway::class, function ($mock) {
            $mock->shouldReceive('createPayment')->once()->andReturn('https://stripe.test/session');
        });

        $this->actingAs($this->user)->postJson(route('checkout.store'), [
            'provider' => 'stripe',
            'address_id' => $this->address->id,
        ])->assertOk();

        $order = Order::where('customer_id', $this->user->id)->firstOrFail();

        $this->assertSame(10, (int) $this->variant->fresh()->stock_quantity);
        $this->assertSame(2, (int) $this->variant->fresh()->reserved_quantity);
        $this->assertNotNull($order->inventory_reserved_at);
        $this->assertDatabaseCount('cart_items', 1);

        $this->signedStripeWebhook($order, 'evt_lifecycle_1')->assertOk();
        $this->signedStripeWebhook($order, 'evt_lifecycle_1')->assertOk();

        $this->assertSame(8, (int) $this->variant->fresh()->stock_quantity);
        $this->assertSame(0, (int) $this->variant->fresh()->reserved_quantity);
        $this->assertNotNull($order->fresh()->inventory_committed_at);
        $this->assertDatabaseCount('cart_items', 0);
    }

    public function test_cancelled_stripe_return_releases_reservation_without_changing_stock(): void
    {
        $this->mock(StripeGateway::class, function ($mock) {
            $mock->shouldReceive('createPayment')->once()->andReturn('https://stripe.test/session');
        });

        $this->actingAs($this->user)->postJson(route('checkout.store'), [
            'provider' => 'stripe',
            'address_id' => $this->address->id,
        ])->assertOk();

        $order = Order::where('customer_id', $this->user->id)->firstOrFail();
        $this->assertSame(2, (int) $this->variant->fresh()->reserved_quantity);

        $this->mock(StripeGateway::class, function ($mock) use ($order) {
            $mock->shouldReceive('handleReturn')->once()->andReturn([
                'status' => 'canceled',
                'transaction_id' => null,
                'order_id' => $order->order_id,
                'message' => 'User canceled',
            ]);
        });

        $this->actingAs($this->user)->get('/payments/stripe/return?'.http_build_query([
            'order_id' => $order->order_id,
            'status' => 'cancel',
            'session_id' => 'cs_test',
        ]))->assertOk();

        $this->assertSame(10, (int) $this->variant->fresh()->stock_quantity);
        $this->assertSame(0, (int) $this->variant->fresh()->reserved_quantity);
        $this->assertDatabaseCount('cart_items', 1);

        $order->refresh();
        $this->assertSame(OrderStatus::CANCELLED, $order->status);
        $this->assertSame(PaymentStatus::FAILED, $order->payment_status);
    }

    public function test_cancelling_paid_order_restores_committed_stock(): void
    {
        $this->actingAs($this->user)->postJson(route('checkout.store'), [
            'provider' => 'cod',
            'address_id' => $this->address->id,
        ])->assertOk();

        $order = Order::where('customer_id', $this->user->id)->firstOrFail();
        $this->assertSame(8, (int) $this->variant->fresh()->stock_quantity);

        $order->update(['status' => OrderStatus::CANCELLED]);

        $this->assertSame(10, (int) $this->variant->fresh()->stock_quantity);
        $this->assertNull($order->fresh()->inventory_committed_at);
    }

    public function test_promotion_targets_only_discount_eligible_products(): void
    {
        $otherProduct = Product::factory()->create([
            'status' => 'published',
            'is_active' => true,
        ]);
        $otherVariant = ProductVariant::factory()->create([
            'product_id' => $otherProduct->product_id,
            'price' => 200000,
            'discount_price' => null,
            'stock_quantity' => 5,
        ]);

        CartItem::factory()->for($this->user)->for($otherVariant, 'variant')->create(['quantity' => 1]);

        $promotion = Promotion::factory()->create([
            'type' => 1,
            'value' => 10,
            'start_date' => now()->subDay(),
            'end_date' => now()->addDay(),
            'is_active' => true,
        ]);
        $promotion->products()->attach($this->product->product_id);

        $code = PromotionCode::factory()->create([
            'promotion_id' => $promotion->promotion_id,
            'is_active' => true,
        ]);

        $this->actingAs($this->user)
            ->withSession([
                'cart.applied_promotion' => [
                    'promotion_id' => $promotion->promotion_id,
                    'promotion_code_id' => $code->promotion_code_id,
                    'code' => $code->code,
                ],
            ])
            ->postJson(route('checkout.store'), [
                'provider' => 'cod',
                'address_id' => $this->address->id,
            ])
            ->assertOk();

        $order = Order::where('customer_id', $this->user->id)->firstOrFail();

        // 10% of the targeted 200.000 line only, not the whole 400.000 cart.
        $this->assertSame(20000.0, (float) $order->discount_amount);
    }

    public function test_buy_now_uses_discount_price_and_commits_cod_stock(): void
    {
        $this->variant->update(['discount_price' => 80000]);

        $response = $this->actingAs($this->user)->postJson(
            route('product.buy.now', ['productId' => $this->product->product_id]),
            ['variant_id' => $this->variant->variant_id, 'quantity' => 2]
        );

        $response->assertOk()->assertJson(['success' => true]);

        $order = Order::findOrFail((int) $response->json('order_id'));
        $item = $order->items()->firstOrFail();

        $this->assertSame(80000.0, (float) $item->unit_price);
        $this->assertSame(2, (int) $this->variant->fresh()->reserved_quantity);

        $this->actingAs($this->user)->postJson(route('buy.now.checkout', ['orderId' => $order->order_id]), [
            'provider' => 'cod',
            'address_id' => $this->address->id,
        ])->assertOk();

        $this->assertSame(8, (int) $this->variant->fresh()->stock_quantity);
        $this->assertSame(0, (int) $this->variant->fresh()->reserved_quantity);
        $this->assertNotNull($order->fresh()->inventory_committed_at);
    }

    public function test_cart_add_rejects_unpublished_product(): void
    {
        $draft = Product::factory()->create([
            'status' => 'draft',
            'is_active' => true,
        ]);
        $draftVariant = ProductVariant::factory()->create([
            'product_id' => $draft->product_id,
            'stock_quantity' => 5,
        ]);

        $this->actingAs($this->user)
            ->post(route('cart.add'), [
                'variant_id' => $draftVariant->variant_id,
                'quantity' => 1,
            ])
            ->assertSessionHas('error');

        $this->assertDatabaseMissing('cart_items', [
            'user_id' => $this->user->id,
            'variant_id' => $draftVariant->variant_id,
        ]);
    }

    public function test_cleanup_cancels_stale_pending_reservations(): void
    {
        $this->mock(StripeGateway::class, function ($mock) {
            $mock->shouldReceive('createPayment')->once()->andReturn('https://stripe.test/session');
        });

        $this->actingAs($this->user)->postJson(route('checkout.store'), [
            'provider' => 'stripe',
            'address_id' => $this->address->id,
        ])->assertOk();

        $order = Order::where('customer_id', $this->user->id)->firstOrFail();
        $order->forceFill(['inventory_reserved_at' => now()->subHours(25)])->save();

        $this->artisan('reservations:cleanup')->assertSuccessful();

        $this->assertSame(OrderStatus::CANCELLED, $order->fresh()->status);
        $this->assertSame(10, (int) $this->variant->fresh()->stock_quantity);
        $this->assertSame(0, (int) $this->variant->fresh()->reserved_quantity);
    }

    private function signedStripeWebhook(Order $order, string $eventId)
    {
        $payload = json_encode([
            'id' => $eventId,
            'type' => 'checkout.session.completed',
            'data' => [
                'object' => [
                    'id' => 'cs_'.$eventId,
                    'payment_intent' => 'pi_'.$order->order_id,
                    'metadata' => ['order_id' => (string) $order->order_id],
                ],
            ],
        ]);

        $timestamp = time();
        $secret = (string) config('services.stripe.webhook_secret');
        $signature = hash_hmac('sha256', $timestamp.'.'.$payload, $secret);

        return $this->call(
            'POST',
            '/webhooks/stripe',
            [],
            [],
            [],
            [
                'HTTP_STRIPE_SIGNATURE' => "t={$timestamp},v1={$signature}",
                'CONTENT_TYPE' => 'application/json',
            ],
            $payload
        );
    }
}

<?php

namespace Tests\Feature\Checkout;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Enums\ProductStatus;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use App\Models\UserAddress;
use App\Payments\Gateways\StripeGateway;
use App\Services\PaymentService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CheckoutEndToEndTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    private Product $product;

    private ProductVariant $variant;

    private int $quantity = 2;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        UserAddress::factory()->for($this->user)->create(['is_default' => true]);

        $this->product = Product::factory()->create([
            'status' => ProductStatus::PUBLISHED->value,
            'is_active' => true,
        ]);

        $this->variant = ProductVariant::factory()
            ->for($this->product, 'product')
            ->create([
                'price' => 250_000,
                'discount_price' => null,
                'stock_quantity' => 20,
            ]);

        $this->variant->forceFill([
            'reserved_quantity' => 0,
            'track_inventory' => true,
            'allow_backorder' => false,
            'minimum_stock_level' => 0,
        ])->save();

        $this->actingAs($this->user);
    }

    private function createBuyNowOrder(): Order
    {
        $response = $this->postJson(route('product.buy.now', ['productId' => $this->product->getKey()]), [
            'variant_id' => $this->variant->getKey(),
            'quantity' => $this->quantity,
        ]);

        $response->assertOk()->assertJson(['success' => true]);

        return Order::findOrFail((int) $response->json('order_id'));
    }

    private function signedStripeWebhook(Order $order, string $eventId = 'evt_e2e_1')
    {
        $payload = json_encode([
            'id' => $eventId,
            'type' => 'checkout.session.completed',
            'data' => [
                'object' => [
                    'id' => 'cs_e2e',
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

    public function test_buy_now_checkout_page_exposes_payment_methods(): void
    {
        $order = $this->createBuyNowOrder();

        $page = $this->get(route('buy.now.checkout.show', ['orderId' => $order->order_id]));

        $page->assertOk()->assertInertia(function (Assert $inertia) use ($order) {
            $inertia->component('Customer/Checkout')
                ->where('order.order_id', $order->order_id)
                ->where('paymentMethods', PaymentService::list());
        });

        $this->assertSame(['stripe', 'cod'], array_column(PaymentService::list(), 'id'));
    }

    public function test_buy_now_stripe_flow_completes_via_webhook(): void
    {
        $order = $this->createBuyNowOrder();

        $this->mock(StripeGateway::class, function ($mock) {
            $mock->shouldReceive('createPayment')
                ->once()
                ->andReturn('https://checkout.stripe.com/e2e-session');
        });

        $this->postJson(route('buy.now.checkout', ['orderId' => $order->order_id]), [
            'provider' => 'stripe',
        ])->assertOk()->assertJson([
            'success' => true,
            'payment_url' => 'https://checkout.stripe.com/e2e-session',
        ]);

        $this->assertSame(3, (int) $order->fresh()->payment_method);

        $this->signedStripeWebhook($order)->assertOk();

        $order->refresh();
        $this->assertSame(PaymentStatus::PAID, $order->payment_status);
        $this->assertSame(OrderStatus::PROCESSING, $order->status);
        $this->assertDatabaseHas('transactions', [
            'order_id' => $order->order_id,
            'gateway' => 'stripe',
            'status' => 'completed',
        ]);
    }

    public function test_buy_now_cod_flow_redirects_to_order_and_stays_unpaid(): void
    {
        $order = $this->createBuyNowOrder();

        $response = $this->postJson(route('buy.now.checkout', ['orderId' => $order->order_id]), [
            'provider' => 'cod',
        ]);

        $response->assertOk()->assertJson([
            'success' => true,
            'payment_url' => route('user.orders.show', $order->order_id),
        ]);

        $order->refresh();
        $this->assertSame(1, (int) $order->payment_method);
        $this->assertSame(PaymentStatus::UNPAID, $order->payment_status);
        $this->assertSame(OrderStatus::PENDING_CONFIRMATION, $order->status);
    }
}

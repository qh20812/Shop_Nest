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
use App\Payments\Contracts\PaymentGateway;
use App\Payments\Gateways\MomoGateway;
use App\Payments\Gateways\PaypalGateway;
use App\Payments\Gateways\StripeGateway;
use App\Payments\Gateways\VnpayGateway;
use App\Services\PaymentService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Mockery;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class CheckoutEndToEndTest extends TestCase
{
    use RefreshDatabase;

    protected function tearDown(): void
    {
        Mockery::close();

        parent::tearDown();
    }

    #[DataProvider('providerCases')]
    public function test_buy_now_checkout_flow_for_each_provider(string $provider): void
    {
    /** @var User $user */
    $user = User::factory()->create();
        UserAddress::factory()->for($user)->create(['is_default' => true]);

        $product = Product::factory()->create([
            'status' => ProductStatus::PUBLISHED->value,
            'is_active' => true,
        ]);

        $unitPrice = 250_000.0;
        $quantity = 2;
        $shippingFee = 30_000.0;
        $subtotal = $unitPrice * $quantity;
        $expectedTotal = $subtotal + $shippingFee;

        $variant = ProductVariant::factory()
            ->for($product, 'product')
            ->create([
                'price' => $unitPrice,
                'discount_price' => null,
                'stock_quantity' => 20,
            ]);

        $variant->forceFill([
            'reserved_quantity' => 0,
            'track_inventory' => true,
            'allow_backorder' => false,
            'minimum_stock_level' => 0,
        ])->save();

        $this->actingAs($user);

        $buyNowResponse = $this->postJson(route('product.buy.now', ['productId' => $product->getKey()]), [
            'variant_id' => $variant->getKey(),
            'quantity' => $quantity,
        ]);

        $buyNowResponse->assertStatus(200)->assertJson(['success' => true]);

        $orderId = (int) $buyNowResponse->json('order_id');
        $this->assertGreaterThan(0, $orderId);

        $order = Order::findOrFail($orderId);
        $this->assertSame($user->id, $order->customer_id);
        $this->assertSame(OrderStatus::PENDING_CONFIRMATION, $order->status);
        $this->assertSame(PaymentStatus::UNPAID, $order->payment_status);
        $this->assertSame('VND', $order->currency);
        $this->assertSame(1.0, (float) $order->exchange_rate);
        $this->assertSame($subtotal, (float) $order->sub_total);
        $this->assertSame($shippingFee, (float) $order->shipping_fee);
        $this->assertSame($expectedTotal, (float) $order->total_amount);
        $this->assertSame($expectedTotal, (float) $order->total_amount_base);

        $orderItem = $order->items()->first();
        $this->assertNotNull($orderItem);
        $this->assertSame($variant->getKey(), $orderItem->variant_id);
        $this->assertSame($quantity, (int) $orderItem->quantity);
        $this->assertSame($unitPrice, (float) $orderItem->unit_price);

        $checkoutPage = $this->get(route('buy.now.checkout.show', ['orderId' => $orderId]));
        $checkoutPage->assertStatus(200);
        $checkoutPage->assertInertia(function (Assert $page) use ($order, $variant, $shippingFee, $subtotal, $expectedTotal, $quantity, $unitPrice) {
            $page->component('Customer/Checkout')
                ->where('order.order_id', $order->order_id)
                ->where('totals.subtotal', fn ($value) => (float) $value === $subtotal)
                ->where('totals.shipping_fee', fn ($value) => (float) $value === $shippingFee)
                ->where('totals.total', fn ($value) => (float) $value === $expectedTotal)
                ->where('paymentMethods', PaymentService::list())
                ->where('orderItems', function ($items) use ($variant, $quantity, $unitPrice, $subtotal) {
                    return count($items) === 1
                        && (int) $items[0]['variant_id'] === $variant->getKey()
                        && (int) $items[0]['quantity'] === $quantity
                        && (float) $items[0]['unit_price'] === $unitPrice
                        && (float) $items[0]['total_price'] === $subtotal;
                });
        });

        $fakeGateway = $this->bindFakeGateway($provider);

        $paymentResponse = $this->postJson(route('buy.now.checkout', ['orderId' => $orderId]), [
            'provider' => $provider,
        ]);

        $paymentResponse->assertStatus(200)->assertJson([
            'success' => true,
            'payment_url' => $fakeGateway->urlFor($orderId),
        ]);

        $this->assertDatabaseHas('transactions', [
            'order_id' => $orderId,
            'gateway' => $provider,
            'status' => 'pending',
        ]);

        $returnResponse = $this->get("/payments/{$provider}/return?order_id={$orderId}&status=success");
        $returnResponse->assertStatus(200);
        $returnResponse->assertInertia(function (Assert $page) use ($provider) {
            $page->component('Customer/PaymentResult')
                ->where('provider', $provider)
                ->where('status', 'processing');
        });

        $order->refresh();
        $this->assertSame(PaymentStatus::UNPAID, $order->payment_status);
        $this->assertSame(OrderStatus::PENDING_CONFIRMATION, $order->status);

        $this->assertDatabaseHas('transactions', [
            'order_id' => $orderId,
            'gateway' => $provider,
            'status' => 'pending',
            'gateway_transaction_id' => $fakeGateway->returnIdFor($orderId),
        ]);

        $captureResponse = $this->triggerWebhook($provider, $orderId);
        $captureResponse->assertStatus(200);

        $order->refresh();
        $this->assertSame(PaymentStatus::PAID, $order->payment_status);
        $this->assertSame(OrderStatus::PROCESSING, $order->status);

        $expectedCaptureId = $provider === 'stripe'
            ? "pi_{$orderId}"
            : $fakeGateway->captureIdFor($orderId);

        $this->assertSame($expectedCaptureId, $order->payment_transaction_id);

        $this->assertDatabaseHas('transactions', [
            'order_id' => $orderId,
            'gateway' => $provider,
            'status' => 'completed',
            'gateway_transaction_id' => $expectedCaptureId,
        ]);

        $variant->refresh();
        $this->assertSame(20 - $quantity, (int) $variant->stock_quantity);

        $this->assertDatabaseHas('inventory_logs', [
            'variant_id' => $variant->getKey(),
            'quantity_change' => -$quantity,
            'reason' => 'Order fulfillment',
        ]);
    }

    public static function providerCases(): array
    {
        return [
            'Stripe' => ['stripe'],
            'PayPal' => ['paypal'],
            'VNPay' => ['vnpay'],
            'MoMo' => ['momo'],
        ];
    }

    private function bindFakeGateway(string $provider): FakeGateway
    {
        $fake = new FakeGateway($provider);

        $class = match ($provider) {
            'stripe' => StripeGateway::class,
            'paypal' => PaypalGateway::class,
            'vnpay' => VnpayGateway::class,
            'momo' => MomoGateway::class,
            default => throw new \InvalidArgumentException("Unsupported provider {$provider}"),
        };

        $this->app->instance($class, $fake);

        return $fake;
    }

    private function triggerWebhook(string $provider, int $orderId)
    {
        $eventId = "evt-{$provider}-{$orderId}";

        return match ($provider) {
            'stripe' => $this->dispatchStripeWebhook($orderId, $eventId),
            'paypal' => $this->postJson(route('webhooks.paypal'), [
                'order_id' => (string) $orderId,
                'event_id' => $eventId,
            ]),
            'vnpay' => $this->postJson(route('webhooks.vnpay'), [
                'order_id' => (string) $orderId,
                'event_id' => $eventId,
            ]),
            'momo' => $this->postJson(route('webhooks.momo'), [
                'order_id' => (string) $orderId,
                'event_id' => $eventId,
            ]),
            default => throw new \InvalidArgumentException("Unsupported provider {$provider}"),
        };
    }

    private function dispatchStripeWebhook(int $orderId, string $eventId)
    {
        Mockery::mock('alias:Stripe\\Webhook')
            ->shouldReceive('constructEvent')
            ->once()
            ->andReturn((object) [
                'id' => $eventId,
                'type' => 'checkout.session.completed',
                'data' => (object) [
                    'object' => (object) [
                        'metadata' => (object) ['order_id' => (string) $orderId],
                        'payment_intent' => "pi_{$orderId}",
                    ],
                ],
            ]);

        config()->set('services.stripe.webhook_secret', 'whsec_test');

        return $this->postJson(route('webhooks.stripe'), [
            'id' => $eventId,
            'type' => 'checkout.session.completed',
            'data' => [
                'object' => [
                    'metadata' => ['order_id' => (string) $orderId],
                    'payment_intent' => "pi_{$orderId}",
                ],
            ],
        ], [
            'Stripe-Signature' => 'sig_test',
        ]);
    }
}

/**
 * Lightweight payment gateway fake that mirrors the create/return/webhook lifecycle.
 */
final class FakeGateway implements PaymentGateway
{
    private array $orderTotals = [];

    public function __construct(private string $provider) {}

    public function createPayment(Order $order): string
    {
        $this->orderTotals[$order->order_id] = (float) $order->total_amount;

        $order->transactions()->updateOrCreate(
            ['type' => 'payment', 'gateway' => $this->provider],
            [
                'amount' => (float) $order->total_amount,
                'currency' => $order->currency ?? 'VND',
                'status' => 'pending',
                'raw_payload' => ['stage' => 'created'],
            ]
        );

        return $this->urlFor($order->order_id);
    }

    public function handleReturn(array $payload): array
    {
        $orderId = (int) ($payload['order_id'] ?? 0);

        return [
            'status' => 'processing',
            'transaction_id' => $this->returnIdFor($orderId),
            'order_id' => $orderId > 0 ? (string) $orderId : null,
            'message' => 'Awaiting provider confirmation',
            'amount' => $this->orderTotals[$orderId] ?? null,
            'currency' => 'VND',
        ];
    }

    public function handleWebhook(array $payload, ?string $signature = null): array
    {
        $orderId = (int) ($payload['order_id'] ?? 0);

        return [
            'status' => 'succeeded',
            'transaction_id' => $this->captureIdFor($orderId),
            'order_id' => $orderId > 0 ? (string) $orderId : null,
            'event_id' => $payload['event_id'] ?? $this->eventIdFor($orderId),
            'amount' => $this->orderTotals[$orderId] ?? null,
            'currency' => 'VND',
            'message' => 'Payment captured',
        ];
    }

    public function urlFor(int $orderId): string
    {
        return "https://{$this->provider}.example/checkout/{$orderId}";
    }

    public function returnIdFor(int $orderId): string
    {
        return "{$this->provider}-return-{$orderId}";
    }

    public function captureIdFor(int $orderId): string
    {
        return "{$this->provider}-capture-{$orderId}";
    }

    public function eventIdFor(int $orderId): string
    {
        return "{$this->provider}-event-{$orderId}";
    }
}

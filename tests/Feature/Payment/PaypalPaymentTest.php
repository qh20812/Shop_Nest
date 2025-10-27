<?php

namespace Tests\Feature\Payment;

use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Tests\TestCase;

class PaypalPaymentTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private Order $order;
    private Product $product;
    private ProductVariant $variant;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->product = Product::factory()->create(['seller_id' => $this->user->id]);
        $this->variant = ProductVariant::factory()->create([
            'product_id' => $this->product->product_id,
            'stock_quantity' => 10,
            'reserved_quantity' => 2,
            'track_inventory' => true,
            'allow_backorder' => false,
        ]);

        $this->order = Order::factory()->create([
            'customer_id' => $this->user->id,
            'payment_status' => PaymentStatus::UNPAID,
            'total_amount' => 300.00,
            'currency' => 'VND',
        ]);

        DB::table('order_items')->insert([
            'order_id' => $this->order->order_id,
            'variant_id' => $this->variant->variant_id,
            'quantity' => 3,
            'unit_price' => 100.00,
            'total_price' => 300.00,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        Log::shouldReceive('info', 'warning', 'error')->andReturnNull();
    }

    public function test_paypal_payment_creation()
    {
        Http::fake([
            '*/v2/checkout/orders' => Http::response([
                'id' => 'PAYPAL_ORDER_123',
                'status' => 'CREATED',
                'links' => [
                    ['rel' => 'approve', 'href' => 'https://www.sandbox.paypal.com/checkoutnow?token=PAYPAL_ORDER_123'],
                    ['rel' => 'self', 'href' => 'https://api.sandbox.paypal.com/v2/checkout/orders/PAYPAL_ORDER_123'],
                ],
            ], 201),
        ]);

        $gateway = app(\App\Payments\Gateways\PaypalGateway::class);
        $url = $gateway->createPayment($this->order);

        $this->assertStringContainsString('paypal.com', $url);
        $this->assertStringContainsString('token=PAYPAL_ORDER_123', $url);
    }

    public function test_paypal_payment_return_success()
    {
        $this->actingAs($this->user);

        Http::fake([
            '*/v2/checkout/orders/*' => Http::response([
                'id' => 'PAYPAL_ORDER_123',
                'status' => 'COMPLETED',
                'purchase_units' => [
                    [
                        'reference_id' => (string) $this->order->order_id,
                        'payments' => [
                            'captures' => [
                                ['id' => 'CAPTURE_123'],
                            ],
                        ],
                    ],
                ],
            ], 200),
        ]);

        $response = $this->get("/payments/paypal/return?order_id={$this->order->order_id}&token=PAYPAL_ORDER_123");

        $response->assertStatus(200);

        $this->assertDatabaseHas('transactions', [
            'order_id' => $this->order->order_id,
            'gateway' => 'paypal',
            'status' => 'completed',
            'gateway_transaction_id' => 'CAPTURE_123',
        ]);

        $this->order->refresh();
        $this->assertEquals(PaymentStatus::PAID, $this->order->payment_status);
    }

    public function test_paypal_payment_return_canceled()
    {
        $this->actingAs($this->user);

        $response = $this->get("/payments/paypal/return?order_id={$this->order->order_id}&status=cancel");

        $response->assertStatus(200);

        $this->assertDatabaseHas('transactions', [
            'order_id' => $this->order->order_id,
            'gateway' => 'paypal',
            'status' => 'canceled',
        ]);

        $this->order->refresh();
        $this->assertEquals(PaymentStatus::UNPAID, $this->order->payment_status);
    }

    public function test_paypal_webhook_capture_completed()
    {
        Log::shouldReceive('info')
            ->once()
            ->with('webhooks.payment.processed', [
                'provider' => 'paypal',
                'order_id' => $this->order->order_id,
                'status' => 'succeeded',
            ]);

        $payload = [
            'id' => 'WH_EVENT_123',
            'event_type' => 'PAYMENT.CAPTURE.COMPLETED',
            'resource' => [
                'id' => 'CAPTURE_456',
                'custom_id' => (string) $this->order->order_id,
            ],
        ];

        $response = $this->postJson('/webhooks/paypal', $payload);

        $response->assertStatus(200);

        $this->assertDatabaseHas('transactions', [
            'order_id' => $this->order->order_id,
            'gateway' => 'paypal',
            'status' => 'completed',
            'gateway_transaction_id' => 'CAPTURE_456',
            'gateway_event_id' => 'WH_EVENT_123',
        ]);

        $this->variant->refresh();
        $this->assertEquals(7, $this->variant->stock_quantity);
    }

    public function test_paypal_webhook_checkout_order_completed()
    {
        Log::shouldReceive('info')
            ->once()
            ->with('webhooks.payment.processed', [
                'provider' => 'paypal',
                'order_id' => $this->order->order_id,
                'status' => 'succeeded',
            ]);

        $payload = [
            'id' => 'WH_EVENT_789',
            'event_type' => 'CHECKOUT.ORDER.COMPLETED',
            'resource' => [
                'id' => 'ORDER_789',
                'purchase_units' => [
                    [
                        'reference_id' => (string) $this->order->order_id,
                        'payments' => [
                            'captures' => [
                                ['id' => 'CAPTURE_789'],
                            ],
                        ],
                    ],
                ],
            ],
        ];

        $response = $this->postJson('/webhooks/paypal', $payload);

        $response->assertStatus(200);

        $this->assertDatabaseHas('transactions', [
            'order_id' => $this->order->order_id,
            'gateway' => 'paypal',
            'status' => 'completed',
            'gateway_transaction_id' => 'CAPTURE_789',
        ]);
    }

    public function test_paypal_webhook_payment_denied()
    {
        $payload = [
            'id' => 'WH_EVENT_DENIED',
            'event_type' => 'PAYMENT.CAPTURE.DENIED',
            'resource' => [
                'id' => 'CAPTURE_DENIED',
            ],
        ];

        $response = $this->postJson('/webhooks/paypal', $payload);

        $response->assertStatus(200);

        // Transaction should be created with failed status
        $this->assertDatabaseHas('transactions', [
            'gateway' => 'paypal',
            'status' => 'failed',
        ]);
    }

    public function test_paypal_webhook_duplicate_event()
    {
        Transaction::create([
            'order_id' => $this->order->order_id,
            'type' => 'payment',
            'amount' => 300.00,
            'currency' => 'USD',
            'gateway' => 'paypal',
            'status' => 'completed',
            'gateway_event_id' => 'WH_DUPLICATE',
        ]);

        Log::shouldReceive('info')
            ->once()
            ->with('webhooks.payment.duplicate_event', [
                'provider' => 'paypal',
                'order_id' => $this->order->order_id,
                'event_id' => 'WH_DUPLICATE',
            ]);

        $payload = [
            'id' => 'WH_DUPLICATE',
            'event_type' => 'PAYMENT.CAPTURE.COMPLETED',
            'resource' => [
                'id' => 'CAPTURE_DUP',
                'custom_id' => (string) $this->order->order_id,
            ],
        ];

        $response = $this->postJson('/webhooks/paypal', $payload);

        $response->assertStatus(200);

        $this->assertEquals(1, Transaction::where('gateway_event_id', 'WH_DUPLICATE')->count());
    }
}

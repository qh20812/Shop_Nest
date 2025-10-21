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
use Illuminate\Support\Facades\Log;
use Tests\TestCase;

class PaymentWebhookTest extends TestCase
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
        ]);

        // Create order item
        DB::table('order_items')->insert([
            'order_id' => $this->order->order_id,
            'variant_id' => $this->variant->variant_id,
            'quantity' => 3,
            'unit_price' => 100.00,
            'total_price' => 300.00,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function test_stripe_checkout_session_completed_webhook()
    {
        Log::shouldReceive('info')
            ->once()
            ->with('webhooks.payment.completed', [
                'provider' => 'stripe',
                'order_id' => $this->order->order_id,
                'event_id' => 'evt_test_webhook',
            ]);

        $payload = [
            'id' => 'evt_test_webhook',
            'object' => 'event',
            'type' => 'checkout.session.completed',
            'data' => [
                'object' => [
                    'id' => 'cs_test_session',
                    'object' => 'checkout.session',
                    'payment_intent' => 'pi_test_intent',
                    'metadata' => [
                        'order_id' => (string) $this->order->order_id,
                    ],
                ],
            ],
        ];

        $signature = $this->generateStripeSignature($payload);

        $response = $this->postJson('/webhooks/stripe', $payload, [
            'Stripe-Signature' => $signature,
        ]);

        $response->assertStatus(200)
                ->assertContent('OK');

        // Check transaction was created
        $this->assertDatabaseHas('transactions', [
            'order_id' => $this->order->order_id,
            'gateway' => 'stripe',
            'status' => 'completed',
            'gateway_transaction_id' => 'pi_test_intent',
            'gateway_event_id' => 'evt_test_webhook',
        ]);

        // Check inventory was adjusted
        $this->variant->refresh();
        $this->assertEquals(7, $this->variant->stock_quantity); // 10 - 3
    }

    public function test_stripe_payment_intent_succeeded_webhook()
    {
        Log::shouldReceive('info')
            ->once()
            ->with('webhooks.payment.completed', [
                'provider' => 'stripe',
                'order_id' => $this->order->order_id,
                'event_id' => 'evt_test_intent',
            ]);

        $payload = [
            'id' => 'evt_test_intent',
            'object' => 'event',
            'type' => 'payment_intent.succeeded',
            'data' => [
                'object' => [
                    'id' => 'pi_test_intent',
                    'object' => 'payment_intent',
                    'metadata' => [
                        'order_id' => (string) $this->order->order_id,
                    ],
                ],
            ],
        ];

        $signature = $this->generateStripeSignature($payload);

        $response = $this->postJson('/webhooks/stripe', $payload, [
            'Stripe-Signature' => $signature,
        ]);

        $response->assertStatus(200)
                ->assertContent('OK');

        $this->assertDatabaseHas('transactions', [
            'order_id' => $this->order->order_id,
            'gateway' => 'stripe',
            'status' => 'completed',
            'gateway_transaction_id' => 'pi_test_intent',
            'gateway_event_id' => 'evt_test_intent',
        ]);
    }

    public function test_duplicate_stripe_webhook_is_ignored()
    {
        // First webhook
        Transaction::create([
            'order_id' => $this->order->order_id,
            'type' => 'payment',
            'amount' => 300.00,
            'currency' => 'USD',
            'gateway' => 'stripe',
            'status' => 'completed',
            'gateway_event_id' => 'evt_duplicate',
        ]);

        Log::shouldReceive('info')
            ->once()
            ->with('webhooks.payment.duplicate_event', [
                'provider' => 'stripe',
                'order_id' => $this->order->order_id,
                'event_id' => 'evt_duplicate',
            ]);

        $payload = [
            'id' => 'evt_duplicate',
            'object' => 'event',
            'type' => 'checkout.session.completed',
            'data' => [
                'object' => [
                    'id' => 'cs_test_session',
                    'payment_intent' => 'pi_test_intent',
                    'metadata' => [
                        'order_id' => (string) $this->order->order_id,
                    ],
                ],
            ],
        ];

        $signature = $this->generateStripeSignature($payload);

        $response = $this->postJson('/webhooks/stripe', $payload, [
            'Stripe-Signature' => $signature,
        ]);

        $response->assertStatus(200);

        // Should only have one transaction
        $this->assertEquals(1, Transaction::where('gateway_event_id', 'evt_duplicate')->count());
    }

    public function test_insufficient_inventory_throws_exception()
    {
        // Set stock to less than ordered
        $this->variant->update(['stock_quantity' => 2, 'reserved_quantity' => 0]);

        $payload = [
            'id' => 'evt_test_webhook',
            'object' => 'event',
            'type' => 'checkout.session.completed',
            'data' => [
                'object' => [
                    'id' => 'cs_test_session',
                    'payment_intent' => 'pi_test_intent',
                    'metadata' => [
                        'order_id' => (string) $this->order->order_id,
                    ],
                ],
            ],
        ];

        $signature = $this->generateStripeSignature($payload);

        $response = $this->postJson('/webhooks/stripe', $payload, [
            'Stripe-Signature' => $signature,
        ]);

        $response->assertStatus(200); // Webhook still returns OK, but transaction rolled back

        // Transaction should not be created due to rollback
        $this->assertDatabaseMissing('transactions', [
            'order_id' => $this->order->order_id,
            'gateway_event_id' => 'evt_test_webhook',
        ]);
    }

    public function test_invalid_stripe_signature_returns_400()
    {
        $payload = ['id' => 'evt_test'];

        $response = $this->postJson('/webhooks/stripe', $payload, [
            'Stripe-Signature' => 'invalid_signature',
        ]);

        $response->assertStatus(400)
                ->assertContent('Invalid');
    }

    public function test_unsupported_event_type_is_ignored()
    {
        $payload = [
            'id' => 'evt_ignored',
            'object' => 'event',
            'type' => 'unsupported.event',
            'data' => ['object' => []],
        ];

        $signature = $this->generateStripeSignature($payload);

        $response = $this->postJson('/webhooks/stripe', $payload, [
            'Stripe-Signature' => $signature,
        ]);

        $response->assertStatus(200)
                ->assertContent('Ignored');
    }

    private function generateStripeSignature(array $payload): string
    {
        $secret = config('services.stripe.webhook_secret');
        $timestamp = time();
        $signedPayload = $timestamp . '.' . json_encode($payload);
        $signature = hash_hmac('sha256', $signedPayload, $secret);

        return "t={$timestamp},v1={$signature}";
    }
}
<?php

namespace Tests\Feature\Payment;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use App\Models\UserAddress;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class PaymentWebhookTest extends TestCase
{
    use RefreshDatabase;

    private Order $order;

    protected function setUp(): void
    {
        parent::setUp();

        $user = User::factory()->create();
        $address = UserAddress::factory()->create(['user_id' => $user->id]);

        $this->order = Order::factory()->create([
            'customer_id' => $user->id,
            'shipping_address_id' => $address->id,
            'status' => OrderStatus::PENDING_CONFIRMATION,
            'payment_status' => PaymentStatus::UNPAID,
            'payment_method' => 3,
            'currency' => 'VND',
        ]);

        OrderItem::factory()->create(['order_id' => $this->order->order_id]);
    }

    private function eventPayload(string $eventId = 'evt_test_1'): array
    {
        return [
            'id' => $eventId,
            'type' => 'checkout.session.completed',
            'data' => [
                'object' => [
                    'id' => 'cs_test_123',
                    'payment_intent' => 'pi_test_123',
                    'metadata' => ['order_id' => (string) $this->order->order_id],
                ],
            ],
        ];
    }

    private function signedHeader(string $payload): string
    {
        $secret = (string) config('services.stripe.webhook_secret');
        $timestamp = time();
        $signature = hash_hmac('sha256', $timestamp.'.'.$payload, $secret);

        return "t={$timestamp},v1={$signature}";
    }

    #[Test]
    public function valid_signature_marks_order_paid(): void
    {
        $payload = json_encode($this->eventPayload());

        $response = $this->call(
            'POST',
            '/webhooks/stripe',
            [],
            [],
            [],
            ['HTTP_STRIPE_SIGNATURE' => $this->signedHeader($payload), 'CONTENT_TYPE' => 'application/json'],
            $payload
        );

        $response->assertOk();

        $this->assertSame(PaymentStatus::PAID, $this->order->fresh()->payment_status);
        $this->assertDatabaseHas('transactions', [
            'order_id' => $this->order->order_id,
            'gateway' => 'stripe',
            'gateway_event_id' => 'evt_test_1',
            'status' => 'completed',
        ]);
    }

    #[Test]
    public function invalid_signature_is_rejected(): void
    {
        $payload = json_encode($this->eventPayload());

        $response = $this->call(
            'POST',
            '/webhooks/stripe',
            [],
            [],
            [],
            ['HTTP_STRIPE_SIGNATURE' => 't='.time().',v1=deadbeef', 'CONTENT_TYPE' => 'application/json'],
            $payload
        );

        $response->assertStatus(400);
        $this->assertSame(PaymentStatus::UNPAID, $this->order->fresh()->payment_status);
    }

    #[Test]
    public function missing_signature_is_rejected(): void
    {
        $response = $this->postJson('/webhooks/stripe', $this->eventPayload());

        $response->assertStatus(400);
        $this->assertSame(PaymentStatus::UNPAID, $this->order->fresh()->payment_status);
    }

    #[Test]
    public function unsupported_event_is_ignored(): void
    {
        $payload = json_encode([
            'id' => 'evt_other',
            'type' => 'customer.created',
            'data' => ['object' => []],
        ]);

        $response = $this->call(
            'POST',
            '/webhooks/stripe',
            [],
            [],
            [],
            ['HTTP_STRIPE_SIGNATURE' => $this->signedHeader($payload), 'CONTENT_TYPE' => 'application/json'],
            $payload
        );

        $response->assertOk();
        $this->assertSame(PaymentStatus::UNPAID, $this->order->fresh()->payment_status);
    }

    #[Test]
    public function duplicate_event_is_idempotent(): void
    {
        $payload = json_encode($this->eventPayload('evt_duplicate'));
        $headers = [
            'HTTP_STRIPE_SIGNATURE' => $this->signedHeader($payload),
            'CONTENT_TYPE' => 'application/json',
        ];

        $this->call('POST', '/webhooks/stripe', [], [], [], $headers, $payload)->assertOk();
        $this->call('POST', '/webhooks/stripe', [], [], [], $headers, $payload)->assertOk();

        $this->assertDatabaseCount('transactions', 1);
    }
}

<?php

namespace Tests\Feature\Payment;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\User;
use App\Models\UserAddress;
use App\Payments\Gateways\StripeGateway;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class PaymentReturnTest extends TestCase
{
    use RefreshDatabase;

    private function makeOrder(): array
    {
        $user = User::factory()->create();
        $address = UserAddress::factory()->create(['user_id' => $user->id]);

        $order = Order::factory()->create([
            'customer_id' => $user->id,
            'shipping_address_id' => $address->id,
            'status' => OrderStatus::PENDING_CONFIRMATION,
            'payment_status' => PaymentStatus::UNPAID,
            'payment_method' => 3,
            'currency' => 'VND',
        ]);

        return [$user, $order];
    }

    private function mockReturn(array $result): void
    {
        $this->mock(StripeGateway::class, function ($mock) use ($result) {
            $mock->shouldReceive('handleReturn')->once()->andReturn($result);
        });
    }

    #[Test]
    public function successful_payment_marks_order_as_paid(): void
    {
        [$user, $order] = $this->makeOrder();

        $this->mockReturn([
            'status' => 'succeeded',
            'transaction_id' => 'pi_test_123',
            'order_id' => $order->order_id,
            'message' => 'Checkout completed',
        ]);

        $response = $this->actingAs($user)->get('/payments/stripe/return?'.http_build_query([
            'order_id' => $order->order_id,
            'status' => 'success',
            'session_id' => 'cs_test_123',
        ]));

        $response->assertOk();

        $order->refresh();
        $this->assertSame(PaymentStatus::PAID, $order->payment_status);
        $this->assertSame(OrderStatus::PROCESSING, $order->status);
        $this->assertSame('pi_test_123', $order->payment_transaction_id);

        $this->assertDatabaseHas('transactions', [
            'order_id' => $order->order_id,
            'gateway' => 'stripe',
            'status' => 'completed',
        ]);
    }

    #[Test]
    public function unverified_session_keeps_order_unpaid(): void
    {
        [$user, $order] = $this->makeOrder();

        $this->mockReturn([
            'status' => 'pending',
            'transaction_id' => null,
            'order_id' => $order->order_id,
            'message' => 'Payment has not been completed',
        ]);

        $this->actingAs($user)->get('/payments/stripe/return?'.http_build_query([
            'order_id' => $order->order_id,
            'status' => 'success',
        ]))->assertOk();

        $order->refresh();
        $this->assertSame(PaymentStatus::UNPAID, $order->payment_status);
    }

    #[Test]
    public function failed_payment_creates_refund_transaction(): void
    {
        [$user, $order] = $this->makeOrder();

        $this->mockReturn([
            'status' => 'failed',
            'transaction_id' => null,
            'order_id' => $order->order_id,
            'message' => 'Order mismatch',
        ]);

        $this->actingAs($user)->get('/payments/stripe/return?'.http_build_query([
            'order_id' => $order->order_id,
            'status' => 'success',
            'session_id' => 'cs_mismatch',
        ]))->assertOk();

        $order->refresh();
        $this->assertSame(PaymentStatus::FAILED, $order->payment_status);

        $this->assertDatabaseHas('transactions', [
            'order_id' => $order->order_id,
            'type' => 'refund',
            'status' => 'completed',
        ]);
    }

    #[Test]
    public function canceled_payment_marks_order_failed(): void
    {
        [$user, $order] = $this->makeOrder();

        $this->mockReturn([
            'status' => 'canceled',
            'transaction_id' => null,
            'order_id' => $order->order_id,
            'message' => 'User canceled',
        ]);

        $this->actingAs($user)->get('/payments/stripe/return?'.http_build_query([
            'order_id' => $order->order_id,
            'status' => 'cancel',
        ]))->assertOk();

        $this->assertSame(PaymentStatus::FAILED, $order->fresh()->payment_status);
    }

    #[Test]
    public function removed_providers_are_rejected_gracefully(): void
    {
        [$user, $order] = $this->makeOrder();

        $this->actingAs($user)->get('/payments/paypal/return?'.http_build_query([
            'order_id' => $order->order_id,
            'status' => 'success',
        ]))->assertOk();

        $this->assertSame(PaymentStatus::UNPAID, $order->fresh()->payment_status);
    }

    #[Test]
    public function missing_order_id_does_not_change_any_order(): void
    {
        $this->get('/payments/stripe/return')->assertOk();

        $this->assertDatabaseCount('transactions', 0);
    }
}

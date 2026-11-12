<?php

namespace Tests\Unit\Payments;

use App\Payments\Gateways\StripeGateway;
use PHPUnit\Framework\Attributes\Test;
use RuntimeException;
use Stripe\StripeClient;
use Tests\TestCase;

class StripeGatewayReturnTest extends TestCase
{
    /**
     * @param  array<string, mixed>  $session
     */
    private function gatewayWithSession(?array $session = null, ?RuntimeException $error = null): StripeGateway
    {
        return new class(new StripeClient('sk_test_fake'), $session, $error) extends StripeGateway
        {
            public function __construct(
                StripeClient $stripe,
                private ?array $session,
                private ?RuntimeException $error,
            ) {
                parent::__construct($stripe);
            }

            protected function retrieveSession(string $sessionId): object
            {
                if ($this->error) {
                    throw $this->error;
                }

                return (object) $this->session;
            }
        };
    }

    #[Test]
    public function paid_session_is_accepted(): void
    {
        $gateway = $this->gatewayWithSession([
            'payment_status' => 'paid',
            'payment_intent' => 'pi_123',
            'metadata' => (object) ['order_id' => '42'],
        ]);

        $result = $gateway->handleReturn([
            'status' => 'success',
            'session_id' => 'cs_test_123',
            'order_id' => '42',
        ]);

        $this->assertSame('succeeded', $result['status']);
        $this->assertSame('pi_123', $result['transaction_id']);
        $this->assertSame('42', $result['order_id']);
    }

    #[Test]
    public function unpaid_session_stays_pending(): void
    {
        $gateway = $this->gatewayWithSession([
            'payment_status' => 'unpaid',
            'payment_intent' => null,
            'metadata' => (object) ['order_id' => '42'],
        ]);

        $result = $gateway->handleReturn([
            'status' => 'success',
            'session_id' => 'cs_test_unpaid',
            'order_id' => '42',
        ]);

        $this->assertSame('pending', $result['status']);
    }

    #[Test]
    public function success_without_session_id_is_never_trusted(): void
    {
        $gateway = $this->gatewayWithSession();

        $result = $gateway->handleReturn([
            'status' => 'success',
            'order_id' => '42',
        ]);

        $this->assertSame('pending', $result['status']);
    }

    #[Test]
    public function order_mismatch_is_rejected(): void
    {
        $gateway = $this->gatewayWithSession([
            'payment_status' => 'paid',
            'payment_intent' => 'pi_123',
            'metadata' => (object) ['order_id' => '99'],
        ]);

        $result = $gateway->handleReturn([
            'status' => 'success',
            'session_id' => 'cs_test_123',
            'order_id' => '42',
        ]);

        $this->assertSame('failed', $result['status']);
    }

    #[Test]
    public function canceled_status_returns_canceled(): void
    {
        $gateway = $this->gatewayWithSession();

        $result = $gateway->handleReturn(['status' => 'cancel', 'order_id' => '42']);

        $this->assertSame('canceled', $result['status']);
    }

    #[Test]
    public function stripe_api_failure_returns_failed(): void
    {
        $gateway = $this->gatewayWithSession(null, new RuntimeException('stripe down'));

        $result = $gateway->handleReturn([
            'status' => 'success',
            'session_id' => 'cs_test_123',
            'order_id' => '42',
        ]);

        $this->assertSame('failed', $result['status']);
    }
}

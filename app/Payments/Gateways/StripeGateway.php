<?php

namespace App\Payments\Gateways;

use App\Models\Order;
use App\Payments\Contracts\PaymentGateway;
use App\Payments\PaymentConstants;
use App\Services\ExchangeRateService;
use Stripe\StripeClient;
use Throwable;

class StripeGateway implements PaymentGateway
{
    /**
     * Stripe treats these currencies as zero-decimal (the amount is already the smallest unit).
     */
    private const ZERO_DECIMAL_CURRENCIES = [
        'bif', 'clp', 'djf', 'gnf', 'jpy', 'kmf', 'krw', 'mga',
        'pyg', 'rwf', 'ugx', 'vnd', 'vuv', 'xaf', 'xof', 'xpf',
    ];

    public function __construct(private StripeClient $stripe) {}

    public function createPayment(Order $order): string
    {
        $order->loadMissing('items.variant.product');
        $targetCurrency = strtolower(config('services.stripe.currency', 'USD'));
        $sourceCurrency = strtoupper($order->currency ?? 'VND');

        $multiplier = in_array($targetCurrency, self::ZERO_DECIMAL_CURRENCIES, true)
            ? 1
            : PaymentConstants::CENTS_MULTIPLIER;

        $lineItems = $order->items->map(function ($item) use ($sourceCurrency, $targetCurrency, $multiplier) {
            $unitAmount = ExchangeRateService::convert(
                (float) $item->unit_price,
                $sourceCurrency,
                strtoupper($targetCurrency)
            );

            $amountCents = (int) round($unitAmount * $multiplier);

            return [
                'price_data' => [
                    'currency' => $targetCurrency,
                    'product_data' => ['name' => $item->variant?->product?->name ?? 'Order Item'],
                    'unit_amount' => $amountCents,
                ],
                'quantity' => (int) $item->quantity,
            ];
        })->values()->toArray();

        $session = $this->stripe->checkout->sessions->create([
            'mode' => 'payment',
            'success_url' => url('/payments/stripe/return?status=success&order_id='.$order->order_id.'&session_id={CHECKOUT_SESSION_ID}'),
            'cancel_url' => url('/payments/stripe/return?status=cancel&order_id='.$order->order_id),
            'line_items' => $lineItems,
            'metadata' => ['order_id' => (string) $order->order_id],
        ]);

        return $session->url;
    }

    /**
     * Verify the checkout session with Stripe before trusting the redirect. A success
     * redirect alone must never mark an order as paid.
     */
    public function handleReturn(array $payload): array
    {
        $status = strtolower((string) ($payload['status'] ?? 'cancel'));
        $sessionId = $payload['session_id'] ?? null;
        $orderId = $payload['order_id'] ?? null;

        if (in_array($status, ['cancel', 'canceled'], true)) {
            return [
                'status' => 'canceled',
                'transaction_id' => null,
                'order_id' => $orderId,
                'message' => 'User canceled',
            ];
        }

        if (! in_array($status, ['success', 'succeeded'], true)) {
            return [
                'status' => 'failed',
                'transaction_id' => null,
                'order_id' => $orderId,
                'message' => 'Unknown status',
            ];
        }

        if (! $sessionId) {
            return [
                'status' => 'pending',
                'transaction_id' => null,
                'order_id' => $orderId,
                'message' => 'Missing checkout session; awaiting webhook confirmation',
            ];
        }

        try {
            $session = $this->retrieveSession($sessionId);
        } catch (Throwable $exception) {
            return [
                'status' => 'failed',
                'transaction_id' => null,
                'order_id' => $orderId,
                'message' => 'Unable to verify checkout session',
            ];
        }

        $sessionOrderId = $session->metadata->order_id ?? null;

        if ($orderId !== null && $sessionOrderId !== null && (string) $orderId !== (string) $sessionOrderId) {
            return [
                'status' => 'failed',
                'transaction_id' => null,
                'order_id' => $orderId,
                'message' => 'Order mismatch',
            ];
        }

        $paymentIntentId = $session->payment_intent ?? null;
        $resolvedOrderId = $sessionOrderId ?? $orderId;

        if (($session->payment_status ?? null) !== 'paid') {
            return [
                'status' => 'pending',
                'transaction_id' => $paymentIntentId,
                'order_id' => $resolvedOrderId,
                'message' => 'Payment has not been completed',
            ];
        }

        return [
            'status' => 'succeeded',
            'transaction_id' => $paymentIntentId,
            'order_id' => $resolvedOrderId,
            'message' => 'Checkout completed',
        ];
    }

    /**
     * Retrieve a Checkout Session from Stripe. Extracted so tests can stub the API call.
     */
    protected function retrieveSession(string $sessionId): object
    {
        return $this->stripe->checkout->sessions->retrieve($sessionId, []);
    }

    public function handleWebhook(array $payload, ?string $signature = null): array
    {
        $type = $payload['type'] ?? '';
        if ($type !== 'checkout.session.completed') {
            return ['status' => 'ignored', 'transaction_id' => null, 'message' => 'Unhandled'];
        }

        $session = $payload['data']['object'] ?? [];

        return [
            'status' => 'succeeded',
            'transaction_id' => $session['payment_intent'] ?? null,
            'order_id' => $session['metadata']['order_id'] ?? null,
            'event_id' => $payload['id'] ?? null,
            'message' => 'Stripe checkout session completed',
        ];
    }
}

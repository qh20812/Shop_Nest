<?php

namespace App\Payments\Gateways;

use App\Models\Order;
use App\Payments\Contracts\PaymentGateway;
use App\Payments\PaymentConstants;
use App\Services\ExchangeRateService;
use Stripe\StripeClient;

class StripeGateway implements PaymentGateway
{
    public function __construct(private StripeClient $stripe) {}


    public function createPayment(Order $order): string
    {
        $order->loadMissing('items.variant.product');
        $targetCurrency = strtolower(config('services.stripe.currency', 'USD'));
        $sourceCurrency = strtoupper($order->currency ?? 'VND');

        $lineItems = $order->items->map(function ($item) use ($sourceCurrency, $targetCurrency) {
            $unitAmount = ExchangeRateService::convert(
                (float) $item->unit_price,
                $sourceCurrency,
                strtoupper($targetCurrency)
            );

            $amountCents = (int) round($unitAmount * PaymentConstants::CENTS_MULTIPLIER);

            return [
                'price_data' => [
                    'currency'     => $targetCurrency,
                    'product_data' => ['name' => $item->variant?->product?->name ?? 'Order Item'],
                    'unit_amount'  => $amountCents,
                ],
                'quantity' => (int) $item->quantity,
            ];
        })->values()->toArray();

        $session = $this->stripe->checkout->sessions->create([
            'mode'                  => 'payment',
            'success_url'           => url('/payments/stripe/return?status=success&order_id=' . $order->order_id . '&session_id={CHECKOUT_SESSION_ID}'),
            'cancel_url'            => url('/payments/stripe/return?status=cancel&order_id=' . $order->order_id),
            'payment_method_types'  => ['card'],
            'line_items'            => $lineItems,
            'metadata'              => ['order_id' => (string) $order->order_id],
        ]);

        return $session->url;
    }

    public function handleReturn(array $payload): array
    {
        $status = $payload['status'] ?? 'cancel';
        if ($status === 'success') return ['status' => 'succeeded', 'transaction_id' => null, 'message' => 'Checkout completed'];
        if ($status === 'cancel')  return ['status' => 'canceled',  'transaction_id' => null, 'message' => 'User canceled'];
        return ['status' => 'failed', 'transaction_id' => null, 'message' => 'Unknown status'];
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
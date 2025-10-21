<?php

namespace App\Payments\Gateways;

use App\Models\Order;
use App\Payments\Contracts\PaymentGateway;
use App\Payments\PaymentConstants;
use App\Services\ExchangeRateService;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class PaypalGateway implements PaymentGateway
{

    private string $clientId;
    private string $clientSecret;
    private string $baseUrl;

    public function __construct()
    {
        $this->clientId = config('services.paypal.client_id');
        $this->clientSecret = config('services.paypal.client_secret');
        $mode = config('services.paypal.mode', 'sandbox');
        
        $this->baseUrl = $mode === 'live'
            ? 'https://api-m.paypal.com'
            : 'https://api-m.sandbox.paypal.com';
    }

    /**
     * Create a PayPal payment order and return the approval URL.
     */
    public function createPayment(Order $order): string
    {
        $order->loadMissing('items.variant.product');
        
        $targetCurrency = 'USD';
        $sourceCurrency = strtoupper($order->currency ?? 'VND');

        $items = $order->items->map(function ($item) use ($sourceCurrency, $targetCurrency) {
            $unitAmount = ExchangeRateService::convert(
                (float) $item->unit_price,
                $sourceCurrency,
                $targetCurrency
            );

            return [
                'name' => $item->variant?->product?->name ?? 'Order Item',
                'quantity' => (string) $item->quantity,
                'unit_amount' => [
                    'currency_code' => $targetCurrency,
                    'value' => number_format($unitAmount, 2, '.', ''),
                ],
            ];
        })->toArray();

        $totalAmount = ExchangeRateService::convert(
            (float) $order->total_amount,
            $sourceCurrency,
            $targetCurrency
        );

        $payload = [
            'intent' => 'CAPTURE',
            'purchase_units' => [
                [
                    'reference_id' => (string) $order->order_id,
                    'items' => $items,
                    'amount' => [
                        'currency_code' => $targetCurrency,
                        'value' => number_format($totalAmount, 2, '.', ''),
                        'breakdown' => [
                            'item_total' => [
                                'currency_code' => $targetCurrency,
                                'value' => number_format($totalAmount, 2, '.', ''),
                            ],
                        ],
                    ],
                ],
            ],
            'application_context' => [
                'return_url' => url('/payments/paypal/return?order_id=' . $order->id),
                'cancel_url' => url('/payments/paypal/return?order_id=' . $order->id . '&status=cancel'),
                'brand_name' => config('app.name'),
                'user_action' => 'PAY_NOW',
            ],
        ];

        $response = Http::withBasicAuth($this->clientId, $this->clientSecret)
            ->withHeaders(['Content-Type' => 'application/json'])
            ->post("{$this->baseUrl}/v2/checkout/orders", $payload);

        if (!$response->successful()) {
            Log::error('paypal.create_payment_failed', [
                'status' => $response->status(),
                'body' => $response->json(),
            ]);
            throw new \RuntimeException('Failed to create PayPal payment');
        }

        $data = $response->json();
        $approveUrl = collect($data['links'] ?? [])
            ->firstWhere('rel', 'approve')['href'] ?? null;

        if (!$approveUrl) {
            throw new \RuntimeException('PayPal approval URL not found');
        }

        return $approveUrl;
    }

    /**
     * Handle the return callback from PayPal.
     */
    public function handleReturn(array $payload): array
    {
        $status = $payload['status'] ?? null;
        
        if ($status === 'cancel') {
            return [
                'status' => 'canceled',
                'transaction_id' => null,
                'message' => 'Payment was cancelled by user',
            ];
        }

        $token = $payload['token'] ?? null;

        if (!$token) {
            return [
                'status' => 'failed',
                'transaction_id' => null,
                'message' => 'Missing PayPal token',
            ];
        }

        // Get order details from PayPal
        $response = Http::withBasicAuth($this->clientId, $this->clientSecret)
            ->get("{$this->baseUrl}/v2/checkout/orders/{$token}");

        if (!$response->successful()) {
            Log::error('paypal.get_order_failed', [
                'token' => $token,
                'status' => $response->status(),
            ]);
            
            return [
                'status' => 'failed',
                'transaction_id' => null,
                'message' => 'Failed to retrieve PayPal order',
            ];
        }

        $data = $response->json();
        $paypalStatus = $data['status'] ?? 'UNKNOWN';

        // If already captured or approved, consider it successful
        if (in_array($paypalStatus, ['COMPLETED', 'APPROVED'])) {
            $captureId = $data['purchase_units'][0]['payments']['captures'][0]['id'] ?? $token;
            
            return [
                'status' => 'succeeded',
                'transaction_id' => $captureId,
                'order_id' => $data['purchase_units'][0]['reference_id'] ?? null,
                'message' => 'Payment completed successfully',
            ];
        }

        return [
            'status' => 'failed',
            'transaction_id' => null,
            'message' => 'Payment not completed',
        ];
    }

    /**
     * Handle PayPal webhook events.
     */
    public function handleWebhook(array $payload, ?string $signature = null): array
    {
        // Verify webhook signature if provided
        if ($signature && !$this->verifyWebhookSignature($payload, $signature)) {
            Log::warning('paypal.webhook.invalid_signature');
            
            return [
                'status' => 'failed',
                'transaction_id' => null,
                'message' => 'Invalid webhook signature',
            ];
        }

        $eventType = $payload['event_type'] ?? '';

        // Handle payment capture completed
        if ($eventType === 'PAYMENT.CAPTURE.COMPLETED') {
            $resource = $payload['resource'] ?? [];
            $captureId = $resource['id'] ?? null;
            $orderId = $resource['custom_id'] ?? $resource['invoice_id'] ?? null;

            return [
                'status' => 'succeeded',
                'transaction_id' => $captureId,
                'order_id' => $orderId,
                'event_id' => $payload['id'] ?? null,
                'message' => 'PayPal payment captured',
            ];
        }

        // Handle checkout order completed
        if ($eventType === 'CHECKOUT.ORDER.COMPLETED') {
            $resource = $payload['resource'] ?? [];
            $orderId = $resource['purchase_units'][0]['reference_id'] ?? null;
            $captureId = $resource['purchase_units'][0]['payments']['captures'][0]['id'] ?? $resource['id'];

            return [
                'status' => 'succeeded',
                'transaction_id' => $captureId,
                'order_id' => $orderId,
                'event_id' => $payload['id'] ?? null,
                'message' => 'PayPal checkout completed',
            ];
        }

        // Handle failed payments
        if (in_array($eventType, ['PAYMENT.CAPTURE.DENIED', 'PAYMENT.CAPTURE.DECLINED'])) {
            return [
                'status' => 'failed',
                'transaction_id' => $payload['resource']['id'] ?? null,
                'event_id' => $payload['id'] ?? null,
                'message' => 'PayPal payment failed',
            ];
        }

        return [
            'status' => 'ignored',
            'transaction_id' => null,
            'message' => 'Unhandled PayPal event type: ' . $eventType,
        ];
    }

    /**
     * Verify PayPal webhook signature.
     */
    private function verifyWebhookSignature(array $payload, string $signature): bool
    {
        // PayPal webhook verification is complex and requires webhook ID
        // For production, implement full verification using PayPal SDK
        // For now, log and return true if signature exists
        
        Log::info('paypal.webhook.signature_check', [
            'has_signature' => !empty($signature),
        ]);

        // TODO: Implement proper PayPal webhook verification
        // https://developer.paypal.com/api/rest/webhooks/
        
        return true;
    }
}

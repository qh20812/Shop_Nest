<?php

namespace App\Payments\Gateways;

use App\Models\Order;
use App\Payments\Contracts\PaymentGateway;
use App\Services\ExchangeRateService;
use Illuminate\Support\Facades\Log;

class VnpayGateway implements PaymentGateway
{
    protected string $tmnCode;
    protected string $secret;
    protected string $paymentUrl;
    protected string $returnUrl;
    protected int $convertRate;

    public function __construct()
    {
        $cfg = config('services.vnpay');
        $this->tmnCode    = (string) $cfg['tmn_code'];
        $this->secret     = (string) $cfg['hash_secret'];
        $this->paymentUrl = (string) $cfg['payment_url'];
        $this->returnUrl  = (string) $cfg['return_url'];
        $this->convertRate = (int)    ($cfg['convert_rate'] ?? 27000);
    }

    public function createPayment(Order $order): string
    {
        try {
            $order->loadMissing('items.variant.product');

            $orderKey = (int) $order->getKey();
            if ($orderKey <= 0) {
                throw new \RuntimeException('Order identifier is missing for VNPAY payment.');
            }

            $orderId = (string) $orderKey;

            $amountVnd = $this->calculateOrderAmountInVnd($order);
            if ($amountVnd <= 0) {
                throw new \RuntimeException('Order amount is invalid for VNPAY payment.');
            }

            $vnpAmount = $amountVnd * 100;

            $params = [
                'vnp_Version'   => '2.1.0',
                'vnp_Command'   => 'pay',
                'vnp_TmnCode'   => $this->tmnCode,
                'vnp_Amount'    => $vnpAmount,
                'vnp_CurrCode'  => 'VND',
                'vnp_TxnRef'    => $orderId,
                'vnp_OrderInfo' => 'Thanh toan don ' . $orderId,
                'vnp_OrderType' => 'other',
                'vnp_Locale'    => 'vn',
                'vnp_ReturnUrl' => $this->returnUrl,
                // 'vnp_IpAddr'    => request()?->ip() ?: '127.0.0.1',
                'vnp_IpAddr' => request()?->ip() ?? '0.0.0.0',
                'vnp_CreateDate' => now()->format('YmdHis'),
            ];

            $url = $this->signedUrl($params);

            $order->transactions()->updateOrCreate(
                [
                    'type' => 'payment',
                    'gateway' => 'vnpay',
                ],
                [
                    'amount' => $amountVnd,
                    'currency' => 'VND',
                    'status' => 'pending',
                    'raw_payload' => ['request' => $params],
                ]
            );

            return $url;
        } catch (\Throwable $e) {
            Log::error('VnpayGateway createPayment failed', [
                'order_id' => $order->getKey(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            throw $e;
        }
    }

    public function handleReturn(array $payload): array
    {
        if (!$this->verifySignature($payload)) {
            return [
                'status' => 'failed',
                'transaction_id' => null,
                'message' => 'Invalid signature',
                'order_id' => $payload['vnp_TxnRef'] ?? null,
            ];
        }

        $code = $payload['vnp_ResponseCode'] ?? null;
        $transNo = (string) ($payload['vnp_TransactionNo'] ?? '');
        if ($code === '00') {
            return [
                'status' => 'succeeded',
                'transaction_id' => $transNo ?: null,
                'message' => 'Paid via VNPAY',
                'order_id' => $payload['vnp_TxnRef'] ?? null,
                'amount' => isset($payload['vnp_Amount']) ? round(((int) $payload['vnp_Amount']) / 100, 2) : null,
                'currency' => 'VND',
            ];
            // return ['status' => 'processing', 'transaction_id' => $payload['vnp_TransactionNo'] ?? null, 'message' => 'Waiting IPN'];
        }

        if ($code === '24') {
            return [
                'status' => 'canceled',
                'transaction_id' => null,
                'message' => 'User canceled',
                'order_id' => $payload['vnp_TxnRef'] ?? null,
                'currency' => 'VND',
            ];
        }

        return [
            'status' => 'failed',
            'transaction_id' => null,
            'message' => 'VNPAY code: ' . $code,
            'order_id' => $payload['vnp_TxnRef'] ?? null,
            'currency' => 'VND',
        ];
    }

    public function handleWebhook(array $payload, ?string $signature = null): array
    {
        if (!$this->verifySignature($payload)) {
            return [
                'status' => 'failed',
                'transaction_id' => null,
                'message' => 'Invalid signature',
                'order_id' => $payload['vnp_TxnRef'] ?? null,
            ];
        }

        $orderId = (string) ($payload['vnp_TxnRef'] ?? '');
        $responseCode = (string) ($payload['vnp_ResponseCode'] ?? '');
        $transactionNo = (string) ($payload['vnp_TransactionNo'] ?? '');
        $amountRaw = (int) ($payload['vnp_Amount'] ?? 0);

        if ($orderId === '') {
            Log::warning('vnpay.webhook.missing_order', ['payload' => $payload]);

            return [
                'status' => 'failed',
                'transaction_id' => $transactionNo ?: null,
                'message' => 'Missing order reference',
                'order_id' => null,
            ];
        }

        if ($responseCode !== '00') {
            return [
                'status' => 'failed',
                'transaction_id' => $transactionNo ?: null,
                'message' => 'Payment failed: ' . $responseCode,
                'order_id' => $orderId,
            ];
        }

        $normalizedAmount = $amountRaw > 0 ? round($amountRaw / 100, 2) : null;

        return [
            'status' => 'succeeded',
            'transaction_id' => $transactionNo ?: null,
            'order_id' => $orderId,
            'event_id' => $payload['vnp_TransactionNo'] ?? null,
            'message' => 'Paid via VNPAY',
            'amount' => $normalizedAmount,
            'currency' => 'VND',
        ];
    }

    private function calculateOrderAmountInVnd(Order $order): int
    {
        $sourceCurrency = strtoupper($order->currency ?? 'VND');
        $amount = (float) ($order->total_amount ?? 0);

        if ($amount <= 0) {
            $amount = (float) $order->items->sum(function ($item) {
                return ((float) $item->unit_price) * (int) $item->quantity;
            });

            $amount += (float) ($order->shipping_fee ?? 0);
            $amount -= (float) ($order->discount_amount ?? 0);
        }

        try {
            $converted = ExchangeRateService::convert($amount, $sourceCurrency, 'VND');
        } catch (\Throwable $exception) {
            Log::warning('vnpay.amount.convert_failed', [
                'order_id' => $order->getKey(),
                'message' => $exception->getMessage(),
            ]);
            $converted = $amount * max(1, $this->convertRate);
        }

        return max(0, (int) round($converted));
    }

    private function secret(): string
    {
        return trim((string) config('services.vnpay.hash_secret'));
    }

    private function signedUrl(array $params): string
    {
        ksort($params);
        $hashData = '';
        foreach ($params as $k => $v) {
            if ($hashData !== '') $hashData .= '&';
            $hashData .= urlencode($k) . '=' . urlencode($v);
        }

        $secureHash = hash_hmac('sha512', $hashData, $this->secret());
        Log::debug('vnp.sign.create', ['hashData' => $hashData, 'hash' => $secureHash]);
        $params['vnp_SecureHash']     = $secureHash;
        $params['vnp_SecureHashType'] = 'HMACSHA512';

        return $this->paymentUrl . '?' . http_build_query($params);
    }

    private function verifySignature(array $payload): bool
    {
        $input = [];
        foreach ($payload as $k => $v) {
            if (strpos($k, 'vnp_') === 0 && $k !== 'vnp_SecureHash' && $k !== 'vnp_SecureHashType') {
                $input[$k] = $v;
            }
        }
        ksort($input);

        $data = '';
        foreach ($input as $k => $v) {
            if ($data !== '') $data .= '&';
            $data .= urlencode($k) . '=' . urlencode($v);
        }

        $calc = hash_hmac('sha512', $data, $this->secret());
        $recv = (string)($payload['vnp_SecureHash'] ?? '');

        Log::debug('vnp.sign.verify', ['data' => $data, 'calc' => $calc, 'recv' => $recv]);

        return hash_equals($calc, $recv);
    }
}
<?php

namespace App\Payments\Gateways;

use App\Models\Order;
use App\Payments\Contracts\PaymentGateway;
use App\Services\ExchangeRateService;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MomoGateway implements PaymentGateway
{
    protected string $partnerCode;
    protected string $accessKey;
    protected string $secretKey;
    protected string $endpoint;
    protected string $redirectUrl;
    protected string $ipnUrl;
    protected int $convertRate;

    public function __construct()
    {
        $cfg = config('services.momo');
        $this->partnerCode = (string) $cfg['partner_code'];
        $this->accessKey   = (string) $cfg['access_key'];
        $this->secretKey   = (string) $cfg['secret_key'];
        $this->endpoint    = (string) $cfg['endpoint'];
        $this->redirectUrl = (string) $cfg['redirect'];
        $this->ipnUrl      = (string) $cfg['ipn'];
        $this->convertRate = (int)    ($cfg['convert_rate'] ?? 25000);
    }


    public function createPayment(Order $order): string
    {

        $order->loadMissing('items.variant.product');

        $orderKey = (int) $order->getKey();
        if ($orderKey <= 0) {
            throw new \RuntimeException('Order identifier is missing for MoMo payment.');
        }

        $orderId = (string) $orderKey;

        $amountVnd = $this->calculateOrderAmountInVnd($order);
        if ($amountVnd <= 0) {
            throw new \RuntimeException('Order amount is invalid for MoMo payment.');
        }

        $requestId = (string) now()->timestamp . rand(1000, 9999);
        $orderInfo = 'Thanh toan don ' . $orderId;
        $extraData = base64_encode(json_encode(['order_id' => $orderId]));

        $payload = [
            'partnerCode' => $this->partnerCode,
            'accessKey'   => $this->accessKey,
            'requestId'   => $requestId,
            'amount'      => (string) $amountVnd,
            'orderId'     => $orderId,
            'orderInfo'   => $orderInfo,
            'redirectUrl' => $this->redirectUrl,
            'ipnUrl'      => $this->ipnUrl,
            'lang'        => 'vi',
            'extraData'   => $extraData,
            'requestType' => 'captureWallet',
        ];

        $payload['signature'] = $this->signCreate($payload);

        $res = Http::timeout(15)->acceptJson()->asJson()->post($this->endpoint, $payload);
        if (!$res->successful()) {
            throw new \RuntimeException('MoMo create failed: ' . $res->body());
        }
        $data = $res->json();

        if (($data['resultCode'] ?? -1) !== 0 || empty($data['payUrl'])) {
            throw new \RuntimeException('MoMo rejected: ' . json_encode($data));
        }


        $order->transactions()->updateOrCreate(
            [
                'type' => 'payment',
                'gateway' => 'momo',
            ],
            [
                'amount' => $amountVnd,
                'currency' => 'VND',
                'status' => 'pending',
                'gateway_transaction_id' => $data['orderId'] ?? $orderId,
                'raw_payload' => [
                    'request' => $payload,
                    'response' => $data,
                ],
            ]
        );

        return $data['payUrl'];
    }


    public function handleReturn(array $payload): array
    {

        $resultCode = (int) ($payload['resultCode'] ?? -1);
        $message    = (string) ($payload['message'] ?? 'Unknown');
        $orderId    = $payload['orderId'] ?? null;

        if ($resultCode === 0) {
            return [
                'status' => 'succeeded',
                'transaction_id' => $payload['orderId'] ?? null,
                'message' => 'Paid via MoMo',
                'order_id' => $orderId,
                'amount' => isset($payload['amount']) ? (int) $payload['amount'] : null,
                'currency' => 'VND',
            ];
        }
        if ($resultCode === 49) {
            return [
                'status' => 'canceled',
                'transaction_id' => null,
                'message' => 'User canceled',
                'order_id' => $orderId,
                'currency' => 'VND',
            ];
        }
        return [
            'status' => 'failed',
            'transaction_id' => null,
            'message' => $message,
            'order_id' => $orderId,
            'currency' => 'VND',
        ];
    }


    public function handleWebhook(array $payload, ?string $signature = null): array
    {
        if (!$this->verifyIpn($payload)) {
            return [
                'status' => 'failed',
                'transaction_id' => null,
                'message' => 'Invalid signature',
                'order_id' => $payload['orderId'] ?? null,
            ];
        }

        $resultCode = (int) ($payload['resultCode'] ?? -1);
        $orderId = (string) ($payload['orderId'] ?? '');
        $transId = (string) ($payload['transId'] ?? '');
        $message = (string) ($payload['message'] ?? '');
        $payAmt = (int) ($payload['amount'] ?? 0);

        if ($orderId === '') {
            Log::warning('momo.webhook.missing_order', ['payload' => $payload]);

            return [
                'status' => 'failed',
                'transaction_id' => $transId ?: null,
                'message' => 'Missing order reference',
                'order_id' => null,
            ];
        }

        if ($resultCode !== 0) {
            return [
                'status' => 'failed',
                'transaction_id' => $transId ?: null,
                'message' => $message ?: 'Payment failed',
                'order_id' => $orderId,
            ];
        }

        return [
            'status' => 'succeeded',
            'transaction_id' => $transId ?: null,
            'order_id' => $orderId,
            'event_id' => $payload['requestId'] ?? null,
            'message' => 'Paid via MoMo',
            'amount' => $payAmt > 0 ? $payAmt : null,
            'currency' => 'VND',
        ];
    }


    private function amountToVndInt(float $amount, string $currency): int
    {
        $normalizedCurrency = strtoupper($currency ?: 'VND');

        try {
            $converted = ExchangeRateService::convert($amount, $normalizedCurrency, 'VND');
        } catch (\Throwable $exception) {
            Log::warning('momo.amount.convert_failed', [
                'message' => $exception->getMessage(),
            ]);
            $converted = $amount * max(1, $this->convertRate);
        }

        return max(0, (int) round($converted));
    }

    private function calculateOrderAmountInVnd(Order $order): int
    {
        $amount = (float) ($order->total_amount ?? 0);
        $currency = $order->currency ?? 'VND';

        if ($amount <= 0) {
            $amount = (float) $order->items->sum(function ($item) {
                return ((float) $item->unit_price) * (int) $item->quantity;
            });

            $amount += (float) ($order->shipping_fee ?? 0);
            $amount -= (float) ($order->discount_amount ?? 0);
        }

        return $this->amountToVndInt($amount, $currency);
    }

    private function signCreate(array $p): string
    {

        $raw = "accessKey={$p['accessKey']}"
            . "&amount={$p['amount']}"
            . "&extraData={$p['extraData']}"
            . "&ipnUrl={$p['ipnUrl']}"
            . "&orderId={$p['orderId']}"
            . "&orderInfo={$p['orderInfo']}"
            . "&partnerCode={$p['partnerCode']}"
            . "&redirectUrl={$p['redirectUrl']}"
            . "&requestId={$p['requestId']}"
            . "&requestType={$p['requestType']}";

        return hash_hmac('sha256', $raw, $this->secretKey);
    }

    private function verifyIpn(array $p): bool
    {

        $keys = [
            'accessKey',
            'amount',
            'extraData',
            'message',
            'orderId',
            'orderInfo',
            'orderType',
            'partnerCode',
            'payType',
            'requestId',
            'responseTime',
            'resultCode',
            'transId'
        ];
        $kv = [];
        foreach ($keys as $k) {
            if (!array_key_exists($k, $p)) $p[$k] = '';
            $kv[] = $k . '=' . $p[$k];
        }
        $raw = implode('&', $kv);
        $sig = hash_hmac('sha256', $raw, $this->secretKey);
        return hash_equals($sig, (string) ($p['signature'] ?? ''));
    }
}
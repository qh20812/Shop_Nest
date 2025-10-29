<?php

namespace App\Payments\Gateways;

use App\Models\Order;
use App\Models\Payment;
use App\Models\Product;
use App\Payments\Contracts\PaymentGateway;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

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

        $amountVnd = $this->amountToVndInt($order->amount, $order->currency);

        $requestId = (string) now()->timestamp . rand(1000, 9999);
        $orderId   = (string) $order->id;
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


        Payment::where('order_id', $order->id)
            ->where('provider', 'momo')
            ->update([
                'transaction_id' => $data['orderId'] ?? $orderId,
                'status'         => 'pending',
            ]);

        return $data['payUrl'];
    }


    public function handleReturn(array $payload): array
    {

        $resultCode = (int) ($payload['resultCode'] ?? -1);
        $message    = (string) ($payload['message'] ?? 'Unknown');

        if ($resultCode === 0) {

            return ['status' => 'processing', 'transaction_id' => $payload['orderId'] ?? null, 'message' => 'Waiting IPN'];
        }
        if ($resultCode === 49) {
            return ['status' => 'canceled', 'transaction_id' => null, 'message' => 'User canceled'];
        }
        return ['status' => 'failed', 'transaction_id' => null, 'message' => $message];
    }


    public function handleWebhook(array $payload, ?string $signature = null): array
    {

        if (!$this->verifyIpn($payload)) {
            return ['status' => 'failed', 'transaction_id' => null, 'message' => 'Invalid signature'];
        }

        $resultCode = (int) ($payload['resultCode'] ?? -1);
        $orderId    = (string) ($payload['orderId'] ?? '');
        $transId    = (string) ($payload['transId'] ?? '');
        $message    = (string) ($payload['message'] ?? '');

        if ($resultCode !== 0) {

            return ['status' => 'failed', 'transaction_id' => $transId ?: null, 'message' => $message ?: 'Payment failed'];
        }


        DB::transaction(function () use ($orderId, $transId, $payload) {
            $order = Order::with('items')->lockForUpdate()->findOrFail($orderId);
            if ($order->status === 'paid') {
                return;
            }
            foreach ($order->items as $item) {
                Product::whereKey($item->product_id)
                    ->where('stock', '>=', (int) $item->quantity)
                    ->decrement('stock', (int) $item->quantity);
            }
            $order->update(['status' => 'paid']);

            Payment::where('order_id', $order->id)
                ->where('provider', 'momo')
                ->update([
                    'status'           => 'succeeded',
                    'transaction_id'   => $transId ?: ($payload['requestId'] ?? null),
                    'gateway_event_id' => $payload['requestId'] ?? null,
                    'raw_payload'      => $payload,
                ]);
        });

        return ['status' => 'succeeded', 'transaction_id' => $transId ?: null, 'message' => 'Paid via MoMo'];
    }


    private function amountToVndInt(float $amount, string $currency): int
    {
        if (strtoupper($currency) === 'VND') {
            return (int) round($amount);
        }

        return (int) round($amount * max(1, $this->convertRate));
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
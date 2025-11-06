<?php

namespace Tests\Unit\Payments;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use App\Payments\Gateways\MomoGateway;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Tests\TestCase;

class MomoGatewayTest extends TestCase
{
    use RefreshDatabase;

    private Order $order;
    private ProductVariant $variant;
    private MomoGateway $gateway;

    protected function setUp(): void
    {
        parent::setUp();

        config()->set('services.momo', [
            'partner_code' => 'MOMOTEST',
            'access_key' => 'access123',
            'secret_key' => 'secret123',
            'endpoint' => 'https://test-payment.momo.vn/v2/gateway/api/create',
            'redirect' => 'https://example.com/payments/momo/return',
            'ipn' => 'https://example.com/payments/momo/ipn',
            'convert_rate' => 25000,
        ]);

        Log::spy();

        $user = User::factory()->create();
        $product = Product::factory()->create([
            'seller_id' => $user->id,
            'status' => 'published',
        ]);

        $this->variant = ProductVariant::factory()->create([
            'product_id' => $product->product_id,
            'stock_quantity' => 20,
            'reserved_quantity' => 0,
        ]);

        $this->order = Order::factory()->create([
            'customer_id' => $user->id,
            'status' => OrderStatus::PENDING_CONFIRMATION,
            'payment_status' => PaymentStatus::UNPAID,
            'sub_total' => 200000,
            'shipping_fee' => 0,
            'discount_amount' => 0,
            'total_amount' => 200000,
            'total_amount_base' => 200000,
            'currency' => 'VND',
        ]);

        DB::table('order_items')->insert([
            'order_id' => $this->order->order_id,
            'variant_id' => $this->variant->variant_id,
            'quantity' => 4,
            'unit_price' => 50000,
            'total_price' => 200000,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $this->gateway = app(MomoGateway::class);
    }

    public function test_create_payment_sends_request_and_records_transaction(): void
    {
        Http::fake([
            config('services.momo.endpoint') => Http::response([
                'resultCode' => 0,
                'payUrl' => 'https://test-payment.momo.vn/pay?orderId=123',
                'orderId' => (string) $this->order->order_id,
            ], 200),
        ]);

        $payUrl = $this->gateway->createPayment($this->order->fresh());

        $this->assertSame('https://test-payment.momo.vn/pay?orderId=123', $payUrl);

        Http::assertSent(function ($request) {
            return $request['partnerCode'] === 'MOMOTEST'
                && $request['orderId'] === (string) $this->order->order_id
                && !empty($request['signature']);
        });

        $transaction = $this->order->transactions()->where('gateway', 'momo')->first();

        $this->assertNotNull($transaction);
        $this->assertSame('pending', $transaction->status);
        $this->assertEquals(200000.0, $transaction->amount);
        $this->assertSame('VND', $transaction->currency);
    }

    public function test_handle_return_success_waits_for_ipn(): void
    {
        $payload = [
            'orderId' => (string) $this->order->order_id,
            'resultCode' => 0,
            'message' => 'Success',
            'amount' => 200000,
        ];

        $result = $this->gateway->handleReturn($payload);

        $this->assertSame('processing', $result['status']);
        $this->assertSame('VND', $result['currency']);
        $this->assertEquals(200000, $result['amount']);
    }

    public function test_handle_webhook_success_returns_normalized_payload(): void
    {
        $payload = $this->signIpnPayload([
            'accessKey' => 'access123',
            'amount' => '200000',
            'extraData' => base64_encode(json_encode(['order_id' => $this->order->order_id])),
            'message' => 'Success',
            'orderId' => (string) $this->order->order_id,
            'orderInfo' => 'Thanh toan don',
            'orderType' => 'momo_wallet',
            'partnerCode' => 'MOMOTEST',
            'payType' => 'qr',
            'requestId' => 'REQ123',
            'responseTime' => (string) now()->timestamp,
            'resultCode' => 0,
            'transId' => 'TRANS789',
        ]);

        $result = $this->gateway->handleWebhook($payload);

        $this->assertSame('succeeded', $result['status']);
        $this->assertSame('TRANS789', $result['transaction_id']);
        $this->assertSame((string) $this->order->order_id, $result['order_id']);
        $this->assertSame('VND', $result['currency']);
        $this->assertEquals(200000, $result['amount']);
    }

    public function test_handle_webhook_invalid_signature_fails(): void
    {
        $payload = [
            'orderId' => (string) $this->order->order_id,
            'resultCode' => 0,
            'signature' => 'invalid-signature',
        ];

        $result = $this->gateway->handleWebhook($payload);

        $this->assertSame('failed', $result['status']);
        $this->assertNull($result['transaction_id']);
    }

    private function signIpnPayload(array $data): array
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
            'transId',
        ];

        $kv = [];
        foreach ($keys as $key) {
            $value = $data[$key] ?? '';
            $kv[] = $key . '=' . $value;
        }

        $raw = implode('&', $kv);
        $data['signature'] = hash_hmac('sha256', $raw, (string) config('services.momo.secret_key'));

        return $data;
    }
}

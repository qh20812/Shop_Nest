<?php

namespace Tests\Unit\Payments;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use App\Payments\Gateways\VnpayGateway;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Tests\TestCase;

class VnpayGatewayTest extends TestCase
{
    use RefreshDatabase;

    private Order $order;
    private ProductVariant $variant;
    private VnpayGateway $gateway;

    protected function setUp(): void
    {
        parent::setUp();

        config()->set('services.vnpay', [
            'tmn_code' => 'TESTCODE',
            'hash_secret' => 'testsecret',
            'payment_url' => 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
            'return_url' => 'https://example.com/payments/vnpay/return',
            'convert_rate' => 23000,
        ]);

        Log::spy();

        $user = User::factory()->create();
        $product = Product::factory()->create([
            'seller_id' => $user->id,
            'status' => 'published',
        ]);

        $this->variant = ProductVariant::factory()->create([
            'product_id' => $product->product_id,
            'stock_quantity' => 25,
            'reserved_quantity' => 0,
        ]);

        $this->order = Order::factory()->create([
            'customer_id' => $user->id,
            'status' => OrderStatus::PENDING_CONFIRMATION,
            'payment_status' => PaymentStatus::UNPAID,
            'sub_total' => 150000,
            'shipping_fee' => 0,
            'discount_amount' => 0,
            'total_amount' => 150000,
            'total_amount_base' => 150000,
            'currency' => 'VND',
        ]);

        DB::table('order_items')->insert([
            'order_id' => $this->order->order_id,
            'variant_id' => $this->variant->variant_id,
            'quantity' => 3,
            'unit_price' => 50000,
            'total_price' => 150000,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $this->gateway = app(VnpayGateway::class);
    }

    public function test_create_payment_generates_payment_url_and_records_transaction(): void
    {
        $url = $this->gateway->createPayment($this->order->fresh());

        $this->assertStringContainsString(config('services.vnpay.payment_url'), $url);

        parse_str((string) parse_url($url, PHP_URL_QUERY), $params);

        $this->assertSame((string) $this->order->order_id, $params['vnp_TxnRef'] ?? null);
        $this->assertSame('VND', $params['vnp_CurrCode'] ?? null);

        $transaction = $this->order->transactions()->where('gateway', 'vnpay')->first();

        $this->assertNotNull($transaction);
        $this->assertSame('pending', $transaction->status);
        $this->assertEquals(150000.0, $transaction->amount);
        $this->assertSame('VND', $transaction->currency);
        $this->assertArrayHasKey('request', $transaction->raw_payload ?? []);
    }

    public function test_handle_return_success_waits_for_ipn(): void
    {
        $payload = $this->signPayload([
            'vnp_TxnRef' => (string) $this->order->order_id,
            'vnp_ResponseCode' => '00',
            'vnp_TransactionNo' => '123456789',
            'vnp_Amount' => (string) (150000 * 100),
        ]);

        $result = $this->gateway->handleReturn($payload);

        $this->assertSame('processing', $result['status']);
        $this->assertSame('VND', $result['currency']);
        $this->assertEquals(150000.0, $result['amount']);
        $this->assertSame('123456789', $result['transaction_id']);
    }

    public function test_handle_return_canceled(): void
    {
        $payload = $this->signPayload([
            'vnp_TxnRef' => (string) $this->order->order_id,
            'vnp_ResponseCode' => '24',
            'vnp_TransactionNo' => '321',
        ]);

        $result = $this->gateway->handleReturn($payload);

        $this->assertSame('canceled', $result['status']);
        $this->assertSame('VND', $result['currency']);
        $this->assertNull($result['transaction_id']);
    }

    public function test_handle_webhook_success_returns_normalized_payload(): void
    {
        $payload = $this->signPayload([
            'vnp_TxnRef' => (string) $this->order->order_id,
            'vnp_ResponseCode' => '00',
            'vnp_TransactionNo' => '987654321',
            'vnp_Amount' => (string) (150000 * 100),
        ]);

        $result = $this->gateway->handleWebhook($payload);

        $this->assertSame('succeeded', $result['status']);
        $this->assertSame('987654321', $result['transaction_id']);
        $this->assertSame((string) $this->order->order_id, $result['order_id']);
        $this->assertSame('VND', $result['currency']);
        $this->assertEquals(150000.0, $result['amount']);
    }

    public function test_handle_webhook_with_invalid_signature_fails(): void
    {
        $payload = [
            'vnp_TxnRef' => (string) $this->order->order_id,
            'vnp_ResponseCode' => '00',
            'vnp_TransactionNo' => '111',
            'vnp_SecureHash' => 'invalid',
        ];

        $result = $this->gateway->handleWebhook($payload);

        $this->assertSame('failed', $result['status']);
        $this->assertNull($result['transaction_id']);
    }

    private function signPayload(array $data): array
    {
        $secret = (string) config('services.vnpay.hash_secret');

        $filtered = [];
        foreach ($data as $key => $value) {
            if (str_starts_with($key, 'vnp_')) {
                $filtered[$key] = $value;
            }
        }

        ksort($filtered);

        $hashPieces = [];
        foreach ($filtered as $key => $value) {
            $hashPieces[] = urlencode($key) . '=' . urlencode((string) $value);
        }
        $hashData = implode('&', $hashPieces);

        $data['vnp_SecureHash'] = hash_hmac('sha512', $hashData, $secret);
        $data['vnp_SecureHashType'] = 'HMACSHA512';

        return $data;
    }
}

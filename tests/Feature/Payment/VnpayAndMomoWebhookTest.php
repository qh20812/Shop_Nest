<?php

namespace Tests\Feature\Payment;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Tests\TestCase;

class VnpayAndMomoWebhookTest extends TestCase
{
    use RefreshDatabase;

    private Order $order;
    private ProductVariant $variant;

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
            'stock_quantity' => 30,
            'reserved_quantity' => 0,
            'track_inventory' => true,
            'allow_backorder' => false,
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
    }

    public function test_vnpay_webhook_marks_order_as_paid_and_updates_inventory(): void
    {
        $payload = $this->signVnpayPayload([
            'vnp_TxnRef' => (string) $this->order->order_id,
            'vnp_ResponseCode' => '00',
            'vnp_TransactionNo' => 'TXN123456',
            'vnp_Amount' => (string) (150000 * 100),
        ]);

        $response = $this->postJson('/webhooks/vnpay', $payload);

        $response->assertOk();

        $this->order->refresh();
        $this->variant->refresh();

        $this->assertSame(PaymentStatus::PAID, $this->order->payment_status);
        $this->assertSame(OrderStatus::PROCESSING, $this->order->status);
        $this->assertEquals(27, $this->variant->stock_quantity);

        $this->assertDatabaseHas('transactions', [
            'order_id' => $this->order->order_id,
            'gateway' => 'vnpay',
            'status' => 'completed',
            'gateway_transaction_id' => 'TXN123456',
        ]);
    }

    public function test_momo_webhook_marks_order_as_paid_and_updates_inventory(): void
    {
        $payload = $this->signMomoPayload([
            'accessKey' => 'access123',
            'amount' => '150000',
            'extraData' => base64_encode(json_encode(['order_id' => $this->order->order_id])),
            'message' => 'Success',
            'orderId' => (string) $this->order->order_id,
            'orderInfo' => 'Thanh toan don',
            'orderType' => 'momo_wallet',
            'partnerCode' => 'MOMOTEST',
            'payType' => 'qr',
            'requestId' => 'REQ456',
            'responseTime' => (string) now()->timestamp,
            'resultCode' => 0,
            'transId' => 'TRANS456',
        ]);

        $response = $this->postJson('/webhooks/momo', $payload);

        $response->assertOk();

        $this->order->refresh();
        $this->variant->refresh();

        $this->assertSame(PaymentStatus::PAID, $this->order->payment_status);
        $this->assertSame(OrderStatus::PROCESSING, $this->order->status);
        $this->assertEquals(27, $this->variant->stock_quantity);

        $this->assertDatabaseHas('transactions', [
            'order_id' => $this->order->order_id,
            'gateway' => 'momo',
            'status' => 'completed',
            'gateway_transaction_id' => 'TRANS456',
        ]);
    }

    private function signVnpayPayload(array $data): array
    {
        $filtered = [];
        foreach ($data as $key => $value) {
            if (str_starts_with($key, 'vnp_')) {
                $filtered[$key] = $value;
            }
        }

        ksort($filtered);

        $pairs = [];
        foreach ($filtered as $key => $value) {
            $pairs[] = urlencode($key) . '=' . urlencode((string) $value);
        }

        $hashData = implode('&', $pairs);

        $data['vnp_SecureHash'] = hash_hmac('sha512', $hashData, (string) config('services.vnpay.hash_secret'));
        $data['vnp_SecureHashType'] = 'HMACSHA512';

        return $data;
    }

    private function signMomoPayload(array $data): array
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

        $segments = [];
        foreach ($keys as $key) {
            $segments[] = $key . '=' . ($data[$key] ?? '');
        }

        $raw = implode('&', $segments);
        $data['signature'] = hash_hmac('sha256', $raw, (string) config('services.momo.secret_key'));

        return $data;
    }
}

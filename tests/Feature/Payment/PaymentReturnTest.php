<?php

namespace Tests\Feature\Payment;

use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Transaction;
use App\Models\User;
use App\Services\CartService;
use App\Services\PaymentService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Vite;
use Mockery;
use Tests\TestCase;

class PaymentReturnTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private Order $order;
    private Product $product;
    private ProductVariant $variant;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->product = Product::factory()->create(['seller_id' => $this->user->id]);
        $this->variant = ProductVariant::factory()->create([
            'product_id' => $this->product->product_id,
            'stock_quantity' => 10,
            'reserved_quantity' => 2,
            'track_inventory' => true,
            'allow_backorder' => false,
        ]);

        $this->order = Order::factory()->create([
            'customer_id' => $this->user->id,
            'payment_status' => PaymentStatus::UNPAID,
        ]);

        // Create order item
        DB::table('order_items')->insert([
            'order_id' => $this->order->order_id,
            'variant_id' => $this->variant->variant_id,
            'quantity' => 3,
            'unit_price' => 100.00,
            'total_price' => 300.00,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Mock Log facade to allow any logging calls
        Log::shouldReceive('info', 'warning', 'error')->andReturnNull();

        // Mock Vite facade to prevent manifest errors
        Vite::shouldReceive('chunk')->andReturn(['mocked-vite-asset']);
        Vite::shouldReceive('__invoke')->andReturn('mocked-vite-asset');
    }

    public function test_successful_stripe_payment_return()
    {
        $this->actingAs($this->user);

        // Mock CartService
        $cartService = $this->mock(CartService::class);
        $cartService->shouldReceive('clearCart')
            ->once()
            ->with($this->user);

        $response = $this->withoutMiddleware()
            ->get("/payments/stripe/return?order_id={$this->order->order_id}&payment_intent=pi_test&status=success");

        $response->assertStatus(200);

        // Check transaction was created
        $this->assertDatabaseHas('transactions', [
            'order_id' => $this->order->order_id,
            'gateway' => 'stripe',
            'status' => 'completed',
            'gateway_transaction_id' => 'pi_test',
        ]);

        // Check order status updated
        $this->order->refresh();
        $this->assertEquals(PaymentStatus::PAID, $this->order->payment_status);
    }

    public function test_failed_payment_return()
    {
        $this->actingAs($this->user);

        Log::shouldReceive('info')
            ->once()
            ->with('payment_return.processed', [
                'provider' => 'stripe',
                'order_id' => $this->order->order_id,
                'status' => 'failed',
            ]);

        $response = $this->get("/payments/stripe/return?order_id={$this->order->order_id}&status=failed&message=Payment declined");

        $response->assertStatus(200)
                ->assertInertia(fn ($page) => $page
                    ->component('PaymentResult')
                    ->where('provider', 'stripe')
                    ->where('status', 'failed')
                    ->where('message', 'Payment declined')
                );

        // Check transaction was created with failed status
        $this->assertDatabaseHas('transactions', [
            'order_id' => $this->order->order_id,
            'gateway' => 'stripe',
            'status' => 'failed',
        ]);

        // Order status should remain unpaid
        $this->order->refresh();
        $this->assertEquals(PaymentStatus::UNPAID, $this->order->payment_status);
    }

    public function test_duplicate_payment_return_is_ignored()
    {
        $this->actingAs($this->user);

        // Create existing transaction
        Transaction::create([
            'order_id' => $this->order->order_id,
            'type' => 'payment',
            'amount' => 300.00,
            'currency' => 'USD',
            'gateway' => 'stripe',
            'status' => 'completed',
            'gateway_event_id' => 'evt_duplicate',
        ]);

        Log::shouldReceive('info')
            ->once()
            ->with('payment_return.duplicate_event', [
                'provider' => 'stripe',
                'order_id' => $this->order->order_id,
                'event_id' => 'evt_duplicate',
            ]);

        $response = $this->get("/payments/stripe/return?order_id={$this->order->order_id}&event_id=evt_duplicate&status=succeeded");

        $response->assertStatus(200);

        // Should only have one transaction
        $this->assertEquals(1, Transaction::where('gateway_event_id', 'evt_duplicate')->count());
    }

    public function test_payment_return_with_invalid_order_id()
    {
        $this->actingAs($this->user);

        Log::shouldReceive('warning')
            ->once()
            ->with('payment_return.invalid_order_id', [
                'provider' => 'stripe',
                'raw_order_id' => 'invalid',
            ]);

        $response = $this->get('/payments/stripe/return?order_id=invalid');

        $response->assertStatus(200)
                ->assertInertia(fn ($page) => $page
                    ->component('PaymentResult')
                    ->where('provider', 'stripe')
                    ->where('status', 'failed')
                );
    }

    public function test_payment_return_with_nonexistent_order()
    {
        $this->actingAs($this->user);

        Log::shouldReceive('warning')
            ->once()
            ->with('payment_return.order_not_found', [
                'provider' => 'stripe',
                'order_id' => 99999,
            ]);

        $response = $this->get('/payments/stripe/return?order_id=99999&status=succeeded');

        $response->assertStatus(200)
                ->assertInertia(fn ($page) => $page
                    ->component('PaymentResult')
                    ->where('provider', 'stripe')
                    ->where('status', 'failed')
                );
    }

    public function test_cart_not_cleared_for_failed_payment()
    {
        $this->actingAs($this->user);

        // Mock CartService - should not be called
        $cartService = $this->mock(CartService::class);
        $cartService->shouldNotReceive('clearCart');

        $response = $this->get("/payments/stripe/return?order_id={$this->order->order_id}&status=failed");

        $response->assertStatus(200);
    }

    public function test_unsupported_payment_provider()
    {
        $this->actingAs($this->user);

        Log::shouldReceive('error')
            ->once()
            ->with('payment_return.unsupported_provider', [
                'provider' => 'unsupported',
                'message' => 'Unsupported payment provider.',
            ]);

        $response = $this->get('/payments/unsupported/return');

        $response->assertStatus(200)
                ->assertInertia(fn ($page) => $page
                    ->component('PaymentResult')
                    ->where('provider', 'unsupported')
                    ->where('status', 'failed')
                    ->where('message', 'Unsupported payment provider.')
                );
    }

    public function test_payment_return_with_vnpay_parameters()
    {
        $this->actingAs($this->user);

        $cartService = $this->mock(CartService::class);
        $cartService->shouldReceive('clearCart')
            ->once()
            ->with($this->user);

        $response = $this->get("/payments/vnpay/return?vnp_TxnRef={$this->order->order_id}&vnp_ResponseCode=00&vnp_TransactionNo=123456");

        $response->assertStatus(200)
                ->assertInertia(fn ($page) => $page
                    ->component('PaymentResult')
                    ->where('provider', 'vnpay')
                    ->where('status', 'succeeded')
                );
    }
}
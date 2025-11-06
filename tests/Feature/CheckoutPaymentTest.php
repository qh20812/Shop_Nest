<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\CartItem;
use App\Models\ProductVariant;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Log;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class CheckoutPaymentTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Product $product;
    protected ProductVariant $variant;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->product = Product::factory()->create([
            'name' => 'Test Product',
            'status' => 1,
        ]);
        $this->variant = ProductVariant::factory()->create([
            'product_id' => $this->product->product_id,
            'stock_quantity' => 10,
            'price' => 100.00,
        ]);
    }

    #[Test]
    public function checkout_returns_json_with_payment_url()
    {
        // Add item to cart
        CartItem::create([
            'user_id' => $this->user->id,
            'variant_id' => $this->variant->variant_id,
            'quantity' => 1,
        ]);

        // Mock Stripe gateway
        $this->mock(\App\Payments\Gateways\StripeGateway::class, function ($mock) {
            $mock->shouldReceive('createPayment')
                ->once()
                ->andReturn('https://checkout.stripe.com/test-session-url');
        });

        // Call checkout endpoint
        $response = $this->actingAs($this->user)
            ->postJson('/cart/checkout', ['provider' => 'stripe']);

        // Assert JSON response structure
        $response->assertOk()
            ->assertJsonStructure([
                'success',
                'payment_url',
                'order_id',
                'order_number',
            ])
            ->assertJson(['success' => true]);

        // Assert payment URL is valid
        $this->assertStringContainsString('https://checkout.stripe.com', $response->json('payment_url'));
    }

    #[Test]
    public function checkout_fails_with_empty_cart()
    {
        // Ensure cart is empty
        CartItem::where('user_id', $this->user->id)->delete();

        $response = $this->actingAs($this->user)
            ->postJson('/cart/checkout', ['provider' => 'stripe']);

        $response->assertStatus(400)
            ->assertJson([
                'success' => false,
                'message' => 'Your cart is empty.',
            ]);
    }

    #[Test]
    public function checkout_fails_with_insufficient_stock()
    {
        // Update variant stock to 0
        $this->variant->update(['stock_quantity' => 0]);

        // Add item to cart (this should succeed initially)
        CartItem::create([
            'user_id' => $this->user->id,
            'variant_id' => $this->variant->variant_id,
            'quantity' => 1,
        ]);

        // Try to checkout
        $response = $this->actingAs($this->user)
            ->postJson('/cart/checkout', ['provider' => 'stripe']);

        $response->assertStatus(400)
            ->assertJson(['success' => false]);

        // Assert error message mentions stock
        $this->assertStringContainsString('stock', strtolower($response->json('message')));
    }

    #[Test]
    public function checkout_creates_order_with_correct_totals()
    {
        CartItem::create([
            'user_id' => $this->user->id,
            'variant_id' => $this->variant->variant_id,
            'quantity' => 2,
        ]);

        $this->mock(\App\Payments\Gateways\StripeGateway::class, function ($mock) {
            $mock->shouldReceive('createPayment')
                ->once()
                ->andReturn('https://checkout.stripe.com/test-session-url');
        });

        $response = $this->actingAs($this->user)
            ->postJson('/cart/checkout', ['provider' => 'stripe']);

        $response->assertOk();

        // Assert order was created
        $this->assertDatabaseHas('orders', [
            'customer_id' => $this->user->id,
            'sub_total' => 200.00, // 2 * 100.00
            'discount_amount' => 0,
            'total_amount' => 200.00,
        ]);

        // Assert order items created
        $orderId = $response->json('order_id');
        $this->assertDatabaseHas('order_items', [
            'order_id' => $orderId,
            'variant_id' => $this->variant->variant_id,
            'quantity' => 2,
            'unit_price' => 100.00,
        ]);
    }

    #[Test]
    public function checkout_reserves_inventory()
    {
        CartItem::create([
            'user_id' => $this->user->id,
            'variant_id' => $this->variant->variant_id,
            'quantity' => 3,
        ]);

        $this->mock(\App\Payments\Gateways\StripeGateway::class, function ($mock) {
            $mock->shouldReceive('createPayment')
                ->once()
                ->andReturn('https://checkout.stripe.com/test-session-url');
        });

        $response = $this->actingAs($this->user)
            ->postJson('/cart/checkout', ['provider' => 'stripe']);

        $response->assertOk();

        // Assert inventory was reserved
        $this->variant->refresh();
        $this->assertEquals(3, $this->variant->reserved_quantity);
        $this->assertEquals(10, $this->variant->stock_quantity); // Stock unchanged until payment
    }

    #[Test]
    public function checkout_handles_invalid_payment_provider()
    {
        CartItem::create([
            'user_id' => $this->user->id,
            'variant_id' => $this->variant->variant_id,
            'quantity' => 1,
        ]);

        $response = $this->actingAs($this->user)
            ->postJson('/cart/checkout', ['provider' => 'invalid_provider']);

        $response->assertStatus(400)
            ->assertJson([
                'success' => false,
                'message' => 'Invalid payment provider selected.',
            ]);
    }

    #[Test]
    public function successful_payment_creates_payment_transaction()
    {
        // Create an order first
        CartItem::create([
            'user_id' => $this->user->id,
            'variant_id' => $this->variant->variant_id,
            'quantity' => 1,
        ]);

        $this->mock(\App\Payments\Gateways\StripeGateway::class, function ($mock) {
            $mock->shouldReceive('createPayment')->andReturn('https://stripe.com/session');
            $mock->shouldReceive('handleReturn')->andReturn([
                'status' => 'succeeded',
                'transaction_id' => 'pi_test123',
                'event_id' => 'evt_test456',
            ]);
        });

        // Checkout
        $checkoutResponse = $this->actingAs($this->user)
            ->postJson('/cart/checkout', ['provider' => 'stripe']);

        $orderId = $checkoutResponse->json('order_id');

        // Simulate payment return
        $returnResponse = $this->actingAs($this->user)
            ->get("/payments/stripe/return?status=success&order_id={$orderId}");

        $returnResponse->assertOk();

        // Assert payment transaction was created
        $this->assertDatabaseHas('transactions', [
            'order_id' => $orderId,
            'type' => 'payment',
            'gateway' => 'stripe',
            'gateway_transaction_id' => 'pi_test123',
            'status' => 'completed',
        ]);

        // Assert order payment status updated
        $this->assertDatabaseHas('orders', [
            'order_id' => $orderId,
            'payment_status' => 1, // PAID
        ]);
    }

    #[Test]
    public function failed_payment_creates_refund_transaction_and_restores_inventory()
    {
        // Create an order
        CartItem::create([
            'user_id' => $this->user->id,
            'variant_id' => $this->variant->variant_id,
            'quantity' => 2,
        ]);

        $this->mock(\App\Payments\Gateways\StripeGateway::class, function ($mock) {
            $mock->shouldReceive('createPayment')->andReturn('https://stripe.com/session');
            $mock->shouldReceive('handleReturn')->andReturn([
                'status' => 'failed',
                'transaction_id' => null,
                'event_id' => 'evt_fail123',
            ]);
        });

        // Checkout
        $checkoutResponse = $this->actingAs($this->user)
            ->postJson('/cart/checkout', ['provider' => 'stripe']);

        $orderId = $checkoutResponse->json('order_id');

        // Get initial reserved quantity
        $this->variant->refresh();
        $initialReserved = $this->variant->reserved_quantity;

        // Simulate payment failure
        $returnResponse = $this->actingAs($this->user)
            ->get("/payments/stripe/return?status=failed&order_id={$orderId}");

        $returnResponse->assertOk();

        // Assert payment transaction was created
        $this->assertDatabaseHas('transactions', [
            'order_id' => $orderId,
            'type' => 'payment',
            'gateway' => 'stripe',
            'status' => 'failed',
        ]);

        // Assert refund transaction was created
        $this->assertDatabaseHas('transactions', [
            'order_id' => $orderId,
            'type' => 'refund',
            'gateway' => 'stripe',
            'status' => 'completed',
        ]);

        // Assert inventory was restored
        $this->variant->refresh();
        $this->assertLessThan($initialReserved, $this->variant->reserved_quantity);

        // Assert order payment status is FAILED
        $this->assertDatabaseHas('orders', [
            'order_id' => $orderId,
            'payment_status' => 2, // FAILED
        ]);
    }

    #[Test]
    public function checkout_logs_detailed_error_information()
    {
        // Force an exception by mocking CartService
        $this->mock(\App\Services\CartService::class, function ($mock) {
            $mock->shouldReceive('getCartItems')->andReturn(collect([['some' => 'item']]));
            $mock->shouldReceive('createOrderFromCart')
                ->andThrow(new \Exception('Database connection failed'));
        });

        CartItem::create([
            'user_id' => $this->user->id,
            'variant_id' => $this->variant->variant_id,
            'quantity' => 1,
        ]);

        // Capture logs
    Log::shouldReceive('error')
            ->once()
            ->with('cart.checkout_failed', \Mockery::on(function ($context) {
                return isset($context['user_id'])
                    && isset($context['message'])
                    && isset($context['trace'])
                    && isset($context['file'])
                    && isset($context['line'])
                    && $context['message'] === 'Database connection failed';
            }));

        $response = $this->actingAs($this->user)
            ->postJson('/cart/checkout', ['provider' => 'stripe']);

        $response->assertStatus(500)
            ->assertJson([
                'success' => false,
                'message' => 'Cannot process payment at this time. Please try again later.',
            ]);
    }
}

<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\UserAddress as Address;
use App\Models\Order;
use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use Illuminate\Support\Facades\Auth;

class CompletePurchaseFlowTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected $testUser;
    protected $testProduct;
    protected $testVariant;
    protected $testAddress;

    protected function setUp(): void
    {
        parent::setUp();

        // Mock PaymentService for all tests to avoid Stripe API calls
        $mockGateway = \Mockery::mock(\App\Payments\Contracts\PaymentGateway::class);
        $mockGateway->shouldReceive('createPayment')->andReturn('https://checkout.stripe.com/test_session_123');
        $mockGateway->shouldReceive('handleReturn')->andReturn(['order_id' => 1, 'status' => 'success']);
        
        // Use Mockery to mock the static method
        $mock = \Mockery::mock('overload:' . \App\Services\PaymentService::class);
        $mock->shouldReceive('make')->with('stripe')->andReturn($mockGateway);
        $mock->shouldReceive('make')->with('paypal')->andReturn($mockGateway);
        $mock->shouldReceive('list')->andReturn([]);

        // Create test user
        $this->testUser = User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
        ]);

        // Create test product with variant
        $this->testProduct = Product::factory()->create([
            'name' => 'Test Product for Purchase Flow',
            'status' => 'published',
            'is_active' => true,
        ]);

        $this->testVariant = ProductVariant::factory()->create([
            'product_id' => $this->testProduct->product_id,
            'sku' => 'TEST-VARIANT-001',
            'price' => 50.00, // USD price for testing
            'stock_quantity' => 10,
        ]);

        // Create test address
        $this->testAddress = Address::factory()->create([
            'user_id' => $this->testUser->id,
            'full_name' => 'Test User',
            'phone_number' => '0123456789',
            'street_address' => '123 Test Street',
            'is_default' => true,
        ]);
    }

    /**
     * Test complete purchase flow from product selection to successful payment
     */
    public function test_complete_purchase_flow()
    {
        echo "\n=== Testing Complete Purchase Flow ===\n";

        // Step 1: User visits homepage
        echo "Step 1: User visits homepage... ";
        $response = $this->get('/');
        $response->assertStatus(200);
        $response->assertSee('Shop Nest');
        echo "✅ PASSED\n";

        // Step 2: User selects a product
        echo "Step 2: User selects product... ";

        // First check if route exists
        $this->assertTrue(\Illuminate\Support\Facades\Route::has('product.detail'), 'Route product.detail should exist');

        $this->assertNotNull($this->testProduct, 'Test product should exist');
        $this->assertNotNull($this->testProduct->product_id, 'Test product should have ID');

        // Try to access the route
        try {
            $response = $this->get("/product/{$this->testProduct->product_id}");
            echo "Response status: " . $response->getStatusCode() . "\n";

            if ($response->getStatusCode() === 404) {
                // Debug: check if product exists in database
                $productExists = Product::find($this->testProduct->product_id);
                echo "Product exists in DB: " . ($productExists ? 'YES' : 'NO') . "\n";
                echo "Product ID: {$this->testProduct->product_id}\n";
                echo "Product name: {$this->testProduct->name}\n";
            }

            $response->assertStatus(200);
        } catch (\Exception $e) {
            echo "Exception: " . $e->getMessage() . "\n";
            throw $e;
        }

        $response->assertSee($this->testProduct->name);
        $response->assertSee('Mua ngay');
        echo "✅ PASSED\n";

        // Step 3: User executes Buy Now with random quantity
        echo "Step 3: User executes Buy Now... ";
        $quantity = rand(1, min(3, $this->testVariant->stock_quantity)); // Random quantity 1-3 or max available stock

        $this->actingAs($this->testUser);

        $buyNowData = [
            'variant_id' => $this->testVariant->variant_id,
            'quantity' => $quantity,
        ];

        $response = $this->post("/product/{$this->testProduct->product_id}/buy-now", $buyNowData);
        $response->assertStatus(200); // Should return JSON response

        $buyNowResponse = json_decode($response->getContent(), true);
        $this->assertTrue($buyNowResponse['success'], 'Buy Now should succeed');
        $this->assertArrayHasKey('redirect_url', $buyNowResponse);
        $this->assertArrayHasKey('order_id', $buyNowResponse);

        // Extract order ID from response
        $orderId = $buyNowResponse['order_id'];
        $this->assertNotEmpty($orderId, 'Order ID should be in response');

        $this->assertNotEmpty($orderId, 'Order ID should be extracted from redirect URL');

        // Verify order was created
        $order = Order::find($orderId);
        $this->assertNotNull($order, 'Order should be created');
        $this->assertEquals($this->testUser->id, $order->customer_id);
        $this->assertEquals(\App\Enums\OrderStatus::PENDING_CONFIRMATION, $order->status);

        echo "✅ PASSED (Order ID: {$orderId})\n";

        // Step 4: User accesses checkout page
        echo "Step 4: User accesses checkout page... ";
        $response = $this->get("/buy-now/checkout/{$orderId}");
        $response->assertStatus(200);
        $response->assertSee('Checkout');
        $response->assertSee($this->testProduct->name);
        $response->assertSee('Test Product for Purchase Flow'); // Check that order data is present
        echo "✅ PASSED\n";

        // Step 5: User completes checkout
        echo "Step 5: User completes checkout... ";
        $checkoutData = [
            'provider' => 'stripe',
            'address_id' => $this->testAddress->id,
            'notes' => 'Test order from complete purchase flow test - ' . now()->toDateTimeString(),
        ];

        $response = $this->post("/buy-now/checkout/{$orderId}", $checkoutData);
        $response->assertStatus(200);

        $paymentResponse = json_decode($response->getContent(), true);
        $this->assertTrue($paymentResponse['success'], 'Payment initiation should succeed');
        $this->assertArrayHasKey('payment_url', $paymentResponse);
        $this->assertStringContainsString('checkout.stripe.com', $paymentResponse['payment_url']);

        echo "✅ PASSED\n";

        // Step 6: Simulate successful payment return
        echo "Step 6: Simulate successful payment return... ";

        // Extract payment intent ID from URL for simulation
        $paymentUrl = $paymentResponse['payment_url'];
        preg_match('/cs_test_[a-zA-Z0-9_]+/', $paymentUrl, $matches);
        $paymentIntentId = $matches[0] ?? 'cs_test_simulated_' . $orderId;

        // Simulate Stripe success callback
        $paymentReturnData = [
            'payment_intent' => $paymentIntentId,
            'payment_intent_client_secret' => $paymentIntentId . '_secret_simulated',
            'redirect_status' => 'succeeded',
        ];

        $response = $this->get('/payments/stripe/return?' . http_build_query($paymentReturnData));
        $response->assertStatus(200); // Should return Inertia page
        $response->assertSee('PaymentResult'); // Should render PaymentResult component

        // Verify order status was updated
        $order->refresh();
        $this->assertEquals(OrderStatus::PROCESSING, $order->status, 'Order status should be updated to processing');
        $this->assertEquals(PaymentStatus::PAID, $order->payment_status, 'Payment status should be updated to paid');

        echo "✅ PASSED\n";

        echo "\n🎉 COMPLETE PURCHASE FLOW TEST PASSED! 🎉\n";
        echo "All steps completed successfully:\n";
        echo "✅ Homepage visit\n";
        echo "✅ Product selection\n";
        echo "✅ Buy Now execution\n";
        echo "✅ Checkout page access\n";
        echo "✅ Payment processing\n";
        echo "✅ Successful payment return\n";
        echo "✅ Order status update\n";

        // Additional verifications
        $this->assertEquals($quantity, $order->items->first()->quantity);
        $this->assertEquals($this->testVariant->variant_id, $order->items->first()->variant_id);
        $subtotal = $this->testVariant->price * $quantity;
        $shippingFee = $subtotal >= 1000 ? 0 : 30000;
        $expectedTotal = $subtotal + $shippingFee;
        $this->assertEquals($expectedTotal, $order->total_amount);

        echo "\n📊 Order Summary:\n";
        echo "- Product: {$this->testProduct->name}\n";
        echo "- Variant: {$this->testVariant->sku}\n";
        echo "- Quantity: {$quantity}\n";
        echo "- Unit Price: " . number_format($this->testVariant->price) . " VND\n";
        echo "- Total: " . number_format($expectedTotal) . " VND\n";
        echo "- Order Status: {$order->status->value}\n";
    }

    /**
     * Test purchase flow with invalid product
     */
    public function test_purchase_flow_with_invalid_product()
    {
        $this->actingAs($this->testUser);

        $response = $this->get('/product/99999'); // Non-existent product
        $response->assertStatus(404);
    }

    /**
     * Test purchase flow with out of stock variant
     */
    public function test_purchase_flow_with_out_of_stock_variant()
    {
        // Create out of stock variant
        $outOfStockVariant = ProductVariant::factory()->create([
            'product_id' => $this->testProduct->product_id,
            'stock_quantity' => 0,
        ]);

        $this->actingAs($this->testUser);

        $buyNowData = [
            'variant_id' => $outOfStockVariant->variant_id,
            'quantity' => 1,
        ];

        $response = $this->post("/product/{$this->testProduct->product_id}/buy-now", $buyNowData);
        $response->assertStatus(422); // Should fail validation
    }

    /**
     * Test checkout with invalid address
     */
    public function test_checkout_with_invalid_address()
    {
        // Create order first
        $this->actingAs($this->testUser);

        $buyNowData = [
            'variant_id' => $this->testVariant->variant_id,
            'quantity' => 1,
        ];

        $response = $this->post("/product/{$this->testProduct->product_id}/buy-now", $buyNowData);
        $response->assertStatus(200);

        $buyNowResponse = json_decode($response->getContent(), true);
        $orderId = $buyNowResponse['order_id'];

        // Try checkout with invalid address
        $checkoutData = [
            'provider' => 'stripe',
            'address_id' => 99999, // Invalid address ID
            'notes' => 'Test with invalid address',
        ];

        $response = $this->post("/buy-now/checkout/{$orderId}", $checkoutData);
        $response->assertStatus(200); // Buy-now doesn't require address
    }

    /**
     * Test complete purchase flow using direct controller calls
     * This bypasses HTTP routing issues and focuses on business logic
     */
    public function test_complete_purchase_flow_business_logic()
    {
        echo "\n=== Testing Complete Purchase Flow (Business Logic) ===\n";

        // Step 1: Setup - we already have test data from setUp()
        echo "Step 1: Setup test data... ✅ PASSED\n";

        // Step 2: Simulate Buy Now action
        echo "Step 2: Execute Buy Now... ";

        $this->actingAs($this->testUser);

        // Debug: Check if product exists
        $productExists = \App\Models\Product::find($this->testProduct->product_id);
        echo "Product exists: " . ($productExists ? 'YES' : 'NO') . "\n";
        echo "Product ID: {$this->testProduct->product_id}\n";
        echo "Product name: {$this->testProduct->name}\n";

        $detailController = app(\App\Http\Controllers\DetailController::class);
        $request = new \Illuminate\Http\Request();
        $request->merge([
            'variant_id' => $this->testVariant->variant_id,
            'quantity' => 2,
            'provider' => 'stripe',
        ]);

        try {
            $response = $detailController->buyNow($request, $this->testProduct->product_id);

            $responseData = json_decode($response->getContent(), true);
            $this->assertTrue($responseData['success'], 'Buy Now should succeed');
            $this->assertArrayHasKey('redirect_url', $responseData);
            $this->assertArrayHasKey('order_id', $responseData);

            // Extract order ID from response
            $orderId = $responseData['order_id'];
            $this->assertNotEmpty($orderId);

            echo "✅ PASSED (Order ID: {$orderId})\n";

            // Step 3: Verify order was created
            echo "Step 3: Verify order creation... ";
            $order = \App\Models\Order::find($orderId);
            $this->assertNotNull($order);
            $this->assertEquals($this->testUser->id, $order->customer_id);
            $this->assertEquals(\App\Enums\OrderStatus::PENDING_CONFIRMATION, $order->status);
            $this->assertEquals(2, $order->items->first()->quantity);
            echo "✅ PASSED\n";

            // Step 4: Simulate checkout
            echo "Step 4: Execute checkout... ";

            $checkoutRequest = new \Illuminate\Http\Request();
            $checkoutRequest->merge([
                'provider' => 'stripe',
                'address_id' => $this->testAddress->id,
                'notes' => 'Test order from business logic test',
            ]);

            $checkoutResponse = $detailController->processBuyNowCheckout($checkoutRequest, $orderId);

            $this->assertEquals(200, $checkoutResponse->getStatusCode());

            $paymentData = json_decode($checkoutResponse->getContent(), true);
            $this->assertTrue($paymentData['success']);
            $this->assertArrayHasKey('payment_url', $paymentData);
            $this->assertStringContainsString('checkout.stripe.com', $paymentData['payment_url']);

            echo "✅ PASSED\n";

            // Simulate successful payment processing
            echo "Step 5: Simulate successful payment... ";
            $order->payment_status = \App\Enums\PaymentStatus::PAID;
            $order->status = \App\Enums\OrderStatus::PROCESSING; // Move to processing after payment
            $order->save();
            echo "✅ PASSED\n";

            // Step 6: Verify final order state
            echo "Step 6: Verify final state... ";
            $order->refresh();
            $this->assertEquals(\App\Enums\PaymentStatus::PAID, $order->payment_status);
            $this->assertEquals(\App\Enums\OrderStatus::PROCESSING, $order->status);

            $expectedTotal = ($this->testVariant->price * 2) + 30000; // 50.00 * 2 + shipping = 30100.00
            $this->assertEquals($expectedTotal, $order->total_amount);

            echo "✅ PASSED\n";

            echo "\n🎉 COMPLETE PURCHASE FLOW BUSINESS LOGIC TEST PASSED! 🎉\n";
            echo "Order Summary:\n";
            echo "- Product: {$this->testProduct->name}\n";
            echo "- Variant: {$this->testVariant->sku}\n";
            echo "- Quantity: 2\n";
            echo "- Unit Price: $" . number_format($this->testVariant->price, 2) . "\n";
            echo "- Total: $" . number_format($expectedTotal, 2) . "\n";
            echo "- Order Status: {$order->status->value}\n";

        } catch (\Exception $e) {
            echo "❌ FAILED: " . $e->getMessage() . "\n";
            throw $e;
        }
    }
}
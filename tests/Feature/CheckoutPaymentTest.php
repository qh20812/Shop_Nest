<?php

namespace Tests\Feature;

use App\Enums\PaymentStatus;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\User;
use App\Models\UserAddress;
use App\Payments\Gateways\StripeGateway;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class CheckoutPaymentTest extends TestCase
{
    use RefreshDatabase;

    private User $user;

    private UserAddress $address;

    private ProductVariant $variant;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->address = UserAddress::factory()->create([
            'user_id' => $this->user->id,
            'is_default' => true,
        ]);

        $product = Product::factory()->create(['status' => 1]);

        $this->variant = ProductVariant::factory()->create([
            'product_id' => $product->product_id,
            'stock_quantity' => 10,
            'price' => 100000,
            'discount_price' => null,
        ]);
    }

    private function addToCart(int $quantity = 1): void
    {
        CartItem::create([
            'user_id' => $this->user->id,
            'variant_id' => $this->variant->variant_id,
            'quantity' => $quantity,
        ]);
    }

    #[Test]
    public function stripe_checkout_returns_payment_url_and_creates_order(): void
    {
        $this->addToCart();

        $this->mock(StripeGateway::class, function ($mock) {
            $mock->shouldReceive('createPayment')
                ->once()
                ->andReturn('https://checkout.stripe.com/test-session-url');
        });

        $response = $this->actingAs($this->user)->postJson(route('checkout.store'), [
            'provider' => 'stripe',
            'address_id' => $this->address->id,
        ]);

        $response->assertOk()->assertJson([
            'success' => true,
            'payment_url' => 'https://checkout.stripe.com/test-session-url',
        ]);

        $order = Order::where('customer_id', $this->user->id)->latest('order_id')->first();

        $this->assertNotNull($order);
        $this->assertSame(3, (int) $order->payment_method);
        $this->assertSame(PaymentStatus::UNPAID, $order->payment_status);
        $this->assertSame(0, CartItem::where('user_id', $this->user->id)->count());
    }

    #[Test]
    public function cod_checkout_redirects_to_order_page_and_stays_unpaid(): void
    {
        $this->addToCart();

        $response = $this->actingAs($this->user)->postJson(route('checkout.store'), [
            'provider' => 'cod',
            'address_id' => $this->address->id,
        ]);

        $response->assertOk()->assertJson(['success' => true]);

        $order = Order::where('customer_id', $this->user->id)->latest('order_id')->first();

        $this->assertNotNull($order);
        $this->assertSame(1, (int) $order->payment_method);
        $this->assertSame(PaymentStatus::UNPAID, $order->payment_status);
        $this->assertSame(route('user.orders.show', $order->order_id), $response->json('payment_url'));
    }

    #[Test]
    public function checkout_fails_with_empty_cart(): void
    {
        $response = $this->actingAs($this->user)->postJson(route('checkout.store'), [
            'provider' => 'stripe',
            'address_id' => $this->address->id,
        ]);

        $response->assertStatus(400)->assertJson(['success' => false]);
    }

    #[Test]
    public function checkout_rejects_removed_payment_providers(): void
    {
        $this->addToCart();

        foreach (['paypal', 'vnpay', 'momo'] as $provider) {
            $response = $this->actingAs($this->user)->postJson(route('checkout.store'), [
                'provider' => $provider,
                'address_id' => $this->address->id,
            ]);

            $response->assertStatus(422);
        }
    }

    #[Test]
    public function checkout_requires_an_address_owned_by_the_user(): void
    {
        $this->addToCart();

        $foreignAddress = UserAddress::factory()->create();

        $response = $this->actingAs($this->user)->postJson(route('checkout.store'), [
            'provider' => 'cod',
            'address_id' => $foreignAddress->id,
        ]);

        $response->assertStatus(422)->assertJson(['success' => false]);
    }

    #[Test]
    public function guests_cannot_checkout(): void
    {
        $response = $this->postJson(route('checkout.store'), [
            'provider' => 'cod',
            'address_id' => $this->address->id,
        ]);

        $response->assertStatus(401);
    }
}

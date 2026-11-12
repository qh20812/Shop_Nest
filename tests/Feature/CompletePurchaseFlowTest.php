<?php

namespace Tests\Feature;

use App\Enums\OrderStatus;
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

class CompletePurchaseFlowTest extends TestCase
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
            'price' => 120000,
            'discount_price' => null,
        ]);

        CartItem::create([
            'user_id' => $this->user->id,
            'variant_id' => $this->variant->variant_id,
            'quantity' => 2,
        ]);

        $this->actingAs($this->user);
    }

    #[Test]
    public function cod_purchase_flow_creates_order_and_clears_cart(): void
    {
        $response = $this->postJson(route('checkout.store'), [
            'provider' => 'cod',
            'address_id' => $this->address->id,
            'notes' => 'Giao ngoài giờ hành chính',
        ]);

        $response->assertOk()->assertJson(['success' => true]);

        $order = Order::where('customer_id', $this->user->id)->latest('order_id')->firstOrFail();

        $this->assertSame(OrderStatus::PENDING_CONFIRMATION, $order->status);
        $this->assertSame(PaymentStatus::UNPAID, $order->payment_status);
        $this->assertSame(1, (int) $order->payment_method);
        $this->assertSame('VND', $order->currency);
        $this->assertSame(2, (int) $order->items()->sum('quantity'));
        $this->assertSame(0, CartItem::where('user_id', $this->user->id)->count());
    }

    #[Test]
    public function stripe_purchase_flow_returns_gateway_url(): void
    {
        $this->mock(StripeGateway::class, function ($mock) {
            $mock->shouldReceive('createPayment')
                ->once()
                ->andReturn('https://checkout.stripe.com/full-flow-session');
        });

        $response = $this->postJson(route('checkout.store'), [
            'provider' => 'stripe',
            'address_id' => $this->address->id,
        ]);

        $response->assertOk()->assertJson([
            'success' => true,
            'payment_url' => 'https://checkout.stripe.com/full-flow-session',
        ]);

        $order = Order::where('customer_id', $this->user->id)->latest('order_id')->firstOrFail();

        $this->assertSame(3, (int) $order->payment_method);
        $this->assertSame(PaymentStatus::UNPAID, $order->payment_status);
    }

    #[Test]
    public function order_shows_up_in_customer_order_history(): void
    {
        $this->postJson(route('checkout.store'), [
            'provider' => 'cod',
            'address_id' => $this->address->id,
        ])->assertOk();

        $order = Order::where('customer_id', $this->user->id)->latest('order_id')->firstOrFail();

        $this->get(route('user.orders.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Customer/Orders/Index')
                ->where('orders.0.code', $order->order_number));
    }

    #[Test]
    public function purchase_requires_authentication(): void
    {
        auth()->logout();

        $this->postJson(route('checkout.store'), [
            'provider' => 'cod',
            'address_id' => $this->address->id,
        ])->assertStatus(401);
    }
}

<?php

namespace Tests\Feature\Checkout;

use App\Models\CartItem;
use App\Models\Order;
use App\Models\ProductVariant;
use App\Models\Promotion;
use App\Models\User;
use App\Models\UserAddress;
use App\Payments\Gateways\StripeGateway;
use App\Services\PaymentService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Mockery;
use Tests\TestCase;

class CheckoutControllerTest extends TestCase
{
	use RefreshDatabase;

	protected function tearDown(): void
	{
		Mockery::close();

		parent::tearDown();
	}

	public function test_index_renders_checkout_summary_with_vnd_amounts(): void
	{
	/** @var User $user */
	$user = User::factory()->create();
		$address = UserAddress::factory()->create([
			'user_id' => $user->id,
			'is_default' => true,
		]);

		$variant = ProductVariant::factory()->create([
			'price' => 250_000,
			'discount_price' => null,
		]);

		CartItem::factory()
			->for($user)
			->for($variant, 'variant')
			->create(['quantity' => 2]);

		$this->actingAs($user);

		$response = $this->get(route('checkout.index'));

		$response->assertStatus(200);
		$response->assertInertia(function (Assert $page) use ($variant, $address) {
			$page->component('Customer/Checkout')
				->where('subtotal', fn ($value) => (float) $value === 500_000.0)
				->where('shipping', fn ($value) => (float) $value === 30_000.0)
				->where('discount', fn ($value) => (float) $value === 0.0)
				->where('total', fn ($value) => (float) $value === 530_000.0)
				->where('paymentMethods', PaymentService::list())
				->where('addresses', function ($addresses) use ($address) {
					return count($addresses) === 1
						&& $addresses[0]['id'] === $address->id
						&& $addresses[0]['name'] === $address->full_name
						&& $addresses[0]['phone'] === $address->phone_number;
				})
				->where('cartItems', function ($items) use ($variant) {
					return count($items) === 1
						&& $items[0]['variant']['id'] === $variant->getKey()
						&& (float) $items[0]['total_price'] === 500_000.0;
				});
		});
	}

	public function test_store_creates_vnd_order_and_returns_payment_redirect(): void
	{
	/** @var User $user */
	$user = User::factory()->create();
		$address = UserAddress::factory()->create([
			'user_id' => $user->id,
			'is_default' => true,
		]);

		$variant = ProductVariant::factory()->create([
			'price' => 250_000,
			'discount_price' => null,
		]);

		CartItem::factory()
			->for($user)
			->for($variant, 'variant')
			->create(['quantity' => 2]);

		$promotion = Promotion::factory()->create([
			'type' => 1,
			'value' => 10,
			'max_discount_amount' => 50_000,
		]);

		$gatewayMock = Mockery::mock(StripeGateway::class);
		$gatewayMock
			->shouldReceive('createPayment')
			->once()
			->with(Mockery::type(Order::class))
			->andReturn('https://stripe.test/checkout');

		$this->app->instance(StripeGateway::class, $gatewayMock);

		$this->actingAs($user);

		$response = $this
			->withSession([
				'applied_promotion' => [
					'promotion_id' => $promotion->promotion_id,
					'type' => 'percentage',
					'discount' => 10,
					'max_discount_amount' => 50_000,
				],
			])
			->postJson(route('checkout.store'), [
				'provider' => 'stripe',
				'address_id' => $address->id,
				'notes' => 'Handle with care',
			]);

		$response->assertStatus(200);
		$response->assertJson([
			'success' => true,
			'payment_url' => 'https://stripe.test/checkout',
		]);

		$order = Order::where('customer_id', $user->id)->first();

		$this->assertNotNull($order);
		$this->assertSame('VND', $order->currency);
		$this->assertSame(1.0, (float) $order->exchange_rate);
		$this->assertSame((float) $order->total_amount, (float) $order->total_amount_base);
		$this->assertSame(500_000.0, (float) $order->sub_total);
		$this->assertSame(30_000.0, (float) $order->shipping_fee);
		$this->assertSame(50_000.0, (float) $order->discount_amount);
		$this->assertSame(480_000.0, (float) $order->total_amount);
		$this->assertSame('unpaid', $order->payment_status->value);

		$orderItem = $order->items()->first();
		$this->assertNotNull($orderItem);
		$this->assertSame($variant->getKey(), $orderItem->variant_id);
		$this->assertSame(2, (int) $orderItem->quantity);
		$this->assertSame(250_000.0, (float) $orderItem->unit_price);
		$this->assertSame(500_000.0, (float) $orderItem->total_price);

		$this->assertDatabaseMissing('cart_items', [
			'user_id' => $user->id,
		]);
	}
}

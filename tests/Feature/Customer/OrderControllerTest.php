<?php

namespace Tests\Feature\Customer;

use App\Enums\OrderStatus;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\ProductVariant;
use App\Models\User;
use App\Models\UserAddress;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_order_from_cart(): void
    {
        $user = User::factory()->create();
        $address = UserAddress::factory()->create(['user_id' => $user->id]);
        $variant = ProductVariant::factory()->create([
            'price' => 125000,
            'discount_price' => 100000,
        ]);

        CartItem::factory()->create([
            'user_id' => $user->id,
            'variant_id' => $variant->variant_id,
            'quantity' => 2,
        ]);

        $response = $this->actingAs($user)->post(route('user.orders.store'), [
            'address_id' => $address->id,
            'payment_method' => 'cod',
        ]);

        $order = Order::where('customer_id', $user->id)->first();

        $this->assertNotNull($order);
        $response->assertRedirect(route('user.orders.show', $order->order_id));

        $this->assertDatabaseHas('orders', [
            'order_id' => $order->order_id,
            'status' => OrderStatus::PENDING_CONFIRMATION->value,
        ]);

        $this->assertDatabaseHas('order_items', [
            'order_id' => $order->order_id,
            'variant_id' => $variant->variant_id,
            'quantity' => 2,
        ]);
    }

    public function test_store_requires_items_in_cart(): void
    {
        $user = User::factory()->create();
        $address = UserAddress::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->from('/previous')->post(route('user.orders.store'), [
            'address_id' => $address->id,
            'payment_method' => 'cod',
        ]);

        $response->assertRedirect('/previous');
        $response->assertSessionHasErrors('cart');
    }

    public function test_user_can_cancel_pending_order(): void
    {
        $user = User::factory()->create();
        $order = Order::factory()->create([
            'customer_id' => $user->id,
            'status' => OrderStatus::PENDING_CONFIRMATION->value,
        ]);

        $response = $this->actingAs($user)->post(route('user.orders.cancel', $order->order_id), [
            'reason' => 'Customer changed mind',
        ]);

        $response->assertRedirect(route('user.orders.show', $order->order_id));

    $order->refresh();
    $this->assertSame(OrderStatus::CANCELLED, $order->status);
    }

    public function test_user_cannot_cancel_foreign_order(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();
        $order = Order::factory()->create([
            'customer_id' => $other->id,
            'status' => OrderStatus::PENDING_CONFIRMATION->value,
        ]);

        $response = $this->actingAs($user)->post(route('user.orders.cancel', $order->order_id), [
            'reason' => 'Not allowed',
        ]);

        $response->assertStatus(403);
    }

    public function test_user_can_reorder_delivered_order(): void
    {
        $user = User::factory()->create();
        $order = Order::factory()->create([
            'customer_id' => $user->id,
            'status' => OrderStatus::DELIVERED->value,
        ]);

        $variant = ProductVariant::factory()->create();

        OrderItem::factory()->create([
            'order_id' => $order->order_id,
            'variant_id' => $variant->variant_id,
            'quantity' => 1,
        ]);

        $response = $this->actingAs($user)->post(route('user.orders.reorder', $order->order_id));

        $response->assertRedirect(route('cart.index'));
        $this->assertDatabaseHas('cart_items', [
            'user_id' => $user->id,
            'variant_id' => $variant->variant_id,
            'quantity' => 1,
        ]);
    }
}
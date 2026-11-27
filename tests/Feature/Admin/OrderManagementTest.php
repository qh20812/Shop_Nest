<?php

namespace Tests\Feature\Admin;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Role;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class OrderManagementTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected User $customer;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RoleSeeder::class);
        app()->setLocale('en');

        $this->admin = User::factory()->create();
        $this->admin->roles()->attach(Role::where('name->en', 'Admin')->first());

        $this->customer = User::factory()->create();
        $this->customer->roles()->attach(Role::where('name->en', 'Customer')->first());
    }

    public function test_admin_can_access_order_management_page(): void
    {
        $response = $this->actingAs($this->admin)->get(route('admin.orders.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Admin/Orders/Index'));
    }

    public function test_admin_can_view_order_detail(): void
    {
        $order = Order::factory()->create();
        $item = OrderItem::factory()->forOrder($order)->create();

        $response = $this->actingAs($this->admin)->get(route('admin.orders.show', $order));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Orders/Show')
            ->where('order.order_number', $order->order_number)
            ->where('order.status', $order->status->value)
            ->where('order.payment_status', $order->payment_status->value)
            ->has('order.items', 1)
            ->where('order.items.0.variant.variant_id', $item->variant_id)
        );
    }

    public function test_customer_cannot_access_order_management(): void
    {
        $response = $this->actingAs($this->customer)->get(route('admin.orders.index'));

        $response->assertRedirect(route('home'));
        $response->assertSessionHas('error');
    }

    public function test_index_filters_orders_by_status_and_payment(): void
    {
        Order::factory()->create([
            'order_number' => 'ORD-PENDING',
            'status' => OrderStatus::PENDING_CONFIRMATION->value,
            'payment_status' => PaymentStatus::UNPAID->value,
        ]);
        Order::factory()->create([
            'order_number' => 'ORD-PROCESSING',
            'status' => OrderStatus::PROCESSING->value,
            'payment_status' => PaymentStatus::UNPAID->value,
        ]);

        $response = $this->actingAs($this->admin)->get(route('admin.orders.index', [
            'status' => OrderStatus::PROCESSING->value,
            'payment_status' => PaymentStatus::UNPAID->value,
        ]));

        $response->assertInertia(fn ($page) => $page
            ->has('orders.data', 1)
            ->where('orders.data.0.order_number', 'ORD-PROCESSING')
        );
    }

    public function test_index_returns_global_summary_counts(): void
    {
        Order::factory()->create(['status' => OrderStatus::PENDING_CONFIRMATION->value]);
        Order::factory()->create(['status' => OrderStatus::COMPLETED->value]);
        Order::factory()->create(['status' => OrderStatus::DELIVERED->value]);
        Order::factory()->create(['status' => OrderStatus::CANCELLED->value]);
        Order::factory()->create(['status' => OrderStatus::RETURNED->value]);

        $response = $this->actingAs($this->admin)->get(route('admin.orders.index'));

        $response->assertInertia(fn ($page) => $page
            ->where('orderSummary.totalCount', 5)
            ->where('orderSummary.pendingCount', 1)
            ->where('orderSummary.completedCount', 2)
            ->where('orderSummary.cancelledCount', 2)
        );
    }

    public function test_admin_can_assign_shipper_to_order(): void
    {
        $shipper = User::factory()->create(['is_active' => true]);
        $shipper->roles()->attach(Role::where('name->en', 'Shipper')->first());
        $order = Order::factory()->create();

        $response = $this->actingAs($this->admin)->post(route('admin.orders.assignShipper', $order), [
            'shipper_id' => $shipper->id,
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');
        $this->assertDatabaseHas('orders', [
            'order_id' => $order->order_id,
            'shipper_id' => $shipper->id,
            'status' => 'assigned_to_shipper',
        ]);
    }

    public function test_admin_can_refund_paid_order(): void
    {
        $order = Order::factory()->create([
            'currency' => 'VND',
            'payment_status' => PaymentStatus::PAID->value,
        ]);

        DB::table('transactions')->insert([
            'order_id' => $order->order_id,
            'type' => 'payment',
            'amount' => 100,
            'currency' => 'VND',
            'gateway' => 'cod',
            'status' => 'completed',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $response = $this->actingAs($this->admin)->post(route('admin.orders.createRefund', $order), [
            'amount' => 40,
            'reason' => 'Customer request',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');
        $this->assertDatabaseHas('orders', [
            'order_id' => $order->order_id,
            'payment_status' => 'refunded',
        ]);
        $this->assertDatabaseHas('transactions', [
            'order_id' => $order->order_id,
            'type' => 'refund',
            'amount' => 40,
        ]);
    }
}

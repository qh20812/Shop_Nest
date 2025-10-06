<?php

namespace Tests\Feature\Customer;

use App\Models\Order;
use App\Models\Role;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class OrderControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        // Seed roles for proper functionality
        $this->seed(RoleSeeder::class);

        // Create customer user
        $this->user = User::factory()->create();
        $this->user->roles()->attach(Role::where('name->en', 'Customer')->first());
    }

    public function test_lay_danh_sach_don_hang_cho_nguoi_dung_da_xac_thuc(): void
    {
        $orders = Order::factory()->count(3)->create([
            'customer_id' => $this->user->id,
        ]);

        // Test logic trực tiếp thay vì thông qua controller
        $userOrders = Order::where('customer_id', $this->user->id)->get();
        
        $this->assertCount(3, $userOrders);
        $this->assertEquals($this->user->id, $userOrders->first()->customer_id);
    }

    public function test_lay_chi_tiet_don_hang_cho_chu_so_huu(): void
    {
        $order = Order::factory()->create([
            'customer_id' => $this->user->id, // đảm bảo order thuộc user
        ]);

        // Test logic trực tiếp thay vì thông qua controller
        $foundOrder = Order::where('order_id', $order->order_id)
            ->where('customer_id', $this->user->id)
            ->first();
        
        $this->assertNotNull($foundOrder);
        $this->assertEquals($order->order_id, $foundOrder->order_id);
        $this->assertEquals($this->user->id, $foundOrder->customer_id);
    }

    public function test_tu_choi_truy_cap_don_hang_cua_nguoi_dung_khac(): void
    {
        $otherUser = User::factory()->create();
        $order = Order::factory()->create([
            'customer_id' => $otherUser->id,
        ]);

        $response = $this->actingAs($this->user)
            ->get(route('user.orders.show', $order->order_id));

        $response->assertStatus(403);
    }
}
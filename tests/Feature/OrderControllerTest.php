<?php

namespace Tests\Feature\User;

use App\Models\Order;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function it_shows_orders_index_for_authenticated_user(): void
    {
        $orders = Order::factory()->count(3)->create([
            'customer_id' => $this->user->id,
        ]);

        $response = $this->actingAs($this->user)
            ->get(route('user.orders.index'));

        $response->assertStatus(200);

        foreach ($orders as $order) {
            $response->assertSee($order->order_number);
        }
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function it_shows_order_detail_for_owner(): void
    {
        $order = Order::factory()->create([
            'customer_id' => $this->user->id, // đảm bảo order thuộc user
        ]);

        $response = $this->actingAs($this->user)
            ->get(route('user.orders.show', $order->order_id));

        $response->assertStatus(200);
        $response->assertSee($order->order_number);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function it_denies_access_to_order_of_other_user(): void
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

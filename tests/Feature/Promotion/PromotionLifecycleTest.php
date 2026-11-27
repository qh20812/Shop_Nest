<?php

namespace Tests\Feature\Promotion;

use App\Enums\OrderStatus;
use App\Models\CartItem;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Promotion;
use App\Models\PromotionCode;
use App\Models\User;
use App\Models\UserAddress;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class PromotionLifecycleTest extends TestCase
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

        $this->variant = ProductVariant::factory()->create([
            'product_id' => Product::factory()->create(['status' => 'published'])->product_id,
            'price' => 250000,
            'discount_price' => null,
            'stock_quantity' => 20,
        ]);

        CartItem::factory()
            ->for($this->user)
            ->for($this->variant, 'variant')
            ->create(['quantity' => 2]);
    }

    public function test_checkout_applies_cart_promotion_and_records_usage(): void
    {
        [$promotion, $code] = $this->promotionWithCode();

        $response = $this->actingAs($this->user)
            ->withSession([
                'cart.applied_promotion' => [
                    'promotion_id' => $promotion->promotion_id,
                    'promotion_code_id' => $code->promotion_code_id,
                    'code' => $code->code,
                ],
            ])
            ->postJson(route('checkout.store'), [
                'provider' => 'cod',
                'address_id' => $this->address->id,
            ]);

        $response->assertOk()->assertJsonPath('success', true);

        $order = Order::where('customer_id', $this->user->id)->firstOrFail();

        $this->assertSame(50000.0, (float) $order->discount_amount);

        $promotion->refresh();
        $this->assertSame(1, (int) $promotion->used_count);
        $this->assertSame(1, (int) $promotion->daily_usage_count);
        $this->assertSame(50000.0, (float) $promotion->budget_used);
        $this->assertSame(50000.0, (float) $promotion->spent_budget);

        $this->assertSame(1, (int) $code->fresh()->used_count);

        $pivot = DB::table('order_promotion')->where('order_id', $order->order_id)->first();
        $this->assertNotNull($pivot);
        $this->assertNotNull($pivot->recorded_at);
        $this->assertSame((int) $promotion->promotion_id, (int) $pivot->promotion_id);
        $this->assertSame((int) $code->promotion_code_id, (int) $pivot->promotion_code_id);

        $this->assertNull(session('cart.applied_promotion'));
    }

    public function test_cancelling_order_releases_promotion_usage_once(): void
    {
        [$promotion, $code] = $this->promotionWithCode();

        $this->actingAs($this->user)
            ->withSession([
                'cart.applied_promotion' => [
                    'promotion_id' => $promotion->promotion_id,
                    'promotion_code_id' => $code->promotion_code_id,
                    'code' => $code->code,
                ],
            ])
            ->postJson(route('checkout.store'), [
                'provider' => 'cod',
                'address_id' => $this->address->id,
            ])
            ->assertOk();

        $order = Order::where('customer_id', $this->user->id)->firstOrFail();

        $order->update(['status' => OrderStatus::CANCELLED]);
        $order->update(['notes' => 'Cancelled twice']);

        $promotion->refresh();
        $this->assertSame(0, (int) $promotion->used_count);
        $this->assertSame(0.0, (float) $promotion->spent_budget);

        $pivot = DB::table('order_promotion')->where('order_id', $order->order_id)->first();
        $this->assertNotNull($pivot->released_at);
    }

    public function test_usage_and_budget_limits_are_enforced_after_first_order(): void
    {
        [$promotion, $code] = $this->promotionWithCode([
            'usage_limit' => 1,
            'budget_limit' => 40000,
        ]);

        $this->actingAs($this->user)
            ->withSession([
                'cart.applied_promotion' => [
                    'promotion_id' => $promotion->promotion_id,
                    'promotion_code_id' => $code->promotion_code_id,
                    'code' => $code->code,
                ],
            ])
            ->postJson(route('checkout.store'), [
                'provider' => 'cod',
                'address_id' => $this->address->id,
            ])
            ->assertOk();

        $promotion->refresh();

        $this->assertFalse($promotion->canBeUsed());
        $this->assertTrue($promotion->isBudgetExceeded());
        $this->assertSame(1, (int) $promotion->used_count);
    }

    /**
     * @param  array<string, mixed>  $promotionOverrides
     * @return array{0: Promotion, 1: PromotionCode}
     */
    private function promotionWithCode(array $promotionOverrides = []): array
    {
        $promotion = Promotion::factory()->create(array_merge([
            'type' => 1,
            'value' => 10,
            'max_discount_amount' => 50000,
            'start_date' => now()->subDay(),
            'end_date' => now()->addDays(5),
            'is_active' => true,
            'usage_limit' => null,
        ], $promotionOverrides));

        $code = PromotionCode::factory()->create([
            'promotion_id' => $promotion->promotion_id,
            'is_active' => true,
            'usage_limit' => null,
        ]);

        return [$promotion, $code];
    }
}

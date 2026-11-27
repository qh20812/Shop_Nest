<?php

namespace Tests\Feature\Seller;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\Promotion;
use App\Models\Role;
use App\Models\User;
use App\Models\Wallet;
use App\Models\WalletTransaction;
use App\Services\WalletService;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PromotionManagementTest extends TestCase
{
    use RefreshDatabase;

    private User $seller;

    private User $otherSeller;

    private Category $category;

    private Brand $brand;

    private Product $product;

    protected function setUp(): void
    {
        parent::setUp();

        Cache::flush();
        $this->seed(RoleSeeder::class);

        $this->seller = User::factory()->create();
        $this->seller->roles()->attach(Role::where('name->en', 'Seller')->first());

        $this->otherSeller = User::factory()->create();
        $this->otherSeller->roles()->attach(Role::where('name->en', 'Seller')->first());

        $this->category = Category::factory()->create();
        $this->brand = Brand::factory()->create();

        $this->product = Product::factory()->create([
            'seller_id' => $this->seller->id,
            'category_id' => $this->category->category_id,
            'brand_id' => $this->brand->brand_id,
        ]);

        Wallet::create([
            'user_id' => $this->seller->id,
            'balance' => 1000000,
            'total_earned' => 1000000,
            'total_spent' => 0,
            'currency' => 'VND',
            'status' => 'active',
        ]);
    }

    public function test_index_lists_only_own_promotions(): void
    {
        $own = $this->activePromotion(['name' => 'Own promotion']);
        $this->activePromotion(['name' => 'Other promotion', 'seller_id' => $this->otherSeller->id]);

        $this->actingAs($this->seller)
            ->get(route('seller.promotions.index'))
            ->assertInertia(fn (Assert $page) => $page
                ->component('Seller/Promotions/Index')
                ->has('promotions.data', 1)
                ->where('promotions.data.0.promotion_id', $own->promotion_id)
                ->where('promotions.data.0.status', 'active')
            );
    }

    public function test_index_filters_by_search_date_and_budget(): void
    {
        $this->activePromotion(['name' => 'Alpha campaign', 'allocated_budget' => 500000]);
        $this->activePromotion(['name' => 'Beta campaign', 'allocated_budget' => 50000]);
        $old = $this->activePromotion(['name' => 'Old campaign', 'allocated_budget' => 2000000]);
        Promotion::whereKey($old->promotion_id)->update(['created_at' => now()->subDays(60)]);

        $this->actingAs($this->seller)
            ->get(route('seller.promotions.index', ['search' => 'Alpha']))
            ->assertInertia(fn (Assert $page) => $page->has('promotions.data', 1));

        $this->actingAs($this->seller)
            ->get(route('seller.promotions.index', ['date_range' => 'last_7_days']))
            ->assertInertia(fn (Assert $page) => $page->has('promotions.data', 2));

        $this->actingAs($this->seller)
            ->get(route('seller.promotions.index', ['budget_range' => '0-1000000']))
            ->assertInertia(fn (Assert $page) => $page->has('promotions.data', 2));
    }

    public function test_store_creates_promotion_and_deducts_wallet(): void
    {
        $response = $this->actingAs($this->seller)->post(
            route('seller.promotions.store'),
            $this->storePayload(['allocated_budget' => 200000])
        );

        $promotion = Promotion::where('seller_id', $this->seller->id)->firstOrFail();

        $response->assertRedirect(route('seller.promotions.show', $promotion));
        $response->assertSessionHasNoErrors();

        $this->assertSame(1, (int) $promotion->type);
        $this->assertSame(200000.0, (float) $promotion->allocated_budget);
        $this->assertDatabaseHas('promotion_products', [
            'promotion_id' => $promotion->promotion_id,
            'product_id' => $this->product->product_id,
        ]);

        $wallet = Wallet::where('user_id', $this->seller->id)->firstOrFail();
        $this->assertSame(800000.0, (float) $wallet->balance);
        $this->assertDatabaseHas('wallet_transactions', [
            'wallet_id' => $wallet->wallet_id,
            'type' => WalletTransaction::TYPE_PROMOTION_BUDGET,
            'direction' => 'debit',
            'reference_id' => $promotion->promotion_id,
        ]);
        $this->assertDatabaseHas('promotion_audit_logs', [
            'promotion_id' => $promotion->promotion_id,
            'action' => 'created',
        ]);
    }

    public function test_store_rejects_product_owned_by_another_seller(): void
    {
        $foreignProduct = Product::factory()->create([
            'seller_id' => $this->otherSeller->id,
            'category_id' => $this->category->category_id,
            'brand_id' => $this->brand->brand_id,
        ]);

        $response = $this->actingAs($this->seller)->post(
            route('seller.promotions.store'),
            $this->storePayload(['product_ids' => [$foreignProduct->product_id]])
        );

        $response->assertSessionHasErrors('product_ids');
        $this->assertDatabaseCount('promotions', 0);
    }

    public function test_store_rejects_budget_above_wallet_balance(): void
    {
        Wallet::where('user_id', $this->seller->id)->update(['balance' => 10000]);

        $response = $this->actingAs($this->seller)->post(
            route('seller.promotions.store'),
            $this->storePayload(['allocated_budget' => 200000])
        );

        $response->assertSessionHasErrors('allocated_budget');
        $this->assertDatabaseCount('promotions', 0);
    }

    public function test_show_and_edit_pages_render(): void
    {
        $promotion = $this->activePromotion();

        $this->actingAs($this->seller)
            ->get(route('seller.promotions.show', $promotion))
            ->assertInertia(fn (Assert $page) => $page
                ->component('Seller/Promotions/Show')
                ->where('promotion.promotion_id', $promotion->promotion_id)
            );

        $this->actingAs($this->seller)
            ->get(route('seller.promotions.edit', $promotion))
            ->assertInertia(fn (Assert $page) => $page
                ->component('Seller/Promotions/Edit')
                ->where('promotion.promotion_id', $promotion->promotion_id)
            );
    }

    public function test_update_adjusts_budget_and_syncs_products(): void
    {
        $promotion = $this->activePromotion(['allocated_budget' => 200000]);
        $wallet = Wallet::where('user_id', $this->seller->id)->firstOrFail();
        app(WalletService::class)->debit(
            $wallet->wallet_id,
            200000,
            WalletTransaction::TYPE_PROMOTION_BUDGET,
            'Initial budget',
            'promotion',
            $promotion->promotion_id,
        );

        $response = $this->actingAs($this->seller)->put(
            route('seller.promotions.update', $promotion),
            $this->updatePayload(['allocated_budget' => 300000])
        );

        $response->assertSessionHasNoErrors();
        $wallet->refresh();
        $this->assertSame(700000.0, (float) $wallet->balance);
        $this->assertSame(300000.0, (float) $promotion->fresh()->allocated_budget);

        $promotion->update(['spent_budget' => 50000]);

        $this->actingAs($this->seller)->put(
            route('seller.promotions.update', $promotion),
            $this->updatePayload(['allocated_budget' => 100000])
        )->assertSessionHasNoErrors();

        $wallet->refresh();
        $this->assertSame(900000.0, (float) $wallet->balance);
        $this->assertSame(100000.0, (float) $promotion->fresh()->allocated_budget);
        $this->assertSame(100000.0, (float) $wallet->total_spent);
    }

    public function test_update_without_is_active_keeps_paused_state(): void
    {
        $promotion = $this->activePromotion(['is_active' => false]);

        $payload = $this->updatePayload(['allocated_budget' => (float) $promotion->allocated_budget]);
        unset($payload['is_active']);

        $this->actingAs($this->seller)->put(
            route('seller.promotions.update', $promotion),
            $payload
        )->assertSessionHasNoErrors();

        $this->assertFalse((bool) $promotion->fresh()->is_active);
    }

    public function test_pause_and_resume_endpoints(): void
    {
        $promotion = $this->activePromotion();

        $this->actingAs($this->seller)
            ->postJson(route('seller.promotions.pause', $promotion))
            ->assertOk()
            ->assertJsonPath('promotion.is_active', false);

        $this->actingAs($this->seller)
            ->postJson(route('seller.promotions.resume', $promotion))
            ->assertOk()
            ->assertJsonPath('promotion.is_active', true);
    }

    public function test_resume_expired_promotion_returns_422(): void
    {
        $promotion = $this->activePromotion([
            'start_date' => now()->subDays(10),
            'end_date' => now()->subDay(),
        ]);

        $this->actingAs($this->seller)
            ->postJson(route('seller.promotions.resume', $promotion))
            ->assertStatus(422)
            ->assertJsonPath('message', 'Cannot resume an expired promotion.');
    }

    public function test_destroy_refunds_only_unused_budget(): void
    {
        $promotion = $this->activePromotion([
            'allocated_budget' => 300000,
            'spent_budget' => 100000,
        ]);

        $wallet = Wallet::where('user_id', $this->seller->id)->firstOrFail();
        app(WalletService::class)->debit(
            $wallet->wallet_id,
            300000,
            WalletTransaction::TYPE_PROMOTION_BUDGET,
            'Initial budget',
            'promotion',
            $promotion->promotion_id,
        );

        $this->actingAs($this->seller)
            ->delete(route('seller.promotions.destroy', $promotion))
            ->assertRedirect(route('seller.promotions.index'));

        $this->assertSoftDeleted('promotions', ['promotion_id' => $promotion->promotion_id]);
        $this->assertDatabaseMissing('promotion_products', ['promotion_id' => $promotion->promotion_id]);

        $wallet->refresh();
        $this->assertSame(900000.0, (float) $wallet->balance);
    }

    public function test_other_seller_cannot_modify_promotion(): void
    {
        $promotion = $this->activePromotion();

        $this->actingAs($this->otherSeller)
            ->put(route('seller.promotions.update', $promotion), $this->updatePayload())
            ->assertStatus(403);

        $this->actingAs($this->otherSeller)
            ->delete(route('seller.promotions.destroy', $promotion))
            ->assertStatus(403);
    }

    /**
     * @param  array<string, mixed>  $overrides
     */
    private function activePromotion(array $overrides = []): Promotion
    {
        return Promotion::create(array_merge([
            'name' => 'Khuyến mãi '.fake()->unique()->word(),
            'description' => 'Mô tả',
            'type' => 1,
            'value' => 10,
            'start_date' => now()->subDay(),
            'end_date' => now()->addDays(5),
            'usage_limit' => null,
            'is_active' => true,
            'created_by_type' => 'seller',
            'seller_id' => $this->seller->id,
            'budget_source' => 'seller_wallet',
            'allocated_budget' => 0,
            'spent_budget' => 0,
        ], $overrides));
    }

    /**
     * @param  array<string, mixed>  $overrides
     * @return array<string, mixed>
     */
    private function storePayload(array $overrides = []): array
    {
        return array_merge([
            'name' => 'Promotion store test',
            'description' => 'Description',
            'type' => 'percentage',
            'value' => 10,
            'product_ids' => [$this->product->product_id],
            'allocated_budget' => 100000,
            'min_order_amount' => null,
            'max_discount_amount' => null,
            'start_date' => now()->addHour()->format('Y-m-d H:i:s'),
            'end_date' => now()->addDays(3)->format('Y-m-d H:i:s'),
            'usage_limit' => null,
            'is_active' => true,
        ], $overrides);
    }

    /**
     * @param  array<string, mixed>  $overrides
     * @return array<string, mixed>
     */
    private function updatePayload(array $overrides = []): array
    {
        return array_merge([
            'name' => 'Đã cập nhật',
            'description' => 'Updated',
            'type' => 'percentage',
            'value' => 15,
            'product_ids' => [$this->product->product_id],
            'allocated_budget' => 0,
            'start_date' => now()->subDay()->format('Y-m-d H:i:s'),
            'end_date' => now()->addDays(5)->format('Y-m-d H:i:s'),
            'is_active' => true,
        ], $overrides);
    }
}

<?php

namespace Tests\Feature\Admin;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\Promotion;
use App\Models\Role;
use App\Models\User;
use App\Services\PromotionService;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PromotionManagementTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    private User $seller;

    private User $customer;

    private Category $category;

    private Brand $brand;

    private Product $product;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RoleSeeder::class);

        $this->admin = User::factory()->create();
        $this->admin->roles()->attach(Role::where('name->en', 'Admin')->first());

        $this->seller = User::factory()->create();
        $this->seller->roles()->attach(Role::where('name->en', 'Seller')->first());

        $this->customer = User::factory()->create();
        $this->customer->roles()->attach(Role::where('name->en', 'Customer')->first());

        $this->category = Category::factory()->create();
        $this->brand = Brand::factory()->create();

        $this->product = Product::factory()->create([
            'seller_id' => $this->seller->id,
            'category_id' => $this->category->category_id,
            'brand_id' => $this->brand->brand_id,
        ]);
    }

    public function test_customer_cannot_access_promotion_management(): void
    {
        $this->actingAs($this->customer)
            ->get(route('admin.promotions.index'))
            ->assertRedirect(route('home'));
    }

    public function test_index_renders_and_filters_promotions(): void
    {
        $active = $this->promotion(['name' => 'Active campaign', 'is_active' => true]);
        $future = $this->promotion([
            'name' => 'Future campaign',
            'start_date' => now()->addDays(2),
            'end_date' => now()->addDays(5),
            'is_active' => true,
        ]);

        $this->actingAs($this->admin)
            ->get(route('admin.promotions.index'))
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Promotions/Index')
                ->has('promotions.data', 2)
            );

        $this->actingAs($this->admin)
            ->get(route('admin.promotions.index', ['status' => 'active']))
            ->assertInertia(fn (Assert $page) => $page
                ->has('promotions.data', 1)
                ->where('promotions.data.0.promotion_id', $active->promotion_id)
                ->where('promotions.data.0.status', 'active')
            );

        $this->actingAs($this->admin)
            ->get(route('admin.promotions.index', ['status' => 'draft']))
            ->assertInertia(fn (Assert $page) => $page
                ->has('promotions.data', 1)
                ->where('promotions.data.0.promotion_id', $future->promotion_id)
                ->where('promotions.data.0.status', 'draft')
            );

        // Viewing the index must not mutate scheduled promotions.
        $this->assertTrue((bool) $future->fresh()->is_active);
    }

    public function test_store_creates_promotion_with_products_and_categories(): void
    {
        $response = $this->actingAs($this->admin)->post(
            route('admin.promotions.store'),
            $this->storePayload()
        );

        $response->assertRedirect(route('admin.promotions.index'));

        $promotion = Promotion::latest('promotion_id')->firstOrFail();

        $this->assertSame(1, (int) $promotion->type);
        $this->assertDatabaseHas('promotion_products', [
            'promotion_id' => $promotion->promotion_id,
            'product_id' => $this->product->product_id,
        ]);
        $this->assertDatabaseHas('promotion_categories', [
            'promotion_id' => $promotion->promotion_id,
            'category_id' => $this->category->category_id,
        ]);
        $this->assertDatabaseHas('promotion_audit_logs', [
            'promotion_id' => $promotion->promotion_id,
            'action' => 'created',
        ]);
    }

    public function test_scheduled_promotion_keeps_is_active_for_dynamic_status(): void
    {
        $this->actingAs($this->admin)->post(route('admin.promotions.store'), $this->storePayload([
            'starts_at' => now()->addDays(2)->format('Y-m-d H:i:s'),
            'expires_at' => now()->addDays(5)->format('Y-m-d H:i:s'),
        ]));

        $promotion = Promotion::latest('promotion_id')->firstOrFail();

        $this->assertTrue((bool) $promotion->is_active);
        $this->assertSame('draft', app(PromotionService::class)->resolveStatus($promotion));
    }

    public function test_create_with_rules_matches_products(): void
    {
        $response = $this->actingAs($this->admin)->postJson(
            route('admin.promotions.createWithRules'),
            [
                'name' => 'Rule based promotion',
                'type' => 'percentage',
                'value' => 10,
                'starts_at' => now()->addDay()->format('Y-m-d H:i:s'),
                'expires_at' => now()->addDays(4)->format('Y-m-d H:i:s'),
                'selection_rules' => [
                    ['type' => 'category', 'operator' => 'equals', 'value' => $this->category->category_id],
                ],
            ]
        );

        $response->assertStatus(201);
        $promotion = Promotion::latest('promotion_id')->firstOrFail();
        $this->assertDatabaseHas('promotion_products', [
            'promotion_id' => $promotion->promotion_id,
            'product_id' => $this->product->product_id,
        ]);
    }

    public function test_preview_matching_products(): void
    {
        $this->actingAs($this->admin)->postJson(
            route('admin.promotions.previewMatching'),
            [
                'selection_rules' => [
                    ['type' => 'category', 'operator' => 'equals', 'value' => $this->category->category_id],
                ],
            ]
        )->assertOk()->assertJsonPath('matched_products', 1);
    }

    public function test_show_and_edit_pages_render(): void
    {
        $promotion = $this->promotion();

        $this->actingAs($this->admin)
            ->get(route('admin.promotions.show', $promotion))
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Promotions/Show')
                ->where('promotion.promotion_id', $promotion->promotion_id)
            );

        $this->actingAs($this->admin)
            ->get(route('admin.promotions.edit', $promotion))
            ->assertInertia(fn (Assert $page) => $page
                ->component('Admin/Promotions/Edit')
                ->where('promotion.promotion_id', $promotion->promotion_id)
            );
    }

    public function test_partial_update_keeps_paused_state_and_description(): void
    {
        $promotion = $this->promotion([
            'description' => 'Keep me',
            'is_active' => false,
        ]);

        $this->actingAs($this->admin)->put(route('admin.promotions.update', $promotion), [
            'name' => 'Updated name',
            'type' => 'percentage',
            'value' => 20,
            'starts_at' => now()->subDay()->format('Y-m-d H:i:s'),
            'expires_at' => now()->addDays(5)->format('Y-m-d H:i:s'),
        ])->assertRedirect(route('admin.promotions.index'));

        $promotion->refresh();

        $this->assertSame('Updated name', $promotion->name);
        $this->assertSame('Keep me', $promotion->description);
        $this->assertFalse((bool) $promotion->is_active);
    }

    public function test_toggle_auto_apply_writes_audit_log(): void
    {
        $promotion = $this->promotion(['auto_apply_new_products' => false]);

        $this->actingAs($this->admin)
            ->patchJson(route('admin.promotions.toggleAutoApply', $promotion), ['enabled' => true])
            ->assertOk()
            ->assertJsonPath('promotion.auto_apply_new_products', true);

        $this->assertDatabaseHas('promotion_audit_logs', [
            'promotion_id' => $promotion->promotion_id,
            'action' => 'auto_apply_enabled',
        ]);
    }

    public function test_admin_can_delete_promotion(): void
    {
        $promotion = $this->promotion();

        $this->actingAs($this->admin)
            ->delete(route('admin.promotions.destroy', $promotion))
            ->assertRedirect(route('admin.promotions.index'));

        $this->assertSoftDeleted('promotions', ['promotion_id' => $promotion->promotion_id]);
    }

    /**
     * @param  array<string, mixed>  $overrides
     */
    private function promotion(array $overrides = []): Promotion
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
            'created_by_type' => 'admin',
            'budget_source' => 'platform',
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
            'name' => 'Admin promotion',
            'description' => 'Description',
            'type' => 'percentage',
            'value' => 10,
            'product_ids' => [$this->product->product_id],
            'category_ids' => [$this->category->category_id],
            'minimum_order_value' => null,
            'max_discount_amount' => null,
            'starts_at' => now()->addHour()->format('Y-m-d H:i:s'),
            'expires_at' => now()->addDays(3)->format('Y-m-d H:i:s'),
            'is_active' => true,
        ], $overrides);
    }
}

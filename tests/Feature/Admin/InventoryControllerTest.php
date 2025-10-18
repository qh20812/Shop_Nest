<?php

namespace Tests\Feature\Admin;

use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Role;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InventoryControllerTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private User $seller;
    private User $customer;
    private Product $product;
    private ProductVariant $variant;

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

        $this->product = Product::factory()->create(['seller_id' => $this->seller->id]);
        $this->variant = ProductVariant::factory()->create([
            'product_id' => $this->product->product_id,
            'stock_quantity' => 50,
        ]);
    }

    // Test 1: Guest access
    public function test_guest_is_redirected_to_login()
    {
        $this->get(route('admin.inventory.index'))->assertRedirect(route('login'));
        $this->get(route('admin.inventory.show', $this->product->product_id))->assertRedirect(route('login'));
        $this->post(route('admin.inventory.store'))->assertRedirect(route('login'));
    }

    // Test 2: Non-admin access
    public function test_non_admin_is_redirected_from_inventory_pages()
    {
        $this->actingAs($this->customer);

        $this->get(route('admin.inventory.index'))
            ->assertRedirect(route('dashboard'))
            ->assertSessionHas('error');

        $this->post(route('admin.inventory.store'), ['variant_id' => $this->variant->variant_id, 'quantity' => 1, 'reason' => 'test'])
            ->assertRedirect(route('dashboard'))
            ->assertSessionHas('error');
    }

    // Test 3: Admin can view index page
    public function test_admin_can_view_inventory_index_page()
    {
        $this->actingAs($this->admin)
            ->get(route('admin.inventory.index'))
            ->assertStatus(200)
            ->assertInertia(fn ($page) => $page
                ->component('Admin/Inventory/Index')
                ->has('variants.data', 1)
                ->where('variants.data.0.variant_id', $this->variant->variant_id)
            );
    }

    // Test 4: Admin can view product inventory details (show page)
    public function test_admin_can_view_product_inventory_details()
    {
        $this->actingAs($this->admin)
            ->get(route('admin.inventory.show', $this->product->product_id))
            ->assertStatus(200)
            ->assertInertia(fn ($page) => $page
                ->component('Admin/Inventory/Show')
                ->where('product.product_id', $this->product->product_id)
                ->has('product.variants', 1)
            );
    }

    // Test 5: Admin can perform stock-in
    public function test_admin_can_perform_stock_in()
    {
        $initialStock = $this->variant->stock_quantity;
        $quantityToAdd = 15;

        $response = $this->actingAs($this->admin)
            ->post(route('admin.inventory.store'), [
                'variant_id' => $this->variant->variant_id,
                'quantity' => $quantityToAdd,
                'reason' => 'Nhập hàng định kỳ',
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('success', 'Cập nhật tồn kho thành công.');

        $this->variant->refresh();
        $this->assertEquals($initialStock + $quantityToAdd, $this->variant->stock_quantity);

        $this->assertDatabaseHas('inventory_logs', [
            'variant_id' => $this->variant->variant_id,
            'user_id' => $this->admin->id,
            'quantity_change' => $quantityToAdd,
            'reason' => 'Stock In: Nhập hàng định kỳ',
        ]);
    }

    // Test 6: Stock-in fails with invalid data
    public function test_stock_in_fails_with_invalid_data()
    {
        $response = $this->actingAs($this->admin)
            ->post(route('admin.inventory.store'), [
                'variant_id' => 999, // Non-existent variant
                'quantity' => 0, // Invalid quantity
                'reason' => '', // Missing reason
            ]);

        $response->assertSessionHasErrors(['variant_id', 'quantity', 'reason']);
    }

    // Test 7: Admin can perform stock-out
    public function test_admin_can_perform_stock_out()
    {
        $initialStock = $this->variant->stock_quantity;
        $quantityToSubtract = 10;

        $response = $this->actingAs($this->admin)
            ->post(route('admin.inventory.stockOut'), [
                'variant_id' => $this->variant->variant_id,
                'quantity' => $quantityToSubtract,
                'reason' => 'Xuất hàng hỏng',
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('success', 'Cập nhật tồn kho thành công.');

        $this->variant->refresh();
        $this->assertEquals($initialStock - $quantityToSubtract, $this->variant->stock_quantity);

        $this->assertDatabaseHas('inventory_logs', [
            'variant_id' => $this->variant->variant_id,
            'quantity_change' => -$quantityToSubtract,
            'reason' => 'Stock Out: Xuất hàng hỏng',
        ]);
    }

    // Test 8: Stock-out fails if quantity exceeds current stock
    public function test_stock_out_fails_if_quantity_exceeds_stock()
    {
        $initialStock = $this->variant->stock_quantity;
        $quantityToSubtract = $initialStock + 1;

        $response = $this->actingAs($this->admin)
            ->post(route('admin.inventory.stockOut'), [
                'variant_id' => $this->variant->variant_id,
                'quantity' => $quantityToSubtract,
                'reason' => 'Test xuất kho thất bại',
            ]);

        $response->assertSessionHasErrors('quantity');
        $this->variant->refresh();
        $this->assertEquals($initialStock, $this->variant->stock_quantity); // Stock should not change
    }

    // Test 9: Admin can perform manual stock adjustment
    public function test_admin_can_perform_stock_adjustment()
    {
        $initialStock = $this->variant->stock_quantity;
        $newQuantity = 25;
        $change = $newQuantity - $initialStock;

        $response = $this->actingAs($this->admin)
            ->put(route('admin.inventory.update', $this->variant->variant_id), [
                'new_quantity' => $newQuantity,
                'reason' => 'Kiểm kê cuối tháng',
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('success', 'Cập nhật tồn kho thành công.');

        $this->variant->refresh();
        $this->assertEquals($newQuantity, $this->variant->stock_quantity);

        $this->assertDatabaseHas('inventory_logs', [
            'variant_id' => $this->variant->variant_id,
            'quantity_change' => $change,
            'reason' => 'Adjustment: Kiểm kê cuối tháng',
        ]);
    }

    // Test 10: Admin can view inventory history page
    public function test_admin_can_view_inventory_history()
    {
        // Create a log entry first
        $this->actingAs($this->admin)->post(route('admin.inventory.store'), [
            'variant_id' => $this->variant->variant_id,
            'quantity' => 5,
            'reason' => 'Log for history test',
        ]);

        $this->assertDatabaseCount('inventory_logs', 1);

        $this->actingAs($this->admin)
            ->get(route('admin.inventory.history', $this->product->product_id))
            ->assertStatus(200)
            ->assertInertia(fn ($page) => $page
                ->component('Admin/Inventory/History')
                ->has('history.data', 1)
                ->where('history.data.0.reason', 'Stock In: Log for history test')
            );
    }
}

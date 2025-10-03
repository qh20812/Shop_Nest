<?php

namespace Tests\Feature\Admin;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\Role;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductManagementTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;
    protected User $seller;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
        $this->seed(RoleSeeder::class);

        $this->admin = User::factory()->create();
        $this->admin->roles()->attach(Role::where('name->en', 'Admin')->first());

        $this->seller = User::factory()->create();
        $this->seller->roles()->attach(Role::where('name->en', 'Seller')->first());
    }

    public function test_admin_co_the_xem_danh_sach_san_pham(): void
    {
        $response = $this->actingAs($this->admin)->get(route('admin.products.index'));
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Admin/Products/Index'));
    }

    public function test_admin_co_the_cap_nhat_trang_thai_san_pham(): void
    {
        $product = Product::factory()->create([
            'seller_id' => $this->seller->id,
            'status' => 1, // Pending
        ]);

        $response = $this->actingAs($this->admin)
            ->patch(route('admin.products.updateStatus', $product), [
                'status' => 2, // Active
            ]);

        $response->assertRedirect(route('admin.products.index'));
        $response->assertSessionHas('success', 'Product approved and activated successfully.');
        
        $this->assertDatabaseHas('products', [
            'product_id' => $product->product_id,
            'status' => 2,
        ]);
    }

    public function test_admin_co_the_xem_chi_tiet_san_pham(): void
    {
        $product = Product::factory()->create(['seller_id' => $this->seller->id]);

        $response = $this->actingAs($this->admin)->get(route('admin.products.show', $product));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Admin/Products/Show'));
    }

    public function test_admin_co_the_xoa_mot_san_pham(): void
    {
        $product = Product::factory()->create(['seller_id' => $this->seller->id]);

        $response = $this->actingAs($this->admin)->delete(route('admin.products.destroy', $product));

        $response->assertRedirect(route('admin.products.index'));
        $response->assertSessionHas('success', 'Product removed successfully.');
        $this->assertSoftDeleted('products', ['product_id' => $product->product_id]);
    }

    public function test_admin_co_the_loc_san_pham_theo_danh_muc(): void
    {
        $category = Category::factory()->create();
        Product::factory()->create([
            'seller_id' => $this->seller->id,
            'category_id' => $category->category_id,
        ]);

        $response = $this->actingAs($this->admin)
            ->get(route('admin.products.index', ['category_id' => $category->category_id]));

        $response->assertStatus(200);
    }

    public function test_admin_co_the_tim_kiem_san_pham_theo_ten(): void
    {
        Product::factory()->create([
            'seller_id' => $this->seller->id,
            'name' => 'Test Product Name',
        ]);

        $response = $this->actingAs($this->admin)
            ->get(route('admin.products.index', ['search' => 'Test Product']));

        $response->assertStatus(200);
    }
}
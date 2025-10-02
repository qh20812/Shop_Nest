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
        $this->admin->roles()->attach(Role::where('name', 'Admin')->first());

        $this->seller = User::factory()->create();
        $this->seller->roles()->attach(Role::where('name', 'Seller')->first());
    }

    public function test_admin_co_the_xem_danh_sach_san_pham(): void
    {
        $response = $this->actingAs($this->admin)->get(route('admin.products.index'));
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Admin/Products/Index'));
    }

    public function test_admin_co_the_tao_mot_san_pham_moi(): void
    {
        $category = Category::factory()->create();
        $brand = Brand::factory()->create();

        $productData = [
            'name' => 'iPhone 15 Pro Max',
            'description' => 'A new iPhone model.',
            'category_id' => $category->category_id,
            'brand_id' => $brand->brand_id,
            'status' => 3, // Published
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.products.store'), $productData);

        $response->assertRedirect(route('admin.products.index'));
        $response->assertSessionHas('success', 'Tạo sản phẩm thành công.');
        $this->assertDatabaseHas('products', ['name' => 'iPhone 15 Pro Max']);
    }

    public function test_admin_khong_the_tao_mot_san_pham_moi_khi_du_lieu_khong_hop_le(): void
    {
        $response = $this->actingAs($this->admin)->post(route('admin.products.store'), ['name' => '']);
        $response->assertSessionHasErrors('name');
    }

    public function test_admin_co_the_cap_nhat_mot_san_pham(): void
    {
        $product = Product::factory()->create([
            'seller_id' => $this->seller->id,
            'name' => 'Tên Sản Phẩm Cũ',
        ]);
        $category = Category::factory()->create();
        $brand = Brand::factory()->create();

        $updateData = [
            'name' => 'Tên Sản Phẩm Mới',
            'description' => 'Mô tả đã được cập nhật.',
            'category_id' => $category->category_id,
            'brand_id' => $brand->brand_id,
            'status' => 3,
        ];

        $response = $this->actingAs($this->admin)->put(route('admin.products.update', $product), $updateData);

        $response->assertRedirect(route('admin.products.index'));
        $response->assertSessionHas('success', 'Cập nhật sản phẩm thành công.');
        $this->assertDatabaseHas('products', [
            'product_id' => $product->product_id,
            'name' => 'Tên Sản Phẩm Mới',
        ]);
    }

    public function test_admin_co_the_xoa_mot_san_pham(): void
    {
        $product = Product::factory()->create(['seller_id' => $this->seller->id]);

        $response = $this->actingAs($this->admin)->delete(route('admin.products.destroy', $product));

        $response->assertRedirect(route('admin.products.index'));
        $response->assertSessionHas('success', 'Xóa sản phẩm thành công.');
        $this->assertSoftDeleted('products', ['product_id' => $product->product_id]);
    }
}
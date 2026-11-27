<?php

namespace Tests\Feature\Admin;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\Role;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProductManagementTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected User $seller;

    protected User $customer;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutVite();
        $this->seed(RoleSeeder::class);
        app()->setLocale('en'); // Set locale to English for consistent testing

        $this->admin = User::factory()->create();
        $this->admin->roles()->attach(Role::where('name->en', 'Admin')->first());

        $this->seller = User::factory()->create();
        $this->seller->roles()->attach(Role::where('name->en', 'Seller')->first());

        $this->customer = User::factory()->create();
        $this->customer->roles()->attach(Role::where('name->en', 'Customer')->first());
    }

    public function test_customer_cannot_access_product_management(): void
    {
        $response = $this->actingAs($this->customer)->get(route('admin.products.index'));

        $response->assertRedirect(route('home'));
        $response->assertSessionHas('error');
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
            'status' => 'pending_approval',
        ]);

        $response = $this->actingAs($this->admin)
            ->patch(route('admin.products.updateStatus', $product), [
                'status' => 'published',
            ]);

        $response->assertRedirect(route('admin.products.index'));
        $response->assertSessionHas('success', 'Product approved and activated successfully.');

        $this->assertDatabaseHas('products', [
            'product_id' => $product->product_id,
            'status' => 'published',
        ]);
    }

    public function test_admin_can_deactivate_product(): void
    {
        $product = Product::factory()->create([
            'seller_id' => $this->seller->id,
            'status' => 'published',
        ]);

        $response = $this->actingAs($this->admin)
            ->patch(route('admin.products.updateStatus', $product), [
                'status' => 'hidden',
            ]);

        $response->assertRedirect(route('admin.products.index'));
        $response->assertSessionHas('success', 'Product deactivated successfully.');

        $this->assertDatabaseHas('products', [
            'product_id' => $product->product_id,
            'status' => 'hidden',
        ]);
    }

    public function test_admin_can_set_product_to_pending(): void
    {
        $product = Product::factory()->create([
            'seller_id' => $this->seller->id,
            'status' => 'published',
        ]);

        $response = $this->actingAs($this->admin)
            ->patch(route('admin.products.updateStatus', $product), [
                'status' => 'pending_approval',
            ]);

        $response->assertRedirect(route('admin.products.index'));
        $response->assertSessionHas('success', 'Product status changed to pending approval.');

        $this->assertDatabaseHas('products', [
            'product_id' => $product->product_id,
            'status' => 'pending_approval',
        ]);
    }

    public function test_admin_can_use_legacy_numeric_status_values(): void
    {
        $product = Product::factory()->create([
            'seller_id' => $this->seller->id,
            'status' => 'draft',
        ]);

        $response = $this->actingAs($this->admin)
            ->patch(route('admin.products.updateStatus', $product), [
                'status' => 2,
            ]);

        $response->assertRedirect(route('admin.products.index'));

        // Legacy integers follow ProductStatus::fromLegacyInt(): 2 = pending_approval.
        $this->assertDatabaseHas('products', [
            'product_id' => $product->product_id,
            'status' => 'pending_approval',
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

    public function test_admin_delete_removes_product_images(): void
    {
        Storage::fake('public');

        $product = Product::factory()->create(['seller_id' => $this->seller->id]);

        Storage::disk('public')->put('products/admin-delete.png', 'image-bytes');
        ProductImage::create([
            'product_id' => $product->product_id,
            'image_url' => 'products/admin-delete.png',
            'is_primary' => true,
            'display_order' => 0,
        ]);

        $response = $this->actingAs($this->admin)->delete(route('admin.products.destroy', $product));

        $response->assertRedirect(route('admin.products.index'));
        $this->assertSoftDeleted('products', ['product_id' => $product->product_id]);
        $this->assertDatabaseMissing('product_images', ['product_id' => $product->product_id]);
        Storage::disk('public')->assertMissing('products/admin-delete.png');
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
            'name' => ['en' => 'Test Product Name', 'vi' => 'Tên sản phẩm thử'],
        ]);

        $response = $this->actingAs($this->admin)
            ->get(route('admin.products.index', ['search' => 'Test Product']));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->has('products.data', 1)
            ->where('products.data.0.name', 'Test Product Name')
        );
    }

    public function test_admin_can_filter_products_by_brand(): void
    {
        $brand = Brand::factory()->create();
        Product::factory()->create([
            'seller_id' => $this->seller->id,
            'brand_id' => $brand->brand_id,
        ]);

        $response = $this->actingAs($this->admin)
            ->get(route('admin.products.index', ['brand_id' => $brand->brand_id]));

        $response->assertStatus(200);
    }

    public function test_admin_can_filter_products_by_status(): void
    {
        Product::factory()->create([
            'seller_id' => $this->seller->id,
            'status' => 'pending_approval',
        ]);

        $response = $this->actingAs($this->admin)
            ->get(route('admin.products.index', ['status' => 'pending_approval']));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->has('products.data', 1)
            ->where('products.data.0.status', 'pending_approval')
        );
    }

    public function test_admin_status_filter_accepts_legacy_numeric_values(): void
    {
        Product::factory()->create([
            'seller_id' => $this->seller->id,
            'status' => 'pending_approval',
        ]);

        $response = $this->actingAs($this->admin)
            ->get(route('admin.products.index', ['status' => 2]));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->has('products.data', 1));
    }

    public function test_validation_errors_on_update_status(): void
    {
        $product = Product::factory()->create(['seller_id' => $this->seller->id]);

        $response = $this->actingAs($this->admin)
            ->patch(route('admin.products.updateStatus', $product), [
                'status' => 'archived', // Invalid status
            ]);

        $response->assertSessionHasErrors('status');
    }

    public function test_product_show_displays_correct_data(): void
    {
        $product = Product::factory()->create(['seller_id' => $this->seller->id]);

        $response = $this->actingAs($this->admin)->get(route('admin.products.show', $product));

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Products/Show')
            ->has('product')
            ->where('product.product_id', $product->product_id)
            ->where('product.seller.id', $this->seller->id)
            ->where('product.status', $product->status->value)
        );
    }

    public function test_admin_can_return_to_product_detail_after_status_update(): void
    {
        $product = Product::factory()->create([
            'seller_id' => $this->seller->id,
            'status' => 'pending_approval',
        ]);

        $response = $this->actingAs($this->admin)
            ->patch(route('admin.products.updateStatus', $product), [
                'status' => 'published',
                'redirect_to' => 'show',
            ]);

        $response->assertRedirect(route('admin.products.show', $product));
        $response->assertSessionHas('success', 'Product approved and activated successfully.');

        $this->assertDatabaseHas('products', [
            'product_id' => $product->product_id,
            'status' => 'published',
        ]);
    }

    public function test_index_displays_translated_product_names(): void
    {
        Product::factory()->create([
            'seller_id' => $this->seller->id,
            'name' => ['en' => 'English Product', 'vi' => 'Sản phẩm tiếng Việt'],
        ]);

        $response = $this->actingAs($this->admin)->get(route('admin.products.index'));

        $response->assertInertia(fn ($page) => $page
            ->has('products.data', 1)
            ->where('products.data.0.name', 'English Product')
        );
    }
}

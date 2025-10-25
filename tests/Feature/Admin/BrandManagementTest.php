<?php

namespace Tests\Feature\Admin;

use App\Models\Brand;
use App\Models\Role;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class BrandManagementTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;
    protected User $customer;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);
        $this->admin = User::factory()->create();
        $this->admin->roles()->attach(Role::where('name->en', 'Admin')->first());
        $this->customer = User::factory()->create();
        $this->customer->roles()->attach(Role::where('name->en', 'Customer')->first());
    }

    public function test_admin_can_access_brand_index_page()
    {
        Brand::factory()->count(5)->create();

        $response = $this->actingAs($this->admin)->get(route('admin.brands.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn($page) => $page
            ->component('Admin/Brands/Index')
            ->has('brands.data', 5)
            ->has('totalBrands')
            ->has('filters')
        );
    }

    public function test_admin_can_access_brand_create_page()
    {
        $response = $this->actingAs($this->admin)->get(route('admin.brands.create'));

        $response->assertStatus(200);
        $response->assertInertia(fn($page) => $page->component('Admin/Brands/Create'));
    }

    public function test_admin_can_create_new_brand()
    {
        $brandData = [
            'name' => 'Apple',
            'description' => 'Apple Inc.',
            'is_active' => true,
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.brands.store'), $brandData);

        $response->assertRedirect(route('admin.brands.index'));
        $response->assertSessionHas('success', 'Brand created successfully.');
        $this->assertDatabaseHas('brands', [
            'name' => json_encode(['vi' => 'Apple']),
            'description' => 'Apple Inc.',
            'is_active' => 1,
        ]);
    }

    public function test_admin_can_access_brand_edit_page()
    {
        $brand = Brand::factory()->create();

        $response = $this->actingAs($this->admin)->get(route('admin.brands.edit', $brand));

        $response->assertStatus(200);
        $response->assertInertia(fn($page) => $page
            ->component('Admin/Brands/Edit')
            ->has('brand')
        );
    }

    public function test_admin_can_update_brand()
    {
        $brand = Brand::factory()->create(['name' => 'Old Name']);

        $updateData = [
            'name' => 'Updated Name',
            'description' => 'Updated Description',
            'is_active' => false,
        ];

        $response = $this->actingAs($this->admin)->put(route('admin.brands.update', $brand), $updateData);

        $response->assertRedirect(route('admin.brands.index'));
        $response->assertSessionHas('success', 'Brand updated successfully.');
        $this->assertDatabaseHas('brands', [
            'brand_id' => $brand->brand_id,
            'name' => json_encode(['vi' => 'Updated Name']),
            'description' => 'Updated Description',
            'is_active' => 0,
        ]);
    }

    public function test_admin_can_delete_brand()
    {
        $brand = Brand::factory()->create();

        $response = $this->actingAs($this->admin)->delete(route('admin.brands.destroy', $brand));

        $response->assertRedirect(route('admin.brands.index'));
        $response->assertSessionHas('success', 'Brand deactivated successfully.');
        $this->assertSoftDeleted('brands', ['brand_id' => $brand->brand_id]);
    }

    public function test_admin_can_restore_brand()
    {
        $brand = Brand::factory()->create();
        $brand->delete();

        $response = $this->actingAs($this->admin)->patch(route('admin.brands.restore', $brand));

        $response->assertRedirect(route('admin.brands.index'));
        $response->assertSessionHas('success', 'Brand restored successfully.');
        $this->assertDatabaseHas('brands', ['brand_id' => $brand->brand_id, 'deleted_at' => null]);
    }

    public function test_customer_cannot_access_brand_management()
    {
        $response = $this->actingAs($this->customer)->get(route('admin.brands.index'));
        $response->assertRedirect(route('home'));
    }
}

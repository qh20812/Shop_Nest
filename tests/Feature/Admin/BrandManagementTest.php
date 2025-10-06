<?php

namespace Tests\Feature\Admin;

use App\Models\Brand;
use App\Models\Role;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class BrandManagementTest extends TestCase
{
    /**
     * A basic feature test example.
     */
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
    public function test_admin_co_the_truy_cap_trang_quan_ly_thuong_hieu(): void
    {
        $response = $this->actingAs($this->admin)->get(route('admin.brands.index'));
        $response->assertStatus(200);
        $response->assertInertia(fn($page) => $page->component('Admin/Brands/Index'));
    }
    public function test_admin_co_the_tao_thuong_hieu_moi(): void
    {
        $brandData = ['name' => 'Apple', 'description' => 'Apple Inc.'];
        $this->actingAs($this->admin)->post(route('admin.brands.store'), $brandData);
        $this->assertDatabaseHas('brands', ['name' => 'Apple']);
    }
    public function test_admin_co_the_cap_nhat_thuong_hieu(): void
    {
        $brand = Brand::factory()->create();
        $updateData = ['name' => 'Samsung Updated'];
        $this->actingAs($this->admin)->put(route('admin.brands.update', $brand), $updateData);
        $this->assertDatabaseHas('brands', ['brand_id' => $brand->brand_id, 'name' => 'Samsung Updated']);
    }
    public function test_admin_co_the_xoa_thuong_hieu(): void
    {
        $brand = Brand::factory()->create();
        $this->actingAs($this->admin)->delete(route('admin.brands.destroy', $brand));
        $this->assertSoftDeleted('brands', ['brand_id' => $brand->brand_id]);
    }
}

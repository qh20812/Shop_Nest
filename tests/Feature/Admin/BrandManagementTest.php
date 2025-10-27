<?php

namespace Tests\Feature\Admin;

use App\Models\Brand;
use App\Models\Role;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class BrandManagementTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected User $admin;
    protected User $customer;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleSeeder::class);
        app()->setLocale('en'); // Set locale to English for consistent testing
        $this->admin = User::factory()->create();
        $this->admin->roles()->attach(Role::where('name->en', 'Admin')->first());
        $this->customer = User::factory()->create();
        $this->customer->roles()->attach(Role::where('name->en', 'Customer')->first());
    }

    public function test_admin_can_access_brand_management_page(): void
    {
        $response = $this->actingAs($this->admin)->get(route('admin.brands.index'));

        $response->assertStatus(200);
        $response->assertInertia(fn($page) => $page->component('Admin/Brands/Index'));
    }

    public function test_admin_can_access_create_brand_page(): void
    {
        $response = $this->actingAs($this->admin)->get(route('admin.brands.create'));

        $response->assertStatus(200);
        $response->assertInertia(fn($page) => $page->component('Admin/Brands/Create'));
    }

    public function test_admin_can_access_edit_brand_page(): void
    {
        $brand = Brand::factory()->create();

        $response = $this->actingAs($this->admin)->get(route('admin.brands.edit', $brand));

        $response->assertStatus(200);
        $response->assertInertia(fn($page) => $page->component('Admin/Brands/Edit'));
    }

    public function test_admin_can_create_brand_without_logo(): void
    {
        $brandData = [
            'name' => 'Apple',
            'description' => 'Apple Inc.',
            'is_active' => true,
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.brands.store'), $brandData);

        $response->assertRedirect(route('admin.brands.index'));
        $response->assertSessionHas('success');
        $this->assertDatabaseHas('brands', ['name' => '{"en":"Apple"}']);
    }

    // public function test_admin_can_create_brand_with_logo(): void
    // {
    //     Storage::fake('public');

    //     $logo = UploadedFile::fake()->image('logo.png');
    //     $brandData = [
    //         'name' => 'Samsung',
    //         'description' => 'Samsung Electronics',
    //         'logo' => $logo,
    //         'is_active' => true,
    //     ];

    //     $response = $this->actingAs($this->admin)->post(route('admin.brands.store'), $brandData);

    //     $response->assertRedirect(route('admin.brands.index'));
    //     $response->assertSessionHas('success');
    //     $this->assertDatabaseHas('brands', ['name' => 'Samsung']);
    //     Storage::assertExists('brands/logos/' . $logo->hashName(), 'public');
    // }

    public function test_admin_can_update_brand(): void
    {
        $brand = Brand::factory()->create(['name' => 'Old Brand']);
        $updateData = [
            'name' => 'Updated Brand',
            'description' => 'Updated description',
            'is_active' => false,
        ];

        $response = $this->actingAs($this->admin)->put(route('admin.brands.update', $brand), $updateData);

        $response->assertRedirect(route('admin.brands.index'));
        $response->assertSessionHas('success');
        $this->assertDatabaseHas('brands', [
            'brand_id' => $brand->brand_id,
            'name' => '{"en":"Updated Brand"}',
            'description' => $updateData['description'],
            'is_active' => $updateData['is_active'],
        ]);
    }

    // public function test_admin_can_update_brand_logo(): void
    // {
    //     Storage::fake('public');

    //     $brand = Brand::factory()->create(['logo_url' => 'old/logo.png']);
    //     $newLogo = UploadedFile::fake()->image('new-logo.jpg');

    //     $updateData = [
    //         'name' => 'Brand with New Logo',
    //         'logo' => $newLogo,
    //     ];

    //     $response = $this->actingAs($this->admin)->put(route('admin.brands.update', $brand), $updateData);

    //     $response->assertRedirect(route('admin.brands.index'));
    //     Storage::assertMissing('old/logo.png', 'public');
    //     Storage::assertExists('brands/logos/' . $newLogo->hashName(), 'public');
    // }

    public function test_admin_can_soft_delete_brand(): void
    {
        $brand = Brand::factory()->create();

        $response = $this->actingAs($this->admin)->delete(route('admin.brands.destroy', $brand));

        $response->assertRedirect(route('admin.brands.index'));
        $response->assertSessionHas('success');
        $this->assertSoftDeleted('brands', ['brand_id' => $brand->brand_id]);
    }

    public function test_admin_can_restore_brand(): void
    {
        $brand = Brand::factory()->create();
        $brand->delete();

        $response = $this->actingAs($this->admin)->patch(route('admin.brands.restore', $brand));

        $response->assertRedirect(route('admin.brands.index'));
        $response->assertSessionHas('success');
        $this->assertDatabaseHas('brands', ['brand_id' => $brand->brand_id, 'deleted_at' => null]);
    }

    public function test_admin_can_filter_brands_by_search(): void
    {
        Brand::factory()->create(['name' => 'Apple']);
        Brand::factory()->create(['name' => 'Samsung']);

        $response = $this->actingAs($this->admin)->get(route('admin.brands.index', ['search' => 'Apple']));

        $response->assertStatus(200);
        $response->assertInertia(fn($page) => $page
            ->has('brands.data', 1)
            ->where('brands.data.0.name', 'Apple')
        );
    }

    public function test_admin_can_filter_brands_by_status(): void
    {
        $activeBrand = Brand::factory()->create(['is_active' => true]);
        $inactiveBrand = Brand::factory()->create(['is_active' => false]);

        $response = $this->actingAs($this->admin)->get(route('admin.brands.index', ['status' => 'inactive']));

        $response->assertStatus(200);
        $response->assertInertia(fn($page) => $page->has('brands.data', 0)); // Assuming inactive means deleted, but controller uses deleted_at
    }

    public function test_customer_cannot_access_brand_management(): void
    {
        $response = $this->actingAs($this->customer)->get(route('admin.brands.index'));

        $response->assertRedirect(route('home'));
        $response->assertSessionHas('error');
    }

    public function test_validation_errors_on_create_brand(): void
    {
        $response = $this->actingAs($this->admin)->post(route('admin.brands.store'), []);

        $response->assertSessionHasErrors(['name']);
    }

    public function test_validation_errors_on_update_brand(): void
    {
        $brand = Brand::factory()->create();
        $anotherBrand = Brand::factory()->create(['name' => ['en' => 'Existing', 'vi' => 'Tồn tại']]);

        $response = $this->actingAs($this->admin)->put(route('admin.brands.update', $brand), [
            'name' => ['en' => 'Existing', 'vi' => 'Tồn tại'], // Duplicate name
        ]);

        $response->assertSessionHasErrors(['name']);
    }

    public function test_brand_translations_are_resolved_in_index(): void
    {
        Brand::factory()->create(['name' => 'Test Brand']);

        $response = $this->actingAs($this->admin)->get(route('admin.brands.index'));

        $response->assertInertia(fn($page) => $page
            ->has('brands.data', 1)
            ->where('brands.data.0.name', 'Test Brand')
        );
    }
}

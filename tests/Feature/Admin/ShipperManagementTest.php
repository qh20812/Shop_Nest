<?php

namespace Tests\Feature\Admin;

use App\Models\Role;
use App\Models\ShipperProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ShipperManagementTest extends TestCase
{
    use RefreshDatabase;

    protected User $adminUser;
    protected User $customerUser;
    protected User $pendingShipper;
    protected User $approvedShipper;
    protected ShipperProfile $pendingShipperProfile;
    protected ShipperProfile $approvedShipperProfile;
    protected Role $adminRole;
    protected Role $customerRole;
    protected Role $shipperRole;

    protected function setUp(): void
    {
        parent::setUp();

        // Create roles first
        $this->adminRole = Role::factory()->create([
            'name' => ['en' => 'Admin', 'vi' => 'Quản trị viên'],
            'description' => ['en' => 'Administrator with full access', 'vi' => 'Quản trị viên có toàn quyền truy cập'],
        ]);
        
        $this->customerRole = Role::factory()->create([
            'name' => ['en' => 'Customer', 'vi' => 'Khách hàng'],
            'description' => ['en' => 'User who can buy products', 'vi' => 'Người dùng có thể mua sản phẩm'],
        ]);
        
        $this->shipperRole = Role::factory()->create([
            'name' => ['en' => 'Shipper', 'vi' => 'Người giao hàng'],
            'description' => ['en' => 'User who delivers orders', 'vi' => 'Người dùng thực hiện giao đơn hàng'],
        ]);

        // Create admin user
        $this->adminUser = User::factory()->create([
            'email' => 'admin@example.com',
            'is_active' => true,
        ]);
        $this->adminUser->roles()->attach($this->adminRole->id);

        // Create customer user (for non-admin authorization tests)
        $this->customerUser = User::factory()->create([
            'email' => 'customer@example.com',
            'is_active' => true,
        ]);
        $this->customerUser->roles()->attach($this->customerRole->id);

        // Create pending shipper
        $this->pendingShipper = User::factory()->create([
            'email' => 'shipper1@example.com',
            'first_name' => 'John',
            'last_name' => 'Shipper',
            'is_active' => true,
        ]);
        $this->pendingShipper->roles()->attach($this->shipperRole->id);
        $this->pendingShipperProfile = ShipperProfile::factory()->create([
            'user_id' => $this->pendingShipper->id,
            'status' => 'pending',
        ]);

        // Create approved shipper
        $this->approvedShipper = User::factory()->create([
            'email' => 'shipper2@example.com',
            'first_name' => 'Jane',
            'last_name' => 'Driver',
            'is_active' => true,
        ]);
        $this->approvedShipper->roles()->attach($this->shipperRole->id);
        $this->approvedShipperProfile = ShipperProfile::factory()->create([
            'user_id' => $this->approvedShipper->id,
            'status' => 'approved',
        ]);
    }

    // Authorization Tests
    public function test_guests_are_redirected_to_login_when_accessing_shipper_index(): void
    {
        $response = $this->get('/admin/shippers');
        
        $response->assertRedirect(route('login'));
    }

    public function test_guests_are_redirected_to_login_when_accessing_shipper_show_page(): void
    {
        $response = $this->get("/admin/shippers/{$this->pendingShipper->id}");
        
        $response->assertRedirect(route('login'));
    }

    public function test_non_admin_users_are_redirected_when_accessing_shipper_index(): void
    {
        $response = $this->actingAs($this->customerUser)->get('/admin/shippers');
        
        $response->assertStatus(302); // Middleware redirects non-admin users
    }

    public function test_non_admin_users_are_redirected_when_accessing_shipper_show_page(): void
    {
        $response = $this->actingAs($this->customerUser)->get("/admin/shippers/{$this->pendingShipper->id}");
        
        $response->assertStatus(302); // Middleware redirects non-admin users
    }

    public function test_non_admin_users_cannot_update_shipper_status(): void
    {
        $response = $this->actingAs($this->customerUser)
            ->patch("/admin/shippers/{$this->pendingShipper->id}/status", [
                'status' => 'approved'
            ]);
        
        $response->assertStatus(302); // Middleware redirects non-admin users
    }

    // Index Method Tests
    public function test_admin_can_successfully_view_shipper_list_page(): void
    {
        $response = $this->actingAs($this->adminUser)->get('/admin/shippers');
        
        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => 
            $page->component('Admin/Shippers/Index')
                ->has('shippers')
                ->has('filters')
                ->has('statusOptions')
        );
    }

    public function test_shipper_list_only_contains_users_with_shipper_role(): void
    {
        $response = $this->actingAs($this->adminUser)->get('/admin/shippers');
        
        $response->assertInertia(fn (Assert $page) => 
            $page->component('Admin/Shippers/Index')
                ->has('shippers.data', 2) // Should have 2 shippers
                ->where('shippers.data.0.email', $this->pendingShipper->email)
                ->where('shippers.data.1.email', $this->approvedShipper->email)
        );
    }

    public function test_shipper_list_filtering_by_status_works_correctly(): void
    {
        $response = $this->actingAs($this->adminUser)->get('/admin/shippers?status=pending');
        
        $response->assertInertia(fn (Assert $page) => 
            $page->component('Admin/Shippers/Index')
                ->has('shippers.data', 1) // Should have only 1 pending shipper
                ->where('shippers.data.0.shipper_profile.status', 'pending')
                ->where('filters.status', 'pending')
        );
    }

    public function test_shipper_list_search_functionality_works_correctly(): void
    {
        $response = $this->actingAs($this->adminUser)->get('/admin/shippers?search=John');
        
        $response->assertInertia(fn (Assert $page) => 
            $page->component('Admin/Shippers/Index')
                ->has('shippers.data', 1) // Should find only John Shipper
                ->where('shippers.data.0.first_name', 'John')
                ->where('filters.search', 'John')
        );
    }

    // Show Method Tests
    public function test_admin_can_successfully_view_shipper_detail_page(): void
    {
        $response = $this->actingAs($this->adminUser)->get("/admin/shippers/{$this->pendingShipper->id}");
        
        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => 
            $page->component('Admin/Shippers/Show')
                ->has('shipper')
                ->where('shipper.id', $this->pendingShipper->id)
                ->where('shipper.email', $this->pendingShipper->email)
                ->has('shipper.shipper_profile')
        );
    }

    public function test_accessing_detail_page_of_non_shipper_user_returns_404(): void
    {
        $response = $this->actingAs($this->adminUser)->get("/admin/shippers/{$this->customerUser->id}");
        
        $response->assertStatus(404);
    }

    public function test_accessing_non_existent_shipper_returns_404(): void
    {
        $response = $this->actingAs($this->adminUser)->get('/admin/shippers/99999');
        
        $response->assertStatus(404);
    }

    // UpdateStatus Method Tests
    public function test_admin_can_successfully_approve_a_pending_shipper(): void
    {
        $response = $this->actingAs($this->adminUser)
            ->patch("/admin/shippers/{$this->pendingShipper->id}/status", [
                'status' => 'approved'
            ]);
        
        $response->assertRedirect(route('admin.shippers.show', $this->pendingShipper));
        $response->assertSessionHas('success');
        
        $this->assertDatabaseHas('shipper_profiles', [
            'user_id' => $this->pendingShipper->id,
            'status' => 'approved',
        ]);
        
        $this->assertDatabaseHas('users', [
            'id' => $this->pendingShipper->id,
            'is_active' => true,
        ]);
    }

    public function test_admin_can_successfully_reject_a_pending_shipper(): void
    {
        $response = $this->actingAs($this->adminUser)
            ->patch("/admin/shippers/{$this->pendingShipper->id}/status", [
                'status' => 'rejected'
            ]);
        
        $response->assertRedirect(route('admin.shippers.show', $this->pendingShipper));
        $response->assertSessionHas('success');
        
        $this->assertDatabaseHas('shipper_profiles', [
            'user_id' => $this->pendingShipper->id,
            'status' => 'rejected',
        ]);
    }

    public function test_admin_can_successfully_suspend_an_approved_shipper(): void
    {
        $response = $this->actingAs($this->adminUser)
            ->patch("/admin/shippers/{$this->approvedShipper->id}/status", [
                'status' => 'suspended'
            ]);
        
        $response->assertRedirect(route('admin.shippers.show', $this->approvedShipper));
        $response->assertSessionHas('success');
        
        $this->assertDatabaseHas('shipper_profiles', [
            'user_id' => $this->approvedShipper->id,
            'status' => 'suspended',
        ]);
        
        // User should be deactivated when suspended
        $this->assertDatabaseHas('users', [
            'id' => $this->approvedShipper->id,
            'is_active' => false,
        ]);
    }

    public function test_validation_error_occurs_when_updating_with_invalid_status(): void
    {
        $response = $this->actingAs($this->adminUser)
            ->patch("/admin/shippers/{$this->pendingShipper->id}/status", [
                'status' => 'invalid_status'
            ]);
        
        $response->assertSessionHasErrors('status');
        
        // Database should remain unchanged
        $this->assertDatabaseHas('shipper_profiles', [
            'user_id' => $this->pendingShipper->id,
            'status' => 'pending', // Should still be pending
        ]);
    }

    public function test_validation_error_occurs_when_status_field_is_missing(): void
    {
        $response = $this->actingAs($this->adminUser)
            ->patch("/admin/shippers/{$this->pendingShipper->id}/status", []);
        
        $response->assertSessionHasErrors('status');
    }

    public function test_updating_status_of_non_shipper_user_returns_404(): void
    {
        $response = $this->actingAs($this->adminUser)
            ->patch("/admin/shippers/{$this->customerUser->id}/status", [
                'status' => 'approved'
            ]);
        
        $response->assertStatus(404);
    }

    public function test_updating_status_of_non_existent_user_returns_404(): void
    {
        $response = $this->actingAs($this->adminUser)
            ->patch('/admin/shippers/99999/status', [
                'status' => 'approved'
            ]);
        
        $response->assertStatus(404);
    }

    // Edge Cases and Additional Tests
    public function test_shipper_profile_status_changes_are_properly_tracked(): void
    {
        // Initial state
        $this->assertEquals('pending', $this->pendingShipperProfile->fresh()->status);
        
        // Approve the shipper
        $this->actingAs($this->adminUser)
            ->patch("/admin/shippers/{$this->pendingShipper->id}/status", [
                'status' => 'approved'
            ]);
        
        // Check the change
        $this->assertEquals('approved', $this->pendingShipperProfile->fresh()->status);
        
        // Suspend the shipper
        $this->actingAs($this->adminUser)
            ->patch("/admin/shippers/{$this->pendingShipper->id}/status", [
                'status' => 'suspended'
            ]);
        
        // Check the change and user deactivation
        $this->assertEquals('suspended', $this->pendingShipperProfile->fresh()->status);
        $this->assertFalse($this->pendingShipper->fresh()->is_active);
    }

    public function test_pagination_works_correctly_on_shipper_index(): void
    {
        // Create more shippers to test pagination
        collect(range(1, 20))->each(function ($i) {
            $shipper = User::factory()->create([
                'email' => "shipper{$i}@test.com",
            ]);
            $shipper->roles()->attach($this->shipperRole->id);
            ShipperProfile::factory()->create([
                'user_id' => $shipper->id,
            ]);
        });
        
        $response = $this->actingAs($this->adminUser)->get('/admin/shippers');
        
        $response->assertInertia(fn (Assert $page) => 
            $page->component('Admin/Shippers/Index')
                ->has('shippers.data', 15) // Default pagination is 15 per page
                ->has('shippers.current_page')
                ->has('shippers.last_page')
                ->where('shippers.total', 22) // 20 + 2 from setUp
        );
    }
}

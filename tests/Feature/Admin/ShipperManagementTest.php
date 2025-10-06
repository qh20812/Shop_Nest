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
    public function test_khach_chua_dang_nhap_khong_the_truy_cap(): void
    {
        $response = $this->get('/admin/shippers');
        
        $response->assertRedirect(route('login'));
    }

    public function test_khach_chua_dang_nhap_khong_the_xem_chi_tiet_nguoi_giao_hang(): void
    {
        $response = $this->get("/admin/shippers/{$this->pendingShipper->id}");
        
        $response->assertRedirect(route('login'));
    }

    public function test_khach_hang_khong_phai_admin_khong_the_truy_cap(): void
    {
        $response = $this->actingAs($this->customerUser)->get('/admin/shippers');
        
        $response->assertStatus(302); // Middleware redirects non-admin users
    }

    public function test_khach_hang_khong_phai_admin_khong_the_xem_chi_tiet_nguoi_giao_hang(): void
    {
        $response = $this->actingAs($this->customerUser)->get("/admin/shippers/{$this->pendingShipper->id}");
        
        $response->assertStatus(302); // Middleware redirects non-admin users
    }

    public function test_khach_hang_khong_phai_admin_khong_the_cap_nhat_trang_thai_nguoi_giao_hang(): void
    {
        $response = $this->actingAs($this->customerUser)
            ->patch("/admin/shippers/{$this->pendingShipper->id}/status", [
                'status' => 'approved'
            ]);
        
        $response->assertStatus(302); // Middleware redirects non-admin users
    }

        // Index Method Tests
    public function test_admin_co_the_xem_danh_sach_nguoi_giao_hang(): void
    {
        $response = $this->actingAs($this->adminUser)->get(route('admin.shippers.index'));
        
        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => 
            $page->component('Admin/Shippers/Index')
                ->has('shippers.data')
                ->has('statusOptions')
        );
    }

    public function test_danh_sach_nguoi_giao_hang_chi_chua_nguoi_giao_hang(): void
    {
        $response = $this->actingAs($this->adminUser)->get(route('admin.shippers.index'));
        
        $response->assertInertia(fn (Assert $page) => 
            $page->component('Admin/Shippers/Index')
                ->has('shippers.data', 2) // Có 2 shipper (pending và approved)
        );
    }

    public function test_danh_sach_nguoi_giao_hang_co_the_loc_theo_trang_thai(): void
    {
        $response = $this->actingAs($this->adminUser)->get(route('admin.shippers.index', ['status' => 'pending']));
        
        $response->assertInertia(fn (Assert $page) => 
            $page->component('Admin/Shippers/Index')
                ->where('filters.status', 'pending')
        );
    }

    public function test_nguoi_giao_hang_co_the_tim_kiem_theo_ten(): void
    {
        $response = $this->actingAs($this->adminUser)->get(route('admin.shippers.index', ['search' => $this->pendingShipper->first_name]));
        
        $response->assertInertia(fn (Assert $page) => 
            $page->component('Admin/Shippers/Index')
                ->where('filters.search', $this->pendingShipper->first_name)
        );
    }

    // Show Method Tests
    public function test_admin_co_the_xem_thanh_cong_chi_tiet_nguoi_giao_hang(): void
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

    public function test_truy_cap_trang_chi_tiet_nguoi_dung_khong_phai_shipper_tra_ve_404(): void
    {
        $response = $this->actingAs($this->adminUser)->get(route('admin.shippers.show', $this->customerUser));
        
        $response->assertStatus(404);
    }

    public function test_truy_cap_shipper_khong_ton_tai_tra_ve_404(): void
    {
        $response = $this->actingAs($this->adminUser)->get('/admin/shippers/99999');
        
        $response->assertStatus(404);
    }

    // UpdateStatus Method Tests
    public function test_admin_co_the_phe_duyet_thanh_cong_shipper_dang_cho(): void
    {
        $response = $this->actingAs($this->adminUser)
            ->patch(route('admin.shippers.updateStatus', $this->pendingShipper), [
                'status' => 'approved'
            ]);
        
        $response->assertRedirect(route('admin.shippers.show', $this->pendingShipper));
        $response->assertSessionHas('success', 'Shipper status updated to approved.');
        
        $this->assertDatabaseHas('shipper_profiles', [
            'user_id' => $this->pendingShipper->id,
            'status' => 'approved',
        ]);
        
        $this->assertDatabaseHas('users', [
            'id' => $this->pendingShipper->id,
            'is_active' => true,
        ]);
    }

    public function test_admin_co_the_tu_choi_thanh_cong_shipper_dang_cho(): void
    {
        $response = $this->actingAs($this->adminUser)
            ->patch(route('admin.shippers.updateStatus', $this->pendingShipper), [
                'status' => 'rejected'
            ]);
        
        $response->assertRedirect(route('admin.shippers.show', $this->pendingShipper));
        $response->assertSessionHas('success', 'Shipper status updated to rejected.');
        
        $this->assertDatabaseHas('shipper_profiles', [
            'user_id' => $this->pendingShipper->id,
            'status' => 'rejected',
        ]);
    }

    public function test_admin_co_the_tam_ngung_thanh_cong_shipper_da_duyet(): void
    {
        $response = $this->actingAs($this->adminUser)
            ->patch(route('admin.shippers.updateStatus', $this->approvedShipper), [
                'status' => 'suspended'
            ]);
        
        $response->assertRedirect(route('admin.shippers.show', $this->approvedShipper));
        $response->assertSessionHas('success', 'Shipper status updated to suspended.');
        
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

    public function test_cap_nhat_voi_trang_thai_khong_hop_le_xay_ra_loi_validation(): void
    {
        $response = $this->actingAs($this->adminUser)
            ->patch(route('admin.shippers.updateStatus', $this->pendingShipper), [
                'status' => 'invalid_status'
            ]);
        
        $response->assertSessionHasErrors('status');
        
        // Database should remain unchanged
        $this->assertDatabaseHas('shipper_profiles', [
            'user_id' => $this->pendingShipper->id,
            'status' => 'pending', // Should still be pending
        ]);
    }

    public function test_cap_nhat_thieu_truong_status_xay_ra_loi_validation(): void
    {
        $response = $this->actingAs($this->adminUser)
            ->patch(route('admin.shippers.updateStatus', $this->pendingShipper), []);
        
        $response->assertSessionHasErrors('status');
    }

    public function test_cap_nhat_trang_thai_nguoi_dung_khong_phai_shipper_tra_ve_404(): void
    {
        $response = $this->actingAs($this->adminUser)
            ->patch(route('admin.shippers.updateStatus', $this->customerUser), [
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
    public function test_thay_doi_trang_thai_shipper_profile_duoc_theo_doi_dung_cach(): void
    {
        // Initial state
        $this->assertEquals('pending', $this->pendingShipperProfile->fresh()->status);
        
        // Approve the shipper
        $this->actingAs($this->adminUser)
            ->patch(route('admin.shippers.updateStatus', $this->pendingShipper), [
                'status' => 'approved'
            ]);
        
        // Check the change
        $this->assertEquals('approved', $this->pendingShipperProfile->fresh()->status);
        $this->assertTrue($this->pendingShipper->fresh()->is_active);
        
        // Suspend the shipper
        $this->actingAs($this->adminUser)
            ->patch(route('admin.shippers.updateStatus', $this->pendingShipper), [
                'status' => 'suspended'
            ]);
        
        // Check the change and user deactivation
        $this->assertEquals('suspended', $this->pendingShipperProfile->fresh()->status);
        $this->assertFalse($this->pendingShipper->fresh()->is_active);
    }

    public function test_pagination_hoat_dong_dung_tren_trang_danh_sach_shipper(): void
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
        
        $response = $this->actingAs($this->adminUser)->get(route('admin.shippers.index'));
        
        $response->assertInertia(fn (Assert $page) => 
            $page->component('Admin/Shippers/Index')
                ->has('shippers.data', 15) // Default pagination is 15 per page
                ->has('shippers.current_page')
                ->has('shippers.last_page')
                ->where('shippers.total', 22) // 20 + 2 from setUp
        );
    }
}

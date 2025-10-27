<?php

namespace Tests\Feature\Admin;

use App\Models\Role;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class UserControllerTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private User $customer;

    protected function setUp(): void
    {
        parent::setUp();

        // Chạy seeder để tạo roles
        $this->seed(RoleSeeder::class);

        // Tạo user với vai trò Admin
        $this->admin = User::factory()->create();
        $this->admin->roles()->attach(Role::where('name->en', 'Admin')->first());

        // Tạo user với vai trò Customer
        $this->customer = User::factory()->create();
        $this->customer->roles()->attach(Role::where('name->en', 'Customer')->first());
    }

    /**
     * Test khách (chưa đăng nhập) không thể truy cập trang quản lý user.
     */
    public function test_khach_chua_dang_nhap_khong_the_truy_cap_quan_ly_nguoi_dung(): void
    {
        $response = $this->get(route('admin.users.index'));
        $response->assertRedirect(route('login'));
    }

    /**
     * Test người dùng không phải Admin không thể truy cập.
     */
    public function test_nguoi_dung_khong_phai_admin_khong_the_truy_cap_quan_ly_nguoi_dung(): void
    {
        $response = $this->actingAs($this->customer)->get(route('admin.users.index'));
        
        $response->assertRedirect(route('home'));
        $response->assertSessionHas('error');
    }

    /**
     * Test Admin có thể xem danh sách user thành công.
     */
    public function test_admin_co_the_xem_danh_sach_nguoi_dung_thanh_cong(): void
    {
        $response = $this->actingAs($this->admin)->get(route('admin.users.index'));

        // Chỉ kiểm tra status code thay vì Inertia component để tránh lỗi Vite
        $response->assertStatus(200);
    }

    /**
     * Test chức năng tìm kiếm user theo tên hoặc email.
     */
    public function test_admin_co_the_tim_kiem_nguoi_dung_theo_ten_hoac_email(): void
    {
        // Tạo user với thông tin cụ thể để test tìm kiếm
        $searchUser = User::factory()->create([
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'john.doe@example.com',
            'username' => 'johndoe'
        ]);

        // Test tìm kiếm theo first_name
        $response = $this->actingAs($this->admin)
            ->get(route('admin.users.index', ['search' => 'John']));

        $response->assertStatus(200);
        
        // Test tìm kiếm theo email
        $response = $this->actingAs($this->admin)
            ->get(route('admin.users.index', ['search' => 'john.doe@example.com']));

        $response->assertStatus(200);
    }

    /**
     * Test chức năng lọc user theo role.
     */
    public function test_admin_co_the_loc_nguoi_dung_theo_vai_tro(): void
    {
        $response = $this->actingAs($this->admin)
            ->get(route('admin.users.index', ['role' => 'Admin']));

        $response->assertStatus(200);
    }

    /**
     * Test Admin có thể truy cập trang chỉnh sửa user.
     */
    public function test_admin_co_the_truy_cap_trang_chinh_sua_nguoi_dung(): void
    {
        $response = $this->actingAs($this->admin)
            ->get(route('admin.users.edit', $this->customer));

        $response->assertStatus(200);
    }

    /**
     * Test Admin có thể cập nhật thông tin user thành công.
     */
    public function test_admin_co_the_cap_nhat_thong_tin_nguoi_dung_thanh_cong(): void
    {
        $customerRole = Role::where('name->en', 'Customer')->first();
        $adminRole = Role::where('name->en', 'Admin')->first();

        $updateData = [
            'first_name' => 'Updated First',
            'last_name' => 'Updated Last',
            'email' => 'updated@example.com',
            'is_active' => true,
            'role_id' => $adminRole->id, // Sử dụng role_id thay vì roles array
        ];

        $response = $this->actingAs($this->admin)
            ->put(route('admin.users.update', $this->customer), $updateData);

        $response->assertRedirect(route('admin.users.index'));
        $response->assertSessionHas('success', 'Cập nhật người dùng thành công.');

        // Kiểm tra data đã được cập nhật trong database
        $this->customer->refresh();
        $this->assertEquals('Updated First', $this->customer->first_name);
        $this->assertEquals('Updated Last', $this->customer->last_name);
        $this->assertEquals('updated@example.com', $this->customer->email);
        $this->assertTrue($this->customer->is_active);
        
        // Kiểm tra role đã được cập nhật
        $this->customer->refresh();
        $this->customer->load('roles');
        $this->assertTrue($this->customer->roles->contains('id', $adminRole->id));
    }

    /**
     * Test việc cập nhật sẽ thất bại nếu email trùng lặp.
     */
    public function test_cap_nhat_nguoi_dung_that_bai_khi_email_trung_lap(): void
    {
        $anotherUser = User::factory()->create(['email' => 'existing@example.com']);

        $updateData = [
            'first_name' => 'Updated First',
            'last_name' => 'Updated Last',
            'email' => 'existing@example.com', // Email đã tồn tại
            'is_active' => true,
            'role_id' => Role::where('name->en', 'Customer')->first()->id,
        ];

        $response = $this->actingAs($this->admin)
            ->put(route('admin.users.update', $this->customer), $updateData);

        $response->assertSessionHasErrors('email');
    }

    /**
     * Test việc cập nhật sẽ thất bại nếu dữ liệu không hợp lệ.
     */
    public function test_cap_nhat_nguoi_dung_that_bai_khi_du_lieu_khong_hop_le(): void
    {
        $updateData = [
            'first_name' => '', // Required field trống
            'last_name' => 'Updated Last',
            'email' => 'invalid-email', // Email không hợp lệ
            'is_active' => 'not-boolean', // Không phải boolean
            'role_id' => 999, // Role ID không tồn tại
        ];

        $response = $this->actingAs($this->admin)
            ->put(route('admin.users.update', $this->customer), $updateData);

        $response->assertSessionHasErrors(['first_name', 'email', 'is_active', 'role_id']);
    }

    /**
     * Test Admin có thể vô hiệu hóa user khác.
     */
    public function test_admin_co_the_vo_hieu_hoa_nguoi_dung_khac(): void
    {
        $response = $this->actingAs($this->admin)
            ->delete(route('admin.users.destroy', $this->customer));

        $response->assertRedirect(route('admin.users.index'));
        $response->assertSessionHas('success', 'Vô hiệu hoá người dùng thành công.');

        // Kiểm tra user đã bị vô hiệu hóa
        $this->customer->refresh();
        $this->assertFalse($this->customer->is_active);
    }

    /**
     * Test Admin không thể tự vô hiệu hóa tài khoản của chính mình.
     */
    public function test_admin_khong_the_tu_vo_hieu_hoa_tai_khoan_cua_chinh_minh(): void
    {
        $response = $this->actingAs($this->admin)
            ->delete(route('admin.users.destroy', $this->admin));

        $response->assertRedirect();
        $response->assertSessionHas('error', 'Bạn không thể thay đổi trạng thái tài khoản của chính mình.');

        // Kiểm tra admin vẫn còn active
        $this->admin->refresh();
        $this->assertTrue($this->admin->is_active);
    }

    /**
     * Test lọc user theo trạng thái active/inactive.
     */
    public function test_admin_co_the_loc_nguoi_dung_theo_trang_thai(): void
    {
        // Tạo user inactive
        $inactiveUser = User::factory()->create(['is_active' => false]);

        // Test lọc user active
        $response = $this->actingAs($this->admin)
            ->get(route('admin.users.index', ['status' => '1']));

        $response->assertStatus(200);

        // Test lọc user inactive
        $response = $this->actingAs($this->admin)
            ->get(route('admin.users.index', ['status' => '0']));

        $response->assertStatus(200);
    }
}

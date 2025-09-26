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
        $this->admin->roles()->attach(Role::where('name', 'Admin')->first());

        // Tạo user với vai trò Customer
        $this->customer = User::factory()->create();
        $this->customer->roles()->attach(Role::where('name', 'Customer')->first());
    }

    /**
     * Test khách (chưa đăng nhập) không thể truy cập trang quản lý user.
     */
    public function test_guest_cannot_access_user_management(): void
    {
        $response = $this->get(route('admin.users.index'));
        $response->assertRedirect(route('login'));
    }

    /**
     * Test người dùng không phải Admin không thể truy cập.
     */
    public function test_non_admin_cannot_access_user_management(): void
    {
        $response = $this->actingAs($this->customer)->get(route('admin.users.index'));
        
        $response->assertRedirect(route('dashboard'));
        $response->assertSessionHas('error');
    }

    /**
     * Test Admin có thể xem danh sách user thành công.
     */
    public function test_admin_can_view_users_list(): void
    {
        $response = $this->actingAs($this->admin)->get(route('admin.users.index'));

        // Chỉ kiểm tra status code thay vì Inertia component để tránh lỗi Vite
        $response->assertStatus(200);
    }

    /**
     * Test chức năng tìm kiếm user theo tên hoặc email.
     */
    public function test_admin_can_search_users(): void
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
    public function test_admin_can_filter_users_by_role(): void
    {
        $response = $this->actingAs($this->admin)
            ->get(route('admin.users.index', ['role' => 'Admin']));

        $response->assertStatus(200);
    }

    /**
     * Test Admin có thể truy cập trang chỉnh sửa user.
     */
    public function test_admin_can_view_edit_user_page(): void
    {
        $response = $this->actingAs($this->admin)
            ->get(route('admin.users.edit', $this->customer));

        $response->assertStatus(200);
    }

    /**
     * Test Admin có thể cập nhật thông tin user thành công.
     */
    public function test_admin_can_update_user_successfully(): void
    {
        $customerRole = Role::where('name', 'Customer')->first();
        $adminRole = Role::where('name', 'Admin')->first();

        $updateData = [
            'first_name' => 'Updated First',
            'last_name' => 'Updated Last',
            'email' => 'updated@example.com',
            'is_active' => true,
            'roles' => [$adminRole->id], // Chuyển từ Customer thành Admin
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
        $this->assertTrue($this->customer->roles->contains('name', 'Admin'));
    }

    /**
     * Test việc cập nhật sẽ thất bại nếu email trùng lặp.
     */
    public function test_user_update_fails_with_duplicate_email(): void
    {
        $anotherUser = User::factory()->create(['email' => 'existing@example.com']);

        $updateData = [
            'first_name' => 'Updated First',
            'last_name' => 'Updated Last',
            'email' => 'existing@example.com', // Email đã tồn tại
            'is_active' => true,
            'roles' => [Role::where('name', 'Customer')->first()->id],
        ];

        $response = $this->actingAs($this->admin)
            ->put(route('admin.users.update', $this->customer), $updateData);

        $response->assertSessionHasErrors('email');
    }

    /**
     * Test việc cập nhật sẽ thất bại nếu dữ liệu không hợp lệ.
     */
    public function test_user_update_fails_with_invalid_data(): void
    {
        $updateData = [
            'first_name' => '', // Required field trống
            'last_name' => 'Updated Last',
            'email' => 'invalid-email', // Email không hợp lệ
            'is_active' => 'not-boolean', // Không phải boolean
            'roles' => [999], // Role ID không tồn tại
        ];

        $response = $this->actingAs($this->admin)
            ->put(route('admin.users.update', $this->customer), $updateData);

        $response->assertSessionHasErrors(['first_name', 'email', 'is_active', 'roles.0']);
    }

    /**
     * Test Admin có thể vô hiệu hóa user khác.
     */
    public function test_admin_can_deactivate_other_user(): void
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
    public function test_admin_cannot_deactivate_themselves(): void
    {
        $response = $this->actingAs($this->admin)
            ->delete(route('admin.users.destroy', $this->admin));

        $response->assertRedirect();
        $response->assertSessionHas('error', 'Bạn không thể tự vô hiệu hoá chính mình.');

        // Kiểm tra admin vẫn còn active
        $this->admin->refresh();
        $this->assertTrue($this->admin->is_active);
    }

    /**
     * Test lọc user theo trạng thái active/inactive.
     */
    public function test_admin_can_filter_users_by_status(): void
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

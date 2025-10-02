<?php

namespace Tests\Feature\Admin;

use App\Models\Role;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class DashboardControllerTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private User $seller;
    private User $customer;

    protected function setUp(): void
    {
        parent::setUp();

        // Chạy seeder để tạo roles
        $this->seed(RoleSeeder::class);

        // Tạo user với vai trò Admin
        $this->admin = User::factory()->create();
        $this->admin->roles()->attach(Role::where('name', 'Admin')->first());

        // Tạo user với vai trò Seller
        $this->seller = User::factory()->create();
        $this->seller->roles()->attach(Role::where('name', 'Seller')->first());
        
        // Tạo user với vai trò Customer
        $this->customer = User::factory()->create();
        $this->customer->roles()->attach(Role::where('name', 'Customer')->first());
    }

    /**
     * Kịch bản 1: Khách (chưa đăng nhập) không thể truy cập admin dashboard.
     */
    public function test_khach_khong_the_truy_cap_admin_dashboard(): void
    {
        $response = $this->get(route('admin.dashboard'));

        // Khẳng định: Bị chuyển hướng đến trang đăng nhập
        $response->assertRedirect(route('login'));
    }

    /**
     * Kịch bản 2: Người dùng không phải Admin (Seller, Customer) không thể truy cập.
     * @dataProvider nonAdminUsers
     */
    public function test_khong_phai_admin_users_bi_chuyen_huong(string $role): void
    {
        $user = $this->{$role}; // Lấy user từ thuộc tính của class (e.g., $this->seller)

        $response = $this->actingAs($user)->get(route('admin.dashboard'));

        // Khẳng định: Bị chuyển hướng về trang dashboard chung và có thông báo lỗi
        $response->assertRedirect(route('dashboard'));
        $response->assertSessionHas('error');
    }

    /**
     * Data provider cho các vai trò không phải admin
     */
    public static function nonAdminUsers(): array
    {
        return [
            'seller user' => ['seller'],
            'customer user' => ['customer'],
        ];
    }

    /**
     * Kịch bản 3: Admin có thể truy cập thành công trang dashboard.
     */
    public function test_admin_co_the_truy_cap_admin_dashboard(): void
    {
        $response = $this->actingAs($this->admin)->get(route('admin.dashboard'));

        // Khẳng định: Truy cập thành công và thấy component React tương ứng
        $response->assertStatus(200);

        // Khẳng định: Đúng component và có các props cần thiết
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Dashboard/Index')
            ->has('stats')
            ->has('recentOrders')
            ->has('newUsers')
        );
    }
}
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
        $this->admin->roles()->attach(Role::where('name->en', 'Admin')->first());

        // Tạo user với vai trò Seller
        $this->seller = User::factory()->create();
        $this->seller->roles()->attach(Role::where('name->en', 'Seller')->first());
        
        // Tạo user với vai trò Customer
        $this->customer = User::factory()->create();
        $this->customer->roles()->attach(Role::where('name->en', 'Customer')->first());
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
    public function test_nguoi_dung_khong_phai_admin_bi_chuyen_huong(string $role): void
    {
        $user = $this->{$role}; // Lấy user từ thuộc tính của class (e.g., $this->seller)

        $response = $this->actingAs($user)->get(route('admin.dashboard'));

        // Khẳng định: Bị chuyển hướng về trang home và có thông báo lỗi
        $response->assertRedirect(route('home'));
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

    /**
     * Kịch bản 4: Dashboard hiển thị đúng dữ liệu thống kê.
     */
    public function test_dashboard_hien_thi_dung_du_lieu_thong_ke(): void
    {
        // Tạo dữ liệu mẫu
        $user = User::factory()->create(['created_at' => now()]);
        $order = \App\Models\Order::factory()->create(['status' => \App\Enums\OrderStatus::COMPLETED->value, 'total_amount_base' => 100]);
        $product = \App\Models\Product::factory()->create();

        $response = $this->actingAs($this->admin)->get(route('admin.dashboard'));

        $response->assertInertia(fn (Assert $page) => $page
            ->has('stats')
            ->where('stats.total_revenue', 100)
            ->where('stats.total_orders', 1)
            ->where('stats.total_products', 1)
        );
    }

    /**
     * Kịch bản 5: Dashboard hiển thị recent orders.
     */
    public function test_dashboard_hien_thi_recent_orders(): void
    {
        $order = \App\Models\Order::factory()->create();

        $response = $this->actingAs($this->admin)->get(route('admin.dashboard'));

        $response->assertInertia(fn (Assert $page) => $page
            ->has('recentOrders')
        );
    }

    /**
     * Kịch bản 6: Dashboard hiển thị new users.
     */
    public function test_dashboard_hien_thi_new_users(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($this->admin)->get(route('admin.dashboard'));

        $response->assertInertia(fn (Assert $page) => $page
            ->has('newUsers')
        );
    }

    /**
     * Kịch bản 7: Dashboard xử lý khi không có dữ liệu.
     */
    public function test_dashboard_xu_ly_khi_khong_co_du_lieu(): void
    {
        $response = $this->actingAs($this->admin)->get(route('admin.dashboard'));

        $response->assertInertia(fn (Assert $page) => $page
            ->where('stats.total_revenue', 0)
            ->where('stats.total_orders', 0)
            ->where('stats.new_users', 3) // 3 users from setUp
            ->where('stats.total_products', 0)
            ->has('recentOrders', 0)
            ->has('newUsers', 3)
        );
    }
}
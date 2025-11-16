<?php

namespace Tests\Feature\Admin;

use App\Enums\OrderStatus;
use App\Models\Order;
use App\Models\Role;
use App\Models\User;
use App\Models\UserAddress;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\DataProvider;

class DashboardControllerTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private User $seller;
    private User $customer;

    protected function setUp(): void
    {
        parent::setUp();

        Cache::flush();

        $this->seed(RoleSeeder::class);

        $baseTimestamp = now()->subMonths(2);

        $this->admin = User::factory()->create(['created_at' => $baseTimestamp]);
        $this->admin->roles()->attach(Role::where('name->en', 'Admin')->first());

        $this->seller = User::factory()->create(['created_at' => $baseTimestamp]);
        $this->seller->roles()->attach(Role::where('name->en', 'Seller')->first());

        $this->customer = User::factory()->create(['created_at' => $baseTimestamp]);
        $this->customer->roles()->attach(Role::where('name->en', 'Customer')->first());
    }

    public function test_khach_khong_the_truy_cap_admin_dashboard(): void
    {
        $response = $this->get(route('admin.dashboard'));

        $response->assertRedirect(route('login'));
    }

    #[DataProvider('nonAdminUsers')]
    public function test_nguoi_dung_khong_phai_admin_bi_chuyen_huong(string $role): void
    {
        $user = $this->{$role};

        $response = $this->actingAs($user)->get(route('admin.dashboard'));

        $response->assertRedirect(route('home'));
        $response->assertSessionHas('error');
    }

    public static function nonAdminUsers(): array
    {
        return [
            'seller user' => ['seller'],
            'customer user' => ['customer'],
        ];
    }

    public function test_admin_co_the_truy_cap_admin_dashboard(): void
    {
        $response = $this->actingAs($this->admin)->get(route('admin.dashboard'));

        $response->assertStatus(200);

        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Dashboard/Index')
            ->has('stats')
            ->has('recentOrders')
            ->has('newUsers')
            ->has('revenueChart')
            ->has('userGrowthChart')
        );
    }

    public function test_dashboard_hien_thi_dung_du_lieu_thong_ke_moi(): void
    {
        User::factory()->create([
            'created_at' => now()->subMonth(),
        ]);

        User::factory(2)->create([
            'created_at' => now()->startOfMonth()->addDays(2),
        ]);

        $shippingAddress = UserAddress::factory()->create([
            'user_id' => $this->customer->id,
        ]);

        Order::factory()->create([
            'status' => OrderStatus::COMPLETED->value,
            'total_amount_base' => 100,
            'customer_id' => $this->customer->id,
            'shipping_address_id' => $shippingAddress->id,
        ]);

        Order::factory()->create([
            'status' => OrderStatus::PENDING_CONFIRMATION->value,
            'total_amount_base' => 50,
            'customer_id' => $this->customer->id,
            'shipping_address_id' => $shippingAddress->id,
        ]);

        $response = $this->actingAs($this->admin)->get(route('admin.dashboard'));

        $response->assertInertia(fn (Assert $page) => $page
            ->has('stats')
            ->where('stats.total_revenue', fn ($value) => abs((float) $value - 100.0) < 0.001)
            ->where('stats.pending_orders', 1)
            ->where('stats.system_health', fn ($value) => abs((float) $value - 50.0) < 0.001)
            ->where('stats.user_growth_monthly', fn ($value) => abs((float) $value - 100.0) < 0.001)
        );
    }

    public function test_dashboard_tra_ve_bieu_do_va_bang_duoc_mo_rong(): void
    {
        Cache::flush();

        Order::factory()->create([
            'status' => OrderStatus::COMPLETED->value,
            'total_amount' => 250,
            'total_amount_base' => 250,
            'created_at' => now()->subDays(2),
        ]);

        Order::factory()->create([
            'status' => OrderStatus::DELIVERING->value,
            'total_amount' => 150,
            'total_amount_base' => 150,
            'created_at' => now()->subDay(),
        ]);

        User::factory()->create(['created_at' => now()->subWeeks(1)]);
        User::factory()->create(['created_at' => now()->subWeeks(2)]);

        $response = $this->actingAs($this->admin)->get(route('admin.dashboard'));

        $response->assertInertia(fn (Assert $page) => $page
            ->has('recentOrders.0.total_amount')
            ->has('revenueChart', 7)
            ->has('userGrowthChart', 4)
        );
    }

    public function test_dashboard_cache_duoc_luu_sau_khi_yeu_cau(): void
    {
        Cache::flush();

        $cacheKey = "admin_dashboard_{$this->admin->id}";
        $this->assertFalse(Cache::has($cacheKey));

        $this->actingAs($this->admin)->get(route('admin.dashboard'));

        $this->assertTrue(Cache::has($cacheKey));
    }

    public function test_dashboard_xu_ly_khi_khong_co_du_lieu(): void
    {
        Cache::flush();

        $response = $this->actingAs($this->admin)->get(route('admin.dashboard'));

        $response->assertInertia(fn (Assert $page) => $page
            ->where('stats.total_revenue', fn ($value) => abs((float) $value) < 0.001)
            ->where('stats.pending_orders', 0)
            ->where('stats.user_growth_monthly', fn ($value) => abs((float) $value) < 0.001)
            ->where('stats.system_health', fn ($value) => abs((float) $value) < 0.001)
            ->has('recentOrders', 0)
            ->has('newUsers', 3) // ba người dùng đã tạo trong setUp
        );
    }
}
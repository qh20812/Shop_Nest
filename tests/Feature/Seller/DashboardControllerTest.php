<?php

namespace Tests\Feature\Seller;

use App\Models\Role;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
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

        $this->seed(RoleSeeder::class);

        $this->admin = User::factory()->create();
        $this->admin->roles()->attach(Role::where('name->en', 'Admin')->first());

        $this->seller = User::factory()->create();
        $this->seller->roles()->attach(Role::where('name->en', 'Seller')->first());
        
        $this->customer = User::factory()->create();
        $this->customer->roles()->attach(Role::where('name->en', 'Customer')->first());
    }
    
    /**
     * Kịch bản 1: Seller có thể truy cập dashboard của mình.
     */
    public function test_nguoi_ban_co_the_truy_cap_dashboard_cua_minh(): void
    {
        // Giả sử bạn có route tên là 'seller.dashboard'
        $response = $this->actingAs($this->seller)->get(route('seller.dashboard'));

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Seller/Dashboard/Index')
            ->has('shopStats')
            ->has('recentOrders')
        );
    }

    /**
     * Kịch bản 2: Người dùng không phải Seller không thể truy cập.
     */
    #[DataProvider('nonSellerUsers')]
    public function test_khong_phai_seller_users_bi_chuyen_huong(string $role): void
    {
        $user = $this->{$role};

        // Giả sử bạn có middleware IsSeller và nó sẽ chuyển hướng về home
        $response = $this->actingAs($user)->get(route('seller.dashboard'));

        // Tất cả non-sellers đều về home
        $response->assertRedirect(route('home'));
    }
    
    public static function nonSellerUsers(): array
    {
        return [
            'admin user' => ['admin'],
            'customer user' => ['customer'],
        ];
    }
}
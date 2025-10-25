<?php

namespace Tests\Feature\Settings;

use App\Models\Role;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class PasswordUpdateTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Seed roles for proper functionality
        $this->seed(RoleSeeder::class);
    }

    public function test_trang_cap_nhat_mat_khau_duoc_hien_thi()
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->get(route('password.edit'));

        $response->assertStatus(200)
            ->assertInertia(fn ($page) => $page->component('Settings/Password'));
    }

    public function test_mat_khau_co_the_duoc_cap_nhat()
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->from(route('password.edit'))
            ->put(route('password.update'), [
                'current_password' => '@12345Shopnest',
                'password' => 'new-password',
                'password_confirmation' => 'new-password',
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('password.edit'))
            ->assertSessionHas('success', 'Mật khẩu đã được cập nhật thành công.');

        $this->assertTrue(Hash::check('new-password', $user->refresh()->password));
    }

    public function test_phai_cung_cap_mat_khau_dung_de_cap_nhat_mat_khau()
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->from(route('password.edit'))
            ->put(route('password.update'), [
                'current_password' => 'wrong-password',
                'password' => 'new-password',
                'password_confirmation' => 'new-password',
            ]);

        $response
            ->assertSessionHasErrors('current_password')
            ->assertRedirect(route('password.edit'));
    }

    public function test_mat_khau_moi_khong_duoc_giong_mat_khau_cu()
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->from(route('password.edit'))
            ->put(route('password.update'), [
                'current_password' => '@12345Shopnest',
                'password' => '@12345Shopnest', // same as current
                'password_confirmation' => '@12345Shopnest',
            ]);

        $response
            ->assertSessionHasErrors('password')
            ->assertRedirect(route('password.edit'));
    }
}

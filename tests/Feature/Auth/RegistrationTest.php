<?php

namespace Tests\Feature\Auth;

use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Seed roles for proper registration flow
        $this->seed(RoleSeeder::class);
    }

    public function test_man_hinh_dang_ky_co_the_hien_thi()
    {
        $response = $this->get(route('register'));

        $response->assertStatus(200);
    }

    public function test_nguoi_dung_moi_co_the_dang_ky()
    {
        $response = $this->post(route('register.store'), [
            'username' => 'SUPER_ADMIN',
            'email' => 'ngocquyhuynh4@gmail.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ]);

        $this->assertAuthenticated(); // User is logged in after registration
        $response->assertRedirect(route('verification.notice'));
        $response->assertSessionHas('status', 'Đăng ký thành công! Vui lòng xác minh email của bạn.');
    }
}

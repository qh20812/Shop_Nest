<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Set locale to English for consistent testing
        app()->setLocale('en');
    }

    public function test_man_hinh_dang_nhap_co_the_hien_thi()
    {
        $response = $this->get(route('login'));

        $response->assertStatus(200);
    }

    public function test_nguoi_dung_co_the_xac_thuc_qua_man_hinh_dang_nhap()
    {
        $user = User::factory()->create();

        $response = $this->post(route('login.store'), [
            'email' => $user->email,
            'password' => '@12345Shopnest',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('home', absolute: false));
    }

    public function test_nguoi_dung_khong_the_xac_thuc_voi_mat_khau_sai()
    {
        $user = User::factory()->create();

        $this->post(route('login.store'), [
            'email' => $user->email,
            'password' => 'wrong-password',
        ]);

        $this->assertGuest();
    }

    public function test_nguoi_dung_co_the_dang_xuat()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('logout'));

        $this->assertGuest();
        $response->assertRedirect(route('home'));
    }

    public function test_nguoi_dung_bi_gioi_han_so_lan_dang_nhap()
    {
        $user = User::factory()->create();

        for ($i = 0; $i < 5; $i++) {
            $this->post(route('login.store'), [
                'email' => $user->email,
                'password' => 'wrong-password',
            ])->assertStatus(302)->assertSessionHasErrors([
                'email' => 'These credentials do not match our records.',
            ]);
        }

        $response = $this->post(route('login.store'), [
            'email' => $user->email,
            'password' => 'wrong-password',
        ]);

        $response->assertSessionHasErrors('email');

        $errors = session('errors');

        $this->assertStringContainsString('Too many login attempts', $errors->first('email'));
    }
}

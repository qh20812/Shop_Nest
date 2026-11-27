<?php

namespace Tests\Feature\Auth;

use App\Enums\ProductStatus;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_man_hinh_dang_nhap_co_the_hien_thi()
    {
        $response = $this->get(route('login'));

        $response->assertStatus(200);
    }

    public function test_nguoi_dung_co_the_xac_thuc_qua_man_hinh_dang_nhap()
    {
        $user = User::factory()->create();

        $response = $this->post(route('login.store'), [
            'identifier' => $user->email,
            'password' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('home', absolute: false));
    }

    public function test_nguoi_dung_khong_the_xac_thuc_voi_mat_khau_sai()
    {
        $user = User::factory()->create();

        $this->post(route('login.store'), [
            'identifier' => $user->email,
            'password' => 'wrong-password',
        ]);

        $this->assertGuest();
    }

    public function test_dang_nhap_quay_lai_trang_san_pham_da_click()
    {
        $user = User::factory()->create();
        $product = Product::factory()->create([
            'status' => ProductStatus::PUBLISHED,
            'is_active' => true,
        ]);
        $url = "/product/{$product->product_id}";

        // Guest click sản phẩm -> bị chặn và lưu intended URL.
        $this->get($url)->assertRedirect(route('login'));

        $response = $this->post(route('login.store'), [
            'identifier' => $user->email,
            'password' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect($url);
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
                'identifier' => $user->email,
                'password' => 'wrong-password',
            ])->assertStatus(302)->assertSessionHasErrors([
                'identifier' => __('auth.failed'),
            ]);
        }

        $response = $this->post(route('login.store'), [
            'identifier' => $user->email,
            'password' => 'wrong-password',
        ]);

        $response->assertSessionHasErrors('identifier');

        $errors = session('errors');

        $this->assertStringContainsString('Quá nhiều lần đăng nhập', $errors->first('identifier'));
    }
}

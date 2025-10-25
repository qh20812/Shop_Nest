<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PasswordConfirmationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Set locale to English for consistent error messages
        app()->setLocale('en');
    }

    public function test_man_hinh_xac_nhan_mat_khau_co_the_hien_thi()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get(route('password.confirm'));

        $response->assertStatus(200);
    }

    public function test_mat_khau_co_the_duoc_xac_nhan()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('password.confirm.store'), [
            'password' => '@12345Shopnest',
        ]);

        $response->assertRedirect();
        $response->assertSessionHasNoErrors();
    }

    public function test_mat_khau_khong_duoc_xac_nhan_voi_mat_khau_sai()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('password.confirm.store'), [
            'password' => 'wrong-password',
        ]);

        $response->assertSessionHasErrors();
    }
}

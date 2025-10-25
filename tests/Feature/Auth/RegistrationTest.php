<?php

namespace Tests\Feature\Auth;

use App\Mail\WelcomeEmail;
use App\Models\Role;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Seed roles for proper registration flow
        $this->seed(RoleSeeder::class);
        
        // Set locale to English for consistent error messages
        app()->setLocale('en');
        
        // Fake mail to prevent actual emails being sent
        Mail::fake();
    }

    public function test_man_hinh_dang_ky_co_the_hien_thi()
    {
        $response = $this->get(route('register'));

        $response->assertStatus(200);
    }

    public function test_nguoi_dung_moi_co_the_dang_ky()
    {
        $response = $this->post(route('register.store'), [
            'email' => 'ngocquyhuynh4@gmail.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('verification.notice'));
        $response->assertSessionHas('status', 'Registration successful! Please verify your email.');
        
        // Verify welcome email was sent
        Mail::assertSent(WelcomeEmail::class, function ($mail) {
            return $mail->hasTo('ngocquyhuynh4@gmail.com');
        });
    }

    public function test_email_la_bat_buoc()
    {
        $response = $this->post(route('register.store'), [
            'email' => '',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ]);

        $response->assertSessionHasErrors(['email']);
        $this->assertGuest();
    }

    public function test_email_phai_hop_le()
    {
        $response = $this->post(route('register.store'), [
            'email' => 'invalid-email',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ]);

        $response->assertSessionHasErrors(['email']);
        $this->assertGuest();
    }

    public function test_email_phai_la_duy_nhat()
    {
        // Create existing user
        User::factory()->create([
            'email' => 'existing@example.com',
        ]);

        $response = $this->post(route('register.store'), [
            'email' => 'existing@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ]);

        $response->assertSessionHasErrors(['email']);
        $this->assertGuest();
    }

    public function test_email_khong_duoc_qua_255_ky_tu()
    {
        $longEmail = str_repeat('a', 256) . '@example.com';

        $response = $this->post(route('register.store'), [
            'email' => $longEmail,
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ]);

        $response->assertSessionHasErrors(['email']);
        $this->assertGuest();
    }

    public function test_mat_khau_la_bat_buoc()
    {
        $response = $this->post(route('register.store'), [
            'email' => 'test@example.com',
            'password' => '',
            'password_confirmation' => '',
        ]);

        $response->assertSessionHasErrors(['password']);
        $this->assertGuest();
    }

    public function test_mat_khau_phai_it_nhat_8_ky_tu()
    {
        $response = $this->post(route('register.store'), [
            'email' => 'test@example.com',
            'password' => 'Pass1!',
            'password_confirmation' => 'Pass1!',
        ]);

        $response->assertSessionHasErrors(['password']);
        $this->assertGuest();
    }

    public function test_mat_khau_phai_chua_chu_hoa()
    {
        $response = $this->post(route('register.store'), [
            'email' => 'test@example.com',
            'password' => 'password123!',
            'password_confirmation' => 'password123!',
        ]);

        $response->assertSessionHasErrors(['password']);
        $this->assertGuest();
    }

    public function test_mat_khau_phai_chua_chu_thuong()
    {
        $response = $this->post(route('register.store'), [
            'email' => 'test@example.com',
            'password' => 'PASSWORD123!',
            'password_confirmation' => 'PASSWORD123!',
        ]);

        $response->assertSessionHasErrors(['password']);
        $this->assertGuest();
    }

    public function test_mat_khau_phai_chua_so()
    {
        $response = $this->post(route('register.store'), [
            'email' => 'test@example.com',
            'password' => 'Password!',
            'password_confirmation' => 'Password!',
        ]);

        $response->assertSessionHasErrors(['password']);
        $this->assertGuest();
    }

    public function test_mat_khau_phai_chua_ky_tu_dac_biet()
    {
        $response = $this->post(route('register.store'), [
            'email' => 'test@example.com',
            'password' => 'Password123',
            'password_confirmation' => 'Password123',
        ]);

        $response->assertSessionHasErrors(['password']);
        $this->assertGuest();
    }

    public function test_mat_khau_phai_khop_voi_xac_nhan()
    {
        $response = $this->post(route('register.store'), [
            'email' => 'test@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'DifferentPassword123!',
        ]);

        $response->assertSessionHasErrors(['password']);
        $this->assertGuest();
    }

    public function test_nguoi_dung_duoc_tao_voi_customer_role()
    {
        $this->post(route('register.store'), [
            'email' => 'test@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ]);

        $user = User::where('email', 'test@example.com')->first();
        $customerRole = Role::where('name->en', 'Customer')->first();

        $this->assertNotNull($user);
        $this->assertTrue($user->roles()->where('role_id', $customerRole->id)->exists());
    }

    public function test_nguoi_dung_duoc_tao_voi_username_duy_nhat()
    {
        // Debug: Check if roles exist
        $customerRole = Role::where('name->en', 'Customer')->first();
        $this->assertNotNull($customerRole, 'Customer role should exist');

        $response1 = $this->post(route('register.store'), [
            'email' => 'user1@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ]);

        $response1->assertRedirect(route('verification.notice'));

        // Log out the first user so we can register the second user
        \Illuminate\Support\Facades\Auth::logout();

        $response2 = $this->post(route('register.store'), [
            'email' => 'user2@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ]);

        $response2->assertRedirect(route('verification.notice'));

        $user1 = User::where('email', 'user1@example.com')->first();
        $user2 = User::where('email', 'user2@example.com')->first();

        $this->assertNotNull($user1, 'User1 was not created');
        $this->assertNotNull($user2, 'User2 was not created');
        $this->assertNotEquals($user1->username, $user2->username);
        $this->assertStringStartsWith('user_', $user1->username);
        $this->assertStringStartsWith('user_', $user2->username);
    }

    public function test_mat_khau_duoc_ma_hoa()
    {
        $password = 'Password123!';

        $this->post(route('register.store'), [
            'email' => 'test@example.com',
            'password' => $password,
            'password_confirmation' => $password,
        ]);

        $user = User::where('email', 'test@example.com')->first();

        $this->assertNotEquals($password, $user->password);
        $this->assertTrue(Hash::check($password, $user->password));
    }

    public function test_nguoi_dung_duoc_kich_hoat_sau_khi_dang_ky()
    {
        $this->post(route('register.store'), [
            'email' => 'test@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ]);

        $user = User::where('email', 'test@example.com')->first();

        $this->assertTrue($user->is_active);
    }

    public function test_nguoi_dung_duoc_tao_voi_provider_manual()
    {
        $this->post(route('register.store'), [
            'email' => 'test@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ]);

        $user = User::where('email', 'test@example.com')->first();

        $this->assertEquals('manual', $user->provider);
    }

    public function test_nguoi_dung_duoc_tao_voi_cac_truong_null()
    {
        $this->post(route('register.store'), [
            'email' => 'test@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ]);

        $user = User::where('email', 'test@example.com')->first();

        $this->assertNull($user->first_name);
        $this->assertNull($user->last_name);
        $this->assertNull($user->phone_number);
        $this->assertNull($user->avatar);
    }

    public function test_email_chao_mung_duoc_gui()
    {
        $this->post(route('register.store'), [
            'email' => 'test@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ]);

        Mail::assertSent(WelcomeEmail::class, 1);
        
        Mail::assertSent(WelcomeEmail::class, function ($mail) {
            $user = User::where('email', 'test@example.com')->first();
            return $mail->hasTo('test@example.com') && $mail->user->id === $user->id;
        });
    }

    public function test_khong_the_dang_ky_khi_thieu_customer_role()
    {
        // Delete all roles to simulate missing customer role
        Role::query()->delete();

        $response = $this->post(route('register.store'), [
            'email' => 'test@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ]);

        $response->assertSessionHasErrors(['email']);
        $this->assertGuest();
        $this->assertDatabaseMissing('users', ['email' => 'test@example.com']);
    }

    public function test_nguoi_dung_da_dang_nhap_khong_the_truy_cap_trang_dang_ky()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->get(route('register'));

        $response->assertRedirect(route('home'));
    }
}
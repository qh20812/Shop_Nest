<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Tests\TestCase;

/**
 * Trùng tài khoản giữa đăng ký email/mật khẩu và đăng nhập Google.
 */
class DuplicateAccountTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RoleSeeder::class);
    }

    public function test_register_with_google_email_points_to_google_login(): void
    {
        User::factory()->create([
            'email' => 'google.user@example.com',
            'provider' => 'google',
            'provider_id' => 'google-1',
        ]);

        $response = $this->post(route('register.store'), $this->registerPayload('google.user@example.com'));

        $response->assertSessionHasErrors('identifier');
        $this->assertStringContainsString('Google', (string) session('errors')->first('identifier'));
        $this->assertGuest();
        $this->assertSame(1, User::where('email', 'google.user@example.com')->count());
    }

    public function test_register_rejects_same_email_in_different_case(): void
    {
        User::factory()->create(['email' => 'case.user@example.com']);

        $response = $this->post(route('register.store'), $this->registerPayload('CASE.USER@EXAMPLE.COM'));

        $response->assertSessionHasErrors('identifier');
        $this->assertSame('Email đã được sử dụng.', session('errors')->first('identifier'));
        $this->assertGuest();
        $this->assertSame(1, User::whereRaw('LOWER(email) = ?', ['case.user@example.com'])->count());
    }

    public function test_register_stores_email_in_lowercase(): void
    {
        $response = $this->post(route('register.store'), $this->registerPayload('New.User@Example.COM'));

        $response->assertRedirect(route('verification.notice'));

        $this->assertDatabaseHas('users', ['email' => 'new.user@example.com']);
        $this->assertFalse(
            User::where('email', 'New.User@Example.COM')->get()
                ->contains(fn (User $user) => $user->email === 'New.User@Example.COM')
        );
    }

    public function test_register_rejects_duplicate_phone_after_normalization(): void
    {
        User::factory()->create(['phone_number' => '+84912345678']);

        $response = $this->post(route('register.store'), $this->registerPayload('0912 345 678'));

        $response->assertSessionHasErrors('identifier');
        $this->assertSame('Số điện thoại đã được sử dụng.', session('errors')->first('identifier'));
        $this->assertGuest();
    }

    public function test_login_with_google_only_account_suggests_google(): void
    {
        User::factory()->create([
            'email' => 'only.google@example.com',
            'provider' => 'google',
            'provider_id' => 'google-2',
            'password' => Hash::make(Str::random(40)),
        ]);

        $response = $this->post(route('login'), [
            'identifier' => 'only.google@example.com',
            'password' => 'password',
        ]);

        $response->assertSessionHasErrors('identifier');
        $this->assertStringContainsString('Google', (string) session('errors')->first('identifier'));
        $this->assertGuest();
    }

    public function test_login_is_case_insensitive_for_email(): void
    {
        User::factory()->create([
            'email' => 'lower@example.com',
            'provider' => null,
        ]);

        $this->post(route('login'), [
            'identifier' => 'LOWER@EXAMPLE.COM',
            'password' => 'password',
        ])->assertSessionHasNoErrors();

        $this->assertAuthenticated();
    }

    /**
     * @return array<string, mixed>
     */
    private function registerPayload(string $identifier): array
    {
        return [
            'identifier' => $identifier,
            'password' => 'Password123!',
            'confirmPassword' => 'Password123!',
            'agreeToTerms' => true,
        ];
    }
}

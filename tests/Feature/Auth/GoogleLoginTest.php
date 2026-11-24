<?php

namespace Tests\Feature\Auth;

use App\Mail\GoogleAccountLinkedMail;
use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Laravel\Socialite\Contracts\Provider as SocialiteProvider;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\User as SocialiteUser;
use Mockery;
use Tests\TestCase;

class GoogleLoginTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed(RoleSeeder::class);
    }

    public function test_google_callback_creates_and_logs_in_verified_customer(): void
    {
        $this->mockGoogleUser([
            'id' => 'google-123456',
            'name' => 'Nguyen Van Google',
            'email' => 'google.user@example.com',
            'avatar' => 'https://example.com/avatar.jpg',
            'email_verified' => true,
        ]);

        $response = $this->get('/auth/google/callback');

        $response->assertRedirect(route('home', absolute: false));
        $this->assertAuthenticated();

        $user = User::where('email', 'google.user@example.com')->first();

        $this->assertNotNull($user);
        $this->assertSame('google', $user->provider);
        $this->assertSame('google-123456', $user->provider_id);
        $this->assertNotNull($user->email_verified_at);
        $this->assertTrue($user->hasVerifiedEmail());
        $this->assertTrue($user->roles()->where('name->en', 'Customer')->exists());
    }

    public function test_google_callback_marks_existing_google_user_as_verified(): void
    {
        $user = User::factory()->create([
            'email' => 'existing.google@example.com',
            'provider' => 'google',
            'provider_id' => 'google-existing',
            'email_verified_at' => null,
        ]);

        $this->mockGoogleUser([
            'id' => 'google-existing',
            'email' => 'existing.google@example.com',
            'email_verified' => true,
        ]);

        $this->get('/auth/google/callback')->assertRedirect(route('home', absolute: false));

        $this->assertAuthenticatedAs($user);
        $this->assertNotNull($user->fresh()->email_verified_at);
        $this->assertTrue($user->fresh()->hasVerifiedEmail());
    }

    public function test_google_callback_links_unverified_existing_email_and_resets_password(): void
    {
        Mail::fake();

        $user = User::factory()->create([
            'email' => 'linked.user@example.com',
            'provider' => null,
            'provider_id' => null,
            'email_verified_at' => null,
        ]);

        $this->mockGoogleUser([
            'id' => 'google-linked',
            'email' => 'linked.user@example.com',
            'email_verified' => true,
        ]);

        $this->get('/auth/google/callback')->assertRedirect(route('home', absolute: false));

        $user->refresh();

        $this->assertAuthenticatedAs($user);
        $this->assertSame('google', $user->provider);
        $this->assertSame('google-linked', $user->provider_id);
        $this->assertTrue($user->hasVerifiedEmail());

        // Mật khẩu cũ (người đăng ký trước đó đặt) phải bị vô hiệu hoá.
        $this->assertFalse(Hash::check('password', $user->password));

        Mail::assertQueued(GoogleAccountLinkedMail::class, function (GoogleAccountLinkedMail $mail) use ($user) {
            return $mail->user->is($user) && $mail->passwordWasReset === true;
        });
    }

    public function test_google_callback_links_verified_account_without_resetting_password(): void
    {
        Mail::fake();

        $user = User::factory()->create([
            'email' => 'verified.user@example.com',
            'provider' => null,
            'provider_id' => null,
        ]);

        $this->mockGoogleUser([
            'id' => 'google-verified',
            'email' => 'verified.user@example.com',
            'email_verified' => true,
        ]);

        $this->get('/auth/google/callback')->assertRedirect(route('home', absolute: false));

        $user->refresh();

        $this->assertAuthenticatedAs($user);
        $this->assertTrue(Hash::check('password', $user->password));

        Mail::assertQueued(GoogleAccountLinkedMail::class, function (GoogleAccountLinkedMail $mail) use ($user) {
            return $mail->user->is($user) && $mail->passwordWasReset === false;
        });
    }

    public function test_google_callback_does_not_link_when_google_has_not_verified_the_email(): void
    {
        Mail::fake();

        $user = User::factory()->create([
            'email' => 'unverified.claim@example.com',
            'provider' => null,
            'provider_id' => null,
            'email_verified_at' => null,
        ]);

        $this->mockGoogleUser([
            'id' => 'google-claim',
            'email' => 'unverified.claim@example.com',
            'email_verified' => false,
        ]);

        $this->get('/auth/google/callback')
            ->assertRedirect(route('login'))
            ->assertSessionHasErrors('google');

        $this->assertGuest();

        $user->refresh();
        $this->assertNull($user->provider);
        $this->assertNull($user->provider_id);
        $this->assertNull($user->email_verified_at);
        Mail::assertNothingQueued();
    }

    public function test_google_callback_rejects_inactive_account(): void
    {
        $user = User::factory()->create([
            'email' => 'inactive@example.com',
            'provider' => 'google',
            'provider_id' => 'google-inactive',
            'is_active' => false,
        ]);

        $this->mockGoogleUser([
            'id' => 'google-inactive',
            'email' => 'inactive@example.com',
            'email_verified' => true,
        ]);

        $this->get('/auth/google/callback')
            ->assertRedirect(route('login'))
            ->assertSessionHasErrors('google');

        $this->assertGuest();
        $this->assertFalse($user->fresh()->is_active);
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    private function mockGoogleUser(array $attributes): SocialiteUser
    {
        $attributes = array_merge([
            'id' => 'google-123456',
            'name' => 'Nguyen Van Google',
            'email' => 'google.user@example.com',
            'avatar' => 'https://example.com/avatar.jpg',
            'email_verified' => true,
        ], $attributes);

        // Google provider thật gọi setRaw() trước map(), nên claim email_verified
        // nằm trong getRaw().
        $socialiteUser = (new SocialiteUser)->setRaw($attributes)->map($attributes);

        $provider = Mockery::mock(SocialiteProvider::class);
        $provider->shouldReceive('user')->once()->andReturn($socialiteUser);

        Socialite::shouldReceive('driver')
            ->with('google')
            ->andReturn($provider);

        return $socialiteUser;
    }
}

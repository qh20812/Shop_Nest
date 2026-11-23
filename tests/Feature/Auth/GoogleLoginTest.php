<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
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

    public function test_google_callback_links_existing_email_and_marks_verified(): void
    {
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
    }

    /**
     * @param  array<string, mixed>  $attributes
     */
    private function mockGoogleUser(array $attributes): SocialiteUser
    {
        $socialiteUser = (new SocialiteUser)->map(array_merge([
            'id' => 'google-123456',
            'name' => 'Nguyen Van Google',
            'email' => 'google.user@example.com',
            'avatar' => 'https://example.com/avatar.jpg',
            'email_verified' => true,
        ], $attributes));

        $provider = Mockery::mock(SocialiteProvider::class);
        $provider->shouldReceive('user')->once()->andReturn($socialiteUser);

        Socialite::shouldReceive('driver')
            ->with('google')
            ->andReturn($provider);

        return $socialiteUser;
    }
}

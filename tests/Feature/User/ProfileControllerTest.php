<?php

namespace Tests\Feature\User;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProfileControllerTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create([
            'email_verified_at' => now(),
        ]);
    }

    /** @test */
    public function authenticated_user_can_view_profile()
    {
        $response = $this->actingAs($this->user)->get(route('user.profile.index'));

        $response->assertInertia(fn ($page) => $page
            ->component('Customer/Profile/Index')
            ->has('user')
            ->where('user.id', $this->user->id)
            ->where('user.email', $this->user->email)
        );
    }

    /** @test */
    public function unauthenticated_user_cannot_view_profile()
    {
        $response = $this->get(route('user.profile.index'));

        $response->assertRedirect(route('login'));
    }

    /** @test */
    public function unverified_user_cannot_view_profile()
    {
        $unverifiedUser = User::factory()->create([
            'email_verified_at' => null,
        ]);

        $response = $this->actingAs($unverifiedUser)->get(route('user.profile.index'));

        $response->assertRedirect(route('verification.notice'));
    }

    /** @test */
    public function user_can_update_profile_successfully()
    {
        $data = [
            'first_name' => 'Updated First',
            'last_name' => 'Updated Last',
            'email' => 'newemail@example.com',
            'phone_number' => '0987654321',
            'gender' => 'male',
            'date_of_birth' => '1990-01-01',
        ];

        $response = $this->actingAs($this->user)->put(route('user.profile.update'), $data);

        $response->assertRedirect(route('user.profile.index'));
        $response->assertSessionHas('success');

        $this->user->refresh();
        $this->assertEquals('Updated First', $this->user->first_name);
        $this->assertEquals('newemail@example.com', $this->user->email);
        $this->assertNull($this->user->email_verified_at); // Should reset verification
    }

    /** @test */
    public function user_can_update_profile_with_avatar()
    {
        if (!function_exists('imagecreatetruecolor')) {
            $this->markTestSkipped('GD extension not installed');
        }

        Storage::fake('public');

        $avatar = UploadedFile::fake()->image('avatar.jpg');

        $data = [
            'first_name' => 'Test',
            'avatar' => $avatar,
        ];

        $response = $this->actingAs($this->user)->put(route('user.profile.update'), $data);

        $response->assertRedirect(route('user.profile.index'));
        $this->user->refresh();

        $this->assertNotNull($this->user->avatar);
        Storage::assertExists('public/' . $this->user->avatar);
    }

    /** @test */
    public function old_avatar_is_deleted_when_uploading_new_one()
    {
        if (!function_exists('imagecreatetruecolor')) {
            $this->markTestSkipped('GD extension not installed');
        }

        Storage::fake('public');

        // Set old avatar
        $oldAvatar = UploadedFile::fake()->image('old.jpg');
        $oldPath = $oldAvatar->store('avatars', 'public');
        $this->user->update(['avatar' => $oldPath]);

        // Upload new avatar
        $newAvatar = UploadedFile::fake()->image('new.jpg');
        $data = ['first_name' => 'Test', 'avatar' => $newAvatar];

        $this->actingAs($this->user)->put(route('user.profile.update'), $data);

        Storage::assertMissing('public/' . $oldPath); // Old deleted
        $this->user->refresh();
        Storage::assertExists('public/' . $this->user->avatar); // New exists
    }

    /** @test */
    public function validation_fails_for_invalid_email()
    {
        $data = [
            'email' => 'invalid-email',
        ];

        $response = $this->actingAs($this->user)->put(route('user.profile.update'), $data);

        $response->assertRedirect();
        $response->assertSessionHasErrors('email');
    }

    /** @test */
    public function validation_fails_for_duplicate_email()
    {
        $anotherUser = User::factory()->create(['email' => 'existing@example.com']);

        $data = [
            'email' => 'existing@example.com',
        ];

        $response = $this->actingAs($this->user)->put(route('user.profile.update'), $data);

        $response->assertRedirect();
        $response->assertSessionHasErrors('email');
    }

    /** @test */
    public function validation_fails_for_invalid_phone_number()
    {
        $data = [
            'phone_number' => 'invalid-phone',
        ];

        $response = $this->actingAs($this->user)->put(route('user.profile.update'), $data);

        $response->assertRedirect();
        $response->assertSessionHasErrors('phone_number');
    }

    /** @test */
    public function validation_fails_for_negative_phone_number()
    {
        $data = [
            'phone_number' => '-123456789',
        ];

        $response = $this->actingAs($this->user)->put(route('user.profile.update'), $data);

        $response->assertRedirect();
        $response->assertSessionHasErrors('phone_number');
    }

    /** @test */
    public function validation_fails_for_invalid_gender()
    {
        $data = [
            'gender' => 'invalid',
        ];

        $response = $this->actingAs($this->user)->put(route('user.profile.update'), $data);

        $response->assertRedirect();
        $response->assertSessionHasErrors('gender');
    }

    /** @test */
    public function validation_fails_for_future_date_of_birth()
    {
        $data = [
            'date_of_birth' => now()->addDay()->toDateString(),
        ];

        $response = $this->actingAs($this->user)->put(route('user.profile.update'), $data);

        $response->assertRedirect();
        $response->assertSessionHasErrors('date_of_birth');
    }

    /** @test */
    public function validation_fails_for_underage_date_of_birth()
    {
        $data = [
            'date_of_birth' => now()->subYears(17)->toDateString(),
        ];

        $response = $this->actingAs($this->user)->put(route('user.profile.update'), $data);

        $response->assertRedirect();
        $response->assertSessionHasErrors('date_of_birth');
    }

    /** @test */
    public function validation_fails_for_invalid_avatar_file()
    {
        $invalidFile = UploadedFile::fake()->create('document.pdf', 100);

        $data = [
            'avatar' => $invalidFile,
        ];

        $response = $this->actingAs($this->user)->put(route('user.profile.update'), $data);

        $response->assertRedirect();
        $response->assertSessionHasErrors('avatar');
    }

    /** @test */
    public function avatar_url_accessor_returns_correct_url()
    {
        // Test local avatar
        $this->user->update(['avatar' => 'avatars/test.jpg']);
        $this->assertStringContainsString('storage/avatars/test.jpg', $this->user->avatar_url);

        // Test Google avatar
        $this->user->update(['avatar' => 'https://google.com/avatar.jpg']);
        $this->assertEquals('https://google.com/avatar.jpg', $this->user->avatar_url);

        // Test placeholder
        $this->user->update(['avatar' => null, 'first_name' => 'John']);
        $this->assertStringContainsString('ui-avatars.com', $this->user->avatar_url);
    }
}
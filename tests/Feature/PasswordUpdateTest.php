<?php

namespace Tests\Feature;

use App\Models\User;
use App\Rules\NotOldPassword;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class PasswordUpdateTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_update_password_with_different_password()
    {
        $user = User::factory()->create([
            'password' => Hash::make('old-password')
        ]);

        $response = $this->actingAs($user)->put('/settings/password', [
            'current_password' => 'old-password',
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertTrue(Hash::check('new-password', $user->fresh()->password));
    }

    public function test_user_cannot_update_password_with_same_password()
    {
        $user = User::factory()->create([
            'password' => Hash::make('current-password')
        ]);

        $response = $this->actingAs($user)->put('/settings/password', [
            'current_password' => 'current-password',
            'password' => 'current-password',
            'password_confirmation' => 'current-password',
        ]);

        $response->assertSessionHasErrors(['password']);
        $this->assertTrue(Hash::check('current-password', $user->fresh()->password));
    }

    public function test_not_old_password_rule_validates_correctly()
    {
        $user = User::factory()->create([
            'password' => Hash::make('test-password')
        ]);

        $this->actingAs($user);

        $rule = new NotOldPassword();
        $fail = function ($message) {
            $this->assertEquals('New password cannot be the same as current password', $message);
        };

        // Test với mật khẩu trùng - should fail
        $rule->validate('password', 'test-password', $fail);

        // Test với mật khẩu khác - should not fail
        $failCalled = false;
        $failCallback = function ($message) use (&$failCalled) {
            $failCalled = true;
        };
        
        $rule->validate('password', 'different-password', $failCallback);
        $this->assertFalse($failCalled);
    }
}
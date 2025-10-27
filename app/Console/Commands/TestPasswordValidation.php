<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Rules\NotOldPassword;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class TestPasswordValidation extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:test-password-validation';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test password validation rule NotOldPassword';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Testing NotOldPassword validation rule...');

        // Tạo user test
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('current-password')
        ]);

        // Simulate đăng nhập
        Auth::login($user);

        $this->info("Test user created with email: {$user->email}");
        $this->info("Current password: current-password");

        // Test case 1: Mật khẩu mới trùng với mật khẩu cũ
        $this->info("\n--- Test Case 1: Same password ---");
        $validator1 = Validator::make([
            'current_password' => 'current-password',
            'password' => 'current-password',
            'password_confirmation' => 'current-password'
        ], [
            'current_password' => ['required', 'current_password'],
            'password' => ['required', 'confirmed', new NotOldPassword()],
        ]);

        if ($validator1->fails()) {
            $this->error("❌ Validation failed as expected:");
            foreach ($validator1->errors()->get('password') as $error) {
                $this->error("   - $error");
            }
        } else {
            $this->info("✅ Validation passed (unexpected)");
        }

        // Test case 2: Mật khẩu mới khác với mật khẩu cũ
        $this->info("\n--- Test Case 2: Different password ---");
        $validator2 = Validator::make([
            'current_password' => 'current-password',
            'password' => 'new-different-password',
            'password_confirmation' => 'new-different-password'
        ], [
            'current_password' => ['required', 'current_password'],
            'password' => ['required', 'confirmed', new NotOldPassword()],
        ]);

        if ($validator2->fails()) {
            $this->error("❌ Validation failed (unexpected):");
            foreach ($validator2->errors()->all() as $error) {
                $this->error("   - $error");
            }
        } else {
            $this->info("✅ Validation passed as expected");
        }

        // Cleanup
        $user->delete();
        Auth::logout();

        $this->info("\n🎉 Password validation test completed!");
    }
}

<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class TestAvatarFlow extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:avatar-flow {user_id}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test complete avatar flow for a user';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $userId = $this->argument('user_id');
        $user = User::find($userId);
        
        if (!$user) {
            $this->error("User with ID {$userId} not found");
            return;
        }
        
        $this->info("=== AVATAR FLOW TEST ===");
        $this->info("User: {$user->username} ({$user->email})");
        
        // Step 1: Current state
        $this->info("\n1. Current Avatar State:");
        $this->info("   Raw Avatar: " . ($user->avatar ?? 'null'));
        $this->info("   Avatar URL: " . $user->avatar_url);
        $this->info("   Is Google User: " . ($user->isGoogleUser() ? 'Yes' : 'No'));
        
        // Step 2: Simulate uploading a new avatar
        $this->info("\n2. Simulating Avatar Upload:");
        $testAvatarPath = 'avatars/test-' . Str::random(8) . '.jpg';
        
        // Create a fake avatar file in storage
        Storage::disk('public')->put($testAvatarPath, 'fake image content');
        $this->info("   Created test file: {$testAvatarPath}");
        
        // Update user avatar
        $oldAvatar = $user->avatar;
        $user->avatar = $testAvatarPath;
        $user->save();
        
        $this->info("   Updated user avatar to: {$testAvatarPath}");
        
        // Step 3: Verify the update
        $this->info("\n3. After Update:");
        $user->refresh();
        $this->info("   Raw Avatar: " . ($user->avatar ?? 'null'));
        $this->info("   Avatar URL: " . $user->avatar_url);
        
        // Step 4: Test the shared data (simulate HandleInertiaRequests)
        $this->info("\n4. Shared Data (as sent to frontend):");
        $sharedUser = [
            'id' => $user->id,
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'email' => $user->email,
            'username' => $user->username,
            'avatar' => $user->avatar,
            'avatar_url' => $user->avatar_url,
        ];
        
        foreach ($sharedUser as $key => $value) {
            $this->info("   {$key}: " . ($value ?? 'null'));
        }
        
        // Step 5: Cleanup
        $this->info("\n5. Cleanup:");
        if (Storage::disk('public')->exists($testAvatarPath)) {
            Storage::disk('public')->delete($testAvatarPath);
            $this->info("   Deleted test file: {$testAvatarPath}");
        }
        
        // Restore old avatar if it was different
        if ($oldAvatar !== $testAvatarPath) {
            $user->avatar = $oldAvatar;
            $user->save();
            $this->info("   Restored original avatar: " . ($oldAvatar ?? 'null'));
        }
        
        $this->info("\n=== TEST COMPLETED ===");
    }
}

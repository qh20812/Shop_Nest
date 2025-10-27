<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class TestAvatarUpdate extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:avatar-update {user_id}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test avatar update for a specific user';

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
        
        $this->info("Current user data:");
        $this->info("ID: {$user->id}");
        $this->info("Username: {$user->username}");
        $this->info("Email: {$user->email}");
        $this->info("Avatar (raw): " . ($user->avatar ?? 'null'));
        $this->info("Avatar URL: " . $user->avatar_url);
        $this->info("Is Google User: " . ($user->isGoogleUser() ? 'Yes' : 'No'));
        
        // Reset to Google avatar
        $googleAvatarUrl = 'https://lh3.googleusercontent.com/a/ACg8ocJ0Sk0muUSR-_bbGzWUzhzBlICGLI4PT17-qZpOrssZnrACHV8S=s96-c';
        $this->info("\nResetting avatar to Google URL: {$googleAvatarUrl}");
        
        $user->avatar = $googleAvatarUrl;
        $saved = $user->save();
        
        $this->info("Save result: " . ($saved ? 'Success' : 'Failed'));
        
        // Refresh from database
        $user->refresh();
        $this->info("After refresh - Avatar: " . ($user->avatar ?? 'null'));
        $this->info("After refresh - Avatar URL: " . $user->avatar_url);
    }
}

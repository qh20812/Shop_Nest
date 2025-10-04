<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Mail\WelcomeGoogleUserMail;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class TestGoogleWelcomeEmail extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:test-google-welcome-email';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test Google welcome email sending functionality';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $user = User::first();
        
        if (!$user) {
            $this->error('No user found in database');
            return;
        }

        // Generate a temporary password for testing
        $tempPassword = Str::random(12);

        try {
            Mail::to($user->email)->send(new WelcomeGoogleUserMail($user, $tempPassword));
            $this->info("Google welcome email sent successfully to {$user->email}");
            $this->info("Temporary password used: {$tempPassword}");
        } catch (\Exception $e) {
            $this->error("Failed to send Google welcome email: " . $e->getMessage());
        }
    }
}

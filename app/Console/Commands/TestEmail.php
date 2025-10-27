<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Mail\WelcomeEmail;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class TestEmail extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:test-email';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test email sending functionality';

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

        try {
            Mail::to($user->email)->send(new WelcomeEmail($user));
            $this->info("Welcome email sent successfully to {$user->email}");
        } catch (\Exception $e) {
            $this->error("Failed to send email: " . $e->getMessage());
        }
    }
}

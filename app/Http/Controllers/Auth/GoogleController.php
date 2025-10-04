<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\WelcomeGoogleUserMail;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;
use Illuminate\Auth\Events\Registered;

class GoogleController extends Controller
{
    /**
     * Redirect to Google OAuth.
     */
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    /**
     * Handle Google OAuth callback.
     */
    public function handleGoogleCallback(Request $request)
    {
        try {
            $googleUser = Socialite::driver('google')->user();
            Log::info('Google user data:', [
                'id' => $googleUser->getId(),
                'email' => $googleUser->getEmail(),
                'name' => $googleUser->getName(),
                'avatar' => $googleUser->getAvatar()
            ]);
        } catch (\Throwable $e) {
            Log::error('Google OAuth error:', ['error' => $e->getMessage()]);
            return redirect()
                ->route('login')
                ->withErrors(['google' => 'Cannot verify with Google. Please try again.']);
        }

        // First, check if user exists by provider and provider_id
        $user = User::where('provider', 'google')
            ->where('provider_id', $googleUser->getId())
            ->first();

        // If not found, check by email (for linking existing accounts)
        if (!$user && $googleUser->getEmail()) {
            $existingUser = User::where('email', $googleUser->getEmail())->first();
            
            if ($existingUser) {
                // Link existing account with Google
                $existingUser->update([
                    'provider' => 'google',
                    'provider_id' => $googleUser->getId(),
                    'avatar' => $googleUser->getAvatar(),
                    'email_verified_at' => now(),
                ]);
                $user = $existingUser;
            }
        }

        // If still no user found, create new one
        if (!$user) {
            Log::info('Creating new Google user');
            
            try {
                // Generate unique username
                $username = $this->generateUniqueUsernameFromGoogle($googleUser);
                Log::info('Generated username:', ['username' => $username]);
                $password = Str::random(32); // Generate a random password
                $user = User::create([
                    'username' => $username,
                    'first_name' => $this->extractFirstName($googleUser->getName()),
                    'last_name' => $this->extractLastName($googleUser->getName()),
                    'email' => $googleUser->getEmail(),
                    'password' => Hash::make($password), // Random password
                    'provider' => 'google',
                    'provider_id' => $googleUser->getId(),
                    'avatar' => $googleUser->getAvatar(),
                    'email_verified_at' => now(),
                    'is_active' => true,
                ]);

                Log::info('User created successfully:', ['user_id' => $user->id]);
                
                // Assign Customer role to new Google users
                $customerRole = Role::where('name->en', 'Customer')->first();
                if ($customerRole) {
                    $user->role()->attach($customerRole->id);
                    Log::info('Customer role assigned to user:', ['user_id' => $user->id, 'role_id' => $customerRole->id]);
                } else {
                    Log::warning('Customer role not found');
                }

                // Fire registered event
                event(new Registered($user));
                Log::info('Registered event fired for user:', ['user_id' => $user->id]);
                
                // Send Google-specific welcome email with temporary password
                try {
                    Mail::to($user->email)->send(new WelcomeGoogleUserMail($user, $password));
                    Log::info('Google welcome email sent successfully to: ' . $user->email);
                } catch (\Exception $e) {
                    Log::error('Failed to send Google welcome email to: ' . $user->email . ' - Error: ' . $e->getMessage());
                }
                
            } catch (\Exception $e) {
                Log::error('Error creating Google user:', [
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);
                return redirect()
                    ->route('login')
                    ->withErrors(['google' => 'Failed to create user account. Please try again.']);
            }
        } else {
            // Update existing user's Google info
            $user->update([
                'avatar' => $googleUser->getAvatar(),
                'provider' => 'google',
                'provider_id' => $googleUser->getId(),
            ]);
        }

        // Log the user in
        Auth::login($user, true);
        Log::info('User logged in via Google:', ['user_id' => $user->id, 'email' => $user->email]);

        // Redirect based on user role
        if ($user->role()->where('name->en', 'Admin')->exists()) {
            Log::info('Redirecting Admin user to admin dashboard');
            return redirect()->intended(route('admin.dashboard', absolute: false))
                ->with('success', 'Welcome back, Admin!');
        }
        
        // Check if user has Customer role
        if ($user->role()->where('name->en', 'Customer')->exists()) {
            Log::info('Redirecting Customer user to welcome page');
            return redirect()->intended(route('welcome', absolute: false))
                ->with('success', 'Login with Google successful!');
        }
        
        Log::info('Redirecting user to dashboard');
        return redirect()->intended(route('dashboard', absolute: false))
            ->with('success', 'Login with Google successful!');
    }

    /**
     * Generate unique username from Google user data.
     */
    private function generateUniqueUsernameFromGoogle($googleUser): string
    {
        $baseName = strtolower(str_replace(' ', '', $googleUser->getName()));
        $baseName = preg_replace('/[^a-z0-9]/', '', $baseName);
        
        if (strlen($baseName) < 3) {
            $baseName = 'google_user';
        }

        $username = $baseName;
        $counter = 1;

        while (User::where('username', $username)->exists()) {
            $username = $baseName . '_' . $counter;
            $counter++;
        }

        return $username;
    }

    /**
     * Extract first name from full name.
     */
    private function extractFirstName($fullName): string
    {
        $parts = explode(' ', trim($fullName));
        return $parts[0] ?? 'User';
    }

    /**
     * Extract last name from full name.
     */
    private function extractLastName($fullName): string
    {
        $parts = explode(' ', trim($fullName));
        if (count($parts) > 1) {
            array_shift($parts); // Remove first name
            return implode(' ', $parts);
        }
        return '';
    }
}

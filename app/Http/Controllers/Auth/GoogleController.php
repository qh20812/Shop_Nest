<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\GoogleAccountLinkedMail;
use App\Mail\WelcomeGoogleUserMail;
use App\Models\Role;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

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
                'avatar' => $googleUser->getAvatar(),
            ]);
        } catch (\Throwable $e) {
            Log::error('Google OAuth error:', ['error' => $e->getMessage()]);

            return redirect()
                ->route('login')
                ->withErrors(['google' => 'Cannot verify with Google. Please try again.']);
        }

        // Google đã xác thực quyền sở hữu email; chỉ mark verified / cho phép
        // liên kết khi claim này đúng. Thiếu claim → coi như chưa xác thực.
        $emailVerifiedByGoogle = filter_var(
            $googleUser->getRaw()['email_verified'] ?? false,
            FILTER_VALIDATE_BOOL
        );

        // First, check if user exists by provider and provider_id
        $user = User::where('provider', 'google')
            ->where('provider_id', $googleUser->getId())
            ->first();

        $linkedNow = false;
        $passwordWasReset = false;

        // If not found, check by email (for linking existing accounts).
        // Chỉ liên kết khi Google xác nhận email này thuộc về người đăng nhập.
        if (! $user && $googleUser->getEmail()) {
            $existingUser = User::whereRaw('LOWER(email) = ?', [strtolower((string) $googleUser->getEmail())])->first();

            if ($existingUser) {
                if (! $emailVerifiedByGoogle) {
                    Log::warning('Google login rejected: email not verified by Google', [
                        'user_id' => $existingUser->id,
                        'email' => $existingUser->email,
                    ]);

                    return redirect()
                        ->route('login')
                        ->withErrors(['google' => 'Google chưa xác thực email này. Hãy đăng nhập bằng mật khẩu hoặc dùng chức năng Quên mật khẩu.']);
                }

                // Tài khoản email/mật khẩu chưa xác thực: người tạo mật khẩu không
                // chứng minh được quyền sở hữu email → coi Google là chủ thật và
                // vô hiệu hoá mật khẩu cũ để tránh bị chiếm tài khoản.
                $passwordWasReset = ! $existingUser->hasVerifiedEmail();

                $attributes = [
                    'provider' => 'google',
                    'provider_id' => $googleUser->getId(),
                    'avatar' => $googleUser->getAvatar(),
                ];

                if ($passwordWasReset) {
                    $attributes['password'] = Hash::make(Str::random(40));
                }

                $existingUser->update($attributes);

                $user = $existingUser;
                $linkedNow = true;

                Log::info('Google account linked to existing email', [
                    'user_id' => $user->id,
                    'password_reset' => $passwordWasReset,
                ]);
            }
        }

        // If still no user found, create new one
        if (! $user) {
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
                    'email' => strtolower((string) $googleUser->getEmail()),
                    'locale' => app()->getLocale(),
                    'password' => Hash::make($password), // Random, không gửi cho người dùng
                    'provider' => 'google',
                    'provider_id' => $googleUser->getId(),
                    'avatar' => $googleUser->getAvatar(),
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

                // Google đã xác thực email, mark verified trước khi fire Registered
                // để tránh gửi email xác thực không cần thiết.
                $this->markGoogleEmailAsVerified($user, $emailVerifiedByGoogle);

                // Fire registered event
                event(new Registered($user));
                Log::info('Registered event fired for user:', ['user_id' => $user->id]);

                // Send Google-specific welcome email (không chứa mật khẩu).
                try {
                    Mail::to($user->email)->send(new WelcomeGoogleUserMail($user));
                    Log::info('Google welcome email sent successfully to: '.$user->email);
                } catch (\Exception $e) {
                    Log::error('Failed to send Google welcome email to: '.$user->email.' - Error: '.$e->getMessage());
                }

            } catch (\Exception $e) {
                Log::error('Error creating Google user:', [
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString(),
                ]);

                return redirect()
                    ->route('login')
                    ->withErrors(['google' => 'Failed to create user account. Please try again.']);
            }
        } elseif (! $linkedNow) {
            // Update existing user's Google info
            $user->update([
                'avatar' => $googleUser->getAvatar(),
                'provider' => 'google',
                'provider_id' => $googleUser->getId(),
            ]);
        }

        // Áp dụng cho cả user đã tồn tại (provider google hoặc link theo email)
        // vì email_verified_at không nằm trong $fillable nên update() ở trên bị bỏ qua.
        $this->markGoogleEmailAsVerified($user, $emailVerifiedByGoogle);

        // Không cho tài khoản đã bị vô hiệu hoá đăng nhập bằng Google
        // (luồng email/mật khẩu đã kiểm tra việc này ở AuthenticatedSessionController).
        if (! $user->is_active) {
            Log::warning('Google login rejected: inactive account', ['user_id' => $user->id]);

            return redirect()
                ->route('login')
                ->withErrors(['google' => 'Tài khoản đã bị vô hiệu hoá. Vui lòng liên hệ bộ phận hỗ trợ.']);
        }

        // Thông báo cho chủ tài khoản khi email/mật khẩu vừa được liên kết Google.
        if ($linkedNow) {
            try {
                Mail::to($user->email)->send(new GoogleAccountLinkedMail($user, $passwordWasReset));
            } catch (\Throwable $e) {
                Log::error('Failed to send Google account linked email', [
                    'user_id' => $user->id,
                    'error' => $e->getMessage(),
                ]);
            }
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

            return redirect()->intended(route('home', absolute: false))
                ->with('success', 'Login with Google successful!');
        }

        Log::info('Redirecting user to home page');

        return redirect()->intended(route('home', absolute: false))
            ->with('success', 'Login with Google successful!');
    }

    /**
     * Mark email as verified when Google confirms ownership.
     */
    private function markGoogleEmailAsVerified(User $user, bool $verifiedByGoogle): void
    {
        if ($verifiedByGoogle && $user->email && ! $user->hasVerifiedEmail()) {
            $user->markEmailAsVerified();
            Log::info('Google email marked as verified:', ['user_id' => $user->id, 'email' => $user->email]);
        }
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
            $username = $baseName.'_'.$counter;
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

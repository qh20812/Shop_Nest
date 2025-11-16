<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Mail\WelcomeEmail;
use App\Models\Role;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register-page');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(RegisterRequest $request): RedirectResponse
    {
        $identifier = $request->input('identifier');

        // Determine if input is email, phone, or username
        $isEmail = filter_var($identifier, FILTER_VALIDATE_EMAIL);
        $phonePattern = '/^\+?[0-9]{9,15}$/';
        $isPhone = preg_match($phonePattern, $identifier);

        // Prepare user data
        $email = null;
        $username = null;
        $phoneNumber = null;

        if ($isEmail) {
            // Input is email - use it directly and generate unique username
            $email = $identifier;
            $username = $this->generateUniqueUsername();
        } elseif ($isPhone) {
            // Input is phone number - set phone and generate username
            $phoneNumber = $identifier;
            $username = $this->generateUniqueUsername();
        } else {
            // Input is username - use it directly and email will be null
            $username = $identifier;
            $email = null; // Email not provided
            $phoneNumber = null; // Phone not provided
        }

        // Get customer role with null check
        $customerRole = Role::where('name->en', 'Customer')->orWhere('name->vi', 'Khách hàng')->first();
        if (!$customerRole) {
            return back()->withErrors([
                'identifier' => __('Customer role not found. Please contact system administrator.'),
            ])->withInput();
        }

        // Create user with validated data
        $user = User::create([
            'username' => $username,
            'email' => $email,
            'password' => Hash::make($request->password),
            'is_active' => true,
            'first_name' => null, // Will be null initially
            'last_name' => null,  // Will be null initially  
            'phone_number' => $phoneNumber,
            'role_id' => $customerRole->id,
            'provider' => 'manual',
            'avatar' => null, // Manual users start with null avatar (will show initials)
            // Note: first_name, last_name, phone_number will be null initially
            // These can be updated later in ProfileController
        ]);

        // Fire the registered event
        event(new Registered($user));

        // Send welcome email only if user has email
        if ($email) {
            Mail::to($user->email)->send(new WelcomeEmail($user));
        }

        // Log in the user
        Auth::login($user);

        // Redirect based on whether user has email
        if ($email) {
            // Redirect to email verification page after registration
            return redirect()->route('verification.notice')->with('status', __('Registration successful! Please verify your email.'));
        } else {
            // User registered with username, redirect to home
            return redirect()->route('home')->with('status', __('Registration successful!'));
        }
    }

    /**
     * Generate a unique username
     */
    private function generateUniqueUsername(): string
    {
        do {
            $username = 'user_' . Str::random(8);
            $exists = User::where('username', $username)->exists();
        } while ($exists);

        return $username;
    }
}

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
        return Inertia::render('auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(RegisterRequest $request): RedirectResponse
    {
        // Generate unique username
        $username = $this->generateUniqueUsername();

        // Get customer role with null check
        $customerRole = Role::where('name->en', 'Customer')->orWhere('name->vi', 'Khách hàng')->first();
        if (!$customerRole) {
            return back()->withErrors([
                'email' => __('Customer role not found. Please contact system administrator.'),
            ])->withInput();
        }

        // Create user with validated data
        $user = User::create([
            'username' => $username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'is_active' => true,
            'first_name' => null, // Will be null initially
            'last_name' => null,  // Will be null initially  
            'phone_number' => null, // Will be null initially
            'provider' => 'manual',
            'avatar' => null, // Manual users start with null avatar (will show initials)
            // Note: first_name, last_name, phone_number will be null initially
            // These can be updated later in ProfileController
        ]);

        // Assign customer role using many-to-many relationship
        $user->roles()->attach($customerRole->id);

        // Fire the registered event
        event(new Registered($user));

        // Send welcome email

        Mail::to($user->email)->send(new WelcomeEmail($user));


        // Log in the user
        Auth::login($user);

        // Redirect to email verification page after registration
        return redirect()->route('verification.notice')->with('status', __('Registration successful! Please verify your email.'));
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

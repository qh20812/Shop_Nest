<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Mail\WelcomeEmail;
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

        // Create user with validated data
        $user = User::create([
            'username' => $username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'is_active' => true,
            // Note: first_name, last_name, phone_number will be null initially
            // These can be updated later in ProfileController
        ]);

        // Fire the registered event
        event(new Registered($user));

        // Send welcome email
        

        // Log in the user
        Auth::login($user);

        // Redirect to login page after registration
        return redirect()->route('login')->with('success', 'Registration successful! Please log in.');
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

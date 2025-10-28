<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class SellerRegistrationController extends Controller
{
    /**
     * Display the seller registration view.
     */
    public function create(): Response
    {
        return Inertia::render('auth/SellerRegister');
    }

    /**
     * Handle an incoming seller registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users',
            'email' => 'required|string|email|max:255|unique:users',
            'phone_number' => 'required|string|max:20|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        try {
            DB::beginTransaction();

            $sellerRole = Role::where('name->en', 'Seller')->firstOrFail();

            $user = User::create([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'username' => $request->username,
                'email' => $request->email,
                'phone_number' => $request->phone_number,
                'password' => Hash::make($request->password),
            ]);

            $user->roles()->attach($sellerRole->id);

            DB::commit();

            event(new Registered($user));

            Auth::login($user);

            // Redirect to seller dashboard if it exists, otherwise home
            return redirect()->route('seller.dashboard.index');

        } catch (\Throwable $e) {
            DB::rollBack();
            Log::error('Seller registration failed: ' . $e->getMessage());
            return back()->with('error', 'An unexpected error occurred during registration. Please try again.');
        }
    }
}
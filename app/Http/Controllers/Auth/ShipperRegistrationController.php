<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ShipperRegisterRequest;
use App\Models\Role;
use App\Models\ShipperProfile;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ShipperRegistrationController extends Controller
{
    /**
     * Show the shipper registration form.
     */
    public function create(): Response
    {
        return Inertia::render('auth/ShipperRegister');
    }

    /**
     * Handle shipper registration.
     */
    public function store(ShipperRegisterRequest $request): RedirectResponse
    {
        try {
            return DB::transaction(function () use ($request) {
                // Handle file uploads first
                $documentPaths = $this->handleFileUploads($request);

                // Create the user
                $user = User::create([
                    'first_name' => $request->first_name,
                    'last_name' => $request->last_name,
                    'email' => $request->email,
                    'phone_number' => $request->phone_number,
                    'password' => Hash::make($request->password),
                    'username' => $this->generateUsername($request->first_name, $request->last_name),
                    'is_active' => true,
                ]);

                // Assign Shipper role
                $shipperRole = Role::where('name->en', 'Shipper')->firstOrFail();
                $user->roles()->attach($shipperRole->id);

                // Create shipper profile
                ShipperProfile::create([
                    'user_id' => $user->id,
                    'id_card_number' => $request->id_card_number,
                    'id_card_front_url' => $documentPaths['id_card_front'],
                    'id_card_back_url' => $documentPaths['id_card_back'],
                    'driver_license_number' => $request->driver_license_number,
                    'driver_license_front_url' => $documentPaths['driver_license_front'],
                    'vehicle_type' => $request->vehicle_type,
                    'license_plate' => $request->license_plate,
                    'status' => 'pending', // Default status for new registrations
                ]);

                // Log the user in
                Auth::login($user);

                return redirect()->route('home')
                    ->with('success', 'Registration successful! Your shipper application is pending approval. You will be notified once reviewed.');
            });
        } catch (\Exception $e) {
            // If anything fails, make sure to clean up uploaded files
            if (isset($documentPaths)) {
                foreach ($documentPaths as $path) {
                    if (Storage::disk('public')->exists($path)) {
                        Storage::disk('public')->delete($path);
                    }
                }
            }

            return back()
                ->withInput($request->except('password', 'password_confirmation'))
                ->withErrors(['error' => 'Registration failed. Please try again.']);
        }
    }

    /**
     * Handle file uploads for shipper documents.
     */
    private function handleFileUploads(ShipperRegisterRequest $request): array
    {
        $documentPaths = [];
        $uploadPath = 'shipper-documents';

        // Upload ID card front
        if ($request->hasFile('id_card_front')) {
            $documentPaths['id_card_front'] = $request->file('id_card_front')
                ->store($uploadPath, 'public');
        }

        // Upload ID card back
        if ($request->hasFile('id_card_back')) {
            $documentPaths['id_card_back'] = $request->file('id_card_back')
                ->store($uploadPath, 'public');
        }

        // Upload driver's license front
        if ($request->hasFile('driver_license_front')) {
            $documentPaths['driver_license_front'] = $request->file('driver_license_front')
                ->store($uploadPath, 'public');
        }

        return $documentPaths;
    }

    /**
     * Generate a unique username from first and last name.
     */
    private function generateUsername(string $firstName, string $lastName): string
    {
        $baseUsername = strtolower($firstName . '.' . $lastName);
        $baseUsername = preg_replace('/[^a-z0-9.]/', '', $baseUsername);
        
        $username = $baseUsername;
        $counter = 1;

        // Ensure username is unique
        while (User::where('username', $username)->exists()) {
            $username = $baseUsername . $counter;
            $counter++;
        }

        return $username;
    }
}

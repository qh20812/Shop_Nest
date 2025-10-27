<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShipperController extends Controller
{
    /**
     * Display a listing of shipper users.
     */
    public function index(Request $request): Response
    {
        // Build query for users with Shipper role
        $query = User::whereHas('roles', function ($query) {
            $query->where('name->en', 'Shipper');
        })->with(['shipperProfile', 'roles']);

        $totalShippers = $query->count();

        // Filter by shipper profile status if provided
        if ($request->filled('status')) {
            $query->whereHas('shipperProfile', function ($query) use ($request) {
                $query->where('status', $request->get('status'));
            });
        }

        // Search by name or email
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function ($query) use ($search) {
                $query->where('first_name', 'like', "%{$search}%")
                      ->orWhere('last_name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%")
                      ->orWhere('username', 'like', "%{$search}%");
            });
        }

        $shippers = $query->paginate(15)->withQueryString();

        return Inertia::render('Admin/Shippers/Index', [
            'shippers' => $shippers,
            'totalShippers' => $totalShippers,
            'filters' => [
                'status' => $request->get('status'),
                'search' => $request->get('search'),
            ],
            'statusOptions' => [
                'pending' => 'Pending',
                'approved' => 'Approved',
                'rejected' => 'Rejected',
                'suspended' => 'Suspended',
            ],
        ]);
    }

    /**
     * Display the specified shipper.
     */
    public function show(User $shipper): Response
    {
        // Ensure the user has Shipper role
        if (!$shipper->isShipper()) {
            abort(404, 'Shipper not found.');
        }

        // Load shipper profile
        $shipper->load(['shipperProfile', 'roles']);

        return Inertia::render('Admin/Shippers/Show', [
            'shipper' => $shipper,
        ]);
    }

    /**
     * Update the shipper's status.
     */
    public function updateStatus(Request $request, User $shipper)
    {
        // Ensure user is admin
        if (!$request->user()->isAdmin()) {
            abort(403, 'Unauthorized action.');
        }

        // Ensure the user has Shipper role
        if (!$shipper->isShipper()) {
            abort(404, 'Shipper not found.');
        }

        // Validate the status
        $request->validate([
            'status' => 'required|in:approved,rejected,suspended',
        ]);

        // Update shipper profile status
        $shipper->shipperProfile->update([
            'status' => $request->status,
        ]);

        // If suspending, also deactivate the user account
        if ($request->status === 'suspended') {
            $shipper->update(['is_active' => false]);
        } else if ($request->status === 'approved') {
            $shipper->update(['is_active' => true]);
        }

        return redirect()->route('admin.shippers.show', $shipper)
            ->with('success', "Shipper status updated to {$request->status}.");
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}

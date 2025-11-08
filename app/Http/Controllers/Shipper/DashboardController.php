<?php

namespace App\Http\Controllers\Shipper;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\ShipmentJourney;
use App\Models\ShippingDetail;
use App\Models\ShipperRating;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $shipperId = Auth::id();

        // Get active journeys for this shipper
        $journeys = ShipmentJourney::where('shipper_id', $shipperId)
            ->with(['order', 'startHub', 'endHub'])
            ->whereIn('status', ['pending', 'in_transit'])
            ->latest('started_at')
            ->get();

        // Get today's completed deliveries
        $todayDeliveries = ShipmentJourney::where('shipper_id', $shipperId)
            ->whereDate('completed_at', Carbon::today())
            ->where('status', 'completed')
            ->count();

        // Get weekly earnings (implement your earning calculation logic)
        $weeklyEarnings = ShipmentJourney::where('shipper_id', $shipperId)
            ->where('status', 'completed')
            ->whereBetween('completed_at', [
                Carbon::now()->startOfWeek(),
                Carbon::now()->endOfWeek()
            ])
            ->sum('shipping_fee'); // Assuming you have a shipping_fee column

        // Get average rating
        $averageRating = ShipperRating::where('shipper_id', $shipperId)
            ->avg('rating') ?? 5.0;

        // Get shipper profile status
        $shipperProfile = Auth::user()->shipperProfile;
        $isActive = $shipperProfile && $shipperProfile->status === 'approved';

        // Calculate stats
        $stats = [
            'today_orders' => $todayDeliveries,
            'total_earnings' => number_format($weeklyEarnings, 0, ',', '.') . '₫',
            'average_rating' => number_format($averageRating, 1),
            'status' => $isActive ? 'ONLINE' : 'OFFLINE'
        ];

        // Format journeys for frontend
        $formattedJourneys = $journeys->map(function ($journey) {
            return [
                'id' => $journey->id,
                'order_id' => $journey->order_id,
                'leg_type' => $journey->leg_type,
                'tracking_number' => $journey->order->shippingDetail->tracking_number ?? 'N/A',
                'status' => $journey->status,
                'start_hub' => $journey->startHub->name ?? 'N/A',
                'end_hub' => $journey->endHub->name ?? 'N/A',
                'started_at' => $journey->started_at?->format('Y-m-d H:i:s'),
                'completed_at' => $journey->completed_at?->format('Y-m-d H:i:s'),
                'shipper' => [
                    'id' => $journey->shipper_id,
                    'name' => $journey->shipper->name ?? 'N/A',
                    'avatar_url' => $journey->shipper->avatar_url ?? null,
                ],
            ];
        });

        // Get recent ratings
        $recentRatings = ShipperRating::where('shipper_id', $shipperId)
            ->with('customer:id,name,avatar_url')
            ->latest('rated_at')
            ->take(5)
            ->get()
            ->map(function ($rating) {
                return [
                    'id' => $rating->id,
                    'rating' => $rating->rating,
                    'comment' => $rating->comment,
                    'customer_name' => $rating->is_anonymous ? 'Khách hàng ẩn danh' : $rating->customer->name,
                    'customer_avatar' => $rating->is_anonymous ? null : $rating->customer->avatar_url,
                    'rated_at' => $rating->rated_at->diffForHumans(),
                ];
            });

        return Inertia::render('Shipper/Dashboard/Index', [
            'stats' => $stats,
            'journeys' => $formattedJourneys,
            'recentRatings' => $recentRatings,
            'shipper' => [
                'id' => Auth::id(),
                'name' => Auth::user()->name,
                'avatar_url' => Auth::user()->avatar_url,
                'status' => $isActive ? 'active' : 'inactive',
            ]
        ]);
    }

    public function updateJourneyStatus(Request $request, ShipmentJourney $journey)
    {
        // Validate shipper owns this journey
        if ($journey->shipper_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'status' => 'required|in:in_transit,completed',
            'notes' => 'nullable|string|max:500',
        ]);

        if ($validated['status'] === 'in_transit') {
            $journey->start();
        } else {
            $journey->complete($validated['notes'] ?? null);
        }

        return response()->json([
            'success' => true,
            'message' => 'Journey status updated successfully',
            'journey' => $journey->fresh(['order', 'startHub', 'endHub'])
        ]);
    }

    public function toggleStatus(): \Illuminate\Http\JsonResponse
    {
        $profile = Auth::user()->shipperProfile;

        if (!$profile || $profile->status !== 'approved') {
            return response()->json(['error' => 'Shipper profile not approved'], 403);
        }

        $profile->update([
            'is_active' => !$profile->is_active
        ]);

        return response()->json([
            'success' => true,
            'status' => $profile->is_active ? 'ONLINE' : 'OFFLINE'
        ]);
    }

    public function getStatistics(): \Illuminate\Http\JsonResponse
    {
        $shipperId = Auth::id();

        // Get monthly stats
        $monthlyStats = ShipmentJourney::where('shipper_id', $shipperId)
            ->where('status', 'completed')
            ->whereMonth('completed_at', Carbon::now()->month)
            ->selectRaw('
                COUNT(*) as total_deliveries,
                AVG(TIMESTAMPDIFF(MINUTE, started_at, completed_at)) as avg_duration,
                SUM(shipping_fee) as total_earnings
            ')
            ->first();

        // Get rating distribution
        $ratingDistribution = ShipperRating::where('shipper_id', $shipperId)
            ->selectRaw('rating, COUNT(*) as count')
            ->groupBy('rating')
            ->get()
            ->pluck('count', 'rating')
            ->toArray();

        return response()->json([
            'monthly' => [
                'deliveries' => $monthlyStats->total_deliveries ?? 0,
                'avg_duration' => round($monthlyStats->avg_duration ?? 0),
                'earnings' => $monthlyStats->total_earnings ?? 0,
            ],
            'ratings' => $ratingDistribution
        ]);
    }
}

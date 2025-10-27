<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateCustomerSegmentRequest;
use App\Http\Requests\UpdateCustomerSegmentRequest;
use App\Jobs\CustomerSegmentRefreshJob;
use App\Models\CustomerSegment;
use App\Services\CustomerSegmentationService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class CustomerSegmentController extends Controller
{
    public function __construct(
        private CustomerSegmentationService $segmentationService
    ) {}

    /**
     * Display a listing of customer segments
     */
    public function index(Request $request): Response
    {
        $segments = CustomerSegment::with('memberships')
            ->when($request->search, function ($query) use ($request) {
                $query->where('name', 'like', "%{$request->search}%")
                      ->orWhere('description', 'like', "%{$request->search}%");
            })
            ->when($request->status !== null, function ($query) use ($request) {
                $query->where('is_active', $request->boolean('status'));
            })
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        // Add statistics to each segment
        $segments->getCollection()->transform(function ($segment) {
            $stats = $this->segmentationService->getSegmentStats($segment);
            $segment->stats = $stats;
            return $segment;
        });

        return Inertia::render('Admin/CustomerSegments/Index', [
            'segments' => $segments,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Show the form for creating a new segment
     */
    public function create(): Response
    {
        return Inertia::render('Admin/CustomerSegments/Create');
    }

    /**
     * Store a newly created segment
     */
    public function store(CreateCustomerSegmentRequest $request): JsonResponse
    {
        try {
            $segment = $this->segmentationService->createSegment($request->validated());

            // Dispatch job to refresh segment customers
            CustomerSegmentRefreshJob::dispatch($segment->segment_id, true);

            return response()->json([
                'success' => true,
                'message' => 'Customer segment created successfully. Customers are being processed in the background.',
                'segment' => $segment,
            ]);

        } catch (Exception $exception) {
            Log::error('Failed to create customer segment', ['exception' => $exception]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to create customer segment.',
                'error' => $exception->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified segment
     */
    public function show(CustomerSegment $segment): Response
    {
        $segment->load(['memberships.customer']);
        $stats = $this->segmentationService->getSegmentStats($segment);

        return Inertia::render('Admin/CustomerSegments/Show', [
            'segment' => $segment,
            'stats' => $stats,
        ]);
    }

    /**
     * Show the form for editing the segment
     */
    public function edit(CustomerSegment $segment): Response
    {
        return Inertia::render('Admin/CustomerSegments/Edit', [
            'segment' => $segment,
        ]);
    }

    /**
     * Update the specified segment
     */
    public function update(UpdateCustomerSegmentRequest $request, CustomerSegment $segment): JsonResponse
    {
        try {
            $updatedSegment = $this->segmentationService->updateSegment($segment, $request->validated());

            // Dispatch job to refresh segment customers
            CustomerSegmentRefreshJob::dispatch($segment->segment_id, true);

            return response()->json([
                'success' => true,
                'message' => 'Customer segment updated successfully. Customers are being refreshed in the background.',
                'segment' => $updatedSegment,
            ]);

        } catch (Exception $exception) {
            Log::error('Failed to update customer segment', ['exception' => $exception]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to update customer segment.',
                'error' => $exception->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified segment
     */
    public function destroy(CustomerSegment $segment): JsonResponse
    {
        try {
            $this->segmentationService->deleteSegment($segment);

            return response()->json([
                'success' => true,
                'message' => 'Customer segment deleted successfully.',
            ]);

        } catch (Exception $exception) {
            Log::error('Failed to delete customer segment', ['exception' => $exception]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to delete customer segment.',
                'error' => $exception->getMessage(),
            ], 500);
        }
    }

    /**
     * Refresh segment customers
     */
    public function refresh(Request $request, CustomerSegment $segment): JsonResponse
    {
        try {
            CustomerSegmentRefreshJob::dispatch($segment->segment_id, true);

            return response()->json([
                'success' => true,
                'message' => 'Segment refresh job has been queued.',
            ]);

        } catch (Exception $exception) {
            Log::error('Failed to queue segment refresh', ['exception' => $exception]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to queue segment refresh.',
                'error' => $exception->getMessage(),
            ], 500);
        }
    }

    /**
     * Get eligible customers for a segment
     */
    public function getEligibleCustomers(Request $request, CustomerSegment $segment): JsonResponse
    {
        try {
            $limit = $request->get('limit', 100);
            $customers = $this->segmentationService->getEligibleCustomers($segment, $limit);

            return response()->json([
                'success' => true,
                'customers' => $customers,
            ]);

        } catch (Exception $exception) {
            Log::error('Failed to get eligible customers', ['exception' => $exception]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to get eligible customers.',
                'error' => $exception->getMessage(),
            ], 500);
        }
    }

    /**
     * Add customers to segment
     */
    public function addCustomers(Request $request, CustomerSegment $segment): JsonResponse
    {
        $request->validate([
            'customer_ids' => 'required|array|min:1',
            'customer_ids.*' => 'integer|exists:users,id',
        ]);

        try {
            $this->segmentationService->addCustomersToSegment($segment, $request->customer_ids);

            return response()->json([
                'success' => true,
                'message' => 'Customers added to segment successfully.',
            ]);

        } catch (Exception $exception) {
            Log::error('Failed to add customers to segment', ['exception' => $exception]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to add customers to segment.',
                'error' => $exception->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove customers from segment
     */
    public function removeCustomers(Request $request, CustomerSegment $segment): JsonResponse
    {
        $request->validate([
            'customer_ids' => 'required|array|min:1',
            'customer_ids.*' => 'integer|exists:users,id',
        ]);

        try {
            $this->segmentationService->removeCustomersFromSegment($segment, $request->customer_ids);

            return response()->json([
                'success' => true,
                'message' => 'Customers removed from segment successfully.',
            ]);

        } catch (Exception $exception) {
            Log::error('Failed to remove customers from segment', ['exception' => $exception]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to remove customers from segment.',
                'error' => $exception->getMessage(),
            ], 500);
        }
    }
}

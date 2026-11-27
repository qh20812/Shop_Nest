<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePromotionRequest;
use App\Http\Requests\Admin\UpdatePromotionRequest;
use App\Models\Promotion;
use App\Services\PromotionBulkImportService;
use App\Services\PromotionConflictResolver;
use App\Services\PromotionRuleService;
use App\Services\PromotionService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class PromotionController extends Controller
{
    private const PAGINATION_LIMIT = 15;

    private const STATUS_OPTIONS = [
        'draft',
        'active',
        'paused',
        'expired',
    ];

    public function __construct(
        private PromotionService $promotionService,
        private PromotionConflictResolver $conflictResolver,
        private PromotionRuleService $ruleService,
        private PromotionBulkImportService $bulkImportService
    ) {}

    /**
     * Display a paginated list of all promotions.
     */
    public function index(Request $request): Response
    {
        $filters = [
            'search' => $request->string('search')->toString(),
            'status' => $request->string('status')->toString(),
            'type' => $request->string('type')->toString(),
        ];

        $baseQuery = Promotion::query()
            ->when($filters['search'], function ($builder, $search) {
                $builder->where('name', 'like', "%{$search}%");
            })
            ->when($filters['type'], function ($builder, $type) {
                $builder->where('type', $this->promotionService->mapTypeForQuery($type));
            });

        $statusCounts = [
            'draft' => (clone $baseQuery)->ofStatus('draft')->count(),
            'active' => (clone $baseQuery)->ofStatus('active')->count(),
            'paused' => (clone $baseQuery)->ofStatus('paused')->count(),
            'expired' => (clone $baseQuery)->ofStatus('expired')->count(),
        ];

        $totalPromotions = (clone $baseQuery)->count();

        $query = (clone $baseQuery)
            ->select([
                'promotion_id',
                'name',
                'type',
                'value',
                'start_date',
                'end_date',
                'usage_limit',
                'used_count',
                'is_active',
                'allocated_budget',
                'spent_budget',
                'roi_percentage',
                'created_by_type',
                'seller_id',
            ])
            ->with('seller:id,username,first_name,last_name')
            ->when($filters['status'], function ($builder, $status) {
                $builder->ofStatus($status);
            })
            ->orderByDesc('created_at');

        $promotions = $query->paginate(self::PAGINATION_LIMIT)->withQueryString();

        $promotions->setCollection(
            $promotions->getCollection()->map(function (Promotion $promotion) {
                $data = $promotion->toArray();
                $data['type'] = $this->promotionService->resolveTypeForResponse($promotion->type);
                $data['status'] = $this->promotionService->resolveStatus($promotion);

                return $data;
            })
        );

        return Inertia::render('Admin/Promotions/Index', [
            'promotions' => $promotions,
            'typeOptions' => $this->promotionService->getPromotionTypeOptions(),
            'statusFilters' => self::STATUS_OPTIONS,
            'statusCounts' => $statusCounts,
            'totalPromotions' => $totalPromotions,
            'ruleOptions' => $this->getRuleOptions(),
            'filters' => array_filter($filters, static fn ($value) => $value !== null && $value !== ''),
        ]);
    }

    /**
     * Show the form for creating a new promotion.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Promotions/Create', [
            'products' => $this->promotionService->getProductOptions(),
            'categories' => $this->promotionService->getCategoryOptions(),
            'promotionTypes' => $this->promotionService->getPromotionTypeOptions(),
            'ruleOptions' => $this->getRuleOptions(),
        ]);
    }

    /**
     * Store a newly created promotion in storage.
     */
    public function store(StorePromotionRequest $request): RedirectResponse
    {
        $payload = $request->validated();

        try {
            if (! empty($payload['selection_rules'] ?? [])) {
                $promotion = $this->promotionService->createWithRules($payload);
            } else {
                unset($payload['selection_rules']);

                $promotion = $this->promotionService->create(
                    $payload,
                    $payload['product_ids'] ?? [],
                    $payload['category_ids'] ?? []
                );
            }

            $this->conflictResolver->handlePromotionConflicts($promotion);

            return redirect()->route('admin.promotions.index')
                ->with('success', 'Promotion created successfully.');
        } catch (ValidationException $exception) {
            throw $exception;
        } catch (Exception $exception) {
            Log::error('Failed to create promotion', ['exception' => $exception]);

            return redirect()->back()
                ->withInput()
                ->with('error', 'Failed to create promotion. Please try again.');
        }
    }

    /**
     * Display the specified promotion.
     */
    public function show(Promotion $promotion): Response
    {
        $promotion->load([
            'products',
            'categories',
            'seller:id,username,first_name,last_name,email',
        ]);

        // Format data without modifying the model
        $promotionData = $promotion->toArray();
        $promotionData['type'] = $this->promotionService->resolveTypeForResponse($promotion->type);
        $promotionData['status'] = $this->promotionService->resolveStatus($promotion);
        $promotionData['products'] = $this->promotionService->formatProductsCollection($promotion->products)->toArray();
        $promotionData['categories'] = $this->promotionService->formatCategoriesCollection($promotion->categories)->toArray();

        return Inertia::render('Admin/Promotions/Show', [
            'promotion' => $promotionData,
        ]);
    }

    /**
     * Show the form for editing the specified promotion.
     */
    public function edit(Promotion $promotion): Response
    {
        $promotion->load([
            'products',
            'categories',
            'seller:id,username,first_name,last_name,email',
        ]);

        // Format data without modifying the model
        $promotionData = $promotion->toArray();
        $promotionData['type'] = $this->promotionService->resolveTypeForResponse($promotion->type);
        $promotionData['status'] = $this->promotionService->resolveStatus($promotion);
        $promotionData['products'] = $this->promotionService->formatProductsCollection($promotion->products)->toArray();
        $promotionData['categories'] = $this->promotionService->formatCategoriesCollection($promotion->categories)->toArray();

        return Inertia::render('Admin/Promotions/Edit', [
            'promotion' => $promotionData,
            'products' => $this->promotionService->getProductOptions(),
            'categories' => $this->promotionService->getCategoryOptions(),
            'promotionTypes' => $this->promotionService->getPromotionTypeOptions(),
            'ruleOptions' => $this->getRuleOptions(),
        ]);
    }

    /**
     * Update the specified promotion in storage.
     */
    public function update(UpdatePromotionRequest $request, Promotion $promotion): RedirectResponse
    {
        $payload = $request->validated();

        try {
            if (array_key_exists('selection_rules', $payload) && ! empty($payload['selection_rules'])) {
                $promotion = $this->promotionService->updateWithRules($promotion, $payload);
            } else {
                $promotion = $this->promotionService->update(
                    $promotion,
                    $payload,
                    $payload['product_ids'] ?? [],
                    $payload['category_ids'] ?? []
                );
            }

            $this->conflictResolver->handlePromotionConflicts($promotion);

            return redirect()->route('admin.promotions.index')
                ->with('success', 'Promotion updated successfully.');
        } catch (ValidationException $exception) {
            throw $exception;
        } catch (Exception $exception) {
            Log::error('Failed to update promotion', [
                'promotion_id' => $promotion->promotion_id,
                'exception' => $exception,
            ]);

            return redirect()->back()
                ->withInput()
                ->with('error', 'Failed to update promotion. Please try again.');
        }
    }

    /**
     * Remove the specified promotion from storage.
     */
    public function destroy(Promotion $promotion): RedirectResponse
    {
        try {
            $this->promotionService->delete($promotion);

            return redirect()->route('admin.promotions.index')
                ->with('success', 'Promotion deleted successfully.');
        } catch (Exception $exception) {
            Log::error('Failed to delete promotion', [
                'promotion_id' => $promotion->promotion_id,
                'exception' => $exception,
            ]);

            return redirect()->back()
                ->with('error', 'Failed to delete promotion. Please try again.');
        }
    }

    /**
     * Create promotion using rule-based selection
     */
    public function createWithRules(Request $request): JsonResponse
    {
        $payload = $request->validate([
            'name' => 'required|string|max:255|min:3',
            'description' => 'nullable|string|max:1000',
            'type' => 'required|in:percentage,fixed_amount,free_shipping,buy_x_get_y',
            'value' => 'required|numeric|min:0.01',
            'minimum_order_value' => 'nullable|numeric|min:0',
            'max_discount_amount' => 'nullable|numeric|min:0',
            'starts_at' => 'required|date|after_or_equal:today',
            'expires_at' => 'required|date|after:starts_at',
            'usage_limit_per_user' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
            'category_ids' => 'nullable|array',
            'category_ids.*' => 'exists:categories,category_id',
            'selection_rules' => 'required|array|min:1',
            'selection_rules.*.type' => 'required|string',
            'selection_rules.*.operator' => 'nullable|string',
            'selection_rules.*.value' => 'required',
            'auto_apply_new_products' => 'boolean',
        ]);

        try {
            $promotion = $this->promotionService->createWithRules($payload);

            $this->conflictResolver->handlePromotionConflicts($promotion);

            $matches = $this->ruleService->getMatchingProducts($payload['selection_rules']);

            return response()->json([
                'success' => true,
                'promotion' => $promotion->fresh(['products' => function ($query) {
                    $query->select('products.product_id', 'name');
                }]),
                'matched_products' => $matches->count(),
                'products_preview' => $matches->take(50),
            ], 201);
        } catch (ValidationException $exception) {
            throw $exception;
        } catch (Exception $exception) {
            Log::error('Failed to create promotion with rules', [
                'exception' => $exception->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to create promotion from rules. Please try again.',
            ], 500);
        }
    }

    /**
     * Preview matching products for selection rules
     */
    public function previewMatchingProducts(Request $request): JsonResponse
    {
        $rules = $request->input('selection_rules');

        if (empty($rules) && $request->filled('promotion_id')) {
            $promotion = Promotion::find($request->input('promotion_id'));
            $rules = $promotion?->selection_rules ?? [];
        }

        if (empty($rules)) {
            return response()->json([
                'success' => false,
                'message' => 'Selection rules are required to preview matching products.',
            ], 422);
        }

        try {
            $this->ruleService->validateRules($rules);
            $matches = $this->ruleService->getMatchingProducts($rules);

            return response()->json([
                'success' => true,
                'matched_products' => $matches->count(),
                'products_preview' => $matches->take(50),
            ]);
        } catch (ValidationException $exception) {
            throw $exception;
        } catch (Exception $exception) {
            Log::error('Failed to preview matching products', [
                'exception' => $exception->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to preview matching products.',
            ], 500);
        }
    }

    /**
     * Queue CSV bulk import for promotion products
     */
    public function bulkImportProducts(Request $request, Promotion $promotion): JsonResponse
    {
        $validated = $request->validate([
            'file' => 'required|file',
        ]);

        try {
            /** @var UploadedFile $file */
            $file = $validated['file'];
            $import = $this->bulkImportService->queueImport($promotion, $file);

            return response()->json([
                'success' => true,
                'tracking_token' => $import->tracking_token,
                'import_id' => $import->import_id,
                'status' => $import->status,
            ], 202);
        } catch (ValidationException $exception) {
            throw $exception;
        } catch (Exception $exception) {
            Log::error('Failed to queue promotion bulk import', [
                'promotion_id' => $promotion->promotion_id,
                'exception' => $exception->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Bulk import could not be started. Please try again later.',
            ], 500);
        }
    }

    /**
     * Retrieve import progress
     */
    public function getImportStatus(string $trackingToken): JsonResponse
    {
        $status = $this->bulkImportService->getImportStatus($trackingToken);

        if (! $status) {
            return response()->json([
                'success' => false,
                'message' => 'Import not found.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'import' => $status,
        ]);
    }

    /**
     * Toggle auto-apply behaviour for promotion
     */
    public function toggleAutoApply(Request $request, Promotion $promotion): JsonResponse
    {
        $validated = $request->validate([
            'enabled' => 'required|boolean',
        ]);

        try {
            $updated = $this->promotionService->toggleAutoApply($promotion, (bool) $validated['enabled']);

            return response()->json([
                'success' => true,
                'promotion' => [
                    'promotion_id' => $updated->promotion_id,
                    'auto_apply_new_products' => $updated->auto_apply_new_products,
                ],
            ]);
        } catch (Exception $exception) {
            Log::error('Failed to toggle auto apply on promotion', [
                'promotion_id' => $promotion->promotion_id,
                'exception' => $exception->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Unable to update auto-apply settings right now.',
            ], 500);
        }
    }

    private function getRuleOptions(): array
    {
        return [
            'types' => PromotionRuleService::SUPPORTED_RULE_TYPES,
            'operators' => PromotionRuleService::SUPPORTED_OPERATORS,
        ];
    }
}

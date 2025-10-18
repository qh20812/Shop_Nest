<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePromotionRequest;
use App\Http\Requests\Admin\UpdatePromotionRequest;
use App\Models\Promotion;
use App\Services\PromotionService;
use App\Services\PromotionConflictResolver;
use App\Services\PromotionAnalyticsService;
use App\Services\PromotionTemplateService;
use App\Services\PromotionBulkService;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Validator;
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
        private PromotionAnalyticsService $analyticsService,
        private PromotionTemplateService $templateService,
        private PromotionBulkService $bulkService
    ) {}

    /**
     * Display a paginated list of all promotions.
     */
    public function index(): Response
    {
        $this->applyAutomaticStatusUpdates();

        $promotions = Promotion::select([
                'promotion_id',
                'name',
                'type',
                'value',
                'start_date',
                'end_date',
                'usage_limit',
                'used_count',
                'is_active'
            ])
            ->orderByDesc('created_at')
            ->paginate(self::PAGINATION_LIMIT);

        $promotions->setCollection(
            $promotions->getCollection()->map(function (Promotion $promotion) {
                return array_merge($promotion->toArray(), [
                    'type' => $this->promotionService->resolveTypeForResponse($promotion->type),
                    'status' => $this->promotionService->resolveStatus($promotion),
                ]);
            })
        );

        return Inertia::render('Admin/Promotions/Index', [
            'promotions' => $promotions,
            'typeOptions' => $this->promotionService->getPromotionTypeOptions(),
            'statusFilters' => self::STATUS_OPTIONS,
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
        ]);
    }

    /**
     * Store a newly created promotion in storage.
     */
    public function store(StorePromotionRequest $request): RedirectResponse
    {
        $payload = $request->validated();

        try {
            $promotion = $this->promotionService->create(
                $payload,
                $payload['product_ids'] ?? [],
                $payload['category_ids'] ?? []
            );

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
            'products:product_id,name,sku',
            'categories:category_id,name',
        ]);

        $promotion->type = $this->promotionService->resolveTypeForResponse($promotion->type);
        $promotion->status = $this->promotionService->resolveStatus($promotion);

        $promotion->products = $this->promotionService->formatProductsCollection($promotion->products);
        $promotion->categories = $this->promotionService->formatCategoriesCollection($promotion->categories);

        return Inertia::render('Admin/Promotions/Show', [
            'promotion' => $promotion,
        ]);
    }

    /**
     * Show the form for editing the specified promotion.
     */
    public function edit(Promotion $promotion): Response
    {
        $promotion->load([
            'products:product_id,name,sku',
            'categories:category_id,name',
        ]);

        $promotion->type = $this->promotionService->resolveTypeForResponse($promotion->type);
        $promotion->status = $this->promotionService->resolveStatus($promotion);
        $promotion->products = $this->promotionService->formatProductsCollection($promotion->products);
        $promotion->categories = $this->promotionService->formatCategoriesCollection($promotion->categories);

        return Inertia::render('Admin/Promotions/Edit', [
            'promotion' => $promotion,
            'products' => $this->promotionService->getProductOptions(),
            'categories' => $this->promotionService->getCategoryOptions(),
            'promotionTypes' => $this->promotionService->getPromotionTypeOptions(),
        ]);
    }

    /**
     * Update the specified promotion in storage.
     */
    public function update(UpdatePromotionRequest $request, Promotion $promotion): RedirectResponse
    {
        $payload = $request->validated();

        try {
            $promotion = $this->promotionService->update(
                $promotion,
                $payload,
                $payload['product_ids'] ?? [],
                $payload['category_ids'] ?? []
            );

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

    private function applyAutomaticStatusUpdates(?Promotion $promotion = null, bool $requestedActive = true): void
    {
        Promotion::where('end_date', '<', now())->update(['is_active' => false]);
        Promotion::where('start_date', '>', now())->update(['is_active' => false]);
    }

    // ===== PHASE 3: CONFLICT RESOLUTION & TARGETING BASICS =====

    // ===== PHASE 2: USAGE TRACKING & ANALYTICS =====

    /**
     * Get detailed usage statistics for a promotion
     */
    public function getUsageStats(Promotion $promotion): array
    {
        return $this->analyticsService->getUsageStats($promotion);
    }

    /**
     * Calculate revenue impact of a promotion
     */
    public function getRevenueImpact(Promotion $promotion): array
    {
        return $this->analyticsService->getRevenueImpact($promotion);
    }

    /**
     * Get performance metrics for a promotion
     */
    public function getPerformanceMetrics(Promotion $promotion): array
    {
        return $this->analyticsService->getPerformanceMetrics($promotion);
    }

    // ===== PHASE 2: BULK OPERATIONS =====

    /**
     * Bulk activate multiple promotions
     */
    public function bulkActivate(Request $request): \Illuminate\Http\JsonResponse
    {
        $request->validate([
            'promotion_ids' => 'required|array|min:1',
            'promotion_ids.*' => 'exists:promotions,promotion_id',
        ]);

        $result = $this->bulkService->bulkActivate($request->promotion_ids);

        return response()->json($result);
    }

    /**
     * Bulk deactivate multiple promotions
     */
    public function bulkDeactivate(Request $request): \Illuminate\Http\JsonResponse
    {
        $request->validate([
            'promotion_ids' => 'required|array|min:1',
            'promotion_ids.*' => 'exists:promotions,promotion_id',
        ]);

        $result = $this->bulkService->bulkDeactivate($request->promotion_ids);

        return response()->json($result);
    }

    /**
     * Bulk delete multiple promotions
     */
    public function bulkDelete(Request $request): \Illuminate\Http\JsonResponse
    {
        $request->validate([
            'promotion_ids' => 'required|array|min:1',
            'promotion_ids.*' => 'exists:promotions,promotion_id',
            'confirm' => 'required|boolean|accepted',
        ]);

        $result = $this->bulkService->bulkDelete($request->promotion_ids);

        return response()->json($result);
    }

    /**
     * Bulk duplicate promotions
     */
    public function bulkDuplicate(Request $request, Promotion $promotion): \Illuminate\Http\JsonResponse
    {
        $request->validate([
            'count' => 'required|integer|min:1|max:50',
            'name_prefix' => 'nullable|string|max:100',
        ]);

        $result = $this->bulkService->bulkDuplicate(
            $promotion,
            $request->count,
            $request->name_prefix ?? 'Copy of '
        );

        return response()->json($result);
    }

    // ===== PHASE 2: PROMOTION TEMPLATES =====

    /**
     * Get available promotion templates
     */
    public function getTemplates(): \Illuminate\Http\JsonResponse
    {
        $templates = $this->templateService->getTemplates();

        return response()->json([
            'templates' => $templates,
        ]);
    }

    /**
     * Create promotion from template
     */
    public function createFromTemplate(Request $request): RedirectResponse
    {
        $request->validate([
            'template_id' => 'required|string',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'starts_at' => 'required|date|after_or_equal:today',
            'expires_at' => 'required|date|after:starts_at',
            'product_ids' => 'nullable|array',
            'product_ids.*' => 'exists:products,product_id',
            'category_ids' => 'nullable|array',
            'category_ids.*' => 'exists:categories,category_id',
        ]);

        try {
            $promotion = $this->templateService->createFromTemplate($request->all());

            return redirect()->route('admin.promotions.edit', $promotion)
                ->with('success', 'Promotion created from template successfully. Please review and activate when ready.');
        } catch (Exception $exception) {
            Log::error('Failed to create promotion from template', ['exception' => $exception]);

            return redirect()->back()
                ->withInput()
                ->with('error', 'Failed to create promotion from template. Please try again.');
        }
    }

    /**
     * Save current promotion as template
     */
    public function saveAsTemplate(Request $request, Promotion $promotion): \Illuminate\Http\JsonResponse
    {
        $request->validate([
            'template_name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'is_public' => 'boolean',
        ]);

        $template = $this->templateService->saveAsTemplate($promotion, $request->all());

        return response()->json([
            'success' => true,
            'template' => $template,
            'message' => 'Promotion saved as template successfully.',
        ]);
    }
}

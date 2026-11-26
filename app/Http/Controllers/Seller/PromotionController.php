<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Http\Requests\Seller\StoreSellerPromotionRequest;
use App\Http\Requests\Seller\UpdateSellerPromotionRequest;
use App\Models\Product;
use App\Models\Promotion;
use App\Services\SellerPromotionService;
use App\Services\SellerWalletService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use InvalidArgumentException;
use Throwable;

class PromotionController extends Controller
{
    public function __construct(
        private SellerPromotionService $promotionService,
        private SellerWalletService $walletService
    ) {}

    public function index(Request $request): Response
    {
        $sellerId = Auth::id();
        $filters = $request->validate([
            'search' => ['nullable', 'string', 'max:255'],
            'status' => ['nullable', Rule::in(['active', 'paused', 'upcoming', 'draft', 'expired'])],
            'type' => ['nullable', Rule::in(['percentage', 'fixed_amount', 'free_shipping', 'buy_x_get_y'])],
            'date_range' => ['nullable', Rule::in(['last_7_days', 'last_30_days', 'last_90_days'])],
            'budget_range' => ['nullable', Rule::in(['0-1000000', '1000000-5000000', '5000000+'])],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        $promotions = $this->promotionService->getSellerPromotions((int) $sellerId, $filters);
        $transformed = $promotions->through(function (Promotion $promotion) {
            return [
                'promotion_id' => $promotion->promotion_id,
                'name' => $promotion->name,
                'type' => $this->promotionService->mapTypeForResponse($promotion->type),
                'value' => $promotion->value,
                'start_date' => $promotion->start_date,
                'end_date' => $promotion->end_date,
                'is_active' => $promotion->is_active,
                'status' => $this->promotionService->resolveStatus($promotion),
                'allocated_budget' => $promotion->allocated_budget,
                'spent_budget' => $promotion->spent_budget,
                'roi_percentage' => $promotion->roi_percentage,
                'products' => $promotion->products->map(fn (Product $product) => [
                    'product_id' => $product->product_id,
                    'name' => $product->name,
                    'sku' => $product->sku,
                ])->values(),
            ];
        });

        return Inertia::render('Seller/Promotions/Index', [
            'promotions' => $transformed,
            'filters' => $filters,
            'wallet' => $this->walletService->getWallet($sellerId),
            'pagination' => [
                'current_page' => $promotions->currentPage(),
                'last_page' => $promotions->lastPage(),
                'per_page' => $promotions->perPage(),
                'total' => $promotions->total(),
            ],
        ]);
    }

    public function create(): Response
    {
        $sellerId = Auth::id();
        $products = Product::query()
            ->where('seller_id', $sellerId)
            ->select('product_id', 'name', 'sku')
            ->orderByDesc('product_id')
            ->get();

        return Inertia::render('Seller/Promotions/Create', [
            'products' => $products,
            'wallet' => $this->walletService->getWallet($sellerId),
        ]);
    }

    public function store(StoreSellerPromotionRequest $request): RedirectResponse
    {
        try {
            $promotion = $this->promotionService->createPromotion(
                $request->validated(),
                Auth::id()
            );

            return redirect()
                ->route('seller.promotions.show', $promotion)
                ->with('success', 'Promotion created successfully.');
        } catch (InvalidArgumentException $exception) {
            return back()->withErrors(['error' => $exception->getMessage()])->withInput();
        } catch (Throwable $exception) {
            Log::error('Seller promotion creation failed', [
                'seller_id' => Auth::id(),
                'exception' => $exception->getMessage(),
            ]);

            return back()->withErrors(['error' => 'Unable to create promotion. Please try again.'])->withInput();
        }
    }

    public function show(Promotion $promotion): Response
    {
        $this->authorize('view', $promotion);

        $roi = $this->promotionService->calculatePromotionROI($promotion);

        return Inertia::render('Seller/Promotions/Show', [
            'promotion' => $promotion->load(['products', 'orders']),
            'roi' => $roi,
            'status' => $this->promotionService->resolveStatus($promotion),
        ]);
    }

    public function edit(Promotion $promotion): Response
    {
        $this->authorize('update', $promotion);

        $sellerId = Auth::id();
        $products = Product::query()
            ->where('seller_id', $sellerId)
            ->select('product_id', 'name', 'sku')
            ->orderByDesc('product_id')
            ->get();

        return Inertia::render('Seller/Promotions/Edit', [
            'promotion' => $promotion->load('products'),
            'products' => $products,
            'wallet' => $this->walletService->getWallet($sellerId),
            'status' => $this->promotionService->resolveStatus($promotion),
        ]);
    }

    public function update(UpdateSellerPromotionRequest $request, Promotion $promotion): RedirectResponse
    {
        $this->authorize('update', $promotion);

        try {
            $updated = $this->promotionService->updatePromotion(
                $promotion,
                $request->validated(),
                Auth::id()
            );

            return redirect()
                ->route('seller.promotions.show', $updated)
                ->with('success', 'Promotion updated successfully.');
        } catch (InvalidArgumentException $exception) {
            return back()->withErrors(['error' => $exception->getMessage()])->withInput();
        } catch (Throwable $exception) {
            Log::error('Seller promotion update failed', [
                'seller_id' => Auth::id(),
                'promotion_id' => $promotion->promotion_id,
                'exception' => $exception->getMessage(),
            ]);

            return back()->withErrors(['error' => 'Unable to update promotion. Please try again.'])->withInput();
        }
    }

    public function destroy(Promotion $promotion): RedirectResponse
    {
        $this->authorize('delete', $promotion);

        try {
            $this->promotionService->deletePromotion($promotion, Auth::id());

            return redirect()
                ->route('seller.promotions.index')
                ->with('success', 'Promotion deleted successfully.');
        } catch (InvalidArgumentException $exception) {
            return back()->withErrors(['error' => $exception->getMessage()]);
        } catch (Throwable $exception) {
            Log::error('Seller promotion deletion failed', [
                'seller_id' => Auth::id(),
                'promotion_id' => $promotion->promotion_id,
                'exception' => $exception->getMessage(),
            ]);

            return back()->withErrors(['error' => 'Unable to delete promotion. Please try again.']);
        }
    }

    public function pause(Promotion $promotion): JsonResponse
    {
        $this->authorize('update', $promotion);

        try {
            $updated = $this->promotionService->pausePromotion($promotion, (int) Auth::id());
        } catch (InvalidArgumentException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        return response()->json([
            'message' => 'Promotion paused successfully.',
            'promotion' => $updated,
        ]);
    }

    public function resume(Promotion $promotion): JsonResponse
    {
        $this->authorize('update', $promotion);

        try {
            $updated = $this->promotionService->resumePromotion($promotion, (int) Auth::id());
        } catch (InvalidArgumentException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        return response()->json([
            'message' => 'Promotion resumed successfully.',
            'promotion' => $updated,
        ]);
    }
}

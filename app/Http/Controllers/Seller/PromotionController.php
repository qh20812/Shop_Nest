<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Http\Requests\Seller\StoreSellerPromotionRequest;
use App\Http\Requests\Seller\UpdateSellerPromotionRequest;
use App\Models\Product;
use App\Models\Promotion;
use App\Services\SellerPromotionService;
use App\Services\SellerWalletService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class PromotionController extends Controller
{
    public function __construct(
        private SellerPromotionService $promotionService,
        private SellerWalletService $walletService
    ) {
    }

    public function index(Request $request): Response
    {
        $sellerId = Auth::id();
        $filters = $request->only(['status', 'type', 'per_page']);

        $promotions = $this->promotionService->getSellerPromotions($sellerId, $filters);
        $transformed = $promotions->through(function (Promotion $promotion) {
            return [
                'promotion_id' => $promotion->promotion_id,
                'name' => $promotion->name,
                'type' => $this->promotionService->mapTypeForResponse($promotion->type),
                'value' => $promotion->value,
                'start_date' => $promotion->start_date,
                'end_date' => $promotion->end_date,
                'is_active' => $promotion->is_active,
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
        } catch (Exception $exception) {
            return back()->withErrors(['error' => $exception->getMessage()]);
        }
    }

    public function show(Promotion $promotion): Response
    {
        $this->authorize('view', $promotion);

        $roi = $this->promotionService->calculatePromotionROI($promotion);

        return Inertia::render('Seller/Promotions/Show', [
            'promotion' => $promotion->load(['products', 'orders']),
            'roi' => $roi,
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
        } catch (Exception $exception) {
            return back()->withErrors(['error' => $exception->getMessage()]);
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
        } catch (Exception $exception) {
            return back()->withErrors(['error' => $exception->getMessage()]);
        }
    }

    public function pause(Promotion $promotion): JsonResponse
    {
        $this->authorize('update', $promotion);

        $updated = $this->promotionService->pausePromotion($promotion, Auth::id());

        return response()->json([
            'message' => 'Promotion paused successfully.',
            'promotion' => $updated,
        ]);
    }

    public function resume(Promotion $promotion): JsonResponse
    {
        $this->authorize('update', $promotion);

        $updated = $this->promotionService->resumePromotion($promotion, Auth::id());

        return response()->json([
            'message' => 'Promotion resumed successfully.',
            'promotion' => $updated,
        ]);
    }
}

<?php

namespace App\Jobs;

use App\Models\Product;
use App\Models\Promotion;
use App\Services\PromotionRuleService;
use Exception;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class AutoApplyNewProductsJob implements ShouldQueue
{
    use Queueable;

    public $tries = 3;

    public function __construct(public int $productId)
    {
    }

    public function handle(PromotionRuleService $ruleService): void
    {
        $product = Product::with(['category', 'brand', 'variants'])->find($this->productId);

        if (!$product) {
            Log::warning('AutoApplyNewProductsJob: product not found', ['product_id' => $this->productId]);
            return;
        }

        $promotions = Promotion::query()
            ->where('auto_apply_new_products', true)
            ->whereNotNull('selection_rules')
            ->where('is_active', true)
            ->get();

        foreach ($promotions as $promotion) {
            try {
                $matches = $ruleService->productMatchesRules($product, $promotion->selection_rules ?? []);

                if ($matches) {
                    $promotion->products()->syncWithoutDetaching([$product->product_id]);
                }
            } catch (Exception $exception) {
                Log::error('Failed to auto-apply promotion for product', [
                    'promotion_id' => $promotion->promotion_id,
                    'product_id' => $product->product_id,
                    'exception' => $exception->getMessage(),
                ]);
            }
        }
    }

    public function failed(Exception $exception): void
    {
        Log::error('AutoApplyNewProductsJob permanently failed', [
            'product_id' => $this->productId,
            'exception' => $exception->getMessage(),
        ]);
    }
}

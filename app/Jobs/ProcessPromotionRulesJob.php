<?php

namespace App\Jobs;

use App\Models\Promotion;
use App\Services\PromotionRuleService;
use Exception;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class ProcessPromotionRulesJob implements ShouldQueue
{
    use Queueable;

    public $tries = 3;

    public function __construct(public int $promotionId)
    {
    }

    public function handle(PromotionRuleService $ruleService): void
    {
        $promotion = Promotion::find($this->promotionId);

        if (!$promotion) {
            Log::warning('ProcessPromotionRulesJob: promotion not found', ['promotion_id' => $this->promotionId]);
            return;
        }

        $rules = $promotion->selection_rules ?? [];

        if (empty($rules)) {
            Log::info('ProcessPromotionRulesJob: promotion has no rules', ['promotion_id' => $promotion->promotion_id]);
            return;
        }

        try {
            $ruleService->applyRulesToPromotion($promotion, $rules);
        } catch (Exception $exception) {
            Log::error('ProcessPromotionRulesJob failed', [
                'promotion_id' => $promotion->promotion_id,
                'exception' => $exception->getMessage(),
            ]);

            throw $exception;
        }
    }

    public function failed(Exception $exception): void
    {
        Log::error('ProcessPromotionRulesJob permanently failed', [
            'promotion_id' => $this->promotionId,
            'exception' => $exception->getMessage(),
        ]);
    }
}

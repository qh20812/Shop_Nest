<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Promotion;
use App\Models\PromotionCode;
use Illuminate\Support\Facades\DB;

/**
 * Records promotion usage against orders and releases it again when the order
 * is cancelled, returned or refunded.
 */
class PromotionUsageService
{
    public function recordForOrder(Order $order): void
    {
        $order->loadMissing('promotions');

        foreach ($order->promotions as $promotion) {
            $pivot = $promotion->pivot;

            if ($pivot->recorded_at !== null || $pivot->released_at !== null) {
                continue;
            }

            $discount = (float) $pivot->discount_applied;
            $promotionCodeId = $pivot->promotion_code_id !== null ? (int) $pivot->promotion_code_id : null;

            DB::transaction(function () use ($order, $promotion, $discount, $promotionCodeId) {
                $locked = Promotion::query()->lockForUpdate()->find($promotion->promotion_id);

                if (! $locked) {
                    return;
                }

                $locked->used_count = (int) $locked->used_count + 1;
                $locked->daily_usage_count = (int) $locked->daily_usage_count + 1;
                $locked->budget_used = (float) $locked->budget_used + $discount;
                $locked->spent_budget = (float) $locked->spent_budget + $discount;
                $locked->last_used_at = now();
                $locked->save();

                if ($promotionCodeId) {
                    PromotionCode::query()->whereKey($promotionCodeId)->increment('used_count');
                }

                DB::table('order_promotion')
                    ->where('order_id', $order->order_id)
                    ->where('promotion_id', $promotion->promotion_id)
                    ->update(['recorded_at' => now()]);
            });
        }
    }

    public function releaseForOrder(Order $order): void
    {
        $order->loadMissing('promotions');

        foreach ($order->promotions as $promotion) {
            $pivot = $promotion->pivot;

            if ($pivot->recorded_at === null || $pivot->released_at !== null) {
                continue;
            }

            $discount = (float) $pivot->discount_applied;
            $promotionCodeId = $pivot->promotion_code_id !== null ? (int) $pivot->promotion_code_id : null;

            DB::transaction(function () use ($order, $promotion, $discount, $promotionCodeId) {
                $locked = Promotion::query()->lockForUpdate()->find($promotion->promotion_id);

                if ($locked) {
                    $locked->used_count = max(0, (int) $locked->used_count - 1);
                    $locked->daily_usage_count = max(0, (int) $locked->daily_usage_count - 1);
                    $locked->budget_used = max(0, (float) $locked->budget_used - $discount);
                    $locked->spent_budget = max(0, (float) $locked->spent_budget - $discount);
                    $locked->save();
                }

                if ($promotionCodeId) {
                    $code = PromotionCode::query()->lockForUpdate()->find($promotionCodeId);
                    if ($code) {
                        $code->used_count = max(0, (int) $code->used_count - 1);
                        $code->save();
                    }
                }

                DB::table('order_promotion')
                    ->where('order_id', $order->order_id)
                    ->where('promotion_id', $promotion->promotion_id)
                    ->update(['released_at' => now()]);
            });
        }
    }
}

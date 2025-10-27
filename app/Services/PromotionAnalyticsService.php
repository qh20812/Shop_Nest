<?php

namespace App\Services;

use App\Models\Promotion;
use App\Models\PromotionPerformanceMetric;
use Carbon\Carbon;

class PromotionAnalyticsService
{
    /**
     * Track daily performance metrics for a promotion
     */
    public function trackDailyMetrics(Promotion $promotion, array $metrics): void
    {
        PromotionPerformanceMetric::updateOrCreate(
            [
                'promotion_id' => $promotion->promotion_id,
                'date' => Carbon::today(),
            ],
            [
                'impressions' => ($metrics['impressions'] ?? 0),
                'clicks' => ($metrics['clicks'] ?? 0),
                'conversions' => ($metrics['conversions'] ?? 0),
                'revenue' => ($metrics['revenue'] ?? 0),
                'cost' => ($metrics['cost'] ?? 0),
            ]
        );
    }

    /**
     * Increment impression count for a promotion
     */
    public function incrementImpressions(Promotion $promotion, int $count = 1): void
    {
        $metric = PromotionPerformanceMetric::firstOrCreate(
            [
                'promotion_id' => $promotion->promotion_id,
                'date' => Carbon::today(),
            ],
            [
                'impressions' => 0,
                'clicks' => 0,
                'conversions' => 0,
                'revenue' => 0,
                'cost' => 0,
            ]
        );

        $metric->incrementImpressions($count);
    }

    /**
     * Record a click for a promotion
     */
    public function recordClick(Promotion $promotion): void
    {
        $metric = PromotionPerformanceMetric::firstOrCreate(
            [
                'promotion_id' => $promotion->promotion_id,
                'date' => Carbon::today(),
            ],
            [
                'impressions' => 0,
                'clicks' => 0,
                'conversions' => 0,
                'revenue' => 0,
                'cost' => 0,
            ]
        );

        $metric->increment('clicks');
    }

    /**
     * Record a conversion for a promotion
     */
    public function recordConversion(Promotion $promotion, float $revenue = 0): void
    {
        $metric = PromotionPerformanceMetric::firstOrCreate(
            [
                'promotion_id' => $promotion->promotion_id,
                'date' => Carbon::today(),
            ],
            [
                'impressions' => 0,
                'clicks' => 0,
                'conversions' => 0,
                'revenue' => 0,
                'cost' => 0,
            ]
        );

        $metric->increment('conversions');
        if ($revenue > 0) {
            $metric->increment('revenue', $revenue);
        }
    }

    /**
     * Add cost to promotion metrics
     */
    public function addCost(Promotion $promotion, float $cost): void
    {
        $metric = PromotionPerformanceMetric::firstOrCreate(
            [
                'promotion_id' => $promotion->promotion_id,
                'date' => Carbon::today(),
            ],
            [
                'impressions' => 0,
                'clicks' => 0,
                'conversions' => 0,
                'revenue' => 0,
                'cost' => 0,
            ]
        );

        $metric->increment('cost', $cost);
    }
    /**
     * Get detailed usage statistics for a promotion
     */
    public function getUsageStats(Promotion $promotion): array
    {
        // Get metrics from performance tracking
        $totalMetrics = $promotion->performanceMetrics()
            ->selectRaw('
                SUM(impressions) as total_impressions,
                SUM(clicks) as total_clicks,
                SUM(conversions) as total_conversions,
                SUM(revenue) as total_revenue,
                SUM(cost) as total_cost
            ')
            ->first();

        // Get order-based metrics for fallback and validation
        $orderMetrics = $promotion->orders()
            ->selectRaw('
                COUNT(*) as total_orders,
                SUM(discount_applied) as total_discount,
                AVG(total_amount) as avg_order_value
            ')
            ->first();

        // Use metrics data if available, otherwise fallback to order data
        $impressions = $totalMetrics->total_impressions ?? 0;
        $clicks = $totalMetrics->total_clicks ?? 0;
        $conversions = $totalMetrics->total_conversions ?? $orderMetrics->total_orders ?? 0;
        $revenue = $totalMetrics->total_revenue ?? $promotion->orders()->sum('total_amount') ?? 0;
        $cost = $totalMetrics->total_cost ?? 0;

        // Calculate derived metrics
        $clickThroughRate = $impressions > 0 ? round(($clicks / $impressions) * 100, 2) : 0;
        $conversionRateFromClicks = $clicks > 0 ? round(($conversions / $clicks) * 100, 2) : 0;
        $costPerClick = $clicks > 0 ? round($cost / $clicks, 2) : 0;
        $returnOnAdSpend = $cost > 0 ? round($revenue / $cost, 2) : 0;

        // Get daily usage for the last 30 days
        $dailyUsage = $promotion->orders()
            ->whereDate('orders.created_at', '>=', now()->subDays(30))
            ->selectRaw('DATE(orders.created_at) as date, COUNT(*) as count, SUM(discount_applied) as discount')
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        return [
            'total_usage' => $conversions,
            'unique_users' => $promotion->orders()->distinct('customer_id')->count(),
            'total_discount_applied' => $orderMetrics->total_discount ?? 0,
            'conversion_rate' => $conversions > 0 ? round(($orderMetrics->total_orders ?? 0) / $conversions * 100, 2) : 0,
            'daily_usage' => $dailyUsage,
            'remaining_budget' => $promotion->budget_limit ? $promotion->budget_limit - $promotion->budget_used : null,
            'remaining_usage_limit' => $promotion->usage_limit ? $promotion->usage_limit - $promotion->used_count : null,

            // Performance metrics
            'total_impressions' => $impressions,
            'total_clicks' => $clicks,
            'total_conversions' => $conversions,
            'total_revenue' => $revenue,
            'total_cost' => $cost,
            'click_through_rate' => $clickThroughRate,
            'conversion_rate_from_clicks' => $conversionRateFromClicks,
            'cost_per_click' => $costPerClick,
            'return_on_ad_spend' => $returnOnAdSpend,

            // Data source indicators
            'has_performance_metrics' => $impressions > 0 || $clicks > 0 || $conversions > 0,
            'has_order_data' => ($orderMetrics->total_orders ?? 0) > 0,
        ];
    }

    /**
     * Calculate revenue impact of a promotion
     */
    public function getRevenueImpact(Promotion $promotion): array
    {
        $ordersWithPromotion = $promotion->orders()
            ->with('items')
            ->get();

        $totalRevenue = $ordersWithPromotion->sum('total_amount');
        $totalDiscount = $ordersWithPromotion->sum('discount_applied');
        $netRevenue = $totalRevenue - $totalDiscount;

        $averageOrderValue = $ordersWithPromotion->avg('total_amount');
        $averageDiscount = $ordersWithPromotion->avg('discount_applied');

        $roi = $totalDiscount > 0 ? (($netRevenue - $totalDiscount) / $totalDiscount) * 100 : 0;

        return [
            'total_revenue' => $totalRevenue,
            'total_discount_cost' => $totalDiscount,
            'net_revenue' => $netRevenue,
            'average_order_value' => round($averageOrderValue, 2),
            'average_discount_per_order' => round($averageDiscount, 2),
            'roi_percentage' => round($roi, 2),
            'orders_count' => $ordersWithPromotion->count(),
        ];
    }

    /**
     * Get performance metrics for a promotion
     */
    public function getPerformanceMetrics(Promotion $promotion): array
    {
        $usageStats = $this->getUsageStats($promotion);
        $revenueImpact = $this->getRevenueImpact($promotion);

        $aov = $revenueImpact['average_order_value'];
        $conversionRate = $usageStats['conversion_rate'];

        $performanceScore = 0;
        if ($conversionRate > 20) $performanceScore += 30;
        elseif ($conversionRate > 10) $performanceScore += 20;
        elseif ($conversionRate > 5) $performanceScore += 10;

        if ($revenueImpact['roi_percentage'] > 200) $performanceScore += 40;
        elseif ($revenueImpact['roi_percentage'] > 100) $performanceScore += 30;
        elseif ($revenueImpact['roi_percentage'] > 50) $performanceScore += 20;

        if ($usageStats['total_usage'] > 1000) $performanceScore += 30;
        elseif ($usageStats['total_usage'] > 500) $performanceScore += 20;
        elseif ($usageStats['total_usage'] > 100) $performanceScore += 10;

        return [
            'usage_stats' => $usageStats,
            'revenue_impact' => $revenueImpact,
            'performance_score' => min(100, $performanceScore),
            'performance_rating' => $performanceScore >= 80 ? 'Excellent' :
                                   ($performanceScore >= 60 ? 'Good' :
                                   ($performanceScore >= 40 ? 'Average' : 'Poor')),
        ];
    }
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PromotionPerformanceMetric extends Model
{
    use HasFactory;

    protected $primaryKey = 'metric_id';

    protected $fillable = [
        'promotion_id',
        'date',
        'impressions',
        'clicks',
        'conversions',
        'revenue',
        'cost',
    ];

    protected $casts = [
        'date' => 'date',
        'impressions' => 'integer',
        'clicks' => 'integer',
        'conversions' => 'integer',
        'revenue' => 'decimal:2',
        'cost' => 'decimal:2',
    ];

    /**
     * Get the promotion this metric belongs to
     */
    public function promotion(): BelongsTo
    {
        return $this->belongsTo(Promotion::class, 'promotion_id');
    }

    /**
     * Scope for metrics by date range
     */
    public function scopeDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('date', [$startDate, $endDate]);
    }

    /**
     * Scope for metrics by promotion
     */
    public function scopeForPromotion($query, int $promotionId)
    {
        return $query->where('promotion_id', $promotionId);
    }

    /**
     * Scope for metrics with impressions
     */
    public function scopeWithImpressions($query)
    {
        return $query->where('impressions', '>', 0);
    }

    /**
     * Scope for metrics with conversions
     */
    public function scopeWithConversions($query)
    {
        return $query->where('conversions', '>', 0);
    }

    /**
     * Calculate click-through rate (CTR)
     */
    public function getClickThroughRateAttribute(): float
    {
        if ($this->impressions <= 0) {
            return 0.0;
        }

        return round(($this->clicks / $this->impressions) * 100, 2);
    }

    /**
     * Calculate conversion rate
     */
    public function getConversionRateAttribute(): float
    {
        if ($this->clicks <= 0) {
            return 0.0;
        }

        return round(($this->conversions / $this->clicks) * 100, 2);
    }

    /**
     * Calculate cost per click (CPC)
     */
    public function getCostPerClickAttribute(): float
    {
        if ($this->clicks <= 0) {
            return 0.0;
        }

        return round($this->cost / $this->clicks, 2);
    }

    /**
     * Calculate cost per conversion
     */
    public function getCostPerConversionAttribute(): float
    {
        if ($this->conversions <= 0) {
            return 0.0;
        }

        return round($this->cost / $this->conversions, 2);
    }

    /**
     * Calculate return on ad spend (ROAS)
     */
    public function getReturnOnAdSpendAttribute(): float
    {
        if ($this->cost <= 0) {
            return 0.0;
        }

        return round($this->revenue / $this->cost, 2);
    }

    /**
     * Calculate profit
     */
    public function getProfitAttribute(): float
    {
        return round($this->revenue - $this->cost, 2);
    }

    /**
     * Increment impressions
     */
    public function incrementImpressions(int $count = 1): bool
    {
        return $this->increment('impressions', $count);
    }

    /**
     * Increment clicks
     */
    public function incrementClicks(int $count = 1): bool
    {
        return $this->increment('clicks', $count);
    }

    /**
     * Increment conversions
     */
    public function incrementConversions(int $count = 1): bool
    {
        return $this->increment('conversions', $count);
    }

    /**
     * Add revenue
     */
    public function addRevenue(float $amount): bool
    {
        return $this->increment('revenue', $amount);
    }

    /**
     * Add cost
     */
    public function addCost(float $amount): bool
    {
        return $this->increment('cost', $amount);
    }
}
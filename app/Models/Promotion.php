<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Promotion extends Model
{
    use HasFactory, SoftDeletes;
    protected $primaryKey = 'promotion_id';
    protected $fillable = [
        'name',
        'description',
        'type',
        'value',
        'min_order_amount',
        'max_discount_amount',
        'start_date',
        'end_date',
        'usage_limit',
        'used_count',
        'is_active'
    ];
    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'last_used_at' => 'datetime',
        'customer_eligibility' => 'array',
        'geographic_restrictions' => 'array',
        'product_restrictions' => 'array',
        'time_restrictions' => 'array',
        'is_active' => 'boolean',
        'stackable' => 'boolean',
        'first_time_customer_only' => 'boolean',
    ];

    /**
     * The orders that belong to the promotion.
     */
    public function orders(): BelongsToMany
    {
        return $this->belongsToMany(
            Order::class,
            'order_promotion',  // Tên bảng trung gian
            'promotion_id',       // Khóa ngoại của Promotion trong bảng trung gian
            'order_id'            // Khóa ngoại của Order trong bảng trung gian
        )->withPivot('discount_applied');
    }

    /**
     * The products that belong to the promotion.
     */
    public function products(): BelongsToMany
    {
        return $this->belongsToMany(
            Product::class,
            'promotion_products',
            'promotion_id',
            'product_id'
        );
    }

    /**
     * The categories that belong to the promotion.
     */
    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(
            Category::class,
            'promotion_categories',
            'promotion_id',
            'category_id'
        );
    }

    /**
     * Check if promotion is active and within date range
     */
    public function isActive(): bool
    {
        return $this->is_active 
            && $this->start_date <= now() 
            && $this->end_date >= now();
    }

    /**
     * Check if promotion budget is exceeded
     */
    public function isBudgetExceeded(): bool
    {
        return $this->budget_limit && $this->budget_used >= $this->budget_limit;
    }

    /**
     * Check if daily usage limit is exceeded
     */
    public function isDailyLimitExceeded(): bool
    {
        return $this->daily_usage_limit && $this->daily_usage_count >= $this->daily_usage_limit;
    }

    /**
     * Check if promotion can be used
     */
    public function canBeUsed(): bool
    {
        return $this->isActive() 
            && !$this->isBudgetExceeded() 
            && !$this->isDailyLimitExceeded()
            && ($this->usage_limit === null || $this->used_count < $this->usage_limit);
    }

    /**
     * Apply the promotion (increment counters)
     */
    public function apply(float $discountAmount): void
    {
        $this->increment('used_count');
        $this->increment('daily_usage_count');
        $this->increment('budget_used', $discountAmount);
        $this->update(['last_used_at' => now()]);
    }

    /**
     * Scope to get active promotions
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true)
                    ->where('start_date', '<=', now())
                    ->where('end_date', '>=', now());
    }

    /**
     * Scope to get high priority promotions
     */
    public function scopeHighPriority($query)
    {
        return $query->whereIn('priority', ['high', 'urgent']);
    }

    /**
     * Scope to get stackable promotions
     */
    public function scopeStackable($query)
    {
        return $query->where('stackable', true);
    }
}
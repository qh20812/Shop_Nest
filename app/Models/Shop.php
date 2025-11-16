<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Shop extends Model
{
    use HasFactory;

    protected $fillable = [
        'owner_id',
        'name',
        'slug',
        'description',
        'logo',
        'banner',
        'phone',
        'email',
        'website',
        'business_type',
        'tax_id',
        'business_license',
        'address',
        'city',
        'state',
        'postal_code',
        'country',
        'status',
        'is_verified',
        'commission_rate',
        'shipping_policies',
        'return_policy',
        'social_media',
        'rating',
        'total_reviews',
        'total_sales',
        'total_revenue',
        'meta_title',
        'meta_description',
        'keywords',
        'verified_at',
        'last_active_at',
    ];

    protected $casts = [
        'is_verified' => 'boolean',
        'commission_rate' => 'decimal:2',
        'rating' => 'decimal:2',
        'total_reviews' => 'integer',
        'total_sales' => 'integer',
        'total_revenue' => 'decimal:2',
        'shipping_policies' => 'array',
        'return_policy' => 'array',
        'social_media' => 'array',
        'keywords' => 'array',
        'verified_at' => 'datetime',
        'last_active_at' => 'datetime',
    ];

    protected $attributes = [
        'status' => 'pending',
        'is_verified' => false,
        'commission_rate' => 10.00,
        'rating' => 0.00,
        'total_reviews' => 0,
        'total_sales' => 0,
        'total_revenue' => 0.00,
    ];

    // Relationships
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class, 'shop_id');
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class, 'shop_id');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeVerified($query)
    {
        return $query->where('is_verified', true);
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeByRating($query, $minRating = 0)
    {
        return $query->where('rating', '>=', $minRating);
    }

    // Accessors & Mutators
    public function getFullAddressAttribute(): string
    {
        $parts = array_filter([
            $this->address,
            $this->city,
            $this->state,
            $this->postal_code,
            $this->country,
        ]);

        return implode(', ', $parts);
    }

    public function getIsActiveAttribute(): bool
    {
        return $this->status === 'active' && $this->is_verified;
    }

    public function getLogoUrlAttribute(): string
    {
        return $this->logo ? asset('storage/' . $this->logo) : asset('images/default-shop-logo.png');
    }

    public function getBannerUrlAttribute(): string
    {
        return $this->banner ? asset('storage/' . $this->banner) : asset('images/default-shop-banner.jpg');
    }

    // Methods
    public function canSell(): bool
    {
        return $this->isActive;
    }

    public function updateRating(float $newRating, int $newReviewCount): void
    {
        $currentTotalRating = $this->rating * $this->total_reviews;
        $newTotalRating = $currentTotalRating + $newRating;
        $newTotalReviews = $this->total_reviews + $newReviewCount;

        $this->update([
            'rating' => $newTotalReviews > 0 ? $newTotalRating / $newTotalReviews : 0,
            'total_reviews' => $newTotalReviews,
        ]);
    }

    public function updateSalesMetrics(int $orderCount, float $revenue): void
    {
        $this->increment('total_sales', $orderCount);
        $this->increment('total_revenue', $revenue);
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($shop) {
            if (empty($shop->slug)) {
                $shop->slug = Str::slug($shop->name);
            }
        });

        static::updating(function ($shop) {
            if ($shop->isDirty('name') && empty($shop->slug)) {
                $shop->slug = Str::slug($shop->name);
            }
        });
    }
}
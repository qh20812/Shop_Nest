<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * ShipperRating Model
 * 
 * Manages customer ratings and feedback for shipper delivery services
 * Supports detailed criteria ratings and anonymous feedback
 */
class ShipperRating extends Model
{
    use HasFactory;

    protected $table = 'shipper_ratings';

    protected $fillable = [
        'order_id',
        'shipper_id',
        'customer_id',
        'rating',
        'comment',
        'criteria_ratings',
        'is_anonymous',
        'rated_at',
    ];

    protected $casts = [
        'criteria_ratings' => 'array',
        'rating' => 'integer',
        'is_anonymous' => 'boolean',
        'rated_at' => 'datetime',
    ];

    /**
     * Get the order this rating belongs to
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class, 'order_id', 'order_id');
    }

    /**
     * Get the shipper being rated
     */
    public function shipper(): BelongsTo
    {
        return $this->belongsTo(User::class, 'shipper_id');
    }

    /**
     * Get the customer who provided the rating
     */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    /**
     * Scope to get ratings by rating value
     */
    public function scopeByRating($query, $rating)
    {
        return $query->where('rating', $rating);
    }

    /**
     * Scope to get recent ratings
     */
    public function scopeRecent($query, $days = 30)
    {
        return $query->where('rated_at', '>=', now()->subDays($days));
    }

    /**
     * Get average rating for a specific shipper
     */
    public static function averageForShipper($shipperId)
    {
        return static::where('shipper_id', $shipperId)->avg('rating');
    }
}
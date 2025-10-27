<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * WishlistItem Model
 * 
 * Manages individual items within user wishlists
 * Supports price tracking, notifications, and custom notes
 */
class WishlistItem extends Model
{
    use HasFactory;

    protected $table = 'wishlist_items';

    protected $fillable = [
        'wishlist_id',
        'product_id',
        'product_variant',
        'price_when_added',
        'note',
        'priority',
        'notify_price_drop',
        'notify_back_in_stock',
        'notified_at',
    ];

    protected $casts = [
        'product_variant' => 'array',
        'price_when_added' => 'decimal:2',
        'priority' => 'integer',
        'notify_price_drop' => 'boolean',
        'notify_back_in_stock' => 'boolean',
        'notified_at' => 'datetime',
    ];

    /**
     * Get the wishlist this item belongs to
     */
    public function wishlist(): BelongsTo
    {
        return $this->belongsTo(Wishlist::class);
    }

    /**
     * Get the product
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_id', 'product_id');
    }

    /**
     * Check if price has dropped since added
     */
    public function hasPriceDropped(): bool
    {
        if (!$this->price_when_added || !$this->product) {
            return false;
        }

        $currentPrice = $this->product->variants()->min('price');
        return $currentPrice < $this->price_when_added;
    }

    /**
     * Check if product is back in stock
     */
    public function isBackInStock(): bool
    {
        if (!$this->product) {
            return false;
        }

        return $this->product->variants()->where('stock_quantity', '>', 0)->exists();
    }

    /**
     * Scope to get items that need price drop notification
     */
    public function scopeNeedsPriceDropNotification($query)
    {
        return $query->where('notify_price_drop', true)
                    ->whereNull('notified_at');
    }

    /**
     * Scope to get items that need back in stock notification
     */
    public function scopeNeedsStockNotification($query)
    {
        return $query->where('notify_back_in_stock', true)
                    ->whereNull('notified_at');
    }

    /**
     * Scope to order by priority
     */
    public function scopeByPriority($query)
    {
        return $query->orderBy('priority', 'desc');
    }
}
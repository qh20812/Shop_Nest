<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class FlashSaleProduct extends Model
{
    use HasFactory;

    protected $fillable = [
        'flash_sale_event_id',
        'product_variant_id',
        'flash_sale_price',
        'quantity_limit',
        'sold_count',
        'discount_percentage',
        'max_quantity_per_user',
        'metadata',
    ];

    protected $casts = [
        'flash_sale_price' => 'decimal:2',
        'discount_percentage' => 'decimal:2',
        'metadata' => 'array',
    ];

    /**
     * Get the flash sale event this product belongs to
     */
    public function flashSaleEvent(): BelongsTo
    {
        return $this->belongsTo(FlashSaleEvent::class);
    }

    /**
     * Get the product variant this flash sale applies to
     */
    public function productVariant(): BelongsTo
    {
        return $this->belongsTo(ProductVariant::class, 'product_variant_id', 'variant_id');
    }

    /**
     * Check if the flash sale product is still available
     */
    public function isAvailable(): bool
    {
        return $this->sold_count < $this->quantity_limit 
            && $this->flashSaleEvent->isActive();
    }

    /**
     * Get remaining quantity
     */
    public function getRemainingQuantityAttribute(): int
    {
        return max(0, $this->quantity_limit - $this->sold_count);
    }

    /**
     * Get discount amount from original price
     */
    public function getDiscountAmountAttribute(): float
    {
        if ($this->productVariant && $this->productVariant->price > 0) {
            return $this->productVariant->price - $this->flash_sale_price;
        }
        return 0;
    }

    /**
     * Calculate discount percentage if not set
     */
    public function getCalculatedDiscountPercentageAttribute(): float
    {
        if ($this->discount_percentage) {
            return $this->discount_percentage;
        }

        if ($this->productVariant && $this->productVariant->price > 0) {
            return (($this->productVariant->price - $this->flash_sale_price) / $this->productVariant->price) * 100;
        }

        return 0;
    }

    /**
     * Scope to get available flash sale products
     */
    public function scopeAvailable($query)
    {
        return $query->whereRaw('sold_count < quantity_limit')
                    ->whereHas('flashSaleEvent', function ($q) {
                        $q->active();
                    });
    }
}

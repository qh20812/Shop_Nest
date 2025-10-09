<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo; // <-- Thêm vào
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductVariant extends Model
{
    use HasFactory, SoftDeletes;
    protected $primaryKey = 'variant_id';
    protected $fillable = [
        'product_id',
        'sku',
        'price',
        'discount_price',
        'stock_quantity',
        'image_id'
    ];

    /**
     * Lấy sản phẩm cha của biến thể này.
     */
    public function product(): BelongsTo // <-- THÊM PHƯƠNG THỨC NÀY
    {
        return $this->belongsTo(Product::class, 'product_id');
    }

    /**
     * Get the attribute values associated with this product variant.
     */
    public function attributeValues(): BelongsToMany
    {
        return $this->belongsToMany(
            AttributeValue::class,
            'attribute_value_product_variant',
            'product_variant_id',
            'attribute_value_id',
            'variant_id',
            'attribute_value_id'
        );
    }

    /**
     * Reserve quantity for this variant
     */
    public function reserveQuantity(int $quantity): bool
    {
        if ($this->available_quantity < $quantity) {
            return false;
        }

        $this->increment('reserved_quantity', $quantity);
        return true;
    }

    /**
     * Release reserved quantity
     */
    public function releaseReservedQuantity(int $quantity): void
    {
        $this->decrement('reserved_quantity', min($quantity, $this->reserved_quantity));
    }

    /**
     * Check if variant is in stock
     */
    public function isInStock(): bool
    {
        return $this->available_quantity > 0;
    }

    /**
     * Check if variant is low stock
     */
    public function isLowStock(): bool
    {
        return $this->available_quantity <= $this->minimum_stock_level;
    }

    /**
     * Scope to get in-stock variants
     */
    public function scopeInStock($query)
    {
        return $query->where('available_quantity', '>', 0);
    }

    /**
     * Scope to get low-stock variants
     */
    public function scopeLowStock($query)
    {
        return $query->whereRaw('available_quantity <= minimum_stock_level');
    }

    /**
     * Scope to get variants with inventory tracking
     */
    public function scopeTracked($query)
    {
        return $query->where('track_inventory', true);
    }
}
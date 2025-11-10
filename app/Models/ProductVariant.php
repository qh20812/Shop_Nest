<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo; // <-- Thêm vào
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\App;
use App\Models\InventoryLog;
use App\Services\InventoryService;

class ProductVariant extends Model
{
    public const LOW_STOCK_THRESHOLD = InventoryService::LOW_STOCK_THRESHOLD;
    public const IN_STOCK_THRESHOLD = InventoryService::IN_STOCK_THRESHOLD;

    use HasFactory, SoftDeletes;
    protected $primaryKey = 'variant_id';
    protected $fillable = [
        'product_id',
        'variant_name',
        'sku',
        'price',
        'discount_price',
        'stock_quantity',
        'image_id',
        'is_primary',
        'option_values',
        'option_signature',
    ];

    protected $casts = [
        'option_values' => 'array',
        'is_primary' => 'boolean',
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

    public function inventoryLogs(): HasMany
    {
        return $this->hasMany(InventoryLog::class, 'variant_id', 'variant_id');
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class, 'variant_id', 'variant_id');
    }

    /**
     * Reserve quantity for this variant
     * Note: We check against stock_quantity only, not (stock - reserved)
     * This allows checkout even if there are stale reservations from expired sessions
     */
    public function reserveQuantity(int $quantity): bool
    {
        // If inventory tracking is disabled, always allow
        if (!(bool) ($this->track_inventory ?? true)) {
            return true;
        }

        // Check if we have enough physical stock
        if ((int) $this->stock_quantity < $quantity) {
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
        $available = $this->available_quantity;

        if ($available === null) {
            $available = max(0, (int) $this->stock_quantity - (int) ($this->reserved_quantity ?? 0));
        }

        return $available > 0;
    }

    /**
     * Check if variant is low stock
     */
    public function isLowStock(): bool
    {
        $available = $this->available_quantity;

        if ($available === null) {
            $available = max(0, (int) $this->stock_quantity - (int) ($this->reserved_quantity ?? 0));
        }

        return $available <= (int) ($this->minimum_stock_level ?? 0);
    }

    /**
     * Scope to get in-stock variants
     */
    public function scopeInStock($query)
    {
        return $query->where('stock_quantity', '>', self::IN_STOCK_THRESHOLD);
    }

    /**
     * Scope to get low-stock variants
     */
    public function scopeLowStock($query)
    {
        return $query->whereBetween('stock_quantity', [1, self::LOW_STOCK_THRESHOLD]);
    }

    /**
     * Scope to get variants with inventory tracking
     */
    public function scopeTracked($query)
    {
        return $query->where('track_inventory', true);
    }

    public function scopeOutOfStock($query)
    {
        return $query->where('stock_quantity', '=', 0);
    }

    public function scopeForSeller($query, ?int $sellerId)
    {
        if ($sellerId === null) {
            return $query;
        }

        return $query->whereHas('product', fn ($q) => $q->where('seller_id', $sellerId));
    }

    public function scopeForCategory($query, ?int $categoryId)
    {
        if ($categoryId === null) {
            return $query;
        }

        return $query->whereHas('product', fn ($q) => $q->where('category_id', $categoryId));
    }

    public function scopeForBrand($query, ?int $brandId)
    {
        if ($brandId === null) {
            return $query;
        }

        return $query->whereHas('product', fn ($q) => $q->where('brand_id', $brandId));
    }

    public function scopeSearch($query, ?string $term)
    {
        if (!$term) {
            return $query;
        }

        return $query->where(function ($q) use ($term) {
            $q->where('product_variants.sku', 'like', "%{$term}%")
                ->orWhereHas('product', function ($sub) use ($term) {
                    $sub->where('name->' . App::getLocale(), 'like', "%{$term}%");
                });
        });
    }

    public function getCategoryNameAttribute(): ?string
    {
        return $this->product?->category?->getTranslation('name', App::getLocale());
    }

    public function getBrandNameAttribute(): ?string
    {
        return $this->product?->brand?->getTranslation('name', App::getLocale());
    }
}
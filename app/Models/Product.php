<?php

namespace App\Models;

use App\Enums\ProductStatus;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Translatable\HasTranslations;

class Product extends Model
{
    use HasFactory, HasTranslations,SoftDeletes;

    protected $primaryKey = 'product_id';

    protected $fillable = [
        'name',
        'description',
        'shop_id',
        'category_id',
        'brand_id',
        'seller_id',
        'status',
        'is_active',
        'meta_title',
        'meta_slug',
        'meta_description',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'name' => 'array',
        'description' => 'array',
    ];

    protected $translatable = ['name', 'description'];

    // Relationships
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class, 'brand_id');
    }

    public function seller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class, 'product_id');
    }

    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class, 'product_id');
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class, 'product_id');
    }

    /**
     * Get the shop that owns this product
     */
    public function shop(): BelongsTo
    {
        return $this->belongsTo(Shop::class);
    }

    /**
     * Get product questions
     */
    public function questions(): HasMany
    {
        return $this->hasMany(ProductQuestion::class, 'product_id', 'product_id');
    }

    /**
     * Get answered questions only
     */
    public function answeredQuestions()
    {
        return $this->questions()->where('status', 'answered');
    }

    /**
     * Get wishlist items for this product
     */
    public function wishlistItems(): HasMany
    {
        return $this->hasMany(WishlistItem::class, 'product_id', 'product_id');
    }

    /**
     * Normalise the status column to a ProductStatus enum.
     *
     * The database stores enum strings, but accepting legacy integers keeps
     * older rows and imports readable without hiding bad values.
     */
    protected function status(): Attribute
    {
        return Attribute::make(
            get: function ($value): ProductStatus {
                if ($value instanceof ProductStatus) {
                    return $value;
                }

                if (is_numeric($value)) {
                    return ProductStatus::fromLegacyInt((int) $value);
                }

                return ProductStatus::from($value);
            },
            set: function ($value): string {
                if ($value instanceof ProductStatus) {
                    return $value->value;
                }

                if (is_numeric($value)) {
                    return ProductStatus::fromLegacyInt((int) $value)->value;
                }

                return ProductStatus::from($value)->value;
            },
        );
    }
}

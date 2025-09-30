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
}
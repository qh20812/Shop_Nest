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
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Review extends Model
{
    use HasFactory, SoftDeletes;
    protected $primaryKey = 'review_id';
    protected $fillable = [
        'product_id',
        'user_id',
        'order_id',
        'rating',
        'comment',
        'is_approved'
    ];
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class,'user_id','id');
    }
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class, 'order_id');
    }

    /**
     * Get media attachments for this review
     */
    public function media(): HasMany
    {
        return $this->hasMany(ReviewMedia::class, 'review_id', 'review_id')
                    ->orderBy('display_order');
    }

    /**
     * Get primary media for this review
     */
    public function primaryMedia()
    {
        return $this->media()->where('is_primary', true)->first();
    }

    /**
     * Get images only
     */
    public function images()
    {
        return $this->media()->where('media_type', 'image');
    }

    /**
     * Get videos only
     */
    public function videos()
    {
        return $this->media()->where('media_type', 'video');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;
    protected $primaryKey = 'product_id';
    protected $fillable = [
        'name',
        'description',
        'category_id',
        'brand_id',
        'seller_id',
        'status',
        'is_active'
    ];
    public function category(): BelongsTo{
        return $this->belongsTo(Category::class,'category_id');
    }
    public function brand(): BelongsTo{
        return $this->belongsTo(Brand::class,'brand_id');
    }
    public function seller(): BelongsTo{
        return $this->belongsTo(User::class,'seller_id');
    }
    public function variants(): HasMany{
        return $this->hasMany(ProductVariant::class,'product_id');
    }
    public function images(): HasMany{
        return $this->hasMany(ProductImage::class,'product_id');
    }
}

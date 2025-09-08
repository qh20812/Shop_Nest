<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
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
}

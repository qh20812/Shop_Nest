<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItem extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $primaryKey = 'order_item_id';
    protected $fillable = [
        'order_id',
        'variant_id',
        'quantity',
        'unit_price',
        'total_price',
        'original_currency',
        'original_unit_price',
        'original_total_price'
    ];
    public function variant(): BelongsTo{
        return $this->belongsTo(ProductVariant::class,'variant_id');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Enums\InventoryLogReason;

class InventoryLog extends Model
{
    protected $fillable = [
        'variant_id',
        'quantity_change',
        'reason',
        'order_id',
        'user_id',
    ];

    protected $casts = [
        'quantity_change' => 'integer',
        'deleted_at' => 'datetime',
    ];

    protected $dates = [
        'deleted_at',
    ];

    use \Illuminate\Database\Eloquent\SoftDeletes;

    public function variant()
    {
        return $this->belongsTo(ProductVariant::class, 'variant_id');
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
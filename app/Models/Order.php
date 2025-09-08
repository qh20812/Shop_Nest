<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Order extends Model
{
    use HasFactory, SoftDeletes;
    protected $primaryKey = 'order_id';
    protected $fillable = [
        'customer_id',
        'order_number',
        'sub_total',
        'shipping_fee',
        'discount_amount',
        'total_amount',
        'status',
        'payment_method',
        'payment_status',
        'shipping_address_id',
        'notes'
    ];
    public function customer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'customer_id');
    }
    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class, 'order_id');
    }
    public function shippingAddress(): BelongsTo
    {
        return $this->belongsTo(UserAddress::class, 'shipping_address_id');
    }
}

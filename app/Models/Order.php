<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Order extends Model
{
    use HasFactory, SoftDeletes;

    const STATUS_PENDING = 1;
    const STATUS_PROCESSING = 2;
    const STATUS_SHIPPED = 3;
    const STATUS_DELIVERED = 4;
    const STATUS_CANCELLED = 5;

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
        'shipper_id',
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

    public function shipper(): BelongsTo
    {
        return $this->belongsTo(User::class, 'shipper_id');
    }

    /**
     * The promotions that belong to the order.
     */
    public function promotions(): BelongsToMany
    {
        return $this->belongsToMany(
            Promotion::class,
            'order_promotion',
            'order_id',
            'promotion_id'
        )->withPivot('discount_applied');
    }
}

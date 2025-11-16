<?php

namespace App\Models;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
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
        'currency',
        'exchange_rate',
        'total_amount_base',
        'status',
        'payment_method',
        'payment_status',
        'shipping_address_id',
        'shipper_id',
        'notes'
    ];

    /**
     * The attributes that should be cast to native types.
     */
    protected $casts = [
        'status' => OrderStatus::class,
        'payment_status' => PaymentStatus::class,
        'sub_total' => 'decimal:2',
        'shipping_fee' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'exchange_rate' => 'decimal:6',
        'total_amount_base' => 'decimal:2',
        'shipped_at' => 'datetime',
        'delivered_at' => 'datetime',
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

    /**
     * Get all transactions related to the order.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class, 'order_id', 'order_id');
    }

    /**
     * Get shipper rating for this order
     */
    public function shipperRating(): HasOne
    {
        return $this->hasOne(ShipperRating::class, 'order_id', 'order_id');
    }

    /**
     * Get shipment journeys for this order
     */
    public function shipmentJourneys(): HasMany
    {
        return $this->hasMany(ShipmentJourney::class, 'order_id', 'order_id');
    }

    /**
     * Get international addresses for this order
     */
    public function internationalAddresses()
    {
        return $this->morphMany(InternationalAddress::class, 'addressable');
    }

    /**
     * Get reviews for this order
     */
    public function reviews(): HasMany
    {
        return $this->hasMany(OrderReview::class, 'order_id', 'order_id');
    }
}

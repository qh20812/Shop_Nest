<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShippingDetail extends Model
{
    use HasFactory;
    protected $primaryKey = 'shipping_detail_id';
    protected $fillable = [
        'order_id',
        'shipping_provider',
        'tracking_number',
        'external_order_id',
        'status',
        'shipping_fee',
        'status_history'
    ];
}

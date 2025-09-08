<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ReturnRequest extends Model
{
    use HasFactory;
    protected $primaryKey = 'return_id';
    protected $fillable = [
        'order_id',
        'customer_id',
        'return_number',
        'reason',
        'description',
        'status',
        'refund_amount',
        'type',
        'admin_notes',
        'processed_at',
        'refunded_at'
    ];
    public function items(): HasMany
    {
        return $this->hasMany(ReturnItem::class, 'return_id');
    }
}

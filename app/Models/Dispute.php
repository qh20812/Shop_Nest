<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Dispute extends Model
{
    use HasFactory;
    protected $primaryKey = 'dispute_id';
    protected $fillable = [
        'order_id',
        'customer_id',
        'seller_id',
        'subject',
        'description',
        'status',
        'type',
        'assigned_admin_id',
        'resolution',
        'resolved_at'
    ];
    public function order():BelongsTo{
        return $this->belongsTo(Order::class,'order_id');
    }
    public function messages():HasMany{
        return $this->hasMany(DisputeMessage::class,'dispute_id');
    }
}
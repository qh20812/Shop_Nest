<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SellerPromotionParticipation extends Model
{
    use HasFactory;

    protected $primaryKey = 'participation_id';

    protected $fillable = [
        'seller_id',
        'platform_promotion_id',
        'status',
        'seller_contribution',
    ];

    protected $casts = [
        'seller_contribution' => 'decimal:2',
    ];

    public function seller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    public function promotion(): BelongsTo
    {
        return $this->belongsTo(Promotion::class, 'platform_promotion_id', 'promotion_id');
    }
}

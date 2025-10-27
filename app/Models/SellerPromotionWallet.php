<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SellerPromotionWallet extends Model
{
    use HasFactory;

    protected $primaryKey = 'wallet_id';

    protected $fillable = [
        'seller_id',
        'balance',
        'total_earned',
        'total_spent',
        'currency',
        'status',
    ];

    protected $casts = [
        'balance' => 'decimal:2',
        'total_earned' => 'decimal:2',
        'total_spent' => 'decimal:2',
    ];

    public function seller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(SellerWalletTransaction::class, 'wallet_id', 'wallet_id')->orderByDesc('created_at');
    }
}

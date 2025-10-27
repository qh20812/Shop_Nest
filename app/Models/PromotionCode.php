<?php

namespace App\Models;

use App\Models\Promotion;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PromotionCode extends Model
{
    use HasFactory;
    protected $primaryKey = 'promotion_code_id';
    protected $fillable = [
        'promotion_id',
        'code',
        'usage_limit',
        'used_count',
        'is_active'
    ];

    public function promotion(): BelongsTo
    {
        return $this->belongsTo(Promotion::class, 'promotion_id', 'promotion_id');
    }
}

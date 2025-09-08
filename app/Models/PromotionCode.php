<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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
}

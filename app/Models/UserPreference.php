<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserPreference extends Model
{
    use HasFactory;
    protected $primaryKey = 'user_preference_id';
    protected $fillable = [
        'user_id',
        'preferred_category_id',
        'preferred_brand_id',
        'min_price_range',
        'max_price_range'
    ];
}

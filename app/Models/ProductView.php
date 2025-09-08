<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductView extends Model
{
    use HasFactory;
    protected $primaryKey = 'product_view_id';
    protected $fillable = [
        'user_id',
        'product_id',
        'view_count',
        'last_viewed'
    ];
}

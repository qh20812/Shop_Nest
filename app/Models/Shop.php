<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Shop extends Model
{
    // Add fillable or guarded properties as needed
    protected $fillable = [
        'seller_id', 'name', 'description', 'banner', 'logo'
    ];
}
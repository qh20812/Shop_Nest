<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductImage extends Model
{
    use HasFactory;
    protected $primaryKey = 'image_id';
    protected $fillable = [
        'product_id',
        'image_url',
        'alt_text',
        'is_primary',
        'display_order'
    ];
}

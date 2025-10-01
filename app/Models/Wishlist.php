<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Wishlist extends Model
{
    protected $fillable = [
        'user_id',
        'product_id',
        // Thêm các trường khác nếu có
    ];

    // Nếu cần quan hệ với Product
    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReturnItem extends Model
{
    use HasFactory;
    protected $primaryKey = 'return_item_id';
    public $timestamps = false;
    protected $fillable = [
        'return_id',
        'variant_id',
        'quantity',
        'unit_price',
        'total_price',
        'reason'
    ];
}

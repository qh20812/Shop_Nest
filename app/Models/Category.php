<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Category extends Model
{
    use HasFactory, SoftDeletes;
    protected $primaryKey = 'category_id';
    protected $fillable = [
        'name',
        'description',
        'image_url',
        'parent_category_id',
        'is_active'
    ];

    protected $casts = [
        'name' => 'json',
        'description' => 'json',
        'is_active' => 'boolean',
    ];
}

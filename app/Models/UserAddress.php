<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\User;

class UserAddress extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = [
    'user_id',
    'recipient_name',
    'phone',
    'address_line',
    'ward',
    'district',
    'province',
    'postal_code',
    'is_default',
    ];
    protected $casts = [
        'is_default' => 'boolean',
    ];
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
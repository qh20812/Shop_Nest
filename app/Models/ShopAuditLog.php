<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $admin_id
 * @property int $shop_id
 */

class ShopAuditLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'admin_id',
        'shop_id',
        'action',
        'old_values',
        'new_values',
        'ip_address',
        'notes',
    ];

    protected $casts = [
        'old_values' => 'array',
        'new_values' => 'array',
    ];

    public function admin(): BelongsTo
    {
        return $this->belongsTo(User::class, 'admin_id');
    }

    public function shop(): BelongsTo
    {
        return $this->belongsTo(User::class, 'shop_id');
    }
}

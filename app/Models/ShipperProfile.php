<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ShipperProfile extends Model
{
    use HasFactory;

    protected $primaryKey = 'user_id';
    public $incrementing = false;

    protected $fillable = [
        'user_id',
        'id_card_number',
        'id_card_front_url',
        'id_card_back_url',
        'driver_license_number',
        'driver_license_front_url',
        'vehicle_type',
        'license_plate',
        'status',
    ];

    /**
     * Get the user that owns this shipper profile.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the status badge color for frontend display.
     */
    public function getStatusColorAttribute(): string
    {
        return match($this->status) {
            'pending' => 'yellow',
            'approved' => 'green',
            'rejected' => 'red',
            'suspended' => 'gray',
            default => 'blue',
        };
    }
}
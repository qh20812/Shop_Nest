<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Carbon\Carbon;

class FlashSaleEvent extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'start_time',
        'end_time',
        'status',
        'description',
        'banner_image',
        'metadata',
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'metadata' => 'array',
    ];

    /**
     * Get all flash sale products for this event
     */
    public function flashSaleProducts(): HasMany
    {
        return $this->hasMany(FlashSaleProduct::class);
    }

    /**
     * Check if the flash sale is currently active
     */
    public function isActive(): bool
    {
        return $this->status === 'active' 
            && now()->between($this->start_time, $this->end_time);
    }

    /**
     * Check if the flash sale is scheduled to start
     */
    public function isScheduled(): bool
    {
        return $this->status === 'scheduled' && now()->lt($this->start_time);
    }

    /**
     * Check if the flash sale has ended
     */
    public function hasEnded(): bool
    {
        return $this->status === 'ended' || now()->gt($this->end_time);
    }

    /**
     * Scope to get active flash sales
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active')
                    ->where('start_time', '<=', now())
                    ->where('end_time', '>=', now());
    }

    /**
     * Scope to get upcoming flash sales
     */
    public function scopeUpcoming($query)
    {
        return $query->where('status', 'scheduled')
                    ->where('start_time', '>', now());
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * ShipmentJourney Model
 * 
 * Manages individual legs of shipment journeys in hub-and-spoke logistics
 * Tracks first-mile, middle-mile, and last-mile delivery stages
 */
class ShipmentJourney extends Model
{
    use HasFactory;

    protected $table = 'shipment_journeys';

    protected $fillable = [
        'order_id',
        'leg_type',
        'shipper_id',
        'start_hub_id',
        'end_hub_id',
        'status',
        'started_at',
        'completed_at',
        'notes',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    /**
     * Get the order this journey belongs to
     */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class, 'order_id', 'order_id');
    }

    /**
     * Get the shipper handling this leg
     */
    public function shipper(): BelongsTo
    {
        return $this->belongsTo(User::class, 'shipper_id');
    }

    /**
     * Get the starting hub
     */
    public function startHub(): BelongsTo
    {
        return $this->belongsTo(Hub::class, 'start_hub_id');
    }

    /**
     * Get the ending hub
     */
    public function endHub(): BelongsTo
    {
        return $this->belongsTo(Hub::class, 'end_hub_id');
    }

    /**
     * Scope to get journeys by leg type
     */
    public function scopeByLegType($query, $legType)
    {
        return $query->where('leg_type', $legType);
    }

    /**
     * Scope to get active journeys
     */
    public function scopeActive($query)
    {
        return $query->whereIn('status', ['pending', 'in_transit']);
    }

    /**
     * Scope to get completed journeys
     */
    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    /**
     * Start this journey leg
     */
    public function start()
    {
        $this->update([
            'status' => 'in_transit',
            'started_at' => now(),
        ]);
    }

    /**
     * Complete this journey leg
     */
    public function complete($notes = null)
    {
        $this->update([
            'status' => 'completed',
            'completed_at' => now(),
            'notes' => $notes,
        ]);
    }

    /**
     * Get journey duration in minutes
     */
    public function getDurationAttribute()
    {
        if (!$this->started_at || !$this->completed_at) {
            return null;
        }

        return $this->started_at->diffInMinutes($this->completed_at);
    }
}
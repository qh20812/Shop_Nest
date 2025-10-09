<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Hub Model
 * 
 * Manages logistics hubs for package sorting and distribution
 * Part of the hub-and-spoke delivery network
 */
class Hub extends Model
{
    use HasFactory;

    protected $table = 'hubs';

    protected $fillable = [
        'name',
        'address',
        'ward_id',
        'latitude',
        'longitude',
    ];

    protected $casts = [
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
    ];

    /**
     * Get the ward this hub is located in
     */
    public function ward(): BelongsTo
    {
        return $this->belongsTo(AdministrativeDivision::class, 'ward_id');
    }

    /**
     * Get shipment journeys starting from this hub
     */
    public function outgoingJourneys(): HasMany
    {
        return $this->hasMany(ShipmentJourney::class, 'start_hub_id');
    }

    /**
     * Get shipment journeys ending at this hub
     */
    public function incomingJourneys(): HasMany
    {
        return $this->hasMany(ShipmentJourney::class, 'end_hub_id');
    }

    /**
     * Get all journeys (incoming and outgoing)
     */
    public function allJourneys()
    {
        return ShipmentJourney::where('start_hub_id', $this->id)
                             ->orWhere('end_hub_id', $this->id);
    }

    /**
     * Scope to get hubs within a radius of coordinates
     */
    public function scopeWithinRadius($query, $latitude, $longitude, $radiusKm = 50)
    {
        return $query->selectRaw("
            *, 
            (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)))) AS distance
        ", [$latitude, $longitude, $latitude])
        ->having('distance', '<', $radiusKm)
        ->orderBy('distance');
    }

    /**
     * Get the nearest hub to given coordinates
     */
    public static function nearest($latitude, $longitude)
    {
        return static::selectRaw("
            *, 
            (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)))) AS distance
        ", [$latitude, $longitude, $latitude])
        ->orderBy('distance')
        ->first();
    }
}
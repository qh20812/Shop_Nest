<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

/**
 * InternationalAddress Model
 * 
 * Manages international standardized addresses with geocoding support
 * Uses polymorphic relationships to support multiple addressable entities
 */
class InternationalAddress extends Model
{
    use HasFactory;

    protected $table = 'international_addresses';

    protected $fillable = [
        'addressable_type',
        'addressable_id',
        'type',
        'first_name',
        'last_name',
        'company',
        'phone',
        'email',
        'address_line_1',
        'address_line_2',
        'address_line_3',
        'locality',
        'administrative_area',
        'sub_administrative_area',
        'postal_code',
        'country_code',
        'country_name',
        'latitude',
        'longitude',
        'validation_result',
        'formatted_address',
        'is_verified',
        'is_default',
        'timezone',
        'metadata',
    ];

    protected $casts = [
        'validation_result' => 'array',
        'metadata' => 'array',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'is_verified' => 'boolean',
        'is_default' => 'boolean',
    ];

    /**
     * Get the addressable entity (User, Order, etc.)
     */
    public function addressable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Get full name
     */
    public function getFullNameAttribute(): string
    {
        return trim($this->first_name . ' ' . $this->last_name);
    }

    /**
     * Get formatted address line
     */
    public function getAddressLineAttribute(): string
    {
        $lines = array_filter([
            $this->address_line_1,
            $this->address_line_2,
            $this->address_line_3,
        ]);
        
        return implode(', ', $lines);
    }

    /**
     * Scope to get verified addresses
     */
    public function scopeVerified($query)
    {
        return $query->where('is_verified', true);
    }

    /**
     * Scope to get default addresses
     */
    public function scopeDefault($query)
    {
        return $query->where('is_default', true);
    }

    /**
     * Scope to get addresses by type
     */
    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Scope to get addresses by country
     */
    public function scopeByCountry($query, $countryCode)
    {
        return $query->where('country_code', $countryCode);
    }
}
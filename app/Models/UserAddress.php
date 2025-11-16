<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Models\User;
use App\Models\AdministrativeDivision;
use App\Models\Country;

class UserAddress extends Model
{
    use HasFactory, SoftDeletes;
    protected $fillable = [
        'user_id',
        'country_id',
        'province_id',
        'district_id',
        'ward_id',
        'full_name',
        'phone_number',
        'street_address',
        'postal_code',
        'latitude',
        'longitude',
        'is_default',
    ];
    protected $casts = [
        'is_default' => 'boolean',
    ];
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function country(): BelongsTo
    {
        return $this->belongsTo(Country::class);
    }

    public function province(): BelongsTo
    {
        return $this->belongsTo(AdministrativeDivision::class, 'province_id');
    }

    public function district(): BelongsTo
    {
        return $this->belongsTo(AdministrativeDivision::class, 'district_id');
    }

    public function ward(): BelongsTo
    {
        return $this->belongsTo(AdministrativeDivision::class, 'ward_id');
    }

    /**
     * Get the full address as a formatted string
     */
    public function getFullAddressAttribute(): string
    {
        $parts = [];

        if ($this->street_address) {
            $parts[] = $this->street_address;
        }

        if ($this->ward && $this->ward->name) {
            $parts[] = $this->ward->name['vi'] ?? $this->ward->name;
        }

        if ($this->district && $this->district->name) {
            $parts[] = $this->district->name['vi'] ?? $this->district->name;
        }

        if ($this->province && $this->province->name) {
            $parts[] = $this->province->name['vi'] ?? $this->province->name;
        }

        if ($this->country && $this->country->name) {
            $parts[] = $this->country->name['vi'] ?? $this->country->name;
        }

        return implode(', ', array_filter($parts));
    }
}
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * AdministrativeDivision Model
 * 
 * Manages hierarchical administrative divisions (provinces, districts, wards)
 * Supports nested geographical structures for address management
 */
class AdministrativeDivision extends Model
{
    use HasFactory;

    protected $table = 'administrative_divisions';

    protected $fillable = [
        'country_id',
        'parent_id',
        'name',
        'level',
        'code',
    ];

    protected $casts = [
        'name' => 'array', // Assuming multilingual support
        'level' => 'integer',
    ];

    /**
     * Get the country this division belongs to
     */
    public function country(): BelongsTo
    {
        return $this->belongsTo(Country::class);
    }

    /**
     * Get the parent division
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(AdministrativeDivision::class, 'parent_id');
    }

    /**
     * Get child divisions
     */
    public function children(): HasMany
    {
        return $this->hasMany(AdministrativeDivision::class, 'parent_id');
    }

    /**
     * Get user addresses in this division
     */
    public function userAddresses(): HasMany
    {
        return $this->hasMany(UserAddress::class, 'ward_id')
                    ->orWhere('district_id', $this->id)
                    ->orWhere('province_id', $this->id);
    }

    /**
     * Get hubs in this division
     */
    public function hubs(): HasMany
    {
        return $this->hasMany(Hub::class, 'ward_id');
    }

    /**
     * Scope to get divisions by level
     */
    public function scopeByLevel($query, $level)
    {
        return $query->where('level', $level);
    }

    /**
     * Scope to get provinces (level 1)
     */
    public function scopeProvinces($query)
    {
        return $query->where('level', 1);
    }

    /**
     * Scope to get districts (level 2)
     */
    public function scopeDistricts($query)
    {
        return $query->where('level', 2);
    }

    /**
     * Scope to get wards (level 3)
     */
    public function scopeWards($query)
    {
        return $query->where('level', 3);
    }

    /**
     * Get full hierarchical path
     */
    public function getFullPathAttribute()
    {
        $path = [];
        $current = $this;

        while ($current) {
            array_unshift($path, $current->name);
            $current = $current->parent;
        }

        return implode(' > ', $path);
    }
}
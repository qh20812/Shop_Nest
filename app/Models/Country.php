<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Country Model
 * 
 * Manages country information with ISO codes
 * Supports multilingual country names and administrative divisions
 */
class Country extends Model
{
    use HasFactory;

    protected $table = 'countries';

    protected $fillable = [
        'name',
        'iso_code_2',
        'division_structure',
    ];

    protected $casts = [
        'name' => 'array', // Assuming multilingual support
        'division_structure' => 'array', // Assuming division structure is stored as JSON
    ];

    /**
     * Get administrative divisions for this country
     */
    public function administrativeDivisions(): HasMany
    {
        return $this->hasMany(AdministrativeDivision::class);
    }

    /**
     * Get user addresses in this country
     */
    public function userAddresses(): HasMany
    {
        return $this->hasMany(UserAddress::class);
    }

    /**
     * Get provinces (level 1 divisions)
     */
    public function provinces()
    {
        return $this->administrativeDivisions()->where('level', 1);
    }

    /**
     * Scope to find by ISO code
     */
    public function scopeByIsoCode($query, $isoCode)
    {
        return $query->where('iso_code_2', strtoupper($isoCode));
    }

    /**
     * Get country name in specific language
     */
    public function getName($locale = 'en')
    {
        if (is_array($this->name) && isset($this->name[$locale])) {
            return $this->name[$locale];
        }

        return is_array($this->name) ? ($this->name['en'] ?? reset($this->name)) : $this->name;
    }
    public function getDivisionStructure()
    {
        return $this->division_structure ?? match ($this->iso_code_2) {
            'VN' => [
                'levels' => ['province', 'commune'],
                'labels' => ['vi' => ['Tỉnh', 'Xã/Phường'], 'en' => ['Province', 'Commune']]
            ],
            'US' => [
                'levels' => ['state', 'county', 'city'],
                'labels' => ['en' => ['State', 'County', 'City']]
            ],
            default => [
                'levels' => ['province', 'district', 'ward'],
                'labels' => ['en' => ['Province', 'District', 'Ward']]
            ],
        };
    }
}
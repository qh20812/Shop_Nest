<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\Role;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'username',
        'first_name',
        'last_name',
        'phone_number',
        'email',
        'is_active',
        'default_address_id',
        'password',
        'provider',
        'provider_id',
        'avatar',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
        ];
    }
    public function role(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'role_user');
    }
    public function products(): HasMany
    {
        return $this->hasMany(Product::class, 'seller_id');
    }
    public function addresses(): HasMany
    {
        return $this->hasMany(UserAddress::class);
    }
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class, 'customer_id', 'id');
    }
    public function isAdmin(): bool
    {
        return $this->role()->where('name->en', 'Admin')->exists();
    }
    public function roles():BelongsToMany
    {
        return $this->belongsToMany(Role::class);
    }

    /**
     * Get the shipper profile associated with the user.
     */
    public function shipperProfile(): HasOne
    {
        return $this->hasOne(ShipperProfile::class);
    }

    /**
     * Check if user has the Shipper role.
     */
    public function isShipper(): bool
    {
        return $this->role()->where('name->en', 'Shipper')->exists();
    }

    /**
     * Generate a unique username.
     * Note: Username can be updated later in ProfileController with uniqueness validation.
     */
    public static function generateUniqueUsername(): string
    {
        do {
            $username = 'user_' . \Illuminate\Support\Str::random(8);
            $exists = static::where('username', $username)->exists();
        } while ($exists);

        return $username;
    }

    /**
     * Get the user's full name.
     */
    public function getFullNameAttribute(): string
    {
        return trim($this->first_name . ' ' . $this->last_name) ?: $this->username;
    }

    /**
     * Get the user's avatar URL or generate a placeholder.
     */
    public function getAvatarUrlAttribute(): string
    {
        if ($this->avatar) {
            // If it's a Google avatar URL, return as is
            if (str_starts_with($this->avatar, 'http')) {
                return $this->avatar;
            }
            
            // If it's a local file path, return storage URL
            return asset('storage/' . $this->avatar);
        }

        // Generate avatar from first letter of name or username
        $name = $this->first_name ?: $this->username;
        $initial = strtoupper(substr($name, 0, 1));
        
        // Generate placeholder avatar URL using UI Avatars service
        return "https://ui-avatars.com/api/?name=" . urlencode($initial) . 
               "&color=fff&background=1976D2&size=100&rounded=true";
    }

    /**
     * Check if user is registered via Google.
     */
    public function isGoogleUser(): bool
    {
        return $this->provider === 'google';
    }

    /**
     * Get user's wishlist items.
     */
    public function wishlists(): HasMany
    {
        return $this->hasMany(Wishlist::class);
    }

    /**
     * Get user's reviews.
     */
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    /**
     * Check if user is a seller.
     */
    public function isSeller(): bool
    {
        return $this->role()->where('name->en', 'Seller')->exists();
    }

    /**
     * Check if user is a customer.
     */
    public function isCustomer(): bool
    {
        return $this->role()->where('name->en', 'Customer')->exists();
    }

    /**
     * Get user's default address.
     */
    public function defaultAddress(): BelongsTo
    {
        return $this->belongsTo(UserAddress::class, 'default_address_id');
    }
}

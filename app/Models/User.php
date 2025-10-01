<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\Role;
use App\Models\Order;
use App\Models\Wishlist;
use App\Models\Review;
use App\Models\UserAddress;
use App\Models\Product;
use App\Models\ShipperProfile;

class User extends Authenticatable
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
    public function addresses(): HasMany
    {
        return $this->hasMany(UserAddress::class, 'user_id');
    }
    public function role(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'role_user');
    }
    public function products(): HasMany
    {
        return $this->hasMany(Product::class, 'seller_id');
    }
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class, 'customer_id');
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

    // User có nhiều wishlist
    public function wishlists(): HasMany
    {
        return $this->hasMany(Wishlist::class, 'user_id');
    }

    // User có nhiều review
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class, 'user_id');
    }
}

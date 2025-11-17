<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\Role;
use App\Models\SellerPromotionParticipation;
use App\Models\SellerPromotionWallet;

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
        'gender',
        'date_of_birth',
        'shop_status',
        'approved_at',
        'suspended_until',
        'shop_settings',
        'rejection_reason',
        'suspension_reason',
        'shop_logo',
        'shop_description',
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
            'date_of_birth' => 'date',
            'approved_at' => 'datetime',
            'suspended_until' => 'datetime',
            'shop_settings' => 'array',
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
        return $this->roles()->where('name->en', 'Admin')->exists();
    }
    public function roles():BelongsToMany
    {
        return $this->belongsToMany(Role::class);
    }

    public function scopeSellers(Builder $query): Builder
    {
        return $query->whereHas('roles', fn (Builder $roleQuery) => $roleQuery->where('name->en', 'Seller'));
    }

    public function scopeActiveShops(Builder $query): Builder
    {
        return $query->sellers()->where('shop_status', 'active');
    }

    public function scopeShopStatus(Builder $query, string $status): Builder
    {
        return $query->where('shop_status', $status);
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
        return $this->roles()->where('name->en', 'Shipper')->exists();
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
        return $this->roles()->where('name->en', 'Seller')->exists();
    }

    /**
     * Check if user is a customer.
     */
    public function isCustomer(): bool
    {
        return $this->roles()->where('name->en', 'Customer')->exists();
    }

    /**
     * Get user's default address.
     */
    public function defaultAddress(): BelongsTo
    {
        return $this->belongsTo(UserAddress::class, 'default_address_id');
    }

    /**
     * Get shipper ratings given by customers
     */
    public function shipperRatings(): HasMany
    {
        return $this->hasMany(ShipperRating::class, 'shipper_id');
    }

    /**
     * Get ratings given by this user to shippers
     */
    public function givenShipperRatings(): HasMany
    {
        return $this->hasMany(ShipperRating::class, 'customer_id');
    }

    public function shopAuditLogs(): HasMany
    {
        return $this->hasMany(ShopAuditLog::class, 'shop_id');
    }

    public function managedShopAuditLogs(): HasMany
    {
        return $this->hasMany(ShopAuditLog::class, 'admin_id');
    }

    public function shopViolations(): HasMany
    {
        return $this->hasMany(ShopViolation::class, 'shop_id');
    }

    public function reportedShopViolations(): HasMany
    {
        return $this->hasMany(ShopViolation::class, 'reported_by');
    }

    /**
     * Get international addresses for this user
     */
    public function internationalAddresses()
    {
        return $this->morphMany(InternationalAddress::class, 'addressable');
    }

    /**
     * Get default wishlist
     */
    public function defaultWishlist()
    {
        return $this->wishlists()->where('is_default', true)->first();
    }

    /**
     * Get product questions asked by this user
     */
    public function productQuestions(): HasMany
    {
        return $this->hasMany(ProductQuestion::class);
    }

    /**
     * Get product answers provided by this user
     */
    public function productAnswers(): HasMany
    {
        return $this->hasMany(ProductAnswer::class);
    }

    /**
     * Get orders assigned to this shipper
     */
    public function assignedOrders(): HasMany
    {
        return $this->hasMany(Order::class, 'shipper_id');
    }

    /**
     * Get shipment journeys handled by this shipper
     */
    public function shipmentJourneys(): HasMany
    {
        return $this->hasMany(ShipmentJourney::class, 'shipper_id');
    }

    /**
     * Get shops owned by this user
     */
    public function ownedShops(): HasMany
    {
        return $this->hasMany(Shop::class, 'owner_id');
    }

    /**
     * Seller promotions created by this user
     */
    public function sellerPromotions(): HasMany
    {
        return $this->hasMany(Promotion::class, 'seller_id', 'id');
    }

    /**
     * Seller promotion wallet for this user
     */
    public function promotionWallet(): HasOne
    {
        return $this->hasOne(SellerPromotionWallet::class, 'seller_id', 'id');
    }

    /**
     * Platform promotion participations
     */
    public function promotionParticipations(): HasMany
    {
        return $this->hasMany(SellerPromotionParticipation::class, 'seller_id', 'id');
    }

    /**
     * Get user's notifications
     */
    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class, 'user_id', 'id');
    }

    /**
     * Get user's primary role name (lowercase)
     */
    public function getRoleNameAttribute(): ?string
    {
        $role = $this->role()->first();
        if (!$role) {
            return null;
        }
        
        $roleName = $role->name['en'] ?? null;
        return $roleName ? strtolower($roleName) : null;
    }

    /**
     * Get average shipper rating
     */
    public function getAverageShipperRatingAttribute()
    {
        return $this->shipperRatings()->avg('rating');
    }

    public function getShopStatusBadgeAttribute(): string
    {
        return match ($this->shop_status) {
            'pending' => 'warning',
            'active' => 'success',
            'suspended' => 'danger',
            'rejected' => 'secondary',
            default => 'secondary',
        };
    }

    /**
     * Set the phone number attribute, normalizing it.
     */
    public function setPhoneNumberAttribute($value)
    {
        if ($value) {
            // Remove all spaces
            $value = str_replace(' ', '', $value);
            // If starts with 0, replace with +84 (assuming Vietnam)
            if (str_starts_with($value, '0')) {
                $value = '+84' . substr($value, 1);
            }
            // Ensure it starts with +
            if (!str_starts_with($value, '+')) {
                $value = '+' . $value;
            }
        }
        $this->attributes['phone_number'] = $value;
    }

    /**
     * Determine if the user has verified their email address.
     * Only check if user has an email address.
     */
    public function hasVerifiedEmail(): bool
    {
        return $this->email && !is_null($this->email_verified_at);
    }

    /**
     * Mark the given user's email as verified.
     * Only mark if user has an email address.
     */
    public function markEmailAsVerified(): bool
    {
        if ($this->email) {
            return $this->forceFill([
                'email_verified_at' => $this->freshTimestamp(),
            ])->save();
        }
        return true; // Consider verified if no email
    }

    /**
     * Send the email verification notification.
     * Only send if user has an email address.
     */
    public function sendEmailVerificationNotification(): void
    {
        if ($this->email) {
            parent::sendEmailVerificationNotification();
        }
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CustomerSegment extends Model
{
    use HasFactory;

    protected $primaryKey = 'segment_id';

    protected $fillable = [
        'name',
        'description',
        'rules',
        'customer_count',
        'is_active',
    ];

    protected $casts = [
        'rules' => 'array',
        'customer_count' => 'integer',
        'is_active' => 'boolean',
    ];

    /**
     * Get the customers in this segment
     */
    public function memberships(): HasMany
    {
        return $this->hasMany(CustomerSegmentMembership::class, 'segment_id');
    }

    /**
     * Get the customers in this segment
     */
    public function customers()
    {
        return $this->belongsToMany(User::class, 'customer_segment_membership', 'segment_id', 'customer_id')
            ->withPivot('joined_at')
            ->withTimestamps();
    }

    /**
     * Scope for active segments
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for segments with customers
     */
    public function scopeWithCustomers($query)
    {
        return $query->where('customer_count', '>', 0);
    }

    /**
     * Get segment rules as array
     */
    public function getRules(): array
    {
        return $this->rules ?? [];
    }

    /**
     * Update customer count
     */
    public function updateCustomerCount(): bool
    {
        $this->customer_count = $this->memberships()->count();
        return $this->save();
    }

    /**
     * Check if segment has rules
     */
    public function hasRules(): bool
    {
        return !empty($this->rules);
    }

    /**
     * Get segment size category
     */
    public function getSizeCategoryAttribute(): string
    {
        if ($this->customer_count >= 1000) {
            return 'large';
        }

        if ($this->customer_count >= 100) {
            return 'medium';
        }

        if ($this->customer_count >= 10) {
            return 'small';
        }

        return 'tiny';
    }

    /**
     * Add customer to segment
     */
    public function addCustomer(User $customer): CustomerSegmentMembership
    {
        return $this->memberships()->create([
            'customer_id' => $customer->id,
            'joined_at' => now(),
        ]);
    }

    /**
     * Remove customer from segment
     */
    public function removeCustomer(User $customer): bool
    {
        return $this->memberships()->where('customer_id', $customer->id)->delete() > 0;
    }

    /**
     * Check if customer is in segment
     */
    public function hasCustomer(User $customer): bool
    {
        return $this->memberships()->where('customer_id', $customer->id)->exists();
    }
}
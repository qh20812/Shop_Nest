<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CustomerSegmentMembership extends Model
{
    use HasFactory;

    protected $primaryKey = 'membership_id';

    public $timestamps = false;

    protected $fillable = [
        'segment_id',
        'customer_id',
        'joined_at',
    ];

    protected $casts = [
        'joined_at' => 'datetime',
    ];

    /**
     * Get the segment this membership belongs to
     */
    public function segment(): BelongsTo
    {
        return $this->belongsTo(CustomerSegment::class, 'segment_id');
    }

    /**
     * Get the customer this membership belongs to
     */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    /**
     * Scope for memberships by segment
     */
    public function scopeForSegment($query, int $segmentId)
    {
        return $query->where('segment_id', $segmentId);
    }

    /**
     * Scope for memberships by customer
     */
    public function scopeForCustomer($query, int $customerId)
    {
        return $query->where('customer_id', $customerId);
    }

    /**
     * Scope for recent memberships
     */
    public function scopeRecent($query, int $days = 30)
    {
        return $query->where('joined_at', '>=', now()->subDays($days));
    }

    /**
     * Get membership duration in days
     */
    public function getMembershipDurationAttribute(): int
    {
        return $this->joined_at->diffInDays(now());
    }

    /**
     * Check if membership is recent (joined within last 7 days)
     */
    public function isRecent(): bool
    {
        return $this->joined_at->diffInDays(now()) <= 7;
    }

    /**
     * Check if membership is old (joined more than 90 days ago)
     */
    public function isOld(): bool
    {
        return $this->joined_at->diffInDays(now()) > 90;
    }
}
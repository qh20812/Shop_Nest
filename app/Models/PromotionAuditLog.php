<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PromotionAuditLog extends Model
{
    use HasFactory;

    protected $primaryKey = 'audit_id';

    public $timestamps = false;

    protected $fillable = [
        'promotion_id',
        'user_id',
        'action',
        'old_values',
        'new_values',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'old_values' => 'array',
        'new_values' => 'array',
        'created_at' => 'datetime',
    ];

    /**
     * Get the promotion this audit log belongs to
     */
    public function promotion(): BelongsTo
    {
        return $this->belongsTo(Promotion::class, 'promotion_id');
    }

    /**
     * Get the user who performed this action
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Scope for logs by action type
     */
    public function scopeByAction($query, string $action)
    {
        return $query->where('action', $action);
    }

    /**
     * Scope for logs by promotion
     */
    public function scopeForPromotion($query, int $promotionId)
    {
        return $query->where('promotion_id', $promotionId);
    }

    /**
     * Scope for logs by user
     */
    public function scopeByUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope for recent logs
     */
    public function scopeRecent($query, int $days = 30)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }

    /**
     * Get the old values as array
     */
    public function getOldValues(): array
    {
        return $this->old_values ?? [];
    }

    /**
     * Get the new values as array
     */
    public function getNewValues(): array
    {
        return $this->new_values ?? [];
    }

    /**
     * Check if this is a creation action
     */
    public function isCreated(): bool
    {
        return $this->action === 'created';
    }

    /**
     * Check if this is an update action
     */
    public function isUpdated(): bool
    {
        return $this->action === 'updated';
    }

    /**
     * Check if this is a deletion action
     */
    public function isDeleted(): bool
    {
        return $this->action === 'deleted';
    }

    /**
     * Check if this is an activation action
     */
    public function isActivated(): bool
    {
        return $this->action === 'activated';
    }

    /**
     * Check if this is a deactivation action
     */
    public function isDeactivated(): bool
    {
        return $this->action === 'deactivated';
    }

    /**
     * Check if this is an application action
     */
    public function isApplied(): bool
    {
        return $this->action === 'applied';
    }
}
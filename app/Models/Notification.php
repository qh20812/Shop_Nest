<?php

namespace App\Models;

use App\Enums\NotificationType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Notification extends Model
{
    use HasFactory;

    protected $primaryKey = 'notification_id';

    protected $fillable = [
        'user_id',
        'title',
        'content',
        'type',
        'is_read',
        'notifiable_type',
        'notifiable_id',
        'action_url',
        'read_at',
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'read_at' => 'datetime',
        'type' => NotificationType::class,
    ];

    /**
     * Relationship with User
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Polymorphic relationship with notifiable entity
     */
    public function notifiable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Scope for unread notifications
     */
    public function scopeUnread($query)
    {
        return $query->where('is_read', false);
    }

    /**
     * Scope for read notifications
     */
    public function scopeRead($query)
    {
        return $query->where('is_read', true);
    }

    /**
     * Scope for specific type
     */
    public function scopeOfType($query, NotificationType $type)
    {
        return $query->where('type', $type->value);
    }

    /**
     * Scope for notifications relevant to a specific role
     */
    public function scopeForRole($query, string $role)
    {
        $allowedTypes = NotificationType::forRole($role);
        $typeValues = array_map(fn($type) => $type->value, $allowedTypes);

        return $query->whereIn('type', $typeValues);
    }

    /**
     * Mark notification as read
     */
    public function markAsRead(): bool
    {
        if ($this->is_read) {
            return true;
        }

        return $this->update([
            'is_read' => true,
            'read_at' => now(),
        ]);
    }

    /**
     * Mark notification as unread
     */
    public function markAsUnread(): bool
    {
        return $this->update([
            'is_read' => false,
            'read_at' => null,
        ]);
    }

    /**
     * Get notification type label
     */
    public function getTypeLabelAttribute(): string
    {
        return $this->type->label();
    }

    /**
     * Get notification type description
     */
    public function getTypeDescriptionAttribute(): string
    {
        return $this->type->description();
    }
}
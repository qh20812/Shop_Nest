<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WalletTopup extends Model
{
    use HasFactory;

    public const STATUS_PENDING = 'pending';

    public const STATUS_TRANSFERRED = 'transferred';

    public const STATUS_APPROVED = 'approved';

    public const STATUS_REJECTED = 'rejected';

    public const STATUS_EXPIRED = 'expired';

    /**
     * Statuses that still block creating another top-up request.
     *
     * @var list<string>
     */
    public const ACTIVE_STATUSES = [self::STATUS_PENDING, self::STATUS_TRANSFERRED];

    protected $primaryKey = 'topup_id';

    protected $fillable = [
        'user_id',
        'wallet_id',
        'code',
        'amount_declared',
        'amount_received',
        'status',
        'transferred_at',
        'approved_by',
        'approved_at',
        'reject_reason',
        'expires_at',
        'metadata',
    ];

    protected $casts = [
        'amount_declared' => 'decimal:2',
        'amount_received' => 'decimal:2',
        'transferred_at' => 'datetime',
        'approved_at' => 'datetime',
        'expires_at' => 'datetime',
        'metadata' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function wallet(): BelongsTo
    {
        return $this->belongsTo(Wallet::class, 'wallet_id', 'wallet_id');
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function isPending(): bool
    {
        return $this->status === self::STATUS_PENDING;
    }

    public function isAwaitingReview(): bool
    {
        return in_array($this->status, self::ACTIVE_STATUSES, true);
    }

    public function isExpired(): bool
    {
        return $this->status === self::STATUS_EXPIRED
            || ($this->expires_at !== null && $this->expires_at->isPast());
    }
}

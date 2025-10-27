<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AnalyticsReport extends Model
{
    protected $fillable = [
        'title',
        'type',
        'period_type',
        'start_date',
        'end_date',
        'parameters',
        'result_data',
        'file_path',
        'status',
        'created_by',
    ];

    protected $casts = [
        'parameters' => 'array',
        'result_data' => 'array',
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    // Status constants
    const STATUS_PENDING = 'pending';
    const STATUS_COMPLETED = 'completed';
    const STATUS_FAILED = 'failed';

    // Type constants
    const TYPE_REVENUE = 'revenue';
    const TYPE_ORDERS = 'orders';
    const TYPE_PRODUCTS = 'products';
    const TYPE_USERS = 'users';
    const TYPE_CUSTOM = 'custom';

    // Period type constants
    const PERIOD_DAILY = 'daily';
    const PERIOD_WEEKLY = 'weekly';
    const PERIOD_MONTHLY = 'monthly';
    const PERIOD_YEARLY = 'yearly';
    const PERIOD_CUSTOM = 'custom';

    /**
     * Get the user who created this report.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Check if report is completed.
     */
    public function isCompleted(): bool
    {
        return $this->status === self::STATUS_COMPLETED;
    }

    /**
     * Check if report has failed.
     */
    public function hasFailed(): bool
    {
        return $this->status === self::STATUS_FAILED;
    }
}

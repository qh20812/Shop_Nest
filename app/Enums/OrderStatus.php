<?php

namespace App\Enums;

enum OrderStatus: string
{
    case PENDING_CONFIRMATION = 'pending_confirmation';
    case PROCESSING = 'processing';
    case PENDING_ASSIGNMENT = 'pending_assignment';
    case ASSIGNED_TO_SHIPPER = 'assigned_to_shipper';
    case DELIVERING = 'delivering';
    case DELIVERED = 'delivered';
    case COMPLETED = 'completed';
    case CANCELLED = 'cancelled';
    case RETURNED = 'returned';

    /**
     * Get the display name for the status
     */
    public function getDisplayName(): string
    {
        return match($this) {
            self::PENDING_CONFIRMATION => 'Pending Confirmation',
            self::PROCESSING => 'Processing',
            self::PENDING_ASSIGNMENT => 'Pending Assignment',
            self::ASSIGNED_TO_SHIPPER => 'Assigned to Shipper',
            self::DELIVERING => 'Delivering',
            self::DELIVERED => 'Delivered',
            self::COMPLETED => 'Completed',
            self::CANCELLED => 'Cancelled',
            self::RETURNED => 'Returned',
        };
    }

    /**
     * Get CSS class for the status
     */
    public function getCssClass(): string
    {
        return match($this) {
            self::PENDING_CONFIRMATION => 'status pending',
            self::PROCESSING => 'status process',
            self::PENDING_ASSIGNMENT => 'status process',
            self::ASSIGNED_TO_SHIPPER => 'status process',
            self::DELIVERING => 'status process',
            self::DELIVERED => 'status completed',
            self::COMPLETED => 'status completed',
            self::CANCELLED => 'status pending',
            self::RETURNED => 'status pending',
        };
    }

    /**
     * Get all enum values as array
     */
    public static function values(): array
    {
        return array_map(fn($case) => $case->value, self::cases());
    }

    /**
     * Get all enum cases with display names as key-value pairs
     */
    public static function options(): array
    {
        $options = [];
        foreach (self::cases() as $case) {
            $options[$case->value] = $case->getDisplayName();
        }
        return $options;
    }
}
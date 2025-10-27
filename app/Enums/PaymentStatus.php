<?php

namespace App\Enums;

enum PaymentStatus: string
{
    case UNPAID = 'unpaid';
    case PAID = 'paid';
    case FAILED = 'failed';
    case REFUNDED = 'refunded';

    /**
     * Get the display name for the payment status
     */
    public function getDisplayName(): string
    {
        return match($this) {
            self::UNPAID => 'Unpaid',
            self::PAID => 'Paid',
            self::FAILED => 'Failed',
            self::REFUNDED => 'Refunded',
        };
    }

    /**
     * Get CSS class for the payment status
     */
    public function getCssClass(): string
    {
        return match($this) {
            self::UNPAID => 'status pending',
            self::PAID => 'status completed',
            self::FAILED => 'status pending',
            self::REFUNDED => 'status process',
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
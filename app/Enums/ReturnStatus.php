<?php

namespace App\Enums;

enum ReturnStatus: string
{
    case PENDING = 'pending';
    case APPROVED = 'approved';
    case REJECTED = 'rejected';
    case REFUNDED = 'refunded';
    case EXCHANGED = 'exchanged';
    case CANCELLED = 'cancelled';

    /**
     * Get the display name for each status
     */
    public function getDisplayName(): string
    {
        return match($this) {
            self::PENDING => 'Pending',
            self::APPROVED => 'Approved',
            self::REJECTED => 'Rejected',
            self::REFUNDED => 'Refunded',
            self::EXCHANGED => 'Exchanged', 
            self::CANCELLED => 'Cancelled',
        };
    }

    /**
     * Get the Vietnamese display name for each status
     */
    public function getDisplayNameVi(): string
    {
        return match($this) {
            self::PENDING => 'Đang chờ xử lý',
            self::APPROVED => 'Đã chấp nhận',
            self::REJECTED => 'Đã từ chối',
            self::REFUNDED => 'Đã hoàn tiền',
            self::EXCHANGED => 'Đã đổi hàng',
            self::CANCELLED => 'Đã hủy',
        };
    }

    /**
     * Get CSS class for status styling
     */
    public function getCssClass(): string
    {
        return match($this) {
            self::PENDING => 'status pending',
            self::APPROVED => 'status completed',
            self::REJECTED => 'status cancelled',
            self::REFUNDED => 'status completed',
            self::EXCHANGED => 'status process',
            self::CANCELLED => 'status cancelled',
        };
    }

    /**
     * Get all status options for forms
     */
    public static function options(): array
    {
        return collect(self::cases())->mapWithKeys(function (self $status) {
            return [$status->value => $status->getDisplayName()];
        })->toArray();
    }

    /**
     * Get all status values
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Create from legacy integer value
     */
    public static function fromLegacyInt(int $value): self
    {
        return match($value) {
            1 => self::PENDING,
            2 => self::APPROVED,
            3 => self::REJECTED,
            4 => self::REFUNDED,
            5 => self::EXCHANGED,
            6 => self::CANCELLED,
            default => self::PENDING,
        };
    }
}
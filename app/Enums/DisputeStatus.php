<?php

namespace App\Enums;

enum DisputeStatus: string
{
    case OPEN = 'open';
    case UNDER_REVIEW = 'under_review';
    case RESOLVED = 'resolved';
    case CLOSED = 'closed';

    /**
     * Get the display name for each status
     */
    public function getDisplayName(): string
    {
        return match($this) {
            self::OPEN => 'Open',
            self::UNDER_REVIEW => 'Under Review',
            self::RESOLVED => 'Resolved',
            self::CLOSED => 'Closed',
        };
    }

    /**
     * Get the Vietnamese display name for each status
     */
    public function getDisplayNameVi(): string
    {
        return match($this) {
            self::OPEN => 'Mở',
            self::UNDER_REVIEW => 'Đang xem xét',
            self::RESOLVED => 'Đã giải quyết',
            self::CLOSED => 'Đã đóng',
        };
    }

    /**
     * Get CSS class for status styling
     */
    public function getCssClass(): string
    {
        return match($this) {
            self::OPEN => 'status pending',
            self::UNDER_REVIEW => 'status process',
            self::RESOLVED => 'status completed',
            self::CLOSED => 'status cancelled',
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
            1 => self::OPEN,
            2 => self::UNDER_REVIEW,
            3 => self::RESOLVED,
            4 => self::CLOSED,
            default => self::OPEN,
        };
    }
}
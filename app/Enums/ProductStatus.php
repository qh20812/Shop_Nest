<?php

namespace App\Enums;

enum ProductStatus: string
{
    case DRAFT = 'draft';
    case PENDING_APPROVAL = 'pending_approval';
    case PUBLISHED = 'published';
    case HIDDEN = 'hidden';

    /**
     * Get the display name for each status
     */
    public function getDisplayName(): string
    {
        return match($this) {
            self::DRAFT => 'Draft',
            self::PENDING_APPROVAL => 'Pending Approval',
            self::PUBLISHED => 'Published',
            self::HIDDEN => 'Hidden',
        };
    }

    /**
     * Get the Vietnamese display name for each status
     */
    public function getDisplayNameVi(): string
    {
        return match($this) {
            self::DRAFT => 'Nháp',
            self::PENDING_APPROVAL => 'Chờ duyệt',
            self::PUBLISHED => 'Đã xuất bản',
            self::HIDDEN => 'Ẩn',
        };
    }

    /**
     * Get CSS class for status styling
     */
    public function getCssClass(): string
    {
        return match($this) {
            self::DRAFT => 'status pending',
            self::PENDING_APPROVAL => 'status process',
            self::PUBLISHED => 'status completed',
            self::HIDDEN => 'status cancelled',
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
            1 => self::DRAFT,
            2 => self::PENDING_APPROVAL,
            3 => self::PUBLISHED,
            4 => self::HIDDEN,
            default => self::DRAFT,
        };
    }
}
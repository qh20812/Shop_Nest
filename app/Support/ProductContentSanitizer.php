<?php

namespace App\Support;

use Illuminate\Support\Str;

/**
 * Centralised sanitisation for seller supplied product text.
 *
 * Product names and descriptions are plain text rendered by React, so the goal
 * is only to strip markup and script protocols. Business words such as
 * "create", "drop" or "update" must never be removed from the content.
 */
final class ProductContentSanitizer
{
    /**
     * Patterns that must never survive sanitisation.
     *
     * @var array<int, string>
     */
    private const SUSPICIOUS_PATTERNS = [
        '/<script\b/i',
        '/<iframe\b/i',
        '/<object\b/i',
        '/<embed\b/i',
        '/javascript\s*:/i',
        '/vbscript\s*:/i',
        '/data\s*:\s*text\/html/i',
    ];

    public static function sanitize(?string $value): ?string
    {
        if ($value === null) {
            return null;
        }

        $value = trim(strip_tags($value));

        $value = preg_replace('#<\s*script\b[^>]*>.*?<\s*/\s*script\s*>#is', '', $value) ?? $value;
        $value = preg_replace('/javascript\s*:/i', '', $value) ?? $value;
        $value = preg_replace('/vbscript\s*:/i', '', $value) ?? $value;
        $value = preg_replace('/data\s*:\s*text\/html/i', '', $value) ?? $value;

        return trim($value);
    }

    public static function isSuspicious(?string $value): bool
    {
        if ($value === null || $value === '') {
            return false;
        }

        foreach (self::SUSPICIOUS_PATTERNS as $pattern) {
            if (preg_match($pattern, $value) === 1) {
                return true;
            }
        }

        return false;
    }

    public static function normalizeSku(?string $sku): ?string
    {
        if ($sku === null) {
            return null;
        }

        $sku = Str::upper(trim($sku));

        return $sku === '' ? null : $sku;
    }
}

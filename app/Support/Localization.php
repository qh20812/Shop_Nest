<?php

namespace App\Support;

use Illuminate\Contracts\Support\Arrayable;
use JsonSerializable;

class Localization
{
    /**
     * Resolve a localized string value from various data structures.
     */
    public static function resolveField(mixed $value, string $locale, ?string $fallback = ''): string
    {
        $normalized = self::normalizeValue($value);

        if (is_string($normalized) || is_numeric($normalized)) {
            return trim((string) $normalized);
        }

        if (is_array($normalized)) {
            $candidates = self::buildLocaleCandidates($locale);

            foreach ($candidates as $candidate) {
                if (array_key_exists($candidate, $normalized)) {
                    $resolved = self::resolveField($normalized[$candidate], $locale, $fallback);
                    if ($resolved !== '') {
                        return $resolved;
                    }
                }
            }

            foreach ($normalized as $item) {
                $resolved = self::resolveField($item, $locale, $fallback);
                if ($resolved !== '') {
                    return $resolved;
                }
            }
        }

        return $fallback ?? '';
    }

    /**
     * Resolve a localized numeric value from various data structures.
     */
    public static function resolveNumber(mixed $value, ?string $locale = null, float $fallback = 0.0): float
    {
        $normalized = self::normalizeValue($value);

        if (is_numeric($normalized)) {
            return (float) $normalized;
        }

        if (is_string($normalized)) {
            $parsed = self::parseNumericString($normalized);
            if ($parsed !== null) {
                return $parsed;
            }
        }

        if (is_array($normalized)) {
            $candidates = self::buildLocaleCandidates($locale ?? '');

            foreach ($candidates as $candidate) {
                if (array_key_exists($candidate, $normalized)) {
                    $resolved = self::resolveNumber($normalized[$candidate], $locale, $fallback);
                    if ($resolved !== 0.0) {
                        return $resolved;
                    }
                }
            }

            foreach ($normalized as $item) {
                $resolved = self::resolveNumber($item, $locale, $fallback);
                if ($resolved !== 0.0) {
                    return $resolved;
                }
            }
        }

        return $fallback;
    }

    private static function normalizeValue(mixed $value): mixed
    {
        if ($value instanceof Arrayable) {
            return $value->toArray();
        }

        if ($value instanceof JsonSerializable) {
            return $value->jsonSerialize();
        }

        return $value;
    }

    /**
     * Build preferred locale candidate keys.
     */
    private static function buildLocaleCandidates(string $locale): array
    {
        $candidates = [];

        if ($locale !== '') {
            $candidates[] = $locale;
            if (str_contains($locale, '-')) {
                $candidates[] = strtok($locale, '-');
            }
        }

        $candidates[] = 'vi-VN';
        $candidates[] = 'vi';
        $candidates[] = 'en-US';
        $candidates[] = 'en';

        return array_values(array_unique(array_filter($candidates)));
    }

    private static function parseNumericString(string $value): ?float
    {
        $trimmed = trim($value);

        if ($trimmed === '') {
            return null;
        }

        $sanitized = preg_replace('/[^0-9,.-]/', '', $trimmed);

        if ($sanitized === '' || $sanitized === '-' || $sanitized === null) {
            return null;
        }

        $commaCount = substr_count($sanitized, ',');
        $dotCount = substr_count($sanitized, '.');
        $normalized = $sanitized;

        if ($commaCount > 0 && $dotCount > 0) {
            $lastComma = strrpos($sanitized, ',');
            $lastDot = strrpos($sanitized, '.');

            if ($lastComma !== false && $lastDot !== false) {
                if ($lastComma > $lastDot) {
                    $normalized = str_replace(['.', ','], ['', '.'], $sanitized);
                } else {
                    $normalized = str_replace(',', '', $sanitized);
                }
            }
        } elseif ($dotCount > 1 && $commaCount === 0) {
            $normalized = str_replace('.', '', $sanitized);
        } elseif ($commaCount > 1 && $dotCount === 0) {
            $normalized = str_replace(',', '', $sanitized);
        } elseif ($dotCount === 1 && $commaCount === 0) {
            $parts = explode('.', $sanitized, 2);
            $fractionLength = strlen($parts[1] ?? '');
            $normalized = $fractionLength === 3 ? str_replace('.', '', $sanitized) : $sanitized;
        } elseif ($commaCount === 1 && $dotCount === 0) {
            $parts = explode(',', $sanitized, 2);
            $fractionLength = strlen($parts[1] ?? '');
            $normalized = $fractionLength === 3
                ? str_replace(',', '', $sanitized)
                : str_replace(',', '.', $sanitized);
        }

        return is_numeric($normalized) ? (float) $normalized : null;
    }
}

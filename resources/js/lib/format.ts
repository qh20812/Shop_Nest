const VI_LOCALE = 'vi-VN';

const numberFormatter = new Intl.NumberFormat(VI_LOCALE, {
    maximumFractionDigits: 0,
});

const decimalFormatter = new Intl.NumberFormat(VI_LOCALE, {
    maximumFractionDigits: 1,
});

const dateFormatter = new Intl.DateTimeFormat(VI_LOCALE, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
});

const timeFormatter = new Intl.DateTimeFormat(VI_LOCALE, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
});

type DateInput = Date | string | number | null | undefined;
type NumberInput = number | null | undefined;

function toFiniteNumber(value: NumberInput): number | null {
    if (value == null || typeof value !== 'number' || !Number.isFinite(value)) {
        return null;
    }

    return value;
}

function toDate(value: DateInput): Date | null {
    if (value == null || value === '') {
        return null;
    }

    if (value instanceof Date) {
        return Number.isNaN(value.getTime()) ? null : value;
    }

    if (typeof value === 'string') {
        const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

        if (dateOnly) {
            const [, year, month, day] = dateOnly;
            const parsed = new Date(Number(year), Number(month) - 1, Number(day));

            return Number.isNaN(parsed.getTime()) ? null : parsed;
        }
    }

    const parsed = new Date(value);

    return Number.isNaN(parsed.getTime()) ? null : parsed;
}

/**
 * Format a number with Vietnamese grouping, e.g. 14990000 -> "14.990.000".
 */
export function formatNumber(value: NumberInput, options?: Intl.NumberFormatOptions): string {
    const numericValue = toFiniteNumber(value);

    if (numericValue === null) {
        return '0';
    }

    if (options) {
        return new Intl.NumberFormat(VI_LOCALE, options).format(numericValue);
    }

    return numberFormatter.format(numericValue);
}

/**
 * Format a Vietnamese đồng amount, e.g. 14990000 -> "14.990.000 ₫".
 */
export function formatVnd(value: NumberInput): string {
    const numericValue = toFiniteNumber(value);

    if (numericValue === null) {
        return '0 ₫';
    }

    return `${numberFormatter.format(numericValue)} ₫`;
}

/**
 * Format a date as dd/MM/yyyy, e.g. "12/11/2026".
 */
export function formatDate(value: DateInput): string {
    const date = toDate(value);

    return date ? dateFormatter.format(date) : '';
}

/**
 * Format a date and 24-hour time, e.g. "12/11/2026 · 14:30".
 */
export function formatDateTime(value: DateInput): string {
    const date = toDate(value);

    if (!date) {
        return '';
    }

    return `${dateFormatter.format(date)} · ${timeFormatter.format(date)}`;
}

/**
 * Normalise an order code to the ShopNest form, e.g. "SN-24817" -> "#SN-24817".
 */
export function formatOrderCode(value: string | number | null | undefined): string {
    if (value == null) {
        return '';
    }

    const code = String(value).trim();

    if (!code) {
        return '';
    }

    return code.startsWith('#') ? code : `#${code}`;
}

/**
 * Format a one-decimal Vietnamese number, e.g. 4.8 -> "4,8".
 */
export function formatDecimal(value: NumberInput): string {
    const numericValue = toFiniteNumber(value);

    return numericValue === null ? '0' : decimalFormatter.format(numericValue);
}

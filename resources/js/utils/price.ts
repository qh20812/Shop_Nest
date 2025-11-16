export type PriceLike = number | string | Record<string, unknown> | null | undefined;

const intl = typeof Intl !== 'undefined' ? Intl : undefined;

/**
 * Normalize various price representations to a finite number.
 */
export const toNumericPrice = (value: PriceLike): number => {
  if (value == null) {
    return 0;
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '') {
      return 0;
    }

    const sanitized = trimmed.replace(/[^0-9,.-]/g, '');
    const commaCount = (sanitized.match(/,/g) ?? []).length;
    const dotCount = (sanitized.match(/\./g) ?? []).length;

    let normalized = sanitized;

    if (commaCount > 0 && dotCount > 0) {
      const lastComma = sanitized.lastIndexOf(',');
      const lastDot = sanitized.lastIndexOf('.');

      if (lastComma > lastDot) {
        normalized = sanitized.replace(/\./g, '').replace(',', '.');
      } else {
        normalized = sanitized.replace(/,/g, '');
      }
    } else if (dotCount > 1 && commaCount === 0) {
      normalized = sanitized.replace(/\./g, '');
    } else if (commaCount > 1 && dotCount === 0) {
      normalized = sanitized.replace(/,/g, '');
    } else if (dotCount === 1 && commaCount === 0) {
      const [, fraction = ''] = sanitized.split('.');
      normalized = fraction.length === 3 ? sanitized.replace(/\./g, '') : sanitized;
    } else if (commaCount === 1 && dotCount === 0) {
      const [, fraction = ''] = sanitized.split(',');
      normalized = fraction.length === 3
        ? sanitized.replace(/,/g, '')
        : sanitized.replace(',', '.');
    }

    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  if (typeof value === 'object') {
    const record = value as Record<string, unknown>;
    const localeHints = new Set<string>();

    if (typeof window !== 'undefined') {
      const current = window.navigator?.language;
      if (current) {
        localeHints.add(current);
        if (current.includes('-')) {
          localeHints.add(current.split('-')[0]);
        }
      }
    }

    localeHints.add('vi-VN');
    localeHints.add('vi');
    localeHints.add('en-US');
    localeHints.add('en');

    for (const key of localeHints) {
      if (key in record) {
        const resolved = toNumericPrice(record[key] as PriceLike);
        if (resolved !== 0) {
          return resolved;
        }
      }
    }

    for (const entry of Object.values(record)) {
      const resolved = toNumericPrice(entry as PriceLike);
      if (resolved !== 0) {
        return resolved;
      }
    }
  }

  return 0;
};

/**
 * Format a price in VND with a trailing "đ" symbol.
 */
export const formatVnd = (value: PriceLike, locale = 'vi-VN'): string => {
  const amount = toNumericPrice(value);
  const formatter = intl ? new intl.NumberFormat(locale) : null;
  const formatted = formatter ? formatter.format(amount) : amount.toFixed(0);

  return `${formatted} đ`;
};

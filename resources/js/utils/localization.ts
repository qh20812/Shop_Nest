export type LocalizedValue = string | number | Record<string, unknown> | Array<unknown> | null | undefined;

const buildLocaleHints = (locale: string): string[] => {
  const hints = new Set<string>();

  if (locale) {
    hints.add(locale);
    if (locale.includes('-')) {
      hints.add(locale.split('-')[0]);
    }
  }

  if (typeof window !== 'undefined') {
    const browserLocale = window.navigator?.language ?? '';
    if (browserLocale) {
      hints.add(browserLocale);
      if (browserLocale.includes('-')) {
        hints.add(browserLocale.split('-')[0]);
      }
    }
  }

  hints.add('vi-VN');
  hints.add('vi');
  hints.add('en-US');
  hints.add('en');

  return Array.from(hints);
};

/**
 * Resolve a localized string by looking up locale-specific keys and falling back to the first primitive.
 */
export const resolveLocalizedString = (value: LocalizedValue, locale = 'vi'): string => {
  if (value == null) {
    return '';
  }

  if (typeof value === 'string' || typeof value === 'number') {
    return String(value).trim();
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const resolved = resolveLocalizedString(item as LocalizedValue, locale);
      if (resolved) {
        return resolved;
      }
    }
    return '';
  }

  if (typeof value === 'object') {
    const record = value as Record<string, unknown>;
    const hints = buildLocaleHints(locale);

    for (const key of hints) {
      if (key in record) {
        const resolved = resolveLocalizedString(record[key] as LocalizedValue, locale);
        if (resolved) {
          return resolved;
        }
      }
    }

    for (const entry of Object.values(record)) {
      const resolved = resolveLocalizedString(entry as LocalizedValue, locale);
      if (resolved) {
        return resolved;
      }
    }
  }

  return '';
};

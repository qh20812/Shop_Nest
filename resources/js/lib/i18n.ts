import { usePage } from '@inertiajs/react';

interface PageProps {
  translations: Record<string, unknown>;
  locale: string;
  [key: string]: unknown;
}

export function useTranslation() {
  const { props } = usePage<PageProps>();
  const { translations = {}, locale = 'vi' } = props;

  const t = (key: string): string => {
    if (!key) return '';

    // Direct flat-key lookup
    const flat = translations[key as keyof typeof translations];
    if (typeof flat === 'string') return flat;

    // Dot-notation traversal for nested objects
    const parts = key.split('.');
    let cur: unknown = translations;
    for (const p of parts) {
      if (cur && typeof cur === 'object' && Object.prototype.hasOwnProperty.call(cur as Record<string, unknown>, p)) {
        cur = (cur as Record<string, unknown>)[p];
      } else {
        return key;
      }
    }
    return typeof cur === 'string' ? cur : key;
  };

  return { t, locale, translations };
}

export default useTranslation;

/**
 * Non-hook translation helper that reads translations from the global Inertia page props.
 * Useful for class components or places where hooks can't be used.
 */
export function tGlobal(key: string): string {
  try {
    // Inertia packs page props to window.__inertia?.page?.props for non-hook access
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w: any = window;
    const pageProps = w.__inertia?.page?.props ?? w.__INERTIA_PAGE?.props ?? {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const translations: any = pageProps?.translations ?? pageProps ?? {};
    if (!key) return '';

    // Direct flat-key lookup
    const flat = translations[key];
    if (typeof flat === 'string') return flat;

    // Dot-notation traversal for nested objects
    const parts = key.split('.');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let cur: any = translations;
    for (const p of parts) {
      if (cur && typeof cur === 'object' && Object.prototype.hasOwnProperty.call(cur, p)) {
        cur = cur[p];
      } else {
        return key;
      }
    }
    return typeof cur === 'string' ? cur : key;
  } catch (err) {
    // Fallback to key
    console.warn('tGlobal error', err);
    return key;
  }
}

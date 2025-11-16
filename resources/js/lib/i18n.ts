import { usePage } from '@inertiajs/react';

interface PageProps {
  translations: Record<string, string>;
  locale: string;
  [key: string]: unknown;
}

export function useTranslation() {
  const { props } = usePage<PageProps>();
  const { translations = {}, locale = 'vi' } = props;

  const t = (key: string): string => {
    return translations[key] || key;
  };

  return { t, locale, translations };
}

export default useTranslation;

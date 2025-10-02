import React from 'react';
import { router } from '@inertiajs/react';
import { useTranslation } from '../../lib/i18n';

export default function LanguageSwitcher() {
  const { locale } = useTranslation();

  const switchLanguage = (newLocale: string) => {
    router.post('/language', { locale: newLocale }, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <button
          onClick={() => switchLanguage('vi')}
          style={{
            padding: '8px 12px',
            fontSize: '14px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            background: locale === 'vi' ? 'var(--primary)' : 'transparent',
            color: locale === 'vi' ? 'white' : 'var(--dark-grey)',
            fontWeight: locale === 'vi' ? '500' : '400',
          }}
          onMouseEnter={(e) => {
            if (locale !== 'vi') {
              e.currentTarget.style.background = 'var(--grey)';
              e.currentTarget.style.color = 'var(--primary)';
            }
          }}
          onMouseLeave={(e) => {
            if (locale !== 'vi') {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--dark-grey)';
            }
          }}
        >
          Tiếng Việt
        </button>
        <span style={{ color: 'var(--dark-grey)', fontSize: '14px' }}>|</span>
        <button
          onClick={() => switchLanguage('en')}
          style={{
            padding: '8px 12px',
            fontSize: '14px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            background: locale === 'en' ? 'var(--primary)' : 'transparent',
            color: locale === 'en' ? 'white' : 'var(--dark-grey)',
            fontWeight: locale === 'en' ? '500' : '400',
          }}
          onMouseEnter={(e) => {
            if (locale !== 'en') {
              e.currentTarget.style.background = 'var(--grey)';
              e.currentTarget.style.color = 'var(--primary)';
            }
          }}
          onMouseLeave={(e) => {
            if (locale !== 'en') {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--dark-grey)';
            }
          }}
        >
          English
        </button>
      </div>
    </div>
  );
}
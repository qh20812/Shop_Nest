import React from 'react';
import { router } from '@inertiajs/react';
import { useTranslation } from '../../lib/i18n';
import vietnamFlagUrl from '../../../../public/Flag_of_Vietnam.svg?url';
import unitedKingdomFlagUrl from '../../../../public/960px-Flag_of_the_United_Kingdom.svg.svg?url';

interface LanguageOption {
  value: string;
  label: string;
  flag: string;
}

export default function LanguageSwitcher() {
  const { locale } = useTranslation();
  const [isHovering, setIsHovering] = React.useState(false);

  const languageOptions: LanguageOption[] = React.useMemo(() => (
    [
      { value: 'vi', label: 'Tiếng Việt', flag: vietnamFlagUrl },
      { value: 'en', label: 'English', flag: unitedKingdomFlagUrl },
    ]
  ), []);

  const switchLanguage = (newLocale: string) => {
    if (newLocale && newLocale !== locale) {
      router.post('/language', { locale: newLocale }, {
        preserveState: true,
        preserveScroll: true,
      });
    }
  };

  const activeOption = languageOptions.find((option) => option.value === locale) ?? languageOptions[0];

  const visibleTriggerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    borderRadius: '8px',
    background: isHovering ? 'var(--light-primary)' : 'var(--primary)',
    color: isHovering ? 'var(--primary)' : '#ffffff',
    transition: 'all 0.3s ease',
    border: 'none',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    minWidth: '160px',
    justifyContent: 'space-between',
  };

  const arrowStyle: React.CSSProperties = {
    display: 'inline-block',
    marginLeft: '12px',
    width: 0,
    height: 0,
    borderLeft: '5px solid transparent',
    borderRight: '5px solid transparent',
    borderTop: isHovering ? '6px solid var(--primary)' : '6px solid #ffffff',
    transition: 'border-color 0.3s ease',
  };

  const selectStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity: 0,
    cursor: 'pointer',
    border: 'none',
    background: 'transparent',
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div
        style={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div style={visibleTriggerStyle}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img
              src={activeOption.flag}
              alt={activeOption.label}
              style={{ width: '18px', height: '18px', borderRadius: '999px', objectFit: 'cover' }}
            />
            <span>{activeOption.label}</span>
          </span>
          <span style={arrowStyle} />
        </div>
        <select
          value={activeOption.value}
          onChange={(event) => switchLanguage(event.target.value)}
          style={selectStyle}
          aria-label="Select language"
        >
          {languageOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

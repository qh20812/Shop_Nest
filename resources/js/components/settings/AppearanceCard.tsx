import React from 'react';
import { useTranslation } from '@/lib/i18n';
import { useTheme, Theme } from '@/hooks/useTheme';
import SettingsCard from './SettingsCard';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

export default function AppearanceCard() {
  const { t } = useTranslation();
  const { theme, changeTheme } = useTheme();

  const themeOptions: { value: Theme; label: string; description: string; icon: string }[] = [
    {
      value: 'light',
      label: t('Light'),
      description: t('Light mode for better visibility in bright environments'),
      icon: 'bx bx-sun',
    },
    {
      value: 'dark',
      label: t('Dark'),
      description: t('Dark mode for reduced eye strain in low light'),
      icon: 'bx bx-moon',
    },
    {
      value: 'system',
      label: t('System'),
      description: t('Automatically switch based on your system preference'),
      icon: 'bx bx-desktop',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Theme Settings */}
      <SettingsCard
        title={t('Theme')}
        description={t('Choose how the interface looks')}
      >
        <div style={{ padding: '24px 0' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {themeOptions.map((option) => (
              <label
                key={option.value}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '16px',
                  border: theme === option.value ? '2px solid var(--primary)' : '2px solid var(--grey)',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  background: theme === option.value ? 'var(--light-primary)' : 'var(--light)',
                }}
                onMouseEnter={(e) => {
                  if (theme !== option.value) {
                    e.currentTarget.style.borderColor = 'var(--dark-grey)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (theme !== option.value) {
                    e.currentTarget.style.borderColor = 'var(--grey)';
                  }
                }}
              >
                <input
                  type="radio"
                  name="theme"
                  value={option.value}
                  checked={theme === option.value}
                  onChange={() => changeTheme(option.value)}
                  style={{
                    width: '20px',
                    height: '20px',
                    accentColor: 'var(--primary)',
                    marginTop: '2px',
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <i className={option.icon} style={{ fontSize: '20px', color: 'var(--primary)' }}></i>
                    <span style={{ 
                      fontWeight: '500', 
                      color: 'var(--dark)',
                      fontSize: '16px'
                    }}>
                      {option.label}
                    </span>
                  </div>
                  <p style={{ 
                    color: 'var(--dark-grey)', 
                    fontSize: '14px',
                    margin: 0,
                    lineHeight: '1.4'
                  }}>
                    {option.description}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>
      </SettingsCard>

      {/* Language Settings */}
      <SettingsCard
        title={t('Language')}
        description={t('Choose your preferred language')}
      >
        <div style={{ padding: '24px 0' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px',
            padding: '16px',
            background: 'var(--grey)',
            borderRadius: '12px'
          }}>
            <i className='bx bx-globe' style={{ 
              fontSize: '24px', 
              color: 'var(--primary)' 
            }}></i>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '16px',
                fontWeight: '500',
                color: 'var(--dark)',
                marginBottom: '4px'
              }}>
                {t('Interface Language')}
              </div>
              <div style={{
                fontSize: '14px',
                color: 'var(--dark-grey)',
                marginBottom: '12px'
              }}>
                {t('Select the language for the user interface')}
              </div>
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </SettingsCard>
    </div>
  );
}

import React from 'react';
import { Head } from '@inertiajs/react';
import { useTranslation } from '@/lib/i18n';
import SettingsLayout from '@/layouts/settings/SettingLayout';
import AppearanceCard from '@/components/settings/AppearanceCard';

export default function Appearance() {
  const { t } = useTranslation();

  return (
    <SettingsLayout>
      <Head title={t('Appearance Settings')} />
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Page Header */}
        <div>
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: '600', 
            color: 'var(--dark)',
            margin: '0 0 8px 0' 
          }}>
            {t('Appearance Settings')}
          </h1>
          <p style={{ 
            color: 'var(--dark-grey)', 
            fontSize: '14px',
            margin: 0 
          }}>
            {t('Customize how your interface looks and feels')}
          </p>
        </div>

        {/* Appearance Configuration Card */}
        <AppearanceCard />
      </div>
    </SettingsLayout>
  );
}

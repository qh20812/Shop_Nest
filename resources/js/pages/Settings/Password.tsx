import React from 'react';
import { Head } from '@inertiajs/react';
import { useTranslation } from '@/lib/i18n';
import SettingsLayout from '@/layouts/settings/SettingLayout';
import PasswordCard from '@/components/settings/PasswordCard';

export default function Password() {
  const { t } = useTranslation();

  return (
    <SettingsLayout>
      <Head title={t('Password Settings')} />
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Page Header */}
        <div>
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: '600', 
            color: 'var(--dark)',
            margin: '0 0 8px 0' 
          }}>
            {t('Password Settings')}
          </h1>
          <p style={{ 
            color: 'var(--dark-grey)', 
            fontSize: '14px',
            margin: 0 
          }}>
            {t('Ensure your account is using a long, random password to stay secure')}
          </p>
        </div>

        {/* Password Change Card */}
        <PasswordCard />
      </div>
    </SettingsLayout>
  );
}

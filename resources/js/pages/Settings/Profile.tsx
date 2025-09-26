import React from 'react';
import { Head } from '@inertiajs/react';
import { useTranslation } from '@/lib/i18n';
import SettingsLayout from '@/layouts/settings/SettingLayout';
import SettingsCard from '@/components/settings/SettingsCard';

export default function Profile() {
  const { t } = useTranslation();

  return (
    <SettingsLayout>
      <Head title={t('Profile Settings')} />
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Page Header */}
        <div>
          <h1 style={{ 
            fontSize: '24px', 
            fontWeight: '600', 
            color: 'var(--dark)',
            margin: '0 0 8px 0' 
          }}>
            {t('Profile Settings')}
          </h1>
          <p style={{ 
            color: 'var(--dark-grey)', 
            fontSize: '14px',
            margin: 0 
          }}>
            {t('Manage your account profile and personal information')}
          </p>
        </div>

        {/* Profile Information Card */}
        <SettingsCard
          title={t('Profile Information')}
          description={t('Update your account profile information and email address')}
        >
          <div style={{ padding: '24px 0' }}>
            <p style={{ 
              color: 'var(--dark-grey)', 
              fontSize: '14px',
              textAlign: 'center',
              fontStyle: 'italic'
            }}>
              {t('Profile management functionality will be implemented here')}
            </p>
          </div>
        </SettingsCard>

        {/* Account Information Card */}
        <SettingsCard
          title={t('Account Information')}
          description={t('View your account details and status')}
        >
          <div style={{ padding: '24px 0' }}>
            <p style={{ 
              color: 'var(--dark-grey)', 
              fontSize: '14px',
              textAlign: 'center',
              fontStyle: 'italic'
            }}>
              {t('Account information will be displayed here')}
            </p>
          </div>
        </SettingsCard>
      </div>
    </SettingsLayout>
  );
}

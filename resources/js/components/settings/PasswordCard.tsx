import React from 'react';
import { useForm } from '@inertiajs/react';
import { useTranslation } from '@/lib/i18n';
import SettingsCard from './SettingsCard';
import PrimaryInput from '@/Components/ui/PrimaryInput';
import ActionButton from '@/Components/ui/ActionButton';

interface PasswordFormData {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export default function PasswordCard() {
  const { t } = useTranslation();
  
  const { data, setData, put, processing, errors, reset, recentlySuccessful } = useForm<PasswordFormData>({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    put('/settings/password', {
      onSuccess: () => {
        reset();
      },
      preserveScroll: true,
    });
  };

  const footer = (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>
        {recentlySuccessful && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            color: 'var(--success)',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            <i className='bx bx-check-circle'></i>
            {t('Password updated successfully')}
          </div>
        )}
      </div>
      
      <ActionButton
        type="submit"
        form="password-form"
        variant="primary"
        loading={processing}
        disabled={processing}
      >
        {t('Update Password')}
      </ActionButton>
    </div>
  );

  return (
    <SettingsCard
      title={t('Update Password')}
      description={t('Ensure your account is using a long, random password to stay secure')}
      footer={footer}
    >
      <form id="password-form" onSubmit={handleSubmit}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '20px',
          padding: '24px 0'
        }}>
          
          {/* Current Password */}
          <div>
            <PrimaryInput
              label={t('Current Password')}
              type="password"
              name="current_password"
              value={data.current_password}
              onChange={(e) => setData('current_password', e.target.value)}
              error={errors.current_password}
              required
              autoComplete="current-password"
            />
          </div>

          {/* New Password */}
          <div>
            <PrimaryInput
              label={t('New Password')}
              type="password"
              name="password"
              value={data.password}
              onChange={(e) => setData('password', e.target.value)}
              error={errors.password}
              required
              autoComplete="new-password"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <PrimaryInput
              label={t('Confirm New Password')}
              type="password"
              name="password_confirmation"
              value={data.password_confirmation}
              onChange={(e) => setData('password_confirmation', e.target.value)}
              error={errors.password_confirmation}
              required
              autoComplete="new-password"
            />
          </div>

          {/* Password Requirements */}
          <div style={{
            padding: '16px',
            background: 'var(--light-blue)',
            borderRadius: '8px',
            border: '1px solid var(--blue)',
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              marginBottom: '8px'
            }}>
              <i className='bx bx-info-circle' style={{ 
                fontSize: '16px', 
                color: 'var(--blue)' 
              }}></i>
              <span style={{ 
                fontWeight: '500', 
                color: 'var(--blue)',
                fontSize: '14px'
              }}>
                {t('Password Requirements')}
              </span>
            </div>
            <ul style={{ 
              margin: 0, 
              paddingLeft: '20px',
              color: 'var(--blue)',
              fontSize: '13px',
              lineHeight: '1.5'
            }}>
              <li>{t('At least 8 characters long')}</li>
              <li>{t('Contains both uppercase and lowercase letters')}</li>
              <li>{t('Contains at least one number')}</li>
              <li>{t('Contains at least one special character')}</li>
            </ul>
          </div>
        </div>
      </form>
    </SettingsCard>
  );
}

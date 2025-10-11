import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useTranslation } from '@/lib/i18n';
import SettingsLayout from '@/layouts/settings/SettingLayout';
import SettingsCard from '@/components/settings/SettingsCard';
import PrimaryInput from '@/components/ui/PrimaryInput';
import ActionButton from '@/components/ui/ActionButton';
import AvatarUpload from '@/components/ui/AvatarUpload';

interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  avatar?: string;
  avatar_url?: string;
}

interface PageProps {
  user: User;
  mustVerifyEmail: boolean;
  status?: string;
  [key: string]: unknown;
}

export default function Profile() {
  const { user } = usePage<PageProps>().props;
  const { t } = useTranslation();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const { data, setData, post, errors, processing, recentlySuccessful } = useForm({
    username: user.username,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    phone_number: user.phone_number,
    avatar: null as File | null,
    remove_avatar: false,
    _method: 'PATCH' as string,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update data with avatar before submit
    if (avatarFile) {
      setData('avatar', avatarFile);
    }

    // Use POST with _method=PATCH for file uploads in Laravel
    post('/settings/profile', {
      forceFormData: true,
    });
  };

  const handleAvatarChange = (file: File | null) => {
    setAvatarFile(file);
    setData('avatar', file);
    setData('remove_avatar', file === null);
  };

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
          footer={
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <ActionButton
                type="submit"
                variant="primary"
                disabled={processing}
                form="profile-form"
              >
                {t('Save Changes')}
              </ActionButton>
              {recentlySuccessful && (
                <span style={{ 
                  color: 'var(--success)', 
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  {t('Saved.')}
                </span>
              )}
            </div>
          }
        >
          <form id="profile-form" onSubmit={handleSubmit}>
            <div style={{ padding: '24px 0' }}>
              {/* Avatar Section */}
              <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'center' }}>
                <AvatarUpload
                  user={user}
                  onAvatarChange={handleAvatarChange}
                  disabled={processing}
                />
              </div>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                gap: '20px' 
              }}>
                <PrimaryInput
                  label={t('Username')}
                  name="username"
                  value={data.username}
                  onChange={(e) => setData('username', e.target.value)}
                  error={errors.username}
                  placeholder={t('Enter your username')}
                  disabled
                  required
                />

                <PrimaryInput
                  label={t('First Name')}
                  name="first_name"
                  value={data.first_name}
                  onChange={(e) => setData('first_name', e.target.value)}
                  error={errors.first_name}
                  placeholder={t('Enter your first name')}
                  required
                />

                <PrimaryInput
                  label={t('Last Name')}
                  name="last_name"
                  value={data.last_name}
                  onChange={(e) => setData('last_name', e.target.value)}
                  error={errors.last_name}
                  placeholder={t('Enter your last name')}
                  required
                />

                <PrimaryInput
                  label={t('Email')}
                  name="email"
                  type="email"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  error={errors.email}
                  placeholder={t('Enter your email')}
                  required
                />

                <PrimaryInput
                  label={t('Phone Number')}
                  name="phone_number"
                  value={data.phone_number}
                  onChange={(e) => setData('phone_number', e.target.value)}
                  error={errors.phone_number}
                  placeholder={t('Enter your phone number')}
                />
              </div>
            </div>
          </form>
        </SettingsCard>
      </div>
    </SettingsLayout>
  );
}

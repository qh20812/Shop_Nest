import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import '../../../css/AuthPage.css';
import { useTranslation } from '../../lib/i18n';

interface ResetPasswordProps {
  email: string;
  token: string;
}

export default function ResetPassword({ email, token }: ResetPasswordProps) {
  const { t } = useTranslation();
  const { data, setData, post, processing, errors, reset } = useForm({
    token: token,
    email: email,
    password: '',
    password_confirmation: '',
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/reset-password', {
      onFinish: () => reset('password', 'password_confirmation'),
    });
  };

  return (
    <div className="auth-page">
      <Head title={t('Reset Password')} />

      {/* Form Container */}
      <div className="container">
        <div className="form-container" style={{ width: '100%' }}>
          <form onSubmit={onSubmit}>
            <h1>{t('Reset Password')}</h1>
            <p>{t('Enter your new password')}</p>

            {/* Hidden fields */}
            <input type="hidden" name="token" value={data.token} />
            <input type="hidden" name="email" value={data.email} />

            {/* Email display (readonly) */}
            <input
              type="email"
              placeholder={t('Email')}
              value={data.email}
              readOnly
              style={{ 
                backgroundColor: '#f5f5f5',
                cursor: 'not-allowed',
                opacity: 0.7
              }}
            />

            {/* New Password */}
            <input
              id="password"
              type="password"
              placeholder={t('New Password Reset')}
              value={data.password}
              onChange={(e) => setData('password', e.target.value)}
              required
              autoFocus
            />
            
            {errors.password && (
              <div className="text-red-500 text-xs mt-1">{errors.password}</div>
            )}

            {/* Confirm Password */}
            <input
              id="password_confirmation"
              type="password"
              placeholder={t('Confirm New Password Reset')}
              value={data.password_confirmation}
              onChange={(e) => setData('password_confirmation', e.target.value)}
              required
            />
            
            {errors.password_confirmation && (
              <div className="text-red-500 text-xs mt-1">{errors.password_confirmation}</div>
            )}

            {/* Global errors */}
            {errors.email && (
              <div className="text-red-500 text-xs mt-1">{errors.email}</div>
            )}
            {errors.token && (
              <div className="text-red-500 text-xs mt-1">{errors.token}</div>
            )}

            <button
              type="submit"
              className="mt-4"
              disabled={processing}
              style={{
                opacity: processing ? 0.6 : 1,
                cursor: processing ? 'not-allowed' : 'pointer'
              }}
            >
              {processing ? t('Resetting...') : t('Reset Password')}
            </button>

            <a href="/login" className="mt-4" style={{ textDecoration: 'none' }}>
              {t('Back to Login')}
            </a>
          </form>
        </div>
      </div>
    </div>
  );
}

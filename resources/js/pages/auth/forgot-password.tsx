import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import '../../../css/AuthPage.css';
import { useTranslation } from '../../lib/i18n';

interface ForgotPasswordProps {
  status?: string;
}

export default function ForgotPassword({ status }: ForgotPasswordProps) {
  const { t } = useTranslation();
  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/forgot-password', {
      onFinish: () => reset('email'),
    });
  };

  return (
    <div className="auth-page">
      <Head title={t('Forgot Password')} />

      {/* Status Message */}
      {status && (
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2000,
            padding: '10px 20px',
            backgroundColor: '#d4edda',
            color: '#155724',
            border: '1px solid #c3e6cb',
            borderRadius: '5px',
            fontSize: '14px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          }}
        >
          {status}
        </div>
      )}

      {/* Form Container */}
      <div className="container">
        <div className="form-container" style={{ width: '100%' }}>
          <form onSubmit={onSubmit}>
            <h1>{t('Forgot Password')}</h1>
            <p>{t('Enter your email to receive a password reset link')}</p>

            <input
              id="email"
              type="email"
              placeholder={t('Email')}
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              required
              autoFocus
            />
            
            {errors.email && (
              <div className="text-red-500 text-xs mt-1">{errors.email}</div>
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
              {processing ? t('Sending...') : t('Send Password Reset Link')}
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
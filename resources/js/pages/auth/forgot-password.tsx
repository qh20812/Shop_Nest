import '@/../css/login-page.css';
import { Head, useForm, Link } from '@inertiajs/react';
import React from 'react';
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
        <div className="login-page-container">
            <Head title={t('Forgot Password')} />

            {/* Status Message */}
            {status && (
                <div className="login-status">
                    {status}
                </div>
            )}

            <div className="login-content-wrapper">
                <div className="login-card">
                    <div className="login-header">
                        <Link href="/">
                            <img src="/image/ShopnestLogoSVG.svg" alt="ShopNest logo" className="login-logo" />
                        </Link>

                        <div className="login-title-wrapper">
                            <p className="login-title">{t('Forgot Password?')}</p>
                            <p className="login-subtitle">{t('Enter your email to receive a password reset link')}</p>
                        </div>
                    </div>

                    {/* FORM */}
                    <form onSubmit={onSubmit} className="login-form">
                        {/* Email */}
                        <div className="login-form-group">
                            <label className="login-form-label">
                                <p className="login-label-text">{t('Email Address')}</p>

                                <input
                                    id="email"
                                    type="email"
                                    placeholder={t('Enter your email')}
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                    autoFocus
                                    className="login-input"
                                />
                            </label>

                            {errors.email && <div className="mt-1 text-xs text-red-500">{errors.email}</div>}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="login-submit-btn"
                        >
                            {processing ? t('Sending...') : t('Send Password Reset Link')}
                        </button>

                        {/* Back to login */}
                        <p className="login-footer">
                            <a href="/login" className="login-footer-link">
                                <span className="material-symbols-outlined">arrow_back</span>
                                <span style={{ marginLeft: 8 }}>{t('Back to Login')}</span>
                            </a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
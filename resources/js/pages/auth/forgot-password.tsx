import '@/../css/login-page.css';
import { Head, useForm } from '@inertiajs/react';
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
        <div className="font-display bg-background-light dark:bg-background-dark relative min-h-screen">
            <Head title={t('Forgot Password')} />

            {/* Status Message */}
            {status && (
                <div className="absolute top-6 left-1/2 z-50 -translate-x-1/2 rounded border border-green-300 bg-green-100 px-4 py-2 text-green-700 shadow">
                    {status}
                </div>
            )}

            <div className="flex min-h-screen w-full flex-col items-center justify-center px-4">
                <div className="w-full max-w-md space-y-8">
                    {/* Logo */}
                    <div className="text-center">
                        <img src="/image/ShopnestLogoSVG.svg" alt="ShopNest logo" className="login-logo" style={{ width: '59px', height: '59px' }} />

                        {/* Title */}
                        <div className="mt-4 flex flex-col gap-3">
                            <p className="text-text-light dark:text-text-dark text-4xl font-black">{t('Forgot Password?')}</p>

                            <p className="text-subtext-light dark:text-subtext-dark text-base">
                                {t('Enter your email to receive a password reset link')}
                            </p>
                        </div>
                    </div>

                    {/* FORM */}
                    <form onSubmit={onSubmit} className="flex flex-col gap-6">
                        {/* Email */}
                        <div className="flex flex-col gap-1">
                            <label className="flex flex-col">
                                <p className="text-text-light dark:text-text-dark pb-2 text-base font-medium">{t('Email Address')}</p>

                                <input
                                    id="email"
                                    type="email"
                                    placeholder={t('Enter your email')}
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                    autoFocus
                                    className="form-input h-14 p-[15px]"
                                    style={{ borderRadius: '8px' }}
                                />
                            </label>

                            {errors.email && <div className="mt-1 text-xs text-red-500">{errors.email}</div>}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex h-14 w-full items-center justify-center rounded-[8px] !bg-primary bg-primary text-base font-semibold !text-white shadow-lg shadow-primary/30 transition-all duration-200 hover:shadow-xl hover:shadow-primary/40 hover:brightness-110 focus:ring-4 focus:ring-primary/40 focus:outline-none active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {processing ? t('Sending...') : t('Send Password Reset Link')}
                        </button>

                        {/* Back to login */}
                        <p className="text-subtext-light dark:text-subtext-dark text-center text-sm">
                            <a href="/login" className="inline-flex items-center gap-1 font-semibold text-primary hover:underline">
                                <span className="material-symbols-outlined text-base">arrow_back</span>
                                <span>{t('Back to Login')}</span>
                            </a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

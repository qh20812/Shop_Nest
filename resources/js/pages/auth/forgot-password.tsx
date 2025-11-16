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
                        <svg className="mx-auto h-12 w-auto text-primary" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                            <path
                                d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5-1.5-.5M6.75 7.364l-1.5 .545m0 0l-1.5-.5m12 5.564v4.5m1.5-4.5v4.5m-1.5-1.125V21m-12-1.125V21"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            ></path>
                        </svg>

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
                                />
                            </label>

                            {errors.email && <div className="mt-1 text-xs text-red-500">{errors.email}</div>}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex h-14 w-full items-center justify-center rounded-xl !bg-primary bg-primary text-base font-semibold !text-white shadow-lg shadow-primary/30 transition-all duration-200 hover:shadow-xl hover:shadow-primary/40 hover:brightness-110 focus:ring-4 focus:ring-primary/40 focus:outline-none active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
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

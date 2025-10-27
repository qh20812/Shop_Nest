import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import '../../../css/Page.css';
import '../../../css/VerifyEmail.css';

interface VerifyEmailProps {
    status?: string;
}

export default function VerifyEmail({ status }: VerifyEmailProps) {
    const { post, processing } = useForm();

    const handleResend = (e: React.FormEvent) => {
        e.preventDefault();
        post('/email/verification-notification');
    };

    const handleLogout = (e: React.FormEvent) => {
        e.preventDefault();
        post('/logout');
    };

    return (
        <div className="auth-page">
            <Head title="Email Verification" />
            
            <div className="verify-email-container">
                <div className="verify-email-card">
                    <div className="verify-email-header">
                        <i className="bx bx-envelope verify-email-icon"></i>
                        <h1 className="verify-email-title">Verify Your Email</h1>
                        <p className="verify-email-description">
                            Please verify your email address by clicking on the link we just emailed to you.
                        </p>
                    </div>

                    {status === 'verification-link-sent' && (
                        <div className="verify-email-success">
                            <i className="bx bx-check-circle"></i>
                            <p>
                                A new verification link has been sent to the email address
                                you provided during registration.
                            </p>
                        </div>
                    )}

                    <div className="verify-email-actions">
                        <form onSubmit={handleResend} className="verify-email-form">
                            <button 
                                type="submit" 
                                disabled={processing} 
                                className="btn btn-primary verify-email-btn"
                            >
                                {processing && (
                                    <LoaderCircle className="btn-icon spin-animation" />
                                )}
                                {processing ? 'Sending...' : 'Resend Verification Email'}
                            </button>
                        </form>

                        <form onSubmit={handleLogout} className="verify-email-logout-form">
                            <button 
                                type="submit" 
                                className="verify-email-logout-link"
                            >
                                Log out
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
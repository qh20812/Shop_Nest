import React from 'react';
import PasswordResetLinkController from '@/actions/App/Http/Controllers/Auth/PasswordResetLinkController';
import { login } from '@/routes';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import '../../../css/AuthPage.css'; 

export default function ForgotPassword({ status }: { status?: string }) {
    return (
        <div className="auth-page">
            <Head title="Forgot password" />

            {/* Thông báo trạng thái */}
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

            {/* Form */}
            <div className="container">
                <div className="form-container" style={{ width: '100%' }}>
                    <Form {...PasswordResetLinkController.store.form()}>
                        {({ processing, errors }) => (
                            <form
                                className="flex flex-col items-center justify-center h-full px-10 text-center"
                                method="POST"
                            >
                                <h1>Forgot Password</h1>
                                <p>Enter your email to receive a password reset link</p>

                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="email@example.com"
                                    required
                                    autoFocus
                                />
                                <InputError message={errors.email} />

                                <button
                                    type="submit"
                                    className="mt-4"
                                    disabled={processing}
                                >
                                    {processing ? (
                                        <LoaderCircle
                                            className="h-4 w-4 animate-spin inline-block mr-2"
                                        />
                                    ) : null}
                                    Send Password Reset Link
                                </button>

                                <a href="/login" className="mt-4">
                                    Back to Login
                                </a>
                            </form>
                        )}
                    </Form>
                </div>
            </div>
        </div>
    );
}

import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import '../../../css/Page.css';
import '../../../css/AuthPage.css';

interface ConfirmPasswordProps {
    errors?: Record<string, string>;
}

export default function ConfirmPassword({ errors }: ConfirmPasswordProps) {
    const { data, setData, post, processing, reset } = useForm({
        password: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/confirm-password', {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="auth-page">
            <Head title="Confirm Password" />

            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-header">
                        <i className="bx bx-lock-alt auth-icon"></i>
                        <h1 className="auth-title">Confirm Password</h1>
                        <p className="auth-description">
                            Please confirm your password before continuing.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="password" className="form-label">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="form-input"
                                required
                                autoComplete="current-password"
                            />
                            {errors?.password && (
                                <p className="form-error">{errors.password}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="auth-button"
                        >
                            {processing ? (
                                <>
                                    <LoaderCircle className="animate-spin" size={16} />
                                    Confirming...
                                </>
                            ) : (
                                'Confirm Password'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
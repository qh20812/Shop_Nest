import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import '@/../css/login-page.css';

export default function LoginPage() {
    const [formData, setFormData] = useState({
        identifier: '',
        password: '',
        remember: false,
    });

    const [errors, setErrors] = useState({
        identifier: '',
        password: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const validateForm = (data = formData) => {
        const newErrors = {
            identifier: '',
            password: '',
        };

        // Validate identifier
        if (!data.identifier.trim()) {
            newErrors.identifier = 'Email, số điện thoại hoặc tên người dùng là bắt buộc.';
        }

        // Validate password
        if (!data.password) {
            newErrors.password = 'Mật khẩu là bắt buộc.';
        }

        setErrors(newErrors);
        return Object.values(newErrors).every(error => error === '');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        const newData = { ...formData, [name]: newValue } as typeof formData;

        setFormData(newData);
        validateForm(newData);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        setErrors({
            identifier: '',
            password: '',
        });

        if (validateForm()) {
            setSubmitting(true);
            router.post('/login', {
                identifier: formData.identifier.trim(),
                password: formData.password,
                remember: formData.remember,
            }, {
                onError: (serverErrors) => {
                    setErrors({
                        identifier: (serverErrors as Record<string, string>).identifier || '',
                        password: (serverErrors as Record<string, string>).password || '',
                    });
                },
                onFinish: () => setSubmitting(false),
            });
        }
    };

    return (
        <div className="login-page-container">
            <button className="login-dark-toggle" type="button">
                <span className="material-symbols-outlined">dark_mode</span>
            </button>

            <div className="login-content-wrapper">
                <div className="login-card">
                    <div className="login-header">
                        <img
                            src="/image/ShopnestLogoSVG.svg"
                            alt="ShopNest logo"
                            className="login-logo" 
                        />

                        <div className="login-title-wrapper">
                            <p className="login-title">Đăng nhập vào ShopNest</p>
                            <p className="login-subtitle">
                                Chào mừng trở lại! Vui lòng nhập thông tin của bạn.
                            </p>
                        </div>
                    </div>

                    <form className="login-form" onSubmit={handleSubmit}>
                        <div className="login-form-group">
                            <label className="login-form-label">
                                <p className="login-label-text">Email hoặc số điện thoại hoặc tên người dùng</p>
                                <input
                                    className={`login-input ${errors.identifier ? 'login-input-error' : ''}`}
                                    type="text"
                                    name="identifier"
                                    placeholder="Nhập email, số điện thoại hoặc tên người dùng"
                                    value={formData.identifier}
                                    onChange={handleInputChange}
                                />
                            </label>
                            {errors.identifier && <p className="login-error">{errors.identifier}</p>}
                        </div>

                        <div className="login-form-group">
                            <label className="login-form-label">
                                <p className="login-label-text">Mật khẩu</p>
                                <div className="login-input-wrapper">
                                    <input
                                        className={`login-input login-input-password ${errors.password ? 'login-input-error' : ''}`}
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        placeholder="Nhập mật khẩu của bạn"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                    />
                                    <button
                                        className="login-toggle-password"
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <span className="material-symbols-outlined">
                                            {showPassword ? 'visibility_off' : 'visibility'}
                                        </span>
                                    </button>
                                </div>
                            </label>
                            {errors.password && <p className="login-error">{errors.password}</p>}
                        </div>

                        <div className="login-remember-row">
                            <label className="login-checkbox-label">
                                <input
                                    className="login-checkbox"
                                    type="checkbox"
                                    name="remember"
                                    checked={formData.remember}
                                    onChange={handleInputChange}
                                />
                                <p className="login-checkbox-text">Ghi nhớ tôi</p>
                            </label>
                            <a className="login-forgot-link" href="/forgot-password">
                                Quên mật khẩu?
                            </a>
                        </div>

                        <div>
                            <button
                                className="login-submit-btn"
                                type="submit"
                                disabled={
                                    Object.values(errors).some(error => error !== '') ||
                                    !formData.identifier.trim() ||
                                    !formData.password ||
                                    submitting
                                }
                            >
                                Đăng nhập
                            </button>
                        </div>

                        <div className="login-divider">
                            <div className="login-divider-line"></div>
                            <div className="login-divider-text-wrapper">
                                <span className="login-divider-text">Hoặc tiếp tục với</span>
                            </div>
                        </div>

                        <div>
                            <button
                                className="login-google-btn"
                                type="button"
                                onClick={() => window.location.href = '/auth/google'}
                            >
                                <img
                                    className="login-google-icon"
                                    src="google-color-svgrepo-com.svg"
                                    alt="Google"
                                />
                                <span>Google</span>
                            </button>
                        </div>
                    </form>

                    <p className="login-footer">
                        <span className="login-footer-text">Chưa có tài khoản? </span>
                        <a className="login-footer-link" href="/register">
                            Đăng ký ngay
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

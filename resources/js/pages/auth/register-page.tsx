import React, { useState } from 'react';
import { router, Link } from '@inertiajs/react';
import '@/../css/register-page.css';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        identifier: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false,
    });

    const [errors, setErrors] = useState({
        identifier: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [processing, setProcessing] = useState(false);

    const validateForm = (data = formData) => {
        const newErrors = {
            identifier: '',
            password: '',
            confirmPassword: '',
            agreeToTerms: '',
        };

        // Validate identifier (email or phone or username)
        const identifier = data.identifier.trim();
        const emailRegex = /\S+@\S+\.\S+/;
        const phoneRegex = /^\+?[0-9]{9,15}$/; // allows optional + and 9-15 digits
        const usernameRegex = /^[a-zA-Z0-9_]+$/;

        if (!identifier) {
            newErrors.identifier = 'Email, số điện thoại hoặc tên người dùng là bắt buộc.';
        } else if (!emailRegex.test(identifier) && !phoneRegex.test(identifier) && !usernameRegex.test(identifier)) {
            newErrors.identifier = 'Email, số điện thoại hoặc tên người dùng không hợp lệ.';
        }

        // Validate password
        if (!data.password) {
            newErrors.password = 'Mật khẩu là bắt buộc.';
        } else if (data.password.length < 8) {
            newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự.';
        }

        // Validate confirm password
        if (!data.confirmPassword) {
            newErrors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc.';
        } else if (data.password !== data.confirmPassword) {
            newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp.';
        }

        // Validate terms agreement
        if (!data.agreeToTerms) {
            newErrors.agreeToTerms = 'Bạn phải đồng ý với Điều khoản Dịch vụ.';
        }

        setErrors(newErrors);
        return Object.values(newErrors).every(error => error === '');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        const newData = { ...formData, [name]: newValue } as typeof formData;

        // Update form data state
        setFormData(newData);

        // Re-validate live for a better UX so button toggles when the user fixes errors
        validateForm(newData);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Clear previous errors
        setErrors({
            identifier: '',
            password: '',
            confirmPassword: '',
            agreeToTerms: '',
        });

        if (validateForm()) {
            setProcessing(true);
            
            router.post(route('register.store'), {
                identifier: formData.identifier,
                password: formData.password,
                confirmPassword: formData.confirmPassword,
                agreeToTerms: formData.agreeToTerms,
            }, {
                onError: (errors) => {
                    setProcessing(false);
                    // Map backend errors to frontend state
                    setErrors({
                        identifier: errors.identifier || '',
                        password: errors.password || '',
                        confirmPassword: errors.confirmPassword || '',
                        agreeToTerms: errors.agreeToTerms || '',
                    });
                },
                onSuccess: () => {
                    setProcessing(false);
                },
                onFinish: () => {
                    setProcessing(false);
                }
            });
        }
    };

    return (
        <div className="register-page-container">
            <button className="register-dark-toggle" type="button">
                <span className="material-symbols-outlined">dark_mode</span>
            </button>

            <div className="register-content-wrapper">
                <div className="register-card">
                    <div className="register-header">
                        {/* Use external SVG asset from public/image to allow consistent logo updates */}
                        <Link href="/">
                            <img
                                src="/image/ShopnestLogoSVG.svg"
                                alt="ShopNest logo"
                                className="register-logo"
                            />
                        </Link>

                        <div className="register-title-wrapper">
                            <p className="register-title">Tạo tài khoản mới</p>
                            <p className="register-subtitle">
                                Bắt đầu hành trình mua sắm của bạn với ShopNest.
                            </p>
                        </div>
                    </div>

                    <form className="register-form" onSubmit={handleSubmit}>
                        <div className="register-form-group">
                            <label className="register-form-label">
                                <p className="register-label-text">Email, Số điện thoại hoặc Tên người dùng</p>
                                <input
                                    className={`register-input ${errors.identifier ? 'register-input-error' : ''}`}
                                    type="text"
                                    name="identifier"
                                    placeholder="Nhập email, số điện thoại hoặc tên người dùng"
                                    value={formData.identifier}
                                    onChange={handleInputChange}
                                />
                            </label>
                            {errors.identifier && <p className="register-error">{errors.identifier}</p>}
                        </div>

                        <div className="register-form-group">
                            <label className="register-form-label">
                                <p className="register-label-text">Mật khẩu</p>
                                <div className="register-input-wrapper">
                                    <input
                                        className={`register-input register-input-password ${errors.password ? 'register-input-error' : ''}`}
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        placeholder="Tạo mật khẩu của bạn"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                    />
                                    <button
                                        className="register-toggle-password"
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <span className="material-symbols-outlined">
                                            {showPassword ? 'visibility_off' : 'visibility'}
                                        </span>
                                    </button>
                                </div>
                            </label>
                            {errors.password && <p className="register-error">{errors.password}</p>}
                        </div>

                        <div className="register-form-group">
                            <label className="register-form-label">
                                <p className="register-label-text">Xác nhận mật khẩu</p>
                                <div className="register-input-wrapper">
                                    <input
                                        className="register-input register-input-password"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        placeholder="Nhập lại mật khẩu của bạn"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                    />
                                    <button
                                        className="register-toggle-password"
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        <span className="material-symbols-outlined">
                                            {showConfirmPassword ? 'visibility_off' : 'visibility'}
                                        </span>
                                    </button>
                                </div>
                            </label>
                            {errors.confirmPassword && <p className="register-error">{errors.confirmPassword}</p>}
                        </div>

                        <div className="register-checkbox-wrapper">
                            <label className="register-checkbox-label">
                                <input
                                    className="register-checkbox"
                                    type="checkbox"
                                    name="agreeToTerms"
                                    checked={formData.agreeToTerms}
                                    onChange={handleInputChange}
                                />
                                <p className="register-checkbox-text">
                                    Tôi đồng ý với{' '}
                                    <a className="register-checkbox-link" href="#">
                                        Điều khoản Dịch vụ
                                    </a>
                                    {' '}và{' '}
                                    <a className="register-checkbox-link" href="#">
                                        Chính sách Bảo mật
                                    </a>
                                    {' '}của ShopNest.
                                </p>
                            </label>

                        </div>
                        {errors.agreeToTerms && <p className="register-error register-error-checkbox">{errors.agreeToTerms}</p>}
                        <div>
                            <button
                                className="register-submit-btn"
                                type="submit"
                                                            disabled={
                                                                processing ||
                                                                // disable button if any validation error exists or required fields are missing
                                                                Object.values(errors).some(error => error !== '') ||
                                                                !formData.identifier.trim() ||
                                                                !formData.password ||
                                                                !formData.confirmPassword ||
                                                                !formData.agreeToTerms
                                                            }
                            >
                                {processing ? 'Đang xử lý...' : 'Đăng ký'}
                            </button>
                        </div>
                    </form>

                    <p className="register-footer">
                        <span className="register-footer-text">Đã có tài khoản? </span>
                        {/* <a className="register-footer-link" href="/login">
                            Đăng nhập ngay
                        </a> */}
                        <Link className='register-footer-link' href="/login">Đăng nhập ngay</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

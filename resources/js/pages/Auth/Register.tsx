import { Head, router } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';
import * as React from 'react';

import { AuthBrandPanel } from '@/components/layout/AuthBrandPanel';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FormField } from '@/components/ui/form-field';
import { IconButton } from '@/components/ui/icon-button';
import Input from '@/components/ui/input';
import { PasswordStrength } from '@/components/ui/password-strength';
import { TextLink } from '@/components/ui/text-link';
import { Heading, Text } from '@/components/ui/typography';

const EMAIL_PATTERN = /\S+@\S+\.\S+/;
const PHONE_PATTERN = /^\+?[0-9]{9,15}$/;
const USERNAME_PATTERN = /^[a-zA-Z0-9_.]+$/;
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

export default function RegisterPage() {
    const [formData, setFormData] = React.useState({
        identifier: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false,
    });
    const [errors, setErrors] = React.useState({
        identifier: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: '',
    });
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
    const [processing, setProcessing] = React.useState(false);

    const validateForm = (data = formData) => {
        const identifier = data.identifier.trim();

        const nextErrors = {
            identifier: '',
            password: '',
            confirmPassword: '',
            agreeToTerms: '',
        };

        if (!identifier) {
            nextErrors.identifier = 'Email, số điện thoại hoặc tên người dùng là bắt buộc.';
        } else if (!EMAIL_PATTERN.test(identifier) && !PHONE_PATTERN.test(identifier) && !USERNAME_PATTERN.test(identifier)) {
            nextErrors.identifier = 'Email, số điện thoại hoặc tên người dùng không hợp lệ.';
        }

        if (!data.password) {
            nextErrors.password = 'Mật khẩu là bắt buộc.';
        } else if (data.password.length < 8) {
            nextErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự.';
        } else if (!PASSWORD_PATTERN.test(data.password)) {
            nextErrors.password = 'Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt.';
        }

        if (!data.confirmPassword) {
            nextErrors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc.';
        } else if (data.password !== data.confirmPassword) {
            nextErrors.confirmPassword = 'Mật khẩu xác nhận không khớp.';
        }

        if (!data.agreeToTerms) {
            nextErrors.agreeToTerms = 'Bạn phải đồng ý với Điều khoản Dịch vụ.';
        }

        setErrors(nextErrors);

        return Object.values(nextErrors).every((error) => error === '');
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setErrors({ identifier: '', password: '', confirmPassword: '', agreeToTerms: '' });

        if (!validateForm()) {
            return;
        }

        setProcessing(true);
        router.post(
            route('register.store'),
            {
                identifier: formData.identifier,
                password: formData.password,
                confirmPassword: formData.confirmPassword,
                agreeToTerms: formData.agreeToTerms,
            },
            {
                onError: (serverErrors) => {
                    setErrors({
                        identifier: serverErrors.identifier ?? '',
                        password: serverErrors.password ?? '',
                        confirmPassword: serverErrors.confirmPassword ?? '',
                        agreeToTerms: serverErrors.agreeToTerms ?? '',
                    });
                },
                onFinish: () => setProcessing(false),
            },
        );
    };

    return (
        <AuthLayout brand={<AuthBrandPanel role="customer" />} width="wide">
            <Head title="Tạo tài khoản" />

            <div className="sn-auth-page">
                <div className="sn-auth-page__intro">
                    <Heading level={1} size="headline-1">
                        Tạo tài khoản mới
                    </Heading>
                    <Text size="body-md" tone="muted">
                        Bắt đầu hành trình mua sắm của bạn với ShopNest.
                    </Text>
                </div>

                <form onSubmit={handleSubmit} className="sn-auth-page__form" noValidate>
                    <FormField label="Email, số điện thoại hoặc tên người dùng" required error={errors.identifier}>
                        <Input
                            name="identifier"
                            value={formData.identifier}
                            onChange={(event) => setFormData((current) => ({ ...current, identifier: event.target.value }))}
                            placeholder="ban@example.com hoặc 0912 345 678"
                            autoComplete="username"
                            invalid={Boolean(errors.identifier)}
                        />
                    </FormField>

                    <div className="sn-auth-page__actions">
                        <FormField label="Mật khẩu" required error={errors.password}>
                            <Input
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={(event) => setFormData((current) => ({ ...current, password: event.target.value }))}
                                placeholder="Tạo mật khẩu của bạn"
                                autoComplete="new-password"
                                invalid={Boolean(errors.password)}
                                trailing={
                                    <IconButton
                                        variant="ghost"
                                        size="sm"
                                        label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                                        onClick={() => setShowPassword((value) => !value)}
                                    >
                                        {showPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
                                    </IconButton>
                                }
                            />
                        </FormField>
                        <PasswordStrength value={formData.password} />
                    </div>

                    <FormField label="Xác nhận mật khẩu" required error={errors.confirmPassword}>
                        <Input
                            name="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={formData.confirmPassword}
                            onChange={(event) => setFormData((current) => ({ ...current, confirmPassword: event.target.value }))}
                            placeholder="Nhập lại mật khẩu"
                            autoComplete="new-password"
                            invalid={Boolean(errors.confirmPassword)}
                            trailing={
                                <IconButton
                                    variant="ghost"
                                    size="sm"
                                    label={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                                    onClick={() => setShowConfirmPassword((value) => !value)}
                                >
                                    {showConfirmPassword ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
                                </IconButton>
                            }
                        />
                    </FormField>

                    <div className="sn-auth-page__check">
                        <Checkbox
                            checked={formData.agreeToTerms}
                            onCheckedChange={(checked) => setFormData((current) => ({ ...current, agreeToTerms: checked === true }))}
                            label="Tôi đồng ý với điều khoản của ShopNest."
                        />
                        <p className="sn-auth-page__legal">
                            Xem{' '}
                            <TextLink href="/terms" tone="accent" underline={false}>
                                Điều khoản Dịch vụ
                            </TextLink>{' '}
                            và{' '}
                            <TextLink href="/privacy-policy" tone="accent" underline={false}>
                                Chính sách Bảo mật
                            </TextLink>
                            .
                        </p>
                        {errors.agreeToTerms && (
                            <span role="alert" className="sn-field__error">
                                {errors.agreeToTerms}
                            </span>
                        )}
                    </div>

                    <Button type="submit" size="lg" loading={processing} className="sn-auth-page__submit">
                        Đăng ký
                    </Button>
                </form>

                <p className="sn-auth-page__footnote">
                    Đã có tài khoản?{' '}
                    <TextLink href="/login" tone="accent" underline={false}>
                        Đăng nhập ngay
                    </TextLink>
                </p>

                <p className="sn-auth-page__legal sn-auth-page__legal--center">
                    Bạn muốn bán hàng?{' '}
                    <TextLink href="/register/seller" tone="ink" underline={false}>
                        Đăng ký người bán
                    </TextLink>
                </p>
            </div>
        </AuthLayout>
    );
}

import { Head, router } from '@inertiajs/react';
import { Eye, EyeOff, Mail } from 'lucide-react';
import * as React from 'react';

import { AuthBrandPanel } from '@/components/layout/AuthBrandPanel';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FormField } from '@/components/ui/form-field';
import Input from '@/components/ui/input';
import { PasswordStrength } from '@/components/ui/password-strength';
import { TextLink } from '@/components/ui/text-link';
import { Heading, Text } from '@/components/ui/typography';

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
        const emailRegex = /\S+@\S+\.\S+/;
        const phoneRegex = /^\+?[0-9]{9,15}$/;
        const usernameRegex = /^[a-zA-Z0-9_]+$/;

        const nextErrors = {
            identifier: '',
            password: '',
            confirmPassword: '',
            agreeToTerms: '',
        };

        if (!identifier) {
            nextErrors.identifier = 'Email, số điện thoại hoặc tên người dùng là bắt buộc.';
        } else if (!emailRegex.test(identifier) && !phoneRegex.test(identifier) && !usernameRegex.test(identifier)) {
            nextErrors.identifier = 'Email, số điện thoại hoặc tên người dùng không hợp lệ.';
        }

        if (!data.password) {
            nextErrors.password = 'Mật khẩu là bắt buộc.';
        } else if (data.password.length < 8) {
            nextErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự.';
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
        <AuthLayout brand={<AuthBrandPanel role="customer" />}>
            <Head title="Tạo tài khoản" />

            <div className="flex flex-col gap-2">
                <Heading level={1} size="headline-1">
                    Tạo tài khoản mới
                </Heading>
                <Text size="body-md" tone="muted">
                    Bắt đầu hành trình mua sắm của bạn với ShopNest.
                </Text>
            </div>

            <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-5" noValidate>
                <FormField label="Email, số điện thoại hoặc tên người dùng" required error={errors.identifier}>
                    <Input
                        name="identifier"
                        value={formData.identifier}
                        onChange={(event) => setFormData((current) => ({ ...current, identifier: event.target.value }))}
                        placeholder="ban@example.com hoặc 0912 345 678"
                        autoComplete="username"
                        leadingIcon={Mail}
                        invalid={Boolean(errors.identifier)}
                    />
                </FormField>

                <div className="flex flex-col gap-1.5">
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
                                <button
                                    type="button"
                                    aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                                    className="focus-ring flex size-control-sm items-center justify-center rounded-chip text-ink-muted transition-colors hover:bg-lacquer-wash hover:text-ink"
                                    onClick={() => setShowPassword((value) => !value)}
                                >
                                    {showPassword ? <EyeOff aria-hidden="true" className="size-4" /> : <Eye aria-hidden="true" className="size-4" />}
                                </button>
                            }
                        />
                    </FormField>
                    <PasswordStrength value={formData.password} className="mt-1" />
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
                            <button
                                type="button"
                                aria-label={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                                className="focus-ring flex size-control-sm items-center justify-center rounded-chip text-ink-muted transition-colors hover:bg-lacquer-wash hover:text-ink"
                                onClick={() => setShowConfirmPassword((value) => !value)}
                            >
                                {showConfirmPassword ? (
                                    <EyeOff aria-hidden="true" className="size-4" />
                                ) : (
                                    <Eye aria-hidden="true" className="size-4" />
                                )}
                            </button>
                        }
                    />
                </FormField>

                <div className="flex flex-col gap-2">
                    <Checkbox
                        checked={formData.agreeToTerms}
                        onCheckedChange={(checked) => setFormData((current) => ({ ...current, agreeToTerms: checked === true }))}
                        label="Tôi đồng ý với điều khoản của ShopNest."
                    />
                    <p className="text-body-sm text-ink-muted">
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
                        <span role="alert" className="text-body-sm text-brick">
                            {errors.agreeToTerms}
                        </span>
                    )}
                </div>

                <Button type="submit" size="lg" loading={processing} className="w-full">
                    Đăng ký
                </Button>
            </form>

            <p className="mt-6 border-t border-border pt-5 text-body-sm text-ink-muted">
                Đã có tài khoản?{' '}
                <TextLink href="/login" tone="accent" underline={false}>
                    Đăng nhập ngay
                </TextLink>
            </p>

            <p className="mt-5 text-center text-body-sm text-ink-muted">
                Bạn muốn bán hàng?{' '}
                <TextLink href="/register/seller" tone="ink" underline={false}>
                    Đăng ký người bán
                </TextLink>
            </p>
        </AuthLayout>
    );
}

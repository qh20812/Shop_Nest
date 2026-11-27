import { Head, router, usePage } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';
import * as React from 'react';

import { AuthBrandPanel } from '@/components/layout/AuthBrandPanel';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FormField } from '@/components/ui/form-field';
import { IconButton } from '@/components/ui/icon-button';
import Input from '@/components/ui/input';
import { TextLink } from '@/components/ui/text-link';
import { Heading, Text } from '@/components/ui/typography';

interface LoginPageProps extends Record<string, unknown> {
    status?: string | null;
    canResetPassword?: boolean;
    errors?: {
        google?: string;
    };
}

export default function LoginPage() {
    const { status, canResetPassword, errors: pageErrors } = usePage<LoginPageProps>().props;
    const googleError = pageErrors?.google;
    const [formData, setFormData] = React.useState({
        identifier: '',
        password: '',
        remember: false,
    });
    const [errors, setErrors] = React.useState({ identifier: '', password: '' });
    const [showPassword, setShowPassword] = React.useState(false);
    const [submitting, setSubmitting] = React.useState(false);

    const validateForm = (data = formData) => {
        const nextErrors = {
            identifier: data.identifier.trim() ? '' : 'Email, số điện thoại hoặc tên người dùng là bắt buộc.',
            password: data.password ? '' : 'Mật khẩu là bắt buộc.',
        };

        setErrors(nextErrors);

        return Object.values(nextErrors).every((error) => error === '');
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setErrors({ identifier: '', password: '' });

        if (!validateForm()) {
            return;
        }

        setSubmitting(true);
        router.post(
            '/login',
            {
                identifier: formData.identifier.trim(),
                password: formData.password,
                remember: formData.remember,
            },
            {
                onError: (serverErrors) => {
                    setErrors({
                        identifier: (serverErrors as Record<string, string>).identifier ?? '',
                        password: (serverErrors as Record<string, string>).password ?? '',
                    });
                },
                onFinish: () => setSubmitting(false),
            },
        );
    };

    return (
        <AuthLayout brand={<AuthBrandPanel role="customer" />}>
            <Head title="Đăng nhập" />

            <div className="sn-auth-page">
                <div className="sn-auth-page__intro">
                    <Heading level={1} size="headline-1">
                        Đăng nhập
                    </Heading>
                    <Text size="body-md" tone="muted">
                        Tiếp tục với tài khoản của bạn để theo dõi đơn hàng và giỏ hàng.
                    </Text>
                </div>

                {status && <Alert tone="success" description={status} />}
                {googleError && <Alert tone="danger" title="Đăng nhập Google thất bại" description={googleError} />}

                <form onSubmit={handleSubmit} className="sn-auth-page__form" noValidate>
                    <FormField label="Email, số điện thoại hoặc tên đăng nhập" required error={errors.identifier}>
                        <Input
                            name="identifier"
                            value={formData.identifier}
                            onChange={(event) => setFormData((current) => ({ ...current, identifier: event.target.value }))}
                            placeholder="ban@example.com hoặc 0912 345 678"
                            autoComplete="username"
                            invalid={Boolean(errors.identifier)}
                        />
                    </FormField>

                    <FormField label="Mật khẩu" required error={errors.password}>
                        <Input
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={(event) => setFormData((current) => ({ ...current, password: event.target.value }))}
                            placeholder="Nhập mật khẩu"
                            autoComplete="current-password"
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

                    <div className="sn-auth-page__row">
                        <Checkbox
                            checked={formData.remember}
                            onCheckedChange={(checked) => setFormData((current) => ({ ...current, remember: checked === true }))}
                            label="Ghi nhớ đăng nhập"
                        />
                        {canResetPassword !== false && (
                            <TextLink href="/forgot-password" tone="muted" underline={false}>
                                Quên mật khẩu?
                            </TextLink>
                        )}
                    </div>

                    <Button type="submit" size="lg" loading={submitting} className="sn-auth-page__submit">
                        Đăng nhập
                    </Button>

                    <div className="sn-auth-page__divider" aria-hidden="true">
                        <span>hoặc</span>
                    </div>

                    <Button
                        type="button"
                        variant="secondary"
                        size="lg"
                        className="sn-auth-page__google"
                        onClick={() => {
                            window.location.href = '/auth/google';
                        }}
                    >
                        <img src="/google-color-svgrepo-com.svg" alt="" className="sn-auth-page__google-logo" />
                        Tiếp tục với Google
                    </Button>
                </form>

                <p className="sn-auth-page__footnote">
                    Chưa có tài khoản?{' '}
                    <TextLink href="/register" tone="accent" underline={false}>
                        Tạo tài khoản mới
                    </TextLink>
                </p>

                <div className="sn-auth-page__aside">
                    <p className="sn-auth-page__aside-text">Bạn là đối tác kinh doanh hoặc vận chuyển?</p>
                    <div className="sn-auth-page__aside-links">
                        <TextLink href="/register/seller" tone="ink" underline={false}>
                            Bán hàng cùng ShopNest
                        </TextLink>
                        <span className="sn-auth-page__aside-sep" aria-hidden="true">
                            |
                        </span>
                        <TextLink href="/register/shipper" tone="ink" underline={false}>
                            Giao vận đối tác
                        </TextLink>
                    </div>
                </div>
            </div>
        </AuthLayout>
    );
}

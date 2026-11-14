import { Head, router } from '@inertiajs/react';
import { Eye, EyeOff, Mail } from 'lucide-react';
import * as React from 'react';

import { AuthBrandPanel } from '@/components/layout/AuthBrandPanel';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FormField } from '@/components/ui/form-field';
import Input from '@/components/ui/input';
import { TextLink } from '@/components/ui/text-link';
import { Heading, Text } from '@/components/ui/typography';

export default function LoginPage() {
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

            <div className="flex flex-col gap-2">
                <Heading level={1} size="headline-1">
                    Đăng nhập
                </Heading>
                <Text size="body-md" tone="muted">
                    Tiếp tục với tài khoản của bạn để theo dõi đơn hàng và giỏ hàng.
                </Text>
            </div>

            <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-5" noValidate>
                <FormField label="Email, số điện thoại hoặc tên đăng nhập" required error={errors.identifier}>
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

                <div className="flex flex-wrap items-center justify-between gap-3">
                    <Checkbox
                        checked={formData.remember}
                        onCheckedChange={(checked) => setFormData((current) => ({ ...current, remember: checked === true }))}
                        label="Ghi nhớ đăng nhập"
                    />
                    <TextLink href="/forgot-password" tone="muted" underline={false}>
                        Quên mật khẩu?
                    </TextLink>
                </div>

                <Button type="submit" size="lg" loading={submitting} className="w-full">
                    Đăng nhập
                </Button>

                <div className="flex items-center gap-3">
                    <span className="h-px flex-1 bg-border" />
                    <span className="text-label-micro font-semibold tracking-[0.12em] text-ink-faint uppercase">hoặc</span>
                    <span className="h-px flex-1 bg-border" />
                </div>

                <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    className="w-full gap-3"
                    onClick={() => {
                        window.location.href = '/auth/google';
                    }}
                >
                    <img src="/google-color-svgrepo-com.svg" alt="" className="size-5" />
                    Tiếp tục với Google
                </Button>
            </form>

            <p className="mt-6 border-t border-border pt-5 text-body-sm text-ink-muted">
                Chưa có tài khoản?{' '}
                <TextLink href="/register" tone="accent" underline={false}>
                    Tạo tài khoản mới
                </TextLink>
            </p>

            <div className="mt-5 rounded-control border border-border bg-raw-linen/40 p-3.5 text-center">
                <p className="mb-2 text-body-sm text-ink-muted">Bạn là đối tác kinh doanh hoặc vận chuyển?</p>
                <div className="flex flex-wrap items-center justify-center gap-4 text-body-sm font-medium">
                    <TextLink href="/register/seller" tone="ink" underline={false}>
                        Bán hàng cùng ShopNest
                    </TextLink>
                    <span className="text-border">|</span>
                    <TextLink href="/register/shipper" tone="ink" underline={false}>
                        Giao vận đối tác
                    </TextLink>
                </div>
            </div>
        </AuthLayout>
    );
}

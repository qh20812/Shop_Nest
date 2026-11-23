import { Head, useForm } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';
import * as React from 'react';

import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { IconButton } from '@/components/ui/icon-button';
import Input from '@/components/ui/input';
import { PasswordStrength } from '@/components/ui/password-strength';
import { TextLink } from '@/components/ui/text-link';
import { Heading, Text } from '@/components/ui/typography';

interface ResetPasswordProps {
    email: string;
    token: string;
}

export default function ResetPassword({ email, token }: ResetPasswordProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token,
        email,
        password: '',
        password_confirmation: '',
    });
    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmation, setShowConfirmation] = React.useState(false);

    const onSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        post('/reset-password', {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout variant="centered">
            <Head title="Đặt lại mật khẩu" />

            <div className="sn-auth-page">
                <div className="sn-auth-page__intro">
                    <Heading level={1} size="headline-1">
                        Đặt lại mật khẩu
                    </Heading>
                    <Text size="body-md" tone="muted">
                        Tạo mật khẩu mới cho tài khoản {data.email}.
                    </Text>
                </div>

                <form onSubmit={onSubmit} className="sn-auth-page__form">
                    <input type="hidden" name="token" value={data.token} />
                    <input type="hidden" name="email" value={data.email} />

                    <FormField label="Email" error={errors.email ?? errors.token}>
                        <Input id="email" type="email" value={data.email} readOnly />
                    </FormField>

                    <div className="sn-auth-page__actions">
                        <FormField label="Mật khẩu mới" required error={errors.password}>
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                value={data.password}
                                onChange={(event) => setData('password', event.target.value)}
                                placeholder="Nhập mật khẩu mới"
                                autoComplete="new-password"
                                autoFocus
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
                        <PasswordStrength value={data.password} />
                    </div>

                    <FormField label="Xác nhận mật khẩu mới" required error={errors.password_confirmation}>
                        <Input
                            id="password_confirmation"
                            type={showConfirmation ? 'text' : 'password'}
                            value={data.password_confirmation}
                            onChange={(event) => setData('password_confirmation', event.target.value)}
                            placeholder="Nhập lại mật khẩu mới"
                            autoComplete="new-password"
                            invalid={Boolean(errors.password_confirmation)}
                            trailing={
                                <IconButton
                                    variant="ghost"
                                    size="sm"
                                    label={showConfirmation ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                                    onClick={() => setShowConfirmation((value) => !value)}
                                >
                                    {showConfirmation ? <EyeOff aria-hidden="true" /> : <Eye aria-hidden="true" />}
                                </IconButton>
                            }
                        />
                    </FormField>

                    <Button type="submit" size="lg" loading={processing} className="sn-auth-page__submit">
                        Đặt lại mật khẩu
                    </Button>
                </form>

                <p className="sn-auth-page__footnote sn-auth-page__footnote--center">
                    <TextLink href="/login" tone="muted" underline={false}>
                        Quay lại đăng nhập
                    </TextLink>
                </p>
            </div>
        </AuthLayout>
    );
}

import { Head, useForm } from '@inertiajs/react';
import { Eye, EyeOff, KeyRound, Mail } from 'lucide-react';
import * as React from 'react';

import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
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

            <div className="flex flex-col gap-2">
                <Heading level={1} size="headline-1">
                    Đặt lại mật khẩu
                </Heading>
                <Text size="body-md" tone="muted">
                    Tạo mật khẩu mới cho tài khoản {data.email}.
                </Text>
            </div>

            <form onSubmit={onSubmit} className="mt-7 flex flex-col gap-5">
                <input type="hidden" name="token" value={data.token} />
                <input type="hidden" name="email" value={data.email} />

                <FormField label="Email" error={errors.email ?? errors.token}>
                    <Input
                        id="email"
                        type="email"
                        value={data.email}
                        readOnly
                        leadingIcon={Mail}
                        className="cursor-not-allowed bg-raw-linen/50 text-ink-muted"
                    />
                </FormField>

                <div className="flex flex-col gap-1.5">
                    <FormField label="Mật khẩu mới" required error={errors.password}>
                        <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            value={data.password}
                            onChange={(event) => setData('password', event.target.value)}
                            placeholder="Nhập mật khẩu mới"
                            autoComplete="new-password"
                            leadingIcon={KeyRound}
                            autoFocus
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
                    <PasswordStrength value={data.password} className="mt-1" />
                </div>

                <FormField label="Xác nhận mật khẩu mới" required error={errors.password_confirmation}>
                    <Input
                        id="password_confirmation"
                        type={showConfirmation ? 'text' : 'password'}
                        value={data.password_confirmation}
                        onChange={(event) => setData('password_confirmation', event.target.value)}
                        placeholder="Nhập lại mật khẩu mới"
                        autoComplete="new-password"
                        leadingIcon={KeyRound}
                        invalid={Boolean(errors.password_confirmation)}
                        trailing={
                            <button
                                type="button"
                                aria-label={showConfirmation ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                                className="focus-ring flex size-control-sm items-center justify-center rounded-chip text-ink-muted transition-colors hover:bg-lacquer-wash hover:text-ink"
                                onClick={() => setShowConfirmation((value) => !value)}
                            >
                                {showConfirmation ? <EyeOff aria-hidden="true" className="size-4" /> : <Eye aria-hidden="true" className="size-4" />}
                            </button>
                        }
                    />
                </FormField>

                <Button type="submit" size="lg" loading={processing} className="w-full">
                    Đặt lại mật khẩu
                </Button>
            </form>

            <p className="mt-6 text-center text-body-sm text-ink-muted">
                <TextLink href="/login" tone="muted" underline={false}>
                    Quay lại đăng nhập
                </TextLink>
            </p>
        </AuthLayout>
    );
}

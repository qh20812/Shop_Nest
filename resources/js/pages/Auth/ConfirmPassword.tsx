import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import * as React from 'react';

import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { IconButton } from '@/components/ui/icon-button';
import Input from '@/components/ui/input';
import { Heading, Text } from '@/components/ui/typography';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({ password: '' });
    const [showPassword, setShowPassword] = React.useState(false);

    const onSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        post('/confirm-password', {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthLayout variant="centered">
            <Head title="Xác nhận mật khẩu" />

            <div className="sn-auth-page">
                <div className="sn-auth-page__intro">
                    <Heading level={1} size="headline-1">
                        Xác nhận mật khẩu
                    </Heading>
                    <Text size="body-md" tone="muted">
                        Vì lý do bảo mật, vui lòng nhập lại mật khẩu để tiếp tục.
                    </Text>
                </div>

                <form onSubmit={onSubmit} className="sn-auth-page__form">
                    <FormField label="Mật khẩu" required error={errors.password}>
                        <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            value={data.password}
                            onChange={(event) => setData('password', event.target.value)}
                            placeholder="Nhập mật khẩu"
                            autoComplete="current-password"
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

                    <Button type="submit" size="lg" loading={processing} className="sn-auth-page__submit">
                        Xác nhận
                    </Button>
                </form>

                <Link href="/" className="sn-auth-page__back">
                    <ArrowLeft aria-hidden="true" />
                    Về trang chủ
                </Link>
            </div>
        </AuthLayout>
    );
}

import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import * as React from 'react';

import { AuthLayout } from '@/components/layout/AuthLayout';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import Input from '@/components/ui/input';
import { Heading, Text } from '@/components/ui/typography';

interface ForgotPasswordProps {
    status?: string;
}

export default function ForgotPassword({ status }: ForgotPasswordProps) {
    const { data, setData, post, processing, errors, reset } = useForm({ email: '' });

    const onSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        post('/forgot-password', {
            onFinish: () => reset('email'),
        });
    };

    return (
        <AuthLayout variant="centered">
            <Head title="Quên mật khẩu" />

            <div className="sn-auth-page">
                <div className="sn-auth-page__intro">
                    <Heading level={1} size="headline-1">
                        Quên mật khẩu?
                    </Heading>
                    <Text size="body-md" tone="muted">
                        Nhập email để nhận liên kết đặt lại mật khẩu.
                    </Text>
                </div>

                {status && <Alert tone="success" description={status} />}

                <form onSubmit={onSubmit} className="sn-auth-page__form">
                    <FormField label="Email" required error={errors.email}>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            onChange={(event) => setData('email', event.target.value)}
                            placeholder="ban@example.com"
                            autoComplete="email"
                            autoFocus
                            invalid={Boolean(errors.email)}
                        />
                    </FormField>

                    <Button type="submit" size="lg" loading={processing} className="sn-auth-page__submit">
                        Gửi liên kết đặt lại
                    </Button>
                </form>

                <Link href="/login" className="sn-auth-page__back">
                    <ArrowLeft aria-hidden="true" />
                    Quay lại đăng nhập
                </Link>
            </div>
        </AuthLayout>
    );
}

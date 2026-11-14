import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Mail } from 'lucide-react';
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

            <div className="flex flex-col gap-2">
                <Heading level={1} size="headline-1">
                    Quên mật khẩu?
                </Heading>
                <Text size="body-md" tone="muted">
                    Nhập email để nhận liên kết đặt lại mật khẩu.
                </Text>
            </div>

            {status && <Alert tone="success" className="mt-5" description={status} />}

            <form onSubmit={onSubmit} className="mt-7 flex flex-col gap-5">
                <FormField label="Email" required error={errors.email}>
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        onChange={(event) => setData('email', event.target.value)}
                        placeholder="ban@example.com"
                        autoComplete="email"
                        leadingIcon={Mail}
                        autoFocus
                        invalid={Boolean(errors.email)}
                    />
                </FormField>

                <Button type="submit" size="lg" loading={processing} className="w-full">
                    Gửi liên kết đặt lại
                </Button>
            </form>

            <Link
                href="/login"
                className="focus-ring mt-6 inline-flex items-center gap-2 text-body-sm font-medium text-ink-muted transition-colors hover:text-lacquer-red"
            >
                <ArrowLeft aria-hidden="true" className="size-4" />
                Quay lại đăng nhập
            </Link>
        </AuthLayout>
    );
}

import { Head, useForm } from '@inertiajs/react';
import { KeyRound, ShieldCheck } from 'lucide-react';
import * as React from 'react';

import { AccountLayout } from '@/components/layout/AccountLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FormField } from '@/components/ui/form-field';
import Input from '@/components/ui/input';
import { PasswordStrength } from '@/components/ui/password-strength';
import { useToast } from '@/components/ui/toast';

import SettingsTabs from './SettingsTabs';

interface PasswordForm {
    current_password: string;
    password: string;
    password_confirmation: string;
}

export default function SettingsPassword() {
    const { success } = useToast();
    const { data, setData, put, processing, errors, reset, recentlySuccessful } = useForm<PasswordForm>({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        put('/settings/password', {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                success('Đã cập nhật mật khẩu');
            },
        });
    };

    const isValid = Boolean(data.current_password && data.password && data.password_confirmation);

    return (
        <AccountLayout
            active="settings"
            breadcrumbs={[{ label: 'Chợ', href: '/' }, { label: 'Tài khoản' }, { label: 'Cài đặt' }]}
            eyebrow="Cài đặt"
            title="Mật khẩu"
            description="Đổi mật khẩu định kỳ để bảo vệ tài khoản và đơn hàng của bạn."
        >
            <Head title="Cài đặt mật khẩu" />

            <div className="flex flex-col gap-5">
                <SettingsTabs />

                <div className="grid gap-6 lg:grid-cols-12">
                    <Card padding="lg" className="lg:col-span-7">
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <div className="flex items-center gap-2 border-b border-border pb-3">
                                <KeyRound aria-hidden="true" className="size-4 text-lacquer-red" />
                                <h2 className="text-headline-3 text-ink">Cập nhật mật khẩu</h2>
                            </div>

                            <FormField label="Mật khẩu hiện tại" required error={errors.current_password}>
                                <Input
                                    type="password"
                                    value={data.current_password}
                                    onChange={(event) => setData('current_password', event.target.value)}
                                    autoComplete="current-password"
                                    invalid={Boolean(errors.current_password)}
                                    required
                                />
                            </FormField>

                            <FormField label="Mật khẩu mới" required error={errors.password}>
                                <Input
                                    type="password"
                                    value={data.password}
                                    onChange={(event) => setData('password', event.target.value)}
                                    autoComplete="new-password"
                                    invalid={Boolean(errors.password)}
                                    required
                                />
                            </FormField>

                            <PasswordStrength value={data.password} />

                            <FormField label="Xác nhận mật khẩu" required error={errors.password_confirmation}>
                                <Input
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(event) => setData('password_confirmation', event.target.value)}
                                    autoComplete="new-password"
                                    invalid={Boolean(errors.password_confirmation)}
                                    required
                                />
                            </FormField>

                            <div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-end">
                                {recentlySuccessful && <span className="text-body-sm text-jade sm:mr-auto">Đã cập nhật mật khẩu.</span>}
                                <Button type="submit" loading={processing} disabled={!isValid}>
                                    Cập nhật mật khẩu
                                </Button>
                            </div>
                        </form>
                    </Card>

                    <Card padding="lg" variant="inset" className="flex flex-col gap-4 lg:col-span-5">
                        <div className="flex items-center gap-2">
                            <ShieldCheck aria-hidden="true" className="size-5 text-jade" />
                            <h2 className="text-headline-3 text-ink">Tiêu chuẩn mật khẩu</h2>
                        </div>
                        <ul className="flex list-disc flex-col gap-2 pl-5 text-body-sm text-ink-muted">
                            <li>Tối thiểu 8 ký tự.</li>
                            <li>Không trùng mật khẩu đang dùng.</li>
                            <li>Nên có chữ hoa, chữ số và ký tự đặc biệt.</li>
                            <li>Không dùng lại mật khẩu email hoặc mạng xã hội.</li>
                        </ul>
                    </Card>
                </div>
            </div>
        </AccountLayout>
    );
}

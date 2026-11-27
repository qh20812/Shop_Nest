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
import styles from './settings.module.css';

interface PasswordForm {
    current_password: string;
    password: string;
    password_confirmation: string;
}

const INSET_VARIANT = 'inset' as const;

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

            <div className={styles.stack}>
                <SettingsTabs />

                <div className={styles.grid}>
                    <Card padding="lg" className={styles.mainCard}>
                        <form onSubmit={handleSubmit} className={styles.formStack}>
                            <div className={styles.cardHead}>
                                <KeyRound aria-hidden="true" className={styles.iconAccent} />
                                <h2 className={styles.cardTitle}>Cập nhật mật khẩu</h2>
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

                            <div className={styles.formFooter}>
                                {recentlySuccessful ? <span className={styles.formStatus}>Đã cập nhật mật khẩu.</span> : null}
                                <Button type="submit" loading={processing} disabled={!isValid}>
                                    Cập nhật mật khẩu
                                </Button>
                            </div>
                        </form>
                    </Card>

                    <Card padding="lg" variant={INSET_VARIANT} className={styles.sideCard}>
                        <div className={styles.cardHeadPlain}>
                            <ShieldCheck aria-hidden="true" className={styles.iconSuccess} />
                            <h2 className={styles.cardTitle}>Tiêu chuẩn mật khẩu</h2>
                        </div>
                        <ul className={styles.tipsList}>
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

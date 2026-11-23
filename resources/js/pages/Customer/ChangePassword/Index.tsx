import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Eye, EyeOff, KeyRound } from 'lucide-react';
import * as React from 'react';

import { AccountLayout } from '@/components/layout/AccountLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FormField } from '@/components/ui/form-field';
import Input from '@/components/ui/input';
import { PasswordStrength } from '@/components/ui/password-strength';
import { useToast } from '@/components/ui/toast';

import styles from '../customer.module.css';

interface PageProps extends Record<string, unknown> {
    errors?: Record<string, string>;
}

interface PasswordForm {
    current_password: string;
    new_password: string;
    confirm_password: string;
    [key: string]: string;
}

const INSET_VARIANT = 'inset' as const;

const emptyForm: PasswordForm = {
    current_password: '',
    new_password: '',
    confirm_password: '',
};

export default function ChangePasswordIndex() {
    const { errors: pageErrors = {} } = usePage<PageProps>().props;
    const { success, error: showError } = useToast();
    const [form, setForm] = React.useState<PasswordForm>(emptyForm);
    const [errors, setErrors] = React.useState<Record<string, string>>(pageErrors);
    const [show, setShow] = React.useState({ current: false, next: false, confirm: false });
    const [processing, setProcessing] = React.useState(false);

    React.useEffect(() => {
        setErrors(pageErrors);
    }, [pageErrors]);

    const update = (field: keyof PasswordForm) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setForm((current) => ({ ...current, [field]: event.target.value }));
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setErrors({});

        if (form.new_password !== form.confirm_password) {
            setErrors({ confirm_password: 'Mật khẩu xác nhận không khớp.' });
            return;
        }

        setProcessing(true);

        router.post('/user/change-password', form, {
            preserveScroll: true,
            onSuccess: () => {
                setForm(emptyForm);
                success('Đã đổi mật khẩu');
            },
            onError: (nextErrors) => {
                setErrors(nextErrors as Record<string, string>);
                showError('Không thể đổi mật khẩu', 'Vui lòng kiểm tra lại mật khẩu hiện tại.');
            },
            onFinish: () => setProcessing(false),
        });
    };

    const isValid = Boolean(form.current_password && form.new_password && form.confirm_password);

    const revealButton = (key: keyof typeof show, label: string) => (
        <button
            type="button"
            aria-label={show[key] ? `Ẩn ${label}` : `Hiện ${label}`}
            className={styles.reveal}
            onClick={() => setShow((current) => ({ ...current, [key]: !current[key] }))}
        >
            {show[key] ? <EyeOff aria-hidden="true" className={styles.revealIcon} /> : <Eye aria-hidden="true" className={styles.revealIcon} />}
        </button>
    );

    return (
        <AccountLayout
            active="password"
            breadcrumbs={[{ label: 'Chợ', href: '/' }, { label: 'Tài khoản' }, { label: 'Mật khẩu' }]}
            eyebrow="Bảo mật"
            title="Đổi mật khẩu"
            description="Dùng mật khẩu dài, khó đoán và không chia sẻ với người khác."
            actions={
                <Button variant="secondary" size="sm" leftIcon={ArrowLeft} asChild>
                    <Link href="/user/profile">Về hồ sơ</Link>
                </Button>
            }
        >
            <Head title="Đổi mật khẩu" />

            <div className={styles.passwordGrid}>
                <Card padding="lg" className={styles.passwordCard}>
                    <form onSubmit={handleSubmit} className={styles.formStack}>
                        <div className={styles.cardHead}>
                            <KeyRound aria-hidden="true" className={styles.iconAccent} />
                            <h2 className={styles.cardTitle}>Mật khẩu đăng nhập</h2>
                        </div>

                        <FormField label="Mật khẩu hiện tại" required error={errors.current_password}>
                            <Input
                                type={show.current ? 'text' : 'password'}
                                value={form.current_password}
                                onChange={update('current_password')}
                                autoComplete="current-password"
                                invalid={Boolean(errors.current_password)}
                                trailing={revealButton('current', 'mật khẩu hiện tại')}
                                required
                            />
                        </FormField>

                        <FormField label="Mật khẩu mới" required error={errors.new_password}>
                            <Input
                                type={show.next ? 'text' : 'password'}
                                value={form.new_password}
                                onChange={update('new_password')}
                                autoComplete="new-password"
                                invalid={Boolean(errors.new_password)}
                                trailing={revealButton('next', 'mật khẩu mới')}
                                required
                            />
                        </FormField>

                        <PasswordStrength value={form.new_password} />

                        <FormField label="Xác nhận mật khẩu mới" required error={errors.confirm_password}>
                            <Input
                                type={show.confirm ? 'text' : 'password'}
                                value={form.confirm_password}
                                onChange={update('confirm_password')}
                                autoComplete="new-password"
                                invalid={Boolean(errors.confirm_password)}
                                trailing={revealButton('confirm', 'mật khẩu xác nhận')}
                                required
                            />
                        </FormField>

                        <div className={styles.formFooter}>
                            <Button type="button" variant="secondary" asChild>
                                <Link href="/user/profile">Huỷ</Link>
                            </Button>
                            <Button type="submit" loading={processing} disabled={!isValid}>
                                Cập nhật mật khẩu
                            </Button>
                        </div>
                    </form>
                </Card>

                <Card padding="lg" variant={INSET_VARIANT} className={styles.tipsCard}>
                    <h3 className={styles.cardTitle}>Mẹo bảo mật</h3>
                    <ul className={styles.tipsList}>
                        <li>Mật khẩu tối thiểu 8 ký tự, nên có chữ hoa, số và ký tự đặc biệt.</li>
                        <li>Không dùng lại mật khẩu của email hoặc mạng xã hội.</li>
                        <li>Đăng xuất khỏi thiết bị lạ sau khi đổi mật khẩu.</li>
                    </ul>
                </Card>
            </div>
        </AccountLayout>
    );
}

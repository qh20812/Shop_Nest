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
import { useTranslation } from '@/lib/i18n';

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
    const { t } = useTranslation();
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
            setErrors({ confirm_password: t('Password confirmation does not match.') });
            return;
        }

        setProcessing(true);

        router.post('/user/change-password', form, {
            preserveScroll: true,
            onSuccess: () => {
                setForm(emptyForm);
                success(t('Password changed'));
            },
            onError: (nextErrors) => {
                setErrors(nextErrors as Record<string, string>);
                showError(t('Could not change the password'), t('Please check your current password.'));
            },
            onFinish: () => setProcessing(false),
        });
    };

    const isValid = Boolean(form.current_password && form.new_password && form.confirm_password);

    const revealButton = (key: keyof typeof show, label: string) => (
        <button
            type="button"
            aria-label={show[key] ? t('Hide :label', { label }) : t('Show :label', { label })}
            className={styles.reveal}
            onClick={() => setShow((current) => ({ ...current, [key]: !current[key] }))}
        >
            {show[key] ? <EyeOff aria-hidden="true" className={styles.revealIcon} /> : <Eye aria-hidden="true" className={styles.revealIcon} />}
        </button>
    );

    return (
        <AccountLayout
            active="password"
            breadcrumbs={[{ label: t('Market'), href: '/' }, { label: t('Account') }, { label: t('Password') }]}
            eyebrow={t('Security')}
            title={t('Change password')}
            description={t('Use a long, hard-to-guess password and never share it.')}
            actions={
                <Button variant="secondary" size="sm" leftIcon={ArrowLeft} asChild>
                    <Link href="/user/profile">{t('Back to profile')}</Link>
                </Button>
            }
        >
            <Head title={t('Change password')} />

            <div className={styles.passwordGrid}>
                <Card padding="lg" className={styles.passwordCard}>
                    <form onSubmit={handleSubmit} className={styles.formStack}>
                        <div className={styles.cardHead}>
                            <KeyRound aria-hidden="true" className={styles.iconAccent} />
                            <h2 className={styles.cardTitle}>{t('Sign-in password')}</h2>
                        </div>

                        <FormField label={t('Current password')} required error={errors.current_password}>
                            <Input
                                type={show.current ? 'text' : 'password'}
                                value={form.current_password}
                                onChange={update('current_password')}
                                autoComplete="current-password"
                                invalid={Boolean(errors.current_password)}
                                trailing={revealButton('current', t('current password'))}
                                required
                            />
                        </FormField>

                        <FormField label={t('New password')} required error={errors.new_password}>
                            <Input
                                type={show.next ? 'text' : 'password'}
                                value={form.new_password}
                                onChange={update('new_password')}
                                autoComplete="new-password"
                                invalid={Boolean(errors.new_password)}
                                trailing={revealButton('next', t('new password'))}
                                required
                            />
                        </FormField>

                        <PasswordStrength value={form.new_password} />

                        <FormField label={t('Confirm new password')} required error={errors.confirm_password}>
                            <Input
                                type={show.confirm ? 'text' : 'password'}
                                value={form.confirm_password}
                                onChange={update('confirm_password')}
                                autoComplete="new-password"
                                invalid={Boolean(errors.confirm_password)}
                                trailing={revealButton('confirm', t('password confirmation'))}
                                required
                            />
                        </FormField>

                        <div className={styles.formFooter}>
                            <Button type="button" variant="secondary" asChild>
                                <Link href="/user/profile">{t('Cancel')}</Link>
                            </Button>
                            <Button type="submit" loading={processing} disabled={!isValid}>
                                {t('Update password')}
                            </Button>
                        </div>
                    </form>
                </Card>

                <Card padding="lg" variant={INSET_VARIANT} className={styles.tipsCard}>
                    <h3 className={styles.cardTitle}>{t('Security tips')}</h3>
                    <ul className={styles.tipsList}>
                        <li>{t('At least 8 characters, ideally with uppercase letters, numbers and symbols.')}</li>
                        <li>{t('Do not reuse passwords from your email or social accounts.')}</li>
                        <li>{t('Sign out of unfamiliar devices after changing your password.')}</li>
                    </ul>
                </Card>
            </div>
        </AccountLayout>
    );
}

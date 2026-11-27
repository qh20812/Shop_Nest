import { Link, useForm } from '@inertiajs/react';
import { Check, Info, ShieldCheck, UserRound } from 'lucide-react';
import React from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import FormField from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useTranslation } from '@/lib/i18n';

import styles from '@/pages/Admin/Users/Edit.module.css';

interface Role {
    id: number;
    name: Record<string, string>;
    description?: Record<string, string>;
}

interface User {
    id: number;
    username?: string | null;
    first_name: string;
    last_name: string;
    email: string;
    is_active: boolean;
    roles: Role[];
}

interface UserEditFormProps {
    user: User;
    roles: Role[];
    isSelf: boolean;
}

const resolveText = (value: Record<string, string> | undefined, locale: string): string => {
    if (!value) {
        return '';
    }

    return value[locale] ?? value.en ?? Object.values(value)[0] ?? '';
};

export default function UserEditForm({ user, roles, isSelf }: UserEditFormProps) {
    const { t, locale } = useTranslation();
    const currentRole = user.roles[0];

    const { data, setData, put, processing, errors, transform } = useForm({
        first_name: user.first_name ?? '',
        last_name: user.last_name ?? '',
        email: user.email ?? '',
        is_active: user.is_active ? 1 : 0,
        role_id: currentRole?.id ?? '',
    });

    // Tự sửa mình chỉ gửi thông tin cá nhân; vai trò và trạng thái do backend giữ nguyên.
    transform((form) =>
        isSelf
            ? {
                  first_name: form.first_name,
                  last_name: form.last_name,
                  email: form.email,
              }
            : form,
    );

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        put(`/admin/users/${user.id}`, { preserveScroll: true });
    };

    return (
        <div className={styles.panel}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <section className={styles.section} aria-labelledby="account-information">
                    <div className={styles.sectionHead}>
                        <h2 id="account-information" className={styles.sectionTitle}>
                            <UserRound aria-hidden="true" className={styles.sectionIcon} />
                            {t('Account information')}
                        </h2>
                    </div>

                    <div className={styles.fieldGrid}>
                        <FormField label={t('Last Name')} htmlFor="user-last-name" required error={errors.last_name}>
                            <Input
                                id="user-last-name"
                                name="last_name"
                                value={data.last_name}
                                onChange={(event) => setData('last_name', event.target.value)}
                                placeholder={t('Enter your last name')}
                                autoComplete="family-name"
                                required
                            />
                        </FormField>

                        <FormField label={t('First Name')} htmlFor="user-first-name" required error={errors.first_name}>
                            <Input
                                id="user-first-name"
                                name="first_name"
                                value={data.first_name}
                                onChange={(event) => setData('first_name', event.target.value)}
                                placeholder={t('Enter your first name')}
                                autoComplete="given-name"
                                required
                            />
                        </FormField>
                    </div>

                    <FormField
                        label="Email"
                        htmlFor="user-email"
                        required
                        error={errors.email}
                        hint={t('Email is used to sign in and receive notifications.')}
                    >
                        <Input
                            id="user-email"
                            name="email"
                            type="email"
                            value={data.email}
                            onChange={(event) => setData('email', event.target.value)}
                            placeholder={t('Enter your email')}
                            autoComplete="email"
                            required
                        />
                    </FormField>
                </section>

                <section className={styles.section} aria-labelledby="account-access">
                    <div className={styles.sectionHead}>
                        <h2 id="account-access" className={styles.sectionTitle}>
                            <ShieldCheck aria-hidden="true" className={styles.sectionIcon} />
                            {t('Access')}
                        </h2>
                        {!isSelf && <p className={styles.sectionNote}>{t('Changing the role changes what this account can access.')}</p>}
                    </div>

                    {isSelf ? (
                        <>
                            <div className={styles.readonlyGrid}>
                                <div className={styles.readonlyItem}>
                                    <span className={styles.readonlyLabel}>{t('Status')}</span>
                                    <span className={styles.readonlyValue}>
                                        <Badge tone={user.is_active ? 'success' : 'neutral'}>{t(user.is_active ? 'Active' : 'Inactive')}</Badge>
                                    </span>
                                </div>
                                <div className={styles.readonlyItem}>
                                    <span className={styles.readonlyLabel}>{t('Current role')}</span>
                                    <span className={styles.readonlyValue}>
                                        {currentRole ? <Badge tone="neutral">{resolveText(currentRole.name, locale)}</Badge> : '-'}
                                    </span>
                                </div>
                            </div>

                            <p className={styles.lockNote}>
                                <Info aria-hidden="true" className={styles.lockIcon} />
                                <span>{t('Role and status are locked for your own account.')}</span>
                            </p>
                        </>
                    ) : (
                        <>
                            <FormField label={t('Status')} htmlFor="user-status" error={errors.is_active}>
                                <Select
                                    id="user-status"
                                    name="is_active"
                                    value={String(data.is_active)}
                                    onChange={(event) => setData('is_active', Number(event.target.value))}
                                >
                                    <option value="1">{t('Active')}</option>
                                    <option value="0">{t('Inactive')}</option>
                                </Select>
                            </FormField>

                            <div className={styles.roleGroup}>
                                <span id="user-role-label" className={styles.roleLabel}>
                                    {t('Role')}{' '}
                                    <span aria-hidden="true" className={styles.roleRequired}>
                                        *
                                    </span>
                                </span>
                                <div className={styles.roleRegister} role="radiogroup" aria-labelledby="user-role-label">
                                    {roles.map((role) => {
                                        const roleName = resolveText(role.name, locale);
                                        const roleDescription = resolveText(role.description, locale);
                                        const isChecked = Number(data.role_id) === role.id;

                                        return (
                                            <label key={role.id} className={styles.roleChoice}>
                                                <input
                                                    type="radio"
                                                    name="role_id"
                                                    value={role.id}
                                                    checked={isChecked}
                                                    onChange={() => setData('role_id', role.id)}
                                                    className={styles.roleRadio}
                                                />
                                                <span className={styles.roleOption}>
                                                    <span className={styles.roleOptionHead}>
                                                        <span className={styles.roleName}>{roleName}</span>
                                                        {isChecked && <Check aria-hidden="true" className={styles.roleCheck} />}
                                                    </span>
                                                    {roleDescription && <span className={styles.roleDescription}>{roleDescription}</span>}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                                {errors.role_id && (
                                    <span className={styles.roleError} role="alert">
                                        {errors.role_id}
                                    </span>
                                )}
                            </div>
                        </>
                    )}
                </section>

                <div className={styles.footer}>
                    <Button asChild variant="secondary">
                        <Link href="/admin/users">{t('Cancel')}</Link>
                    </Button>
                    <Button type="submit" variant="primary" loading={processing}>
                        {t('Save changes')}
                    </Button>
                </div>
            </form>
        </div>
    );
}

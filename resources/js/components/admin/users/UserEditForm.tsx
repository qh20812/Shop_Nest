import { router, usePage } from '@inertiajs/react';
import { UserRound } from 'lucide-react';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import FormField from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useTranslation } from '@/lib/i18n';

import styles from '../forms.module.css';

interface Role {
    id: number;
    name: Record<string, string>;
}

interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    is_active: boolean;
    roles: Role[];
}

interface AuthUser {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
}

interface PageProps {
    auth: {
        user: AuthUser;
    };
    [key: string]: unknown;
}

interface UserEditFormProps {
    user: User;
    roles: Role[];
    errors: Record<string, string>;
}

export default function UserEditForm({ user, roles, errors }: UserEditFormProps) {
    const { auth } = usePage<PageProps>().props;
    const currentUserId = auth.user.id;
    const isEditingSelf = user.id === currentUserId;

    const [values, setValues] = useState({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        is_active: user.is_active ? 1 : 0,
        role_id: user.roles[0]?.id ?? '',
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setValues((previous) => ({ ...previous, [name]: value }));
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        router.put(`/admin/users/${user.id}`, values);
    };

    const { t, locale } = useTranslation();

    return (
        <section className={styles.panel}>
            <div className={styles.panelHead}>
                <h2 className={styles.panelTitle}>
                    <UserRound aria-hidden="true" className={styles.panelIcon} />
                    {t('User Information')}
                </h2>
            </div>

            <form onSubmit={handleSubmit} className={styles.formGridSingle}>
                <div className={styles.formGrid}>
                    <FormField label={t('Last Name')} htmlFor="user-first-name" required error={errors.first_name}>
                        <Input
                            id="user-first-name"
                            name="first_name"
                            value={values.first_name}
                            onChange={handleChange}
                            placeholder={t('Enter your last name')}
                            disabled
                        />
                    </FormField>

                    <FormField label={t('First Name')} htmlFor="user-last-name" required error={errors.last_name}>
                        <Input
                            id="user-last-name"
                            name="last_name"
                            value={values.last_name}
                            onChange={handleChange}
                            placeholder={t('Enter your first name')}
                            disabled
                        />
                    </FormField>
                </div>

                <FormField label="Email" htmlFor="user-email" required error={errors.email}>
                    <Input
                        id="user-email"
                        name="email"
                        type="email"
                        value={values.email}
                        onChange={handleChange}
                        placeholder={t('Enter your email')}
                        disabled
                    />
                </FormField>

                <FormField label={t('Status')} htmlFor="user-status" error={errors.is_active}>
                    <Select id="user-status" name="is_active" value={String(values.is_active)} onChange={handleChange} disabled={isEditingSelf}>
                        <option value="1">{t('Active')}</option>
                        <option value="0">{t('Inactive')}</option>
                    </Select>
                </FormField>

                <div className={styles.roleGroup}>
                    <span className={styles.fileLabel}>
                        {t('Role')} <span aria-hidden="true">*</span>
                    </span>
                    <div className={styles.roleGrid}>
                        {roles.map((role) => {
                            const isSelected = values.role_id === role.id;
                            const isDisabled = isEditingSelf || isSelected;
                            const roleName = role.name[locale] || role.name['en'];

                            return (
                                <label
                                    key={role.id}
                                    className={`${styles.roleOption} ${isSelected ? styles.roleOptionSelected : ''} ${
                                        isEditingSelf ? styles.roleOptionDisabled : ''
                                    }`.trim()}
                                >
                                    <input
                                        type="radio"
                                        name="role_id"
                                        className={styles.roleRadio}
                                        checked={isSelected}
                                        disabled={isDisabled}
                                        onChange={() => !isEditingSelf && setValues((previous) => ({ ...previous, role_id: role.id }))}
                                    />
                                    <span>{roleName}</span>
                                </label>
                            );
                        })}
                    </div>
                    {errors.role_id && <span className={styles.fileError}>{errors.role_id}</span>}
                </div>

                <div className={styles.footer}>
                    <Button type="button" variant="secondary" onClick={() => window.history.back()}>
                        {t('Cancel')}
                    </Button>
                    <Button type="submit" variant="primary">
                        {t('Update')}
                    </Button>
                </div>
            </form>
        </section>
    );
}

import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Info } from 'lucide-react';

import UserEditForm from '@/components/admin/users/UserEditForm';
import { PageHeader } from '@/components/layout/PageHeader';
import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/format';
import { useTranslation } from '@/lib/i18n';

import adminStyles from '@/components/admin/admin.module.css';
import styles from './Edit.module.css';

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
    email_verified_at?: string | null;
    avatar?: string | null;
    is_active: boolean;
    created_at?: string | null;
    roles: Role[];
}

interface PageProps {
    user: User;
    roles: Role[];
    auth: {
        user: {
            id: number;
        };
    };
    [key: string]: unknown;
}

const resolveText = (value: Record<string, string> | undefined, locale: string): string => {
    if (!value) {
        return '';
    }

    return value[locale] ?? value.en ?? Object.values(value)[0] ?? '';
};

export default function Edit() {
    const { user, roles, auth } = usePage<PageProps>().props;
    const { t, locale } = useTranslation();

    const isSelf = auth.user.id === user.id;
    const fullName = `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim() || user.username || t('Unknown User');
    const currentRole = user.roles[0];

    return (
        <WorkspaceLayout>
            <Head title={`${t('Edit User')} - ${fullName}`} />

            <div className={adminStyles.stack}>
                <PageHeader
                    breadcrumbs={[
                        { label: t('Dashboard'), href: '/admin/dashboard' },
                        { label: t('Users'), href: '/admin/users' },
                        { label: fullName, current: true },
                    ]}
                    title={t('Edit User')}
                    description={t('Update account details, status and role.')}
                    actions={
                        <Button asChild variant="secondary" size="sm">
                            <Link href="/admin/users">
                                <ArrowLeft aria-hidden="true" />
                                {t('Back to list')}
                            </Link>
                        </Button>
                    }
                />

                <div className={styles.layout}>
                    <UserEditForm user={user} roles={roles} isSelf={isSelf} />

                    <aside className={styles.rail} aria-label={t('Profile')}>
                        <div className={styles.profileHead}>
                            <Avatar user={user} size="xl" />
                            <div className={styles.profileIdentity}>
                                <h2 className={styles.profileName}>{fullName}</h2>
                                {user.username && <span className={styles.profileHandle}>@{user.username}</span>}
                                <div className={styles.profileBadges}>
                                    <Badge tone={user.is_active ? 'success' : 'neutral'}>{t(user.is_active ? 'Active' : 'Inactive')}</Badge>
                                    {currentRole && <Badge tone="neutral">{resolveText(currentRole.name, locale)}</Badge>}
                                </div>
                            </div>
                        </div>

                        {isSelf && (
                            <p className={styles.lockNote}>
                                <Info aria-hidden="true" className={styles.lockIcon} />
                                <span>{t('This is your account')}</span>
                            </p>
                        )}

                        <dl className={styles.facts}>
                            <div className={styles.fact}>
                                <dt className={styles.factLabel}>{t('User ID')}</dt>
                                <dd className={styles.factValue}>#{user.id}</dd>
                            </div>
                            <div className={styles.fact}>
                                <dt className={styles.factLabel}>{t('Username')}</dt>
                                <dd className={styles.factValue}>{user.username ?? '-'}</dd>
                            </div>
                            <div className={styles.fact}>
                                <dt className={styles.factLabel}>{t('Joined')}</dt>
                                <dd className={styles.factValue}>{user.created_at ? formatDate(user.created_at) : '-'}</dd>
                            </div>
                            <div className={styles.fact}>
                                <dt className={styles.factLabel}>{t('Email verified')}</dt>
                                <dd className={styles.factValue}>
                                    {user.email_verified_at ? formatDate(user.email_verified_at) : t('Not verified')}
                                </dd>
                            </div>
                        </dl>
                    </aside>
                </div>
            </div>
        </WorkspaceLayout>
    );
}

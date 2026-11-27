import { Head, router, usePage } from '@inertiajs/react';
import { Lock, LockOpen, Pencil, Search, Users as UsersIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import Toast from '@/components/admin/users/Toast';
import { PageHeader } from '@/components/layout/PageHeader';
import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import ActionButtons, { type ActionConfig } from '@/components/ui/action-buttons';
import Avatar from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ConfirmationModal from '@/components/ui/confirmation-modal';
import DataTable from '@/components/ui/data-table';
import FormField from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import Pagination from '@/components/ui/pagination';
import { Select } from '@/components/ui/select';
import StatusBadge from '@/components/ui/status-badge';
import { cx } from '@/lib/cx';
import { formatNumber } from '@/lib/format';
import { useTranslation } from '@/lib/i18n';

import adminStyles from '@/components/admin/admin.module.css';
import styles from './Users.module.css';

interface Role {
    id: number;
    name: Record<string, string>;
}

interface User {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    is_active: boolean;
    roles: Role[];
    avatar?: string | null;
    avatar_url?: string | null;
}

interface AuthUser {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
}

interface PageProps {
    users: {
        data: User[];
        links: { url: string | null; label: string; active: boolean }[];
        total?: number;
        from?: number | null;
        to?: number | null;
    };
    roles: string[];
    totalUsers: number;
    filters: { search?: string; role?: string; status?: string };
    flash?: { success?: string; error?: string };
    auth: {
        user: AuthUser;
    };
    [key: string]: unknown;
}

export default function Index() {
    const { t, locale } = useTranslation();
    const { users, roles, totalUsers = 0, filters = {}, flash, auth } = usePage<PageProps>().props;
    const currentUserId = auth.user.id;

    const [search, setSearch] = useState(filters.search || '');
    const [role, setRole] = useState(filters.role || '');
    const [status, setStatus] = useState(filters.status || '');
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; userId: number | null; userName: string }>({
        isOpen: false,
        userId: null,
        userName: '',
    });

    useEffect(() => {
        if (flash?.success) {
            setToast({ type: 'success', message: flash.success });
        } else if (flash?.error) {
            setToast({ type: 'error', message: flash.error });
        }
    }, [flash]);

    useEffect(() => {
        const delayTimer = setTimeout(() => {
            if (search !== filters.search) {
                router.get(
                    '/admin/users',
                    {
                        search: search || undefined,
                        role: role || undefined,
                        status: status || undefined,
                    },
                    {
                        preserveState: true,
                        preserveScroll: true,
                    },
                );
            }
        }, 500);

        return () => clearTimeout(delayTimer);
    }, [search, filters.search, role, status]);

    const applyFilters = () => {
        router.get('/admin/users', { search, role, status }, { preserveState: true });
    };

    const handleStatusToggle = (id: number) => {
        const user = users.data.find((entry) => entry.id === id);
        const fullName = user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : '';
        const userName = fullName || user?.username || t('Unknown User');

        setConfirmModal({ isOpen: true, userId: id, userName });
    };

    const handleConfirmStatusToggle = () => {
        if (confirmModal.userId) {
            router.delete(`/admin/users/${confirmModal.userId}`);
        }
    };

    const handleCloseModal = () => {
        setConfirmModal({ isOpen: false, userId: null, userName: '' });
    };

    const breadcrumbs = [
        { label: t('Dashboard'), href: '/admin/dashboard' },
        { label: t('Users'), current: true },
    ];

    const filteredTotal = users.total ?? totalUsers;
    const rangeLabel =
        filteredTotal > 0 ? `${formatNumber(users.from ?? 0)}-${formatNumber(users.to ?? 0)} / ${formatNumber(filteredTotal)}` : formatNumber(0);

    const userColumns = [
        {
            key: 'user',
            header: t('User'),
            cell: (user: User) => {
                const isCurrentUser = user.id === currentUserId;
                const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim();
                const displayName = fullName || user.username || t('Unknown User');
                const userForAvatar = { ...user } as User;

                if (userForAvatar.avatar && !userForAvatar.avatar.startsWith('http') && !userForAvatar.avatar.startsWith('/')) {
                    userForAvatar.avatar_url = userForAvatar.avatar_url || `/storage/${userForAvatar.avatar}`;
                }

                return (
                    <div className={adminStyles.avatarCell}>
                        <Avatar user={userForAvatar} />
                        <div className={styles.identity}>
                            <span className={styles.identityName}>
                                <span className={styles.identityNameText}>{displayName}</span>
                                {isCurrentUser && <span className={styles.you}>({t('You')})</span>}
                            </span>
                            <span className={styles.identityMeta}>
                                <span className={styles.identityId}>#{user.id}</span>
                                <span className={styles.identityEmail} title={user.email}>
                                    {user.email}
                                </span>
                            </span>
                        </div>
                    </div>
                );
            },
        },
        {
            key: 'roles',
            header: t('Role'),
            cell: (user: User) => (
                <div className={styles.roles}>
                    {user.roles.map((userRole) => {
                        const roleName = userRole.name[locale] || userRole.name['en'];

                        return (
                            <Badge key={userRole.id} tone="neutral">
                                {roleName}
                            </Badge>
                        );
                    })}
                </div>
            ),
        },
        {
            key: 'status',
            header: t('Status'),
            cell: (user: User) => <StatusBadge status={user.is_active ? 'active' : 'inactive'} />,
        },
        {
            key: 'actions',
            header: t('Actions'),
            cell: (user: User) => {
                const isCurrentUser = user.id === currentUserId;
                const actions: ActionConfig[] = [
                    {
                        type: 'link',
                        href: `/admin/users/${user.id}/edit`,
                        variant: 'primary',
                        icon: Pencil,
                        label: t('Edit'),
                    },
                ];

                actions.push({
                    type: 'button',
                    onClick: () => handleStatusToggle(user.id),
                    variant: user.is_active ? 'danger' : 'primary',
                    icon: user.is_active ? Lock : LockOpen,
                    label: user.is_active ? t('Deactivate') : t('Activate'),
                    disabled: isCurrentUser,
                });

                return <ActionButtons actions={actions} />;
            },
        },
    ];

    return (
        <WorkspaceLayout>
            <Head title={t('User Management')} />

            {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

            <div className={adminStyles.stack}>
                <PageHeader breadcrumbs={breadcrumbs} title={t('User Management')} count={formatNumber(totalUsers)} />

                <form
                    className={cx(styles.filters, 'sn-glass-surface')}
                    aria-label={t('Filters')}
                    onSubmit={(event) => {
                        event.preventDefault();
                        applyFilters();
                    }}
                >
                    <FormField label={t('Search')} htmlFor="user-search">
                        <Input
                            id="user-search"
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder={t('Search by name or email...')}
                            leadingIcon={Search}
                            surface="glass"
                        />
                    </FormField>

                    <FormField label={t('Role')} htmlFor="user-role">
                        <Select id="user-role" value={role} onChange={(event) => setRole(event.target.value)} surface="glass">
                            <option value="">{t('-- All Roles --')}</option>
                            {roles.map((roleName) => (
                                <option key={roleName} value={roleName}>
                                    {roleName}
                                </option>
                            ))}
                        </Select>
                    </FormField>

                    <FormField label={t('Status')} htmlFor="user-status">
                        <Select id="user-status" value={status} onChange={(event) => setStatus(event.target.value)} surface="glass">
                            <option value="">{t('-- All Statuses --')}</option>
                            <option value="1">{t('Active')}</option>
                            <option value="0">{t('Inactive')}</option>
                        </Select>
                    </FormField>

                    <div className={styles.filterActions}>
                        <Button type="submit" variant="primary" leftIcon={Search}>
                            {t('Apply')}
                        </Button>
                    </div>
                </form>

                <div className={styles.table}>
                    <DataTable
                        columns={userColumns}
                        data={users.data}
                        headerTitle={t('Users')}
                        headerIcon={UsersIcon}
                        headerMeta={rangeLabel}
                        emptyMessage={t('No users found')}
                    />
                </div>

                <Pagination links={users.links} />
            </div>

            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmStatusToggle}
                title={t('Confirm User Status Change')}
                message={`${t('Are you sure you want to change the status of user')} "${confirmModal.userName}"?`}
            />
        </WorkspaceLayout>
    );
}

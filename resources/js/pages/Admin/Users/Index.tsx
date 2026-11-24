import { Head, router, usePage } from '@inertiajs/react';
import { Lock, LockOpen, Pencil, Receipt } from 'lucide-react';
import { useEffect, useState } from 'react';

import Toast from '@/components/admin/users/Toast';
import ActionButtons, { type ActionConfig } from '@/components/ui/action-buttons';
import Avatar from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import ConfirmationModal from '@/components/ui/confirmation-modal';
import DataTable from '@/components/ui/data-table';
import FilterPanel from '@/components/ui/filter-panel';
import Pagination from '@/components/ui/pagination';
import StatusBadge from '@/components/ui/status-badge';
import AppLayout from '@/layouts/app/AppLayout';
import { useTranslation } from '@/lib/i18n';

import styles from '@/components/admin/admin.module.css';

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

    const userColumns = [
        {
            key: 'id',
            header: 'ID',
            cell: (user: User) => <span className={styles.numeric}>#{user.id}</span>,
        },
        {
            key: 'name',
            header: t('Full Name'),
            cell: (user: User) => {
                const isCurrentUser = user.id === currentUserId;
                const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim();
                const displayName = fullName || user.username || t('Unknown User');
                const userForAvatar = { ...user } as User;

                if (userForAvatar.avatar && !userForAvatar.avatar.startsWith('http') && !userForAvatar.avatar.startsWith('/')) {
                    userForAvatar.avatar_url = userForAvatar.avatar_url || `/storage/${userForAvatar.avatar}`;
                }

                return (
                    <div className={styles.avatarCell}>
                        <Avatar user={userForAvatar} />
                        <div className={styles.avatarBody}>
                            <span className={styles.avatarName}>{displayName}</span>
                            {isCurrentUser && <span className={styles.avatarMeta}>({t('You')})</span>}
                        </div>
                    </div>
                );
            },
        },
        {
            key: 'email',
            header: 'Email',
            cell: (user: User) => <span className={styles.muted}>{user.email}</span>,
        },
        {
            key: 'roles',
            header: t('Role'),
            cell: (user: User) => (
                <div className={styles.actions}>
                    {user.roles.map((userRole) => {
                        const roleName = userRole.name[locale] || userRole.name['en'];
                        const isAdmin = roleName === 'Admin' || roleName === 'Quản trị viên';

                        return (
                            <Badge key={userRole.id} tone={isAdmin ? 'danger' : 'accent'}>
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
        <AppLayout>
            <Head title={t('User Management')} />

            {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

            <FilterPanel
                title="User Management"
                breadcrumbs={[
                    { label: t('Users'), href: '#' },
                    { label: t('Overview'), href: '#', active: true },
                ]}
                searchConfig={{
                    value: search,
                    onChange: setSearch,
                    placeholder: 'Search by name or email...',
                }}
                filterConfigs={[
                    {
                        value: role,
                        onChange: setRole,
                        label: t('-- All Roles --'),
                        options: roles.map((roleName) => ({ value: roleName, label: roleName })),
                    },
                    {
                        value: status,
                        onChange: setStatus,
                        label: t('-- All Statuses --'),
                        options: [
                            { value: '1', label: t('Active') },
                            { value: '0', label: t('Inactive') },
                        ],
                    },
                ]}
                onApplyFilters={applyFilters}
            />

            <DataTable
                columns={userColumns}
                data={users.data}
                headerTitle={`${t('User List')} (${totalUsers})`}
                headerIcon={Receipt}
                emptyMessage={t('No users found')}
            />

            <Pagination links={users.links} />

            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmStatusToggle}
                title={t('Confirm User Status Change')}
                message={`${t('Are you sure you want to change the status of user')} "${confirmModal.userName}"?`}
            />
        </AppLayout>
    );
}

import { Head, router, usePage } from '@inertiajs/react';
import { Eye, UserRound } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import Toast from '@/components/admin/users/Toast';
import ActionButtons, { type ActionConfig } from '@/components/ui/action-buttons';
import Avatar from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import DataTable from '@/components/ui/data-table';
import FilterPanel from '@/components/ui/filter-panel';
import Pagination from '@/components/ui/pagination';
import AppLayout from '@/layouts/app/AppLayout';
import { useTranslation } from '@/lib/i18n';

import styles from '@/components/admin/admin.module.css';

interface ShipperProfile {
    status: 'pending' | 'approved' | 'rejected' | 'suspended';
    id_card_number: string;
    vehicle_type: string;
    license_plate: string;
}

interface Shipper {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    username: string;
    phone_number: string;
    is_active: boolean;
    shipper_profile: ShipperProfile;
}

interface PageProps {
    shippers: {
        data: Shipper[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    totalShippers: number;
    filters: {
        status?: string;
        search?: string;
    };
    statusOptions: Record<string, string>;
    flash?: { success?: string; error?: string };
    [key: string]: unknown;
}

const statusTone = (status: ShipperProfile['status']) => {
    if (status === 'approved') return 'success' as const;
    if (status === 'pending') return 'warning' as const;
    if (status === 'suspended') return 'accent' as const;
    return 'danger' as const;
};

export default function Index() {
    const { t } = useTranslation();
    const { shippers, totalShippers = 0, filters = {}, statusOptions = {}, flash } = usePage<PageProps>().props;

    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    useEffect(() => {
        if (flash?.success) {
            setToast({ type: 'success', message: flash.success });
        } else if (flash?.error) {
            setToast({ type: 'error', message: flash.error });
        }
    }, [flash]);

    const applyFilters = () => {
        router.get('/admin/shippers', { search, status }, { preserveState: true });
    };

    const shipperColumns = useMemo(
        () => [
            {
                key: 'id',
                header: 'ID',
                cell: (shipper: Shipper) => <span className={styles.numeric}>#{shipper.id}</span>,
            },
            {
                key: 'shipper',
                header: t('Shipper'),
                cell: (shipper: Shipper) => {
                    const fullName = `${shipper.first_name || ''} ${shipper.last_name || ''}`.trim();

                    return (
                        <div className={styles.avatarCell}>
                            <Avatar user={shipper} />
                            <div className={styles.avatarBody}>
                                <span className={styles.avatarName}>{fullName || shipper.username || t('Unknown Shipper')}</span>
                                <span className={styles.avatarMeta}>{shipper.email}</span>
                            </div>
                        </div>
                    );
                },
            },
            {
                key: 'contact',
                header: t('Contact'),
                cell: (shipper: Shipper) => <span className={styles.numeric}>{shipper.phone_number || '-'}</span>,
            },
            {
                key: 'vehicle',
                header: t('Vehicle'),
                cell: (shipper: Shipper) => (
                    <div className={styles.cellStack}>
                        <span className={styles.cellTitle}>{shipper.shipper_profile.vehicle_type}</span>
                        <span className={styles.cellMeta}>{shipper.shipper_profile.license_plate}</span>
                    </div>
                ),
            },
            {
                key: 'status',
                header: t('Status'),
                cell: (shipper: Shipper) => (
                    <Badge tone={statusTone(shipper.shipper_profile.status)}>{t(ucfirst(shipper.shipper_profile.status))}</Badge>
                ),
            },
            {
                key: 'actions',
                header: t('Actions'),
                cell: (shipper: Shipper) => {
                    const actions: ActionConfig[] = [
                        {
                            type: 'link',
                            label: t('View Details'),
                            href: `/admin/shippers/${shipper.id}`,
                            icon: Eye,
                            variant: 'primary',
                        },
                    ];
                    return <ActionButtons actions={actions} />;
                },
            },
        ],
        [t],
    );

    return (
        <AppLayout>
            <Head title={t('Shipper Management')} />

            {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

            <FilterPanel
                title={t('Shipper Management')}
                breadcrumbs={[
                    { label: t('Shippers'), href: '#' },
                    { label: t('Overview'), href: '/admin/shippers', active: true },
                ]}
                onApplyFilters={applyFilters}
                searchConfig={{
                    value: search,
                    onChange: setSearch,
                    placeholder: t('Search by name, email, or phone...'),
                }}
                filterConfigs={[
                    {
                        value: status,
                        onChange: setStatus,
                        label: t('-- All Statuses --'),
                        options: Object.entries(statusOptions).map(([value, label]) => ({ value, label })),
                    },
                ]}
            />

            <DataTable
                columns={shipperColumns}
                data={shippers.data}
                headerTitle={`${t('Shipper List')} (${totalShippers})`}
                headerIcon={UserRound}
                emptyMessage={t('No shippers found')}
            />

            <Pagination links={shippers.links} />
        </AppLayout>
    );
}

const ucfirst = (value: string) => (value ? value.charAt(0).toUpperCase() + value.slice(1) : value);

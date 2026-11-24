import { Head, router, usePage } from '@inertiajs/react';
import { Eye, Pencil, Plus, Tag, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import Toast from '@/components/admin/users/Toast';
import ActionButtons, { type ActionConfig } from '@/components/ui/action-buttons';
import ConfirmationModal from '@/components/ui/confirmation-modal';
import DataTable from '@/components/ui/data-table';
import FilterPanel from '@/components/ui/filter-panel';
import Pagination from '@/components/ui/pagination';
import StatusBadge from '@/components/ui/status-badge';
import AppLayout from '@/layouts/app/AppLayout';
import { formatDate, formatVnd } from '@/lib/format';
import { useTranslation } from '@/lib/i18n';

import styles from '@/components/admin/admin.module.css';

interface Promotion {
    promotion_id: number;
    name: string;
    type: string;
    value: number | string;
    start_date: string;
    end_date: string;
    usage_limit: number | null;
    used_count: number;
    is_active: boolean;
    allocated_budget?: number | string | null;
    spent_budget?: number | string | null;
    roi_percentage?: number | string | null;
    status: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PromotionPaginator {
    data: Promotion[];
    links: PaginationLink[];
}

interface PageProps {
    promotions: PromotionPaginator;
    typeOptions: Record<string, string>;
    statusFilters: string[];
    filters?: Record<string, string>;
    flash?: { success?: string; error?: string };
    [key: string]: unknown;
}

interface ConfirmState {
    open: boolean;
    promotionId: number | null;
    promotionName: string;
}

const toNumber = (value?: number | string | null): number | null => {
    if (value === null || value === undefined || value === '') {
        return null;
    }

    const numeric = typeof value === 'string' ? Number.parseFloat(value) : Number(value);
    return Number.isNaN(numeric) ? null : numeric;
};

const formatBudget = (value?: number | string | null): string => {
    const numeric = toNumber(value);
    return numeric === null ? '-' : formatVnd(numeric);
};

export default function Index() {
    const { t } = useTranslation();
    const { promotions, typeOptions, statusFilters, filters = {}, flash } = usePage<PageProps>().props;

    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? '');
    const [type, setType] = useState(filters.type ?? '');
    const [confirmState, setConfirmState] = useState<ConfirmState>({ open: false, promotionId: null, promotionName: '' });
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    useEffect(() => {
        setSearch(filters.search ?? '');
        setStatus(filters.status ?? '');
        setType(filters.type ?? '');
    }, [filters.search, filters.status, filters.type]);

    useEffect(() => {
        if (flash?.success) {
            setToast({ type: 'success', message: flash.success });
        } else if (flash?.error) {
            setToast({ type: 'error', message: flash.error });
        }
    }, [flash?.success, flash?.error]);

    const applyFilters = () => {
        router.get(
            '/admin/promotions',
            {
                search: search || undefined,
                status: status || undefined,
                type: type || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const openDeleteModal = (promotion: Promotion) => {
        setConfirmState({ open: true, promotionId: promotion.promotion_id, promotionName: promotion.name });
    };

    const handleConfirmDelete = () => {
        if (!confirmState.promotionId) {
            return;
        }

        router.delete(`/admin/promotions/${confirmState.promotionId}`, { preserveScroll: true });
    };

    const columns = useMemo(
        () => [
            {
                key: 'name',
                header: t('Promotion Name'),
                cell: (promotion: Promotion) => (
                    <div className={styles.cellStack}>
                        <span className={styles.cellTitle}>{promotion.name || t('Unnamed Promotion')}</span>
                        <span className={styles.cellMeta}>
                            {formatDate(promotion.start_date)} - {formatDate(promotion.end_date)}
                        </span>
                    </div>
                ),
            },
            {
                key: 'type',
                header: t('Type'),
                cell: (promotion: Promotion) => <span className={styles.muted}>{typeOptions[promotion.type] ?? promotion.type}</span>,
            },
            {
                key: 'value',
                header: t('Discount Value'),
                cell: (promotion: Promotion) => (
                    <span className={styles.priceAccent}>
                        {promotion.type === 'percentage' ? `${Number(promotion.value).toLocaleString('vi-VN')}%` : formatBudget(promotion.value)}
                    </span>
                ),
            },
            {
                key: 'budget',
                header: t('Budget'),
                cell: (promotion: Promotion) => (
                    <div className={styles.cellStack}>
                        <span className={styles.price}>{formatBudget(promotion.allocated_budget)}</span>
                        <span className={styles.cellMeta}>
                            {t('Spent')}: {formatBudget(promotion.spent_budget)}
                        </span>
                    </div>
                ),
            },
            {
                key: 'usage',
                header: t('Usage'),
                cell: (promotion: Promotion) => (
                    <span className={styles.numeric}>
                        {promotion.usage_limit ? `${promotion.used_count} / ${promotion.usage_limit}` : `${promotion.used_count}`}
                    </span>
                ),
            },
            {
                key: 'status',
                header: t('Status'),
                cell: (promotion: Promotion) => <StatusBadge status={promotion.status} />,
            },
            {
                key: 'actions',
                header: t('Actions'),
                cell: (promotion: Promotion) => {
                    const actions: ActionConfig[] = [
                        {
                            type: 'link',
                            label: t('View'),
                            href: `/admin/promotions/${promotion.promotion_id}`,
                            icon: Eye,
                            variant: 'primary',
                        },
                        {
                            type: 'link',
                            label: t('Edit'),
                            href: `/admin/promotions/${promotion.promotion_id}/edit`,
                            icon: Pencil,
                            variant: 'primary',
                        },
                        {
                            type: 'button',
                            label: t('Delete'),
                            onClick: () => openDeleteModal(promotion),
                            icon: Trash2,
                            variant: 'danger',
                        },
                    ];

                    return <ActionButtons actions={actions} />;
                },
            },
        ],
        [t, typeOptions],
    );

    return (
        <AppLayout>
            <Head title={t('Promotion Management')} />

            {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

            <FilterPanel
                title={t('Promotion Management')}
                breadcrumbs={[
                    { label: t('Dashboard'), href: '/admin/dashboard' },
                    { label: t('Promotions'), href: '/admin/promotions', active: true },
                ]}
                onApplyFilters={applyFilters}
                searchConfig={{
                    value: search,
                    onChange: setSearch,
                    placeholder: t('Search promotions, sellers, products...'),
                }}
                filterConfigs={[
                    {
                        value: status,
                        onChange: setStatus,
                        label: t('-- All Statuses --'),
                        options: statusFilters.map((item) => ({ value: item, label: t(ucfirst(item)) })),
                    },
                    {
                        value: type,
                        onChange: setType,
                        label: t('-- All Types --'),
                        options: Object.keys(typeOptions).map((key) => ({ value: key, label: t(typeOptions[key]) })),
                    },
                ]}
                buttonConfigs={[
                    {
                        href: '/admin/promotions/create',
                        label: t('Create Promotion'),
                        icon: Plus,
                        color: 'primary',
                    },
                ]}
            />

            <DataTable
                columns={columns}
                data={promotions.data}
                headerTitle={t('Promotions')}
                headerIcon={Tag}
                emptyMessage={t('No promotions found')}
            />

            <Pagination links={promotions.links} filters={{ search, status, type }} />

            <ConfirmationModal
                isOpen={confirmState.open}
                onClose={() => setConfirmState({ open: false, promotionId: null, promotionName: '' })}
                onConfirm={handleConfirmDelete}
                title={t('Delete Promotion')}
                message={t('Are you sure you want to delete this promotion?')}
            />
        </AppLayout>
    );
}

const ucfirst = (value: string) => {
    if (!value) {
        return value;
    }

    return value.charAt(0).toUpperCase() + value.slice(1);
};

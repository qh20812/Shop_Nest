import { Head, Link, router, usePage } from '@inertiajs/react';
import { Eye, Globe, Pencil, Plus, Search, Store, Tag, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import PromotionStatusBadge from '@/components/admin/promotions/PromotionStatusBadge';
import {
    promotionScopeLabel,
    promotionStatusLabel,
    promotionTypeLabel,
    promotionValueLabel,
    type PromotionSeller,
} from '@/components/admin/promotions/promotion-display';
import Toast from '@/components/admin/users/Toast';
import { PageHeader } from '@/components/layout/PageHeader';
import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import ActionButtons, { type ActionConfig } from '@/components/ui/action-buttons';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ConfirmationModal from '@/components/ui/confirmation-modal';
import DataTable from '@/components/ui/data-table';
import FormField from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import Pagination from '@/components/ui/pagination';
import { Select } from '@/components/ui/select';
import { cx } from '@/lib/cx';
import { formatDate, formatNumber, formatVnd } from '@/lib/format';
import { useTranslation } from '@/lib/i18n';

import adminStyles from '@/components/admin/admin.module.css';
import styles from './Promotions.module.css';

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
    created_by_type?: string | null;
    seller_id?: number | null;
    seller?: PromotionSeller | null;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PromotionPaginator {
    data: Promotion[];
    links: PaginationLink[];
    from?: number | null;
    to?: number | null;
    total?: number;
}

interface PageProps {
    promotions: PromotionPaginator;
    typeOptions: Record<string, string>;
    statusFilters: string[];
    statusCounts: Record<string, number>;
    totalPromotions: number;
    filters?: Record<string, string>;
    flash?: { success?: string; error?: string };
    [key: string]: unknown;
}

interface ConfirmState {
    open: boolean;
    promotionId: number | null;
    promotionName: string;
}

const formatBudget = (value?: number | string | null): string => {
    if (value === null || value === undefined || value === '') {
        return '-';
    }

    const numeric = Number(value);

    return Number.isFinite(numeric) ? formatVnd(numeric) : '-';
};

export default function Index() {
    const { t } = useTranslation();
    const { promotions, typeOptions, statusFilters, statusCounts, totalPromotions, filters = {}, flash } = usePage<PageProps>().props;

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

    const total = promotions.total ?? totalPromotions;
    const hasFilters = Boolean(filters.search || filters.status || filters.type);
    const rangeLabel =
        total > 0 ? `${formatNumber(promotions.from ?? 0)}-${formatNumber(promotions.to ?? 0)} / ${formatNumber(total)}` : formatNumber(0);

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

        setConfirmState({ open: false, promotionId: null, promotionName: '' });
        router.delete(`/admin/promotions/${confirmState.promotionId}`, { preserveScroll: true });
    };

    const summaryItems = [
        { key: 'draft', label: t('Upcoming'), value: statusCounts.draft ?? 0 },
        { key: 'active', label: t('Active'), value: statusCounts.active ?? 0 },
        { key: 'paused', label: t('Paused'), value: statusCounts.paused ?? 0 },
        { key: 'expired', label: t('Expired'), value: statusCounts.expired ?? 0 },
    ];

    const columns = useMemo(
        () => [
            {
                key: 'promotion',
                header: t('Promotion Name'),
                cell: (promotion: Promotion) => {
                    const isSeller = promotion.created_by_type === 'seller';
                    const ScopeIcon = isSeller ? Store : Globe;

                    return (
                        <div className={styles.promotion}>
                            <span className={styles.promotionName}>{promotion.name || t('Unnamed Promotion')}</span>
                            <div className={styles.promotionMeta}>
                                <Badge tone="neutral" size="sm" icon={ScopeIcon}>
                                    {promotionScopeLabel(promotion, t)}
                                </Badge>
                                <span>{promotionTypeLabel(promotion.type, typeOptions, t)}</span>
                            </div>
                            <span className={styles.dateLine}>
                                {formatDate(promotion.start_date)} - {formatDate(promotion.end_date)}
                            </span>
                        </div>
                    );
                },
            },
            {
                key: 'value',
                header: t('Discount Value'),
                cell: (promotion: Promotion) => <span className={styles.value}>{promotionValueLabel(promotion.type, promotion.value)}</span>,
            },
            {
                key: 'budget',
                header: t('Budget'),
                align: 'right' as const,
                cell: (promotion: Promotion) => (
                    <div className={styles.budgetCell}>
                        <span className={styles.value}>{formatBudget(promotion.allocated_budget)}</span>
                        <span className={styles.spent}>
                            {t('Spent')}: {formatBudget(promotion.spent_budget)}
                        </span>
                    </div>
                ),
            },
            {
                key: 'usage',
                header: t('Usage'),
                align: 'right' as const,
                cell: (promotion: Promotion) => (
                    <span className={styles.usage}>
                        {promotion.usage_limit
                            ? `${formatNumber(promotion.used_count)} / ${formatNumber(promotion.usage_limit)}`
                            : formatNumber(promotion.used_count)}
                    </span>
                ),
            },
            {
                key: 'status',
                header: t('Status'),
                cell: (promotion: Promotion) => <PromotionStatusBadge status={promotion.status} />,
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
        <WorkspaceLayout>
            <Head title={t('Promotion Management')} />

            {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

            <div className={adminStyles.stack}>
                <PageHeader
                    breadcrumbs={[
                        { label: t('Dashboard'), href: '/admin/dashboard' },
                        { label: t('Promotions'), current: true },
                    ]}
                    title={t('Promotion Management')}
                    count={formatNumber(total)}
                    actions={
                        <Button asChild variant="primary" size="sm">
                            <Link href="/admin/promotions/create">
                                <Plus aria-hidden="true" />
                                {t('Create Promotion')}
                            </Link>
                        </Button>
                    }
                />

                <form
                    className={cx(styles.filters, 'sn-glass-surface')}
                    aria-label={t('Filters')}
                    onSubmit={(event) => {
                        event.preventDefault();
                        applyFilters();
                    }}
                >
                    <FormField label={t('Search')} htmlFor="promotion-search">
                        <Input
                            id="promotion-search"
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder={t('Search by promotion name...')}
                            leadingIcon={Search}
                            surface="glass"
                        />
                    </FormField>

                    <FormField label={t('Status')} htmlFor="promotion-status-filter">
                        <Select id="promotion-status-filter" value={status} onChange={(event) => setStatus(event.target.value)} surface="glass">
                            <option value="">{t('-- All Statuses --')}</option>
                            {statusFilters.map((value) => (
                                <option key={value} value={value}>
                                    {promotionStatusLabel(value, t)}
                                </option>
                            ))}
                        </Select>
                    </FormField>

                    <FormField label={t('Type')} htmlFor="promotion-type-filter">
                        <Select id="promotion-type-filter" value={type} onChange={(event) => setType(event.target.value)} surface="glass">
                            <option value="">{t('-- All Types --')}</option>
                            {Object.entries(typeOptions).map(([value, label]) => (
                                <option key={value} value={value}>
                                    {t(label)}
                                </option>
                            ))}
                        </Select>
                    </FormField>

                    <div className={styles.filterActions}>
                        <Button type="submit" variant="primary" leftIcon={Search}>
                            {t('Apply')}
                        </Button>
                    </div>
                </form>

                <dl className={styles.summaryRail}>
                    {summaryItems.map((item) => (
                        <div key={item.key} className={styles.summary}>
                            <dt className={styles.summaryLabel}>{item.label}</dt>
                            <dd className={styles.summaryValue}>{formatNumber(item.value)}</dd>
                        </div>
                    ))}
                </dl>

                <div className={styles.table}>
                    <DataTable
                        columns={columns}
                        data={promotions.data}
                        headerTitle={t('Promotions')}
                        headerIcon={Tag}
                        headerMeta={rangeLabel}
                        emptyMessage={hasFilters ? t('No promotions match the filters.') : t('No promotions found')}
                    />
                </div>

                <Pagination links={promotions.links} filters={{ search, status, type }} />
            </div>

            <ConfirmationModal
                isOpen={confirmState.open}
                onClose={() => setConfirmState({ open: false, promotionId: null, promotionName: '' })}
                onConfirm={handleConfirmDelete}
                title={t('Delete Promotion')}
                message={`${t('Are you sure you want to delete this promotion?')} "${confirmState.promotionName}"`}
            />
        </WorkspaceLayout>
    );
}

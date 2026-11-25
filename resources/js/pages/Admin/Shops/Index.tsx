import { Head, Link, router, usePage } from '@inertiajs/react';
import { BarChart3, Check, CheckCircle2, Clock, Eye, PauseCircle, RotateCcw, Store, X, XCircle } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import ActionDropdown from '@/components/ui/action-dropdown';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ConfirmationModal from '@/components/ui/confirmation-modal';
import DataTable from '@/components/ui/data-table';
import { Dialog } from '@/components/ui/dialog';
import FilterPanel from '@/components/ui/filter-panel';
import Insights from '@/components/ui/insights';
import Pagination from '@/components/ui/pagination';
import { formatDate, formatNumber, formatVnd } from '@/lib/format';
import { useTranslation } from '@/lib/i18n';

import styles from '@/components/admin/admin.module.css';
import type { ShopFilters as FilterParams, Shop, ShopCollection, ShopMetrics } from './types';

import type { BadgeTone } from '@/components/ui/badge';

interface PageProps extends Record<string, unknown> {
    shops: ShopCollection & {
        links?: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters: FilterParams;
    metrics?: ShopMetrics;
}

type ShopAction = 'approve' | 'reject' | 'suspend' | 'reactivate';

type ReasonMode = 'reject' | 'suspend' | 'bulkReject';

const statusTones: Record<Shop['shop_status'], BadgeTone> = {
    pending: 'warning',
    active: 'success',
    suspended: 'accent',
    rejected: 'danger',
};

const formatRelative = (input?: string | null, fallback = '-') => {
    if (!input) {
        return fallback;
    }

    const parsed = new Date(input);
    if (Number.isNaN(parsed.getTime())) {
        return fallback;
    }

    const diffMs = Date.now() - parsed.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) {
        return '< 1h';
    }

    if (diffHours < 24) {
        return `${diffHours}h`;
    }

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) {
        return `${diffDays}d`;
    }

    return formatDate(parsed);
};

export default function Index() {
    const { t } = useTranslation();
    const { shops, filters = {}, metrics } = usePage<PageProps>().props;

    const [localFilters, setLocalFilters] = useState<FilterParams>(filters);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [confirm, setConfirm] = useState<{ open: boolean; title: string; message: string; run: () => void }>({
        open: false,
        title: '',
        message: '',
        run: () => {},
    });
    const [reasonDialog, setReasonDialog] = useState<{ open: boolean; mode: ReasonMode; shopId: number | null; title: string }>({
        open: false,
        mode: 'reject',
        shopId: null,
        title: '',
    });
    const [reason, setReason] = useState('');
    const [duration, setDuration] = useState('7');
    const [reasonError, setReasonError] = useState('');

    useEffect(() => {
        setLocalFilters(filters);
        setSelectedIds([]);
    }, [filters]);

    const statusLabelMap = useMemo<Record<Shop['shop_status'], string>>(
        () => ({
            pending: t('Pending'),
            active: t('Active'),
            suspended: t('Suspended'),
            rejected: t('Rejected'),
        }),
        [t],
    );

    const handleShopAction = useCallback(
        (shop: Shop, action: ShopAction) => {
            const routes: Record<ShopAction, string> = {
                approve: `/admin/shops/${shop.id}/approve`,
                reject: `/admin/shops/${shop.id}/reject`,
                suspend: `/admin/shops/${shop.id}/suspend`,
                reactivate: `/admin/shops/${shop.id}/reactivate`,
            };

            if (action === 'reject') {
                setReason('');
                setReasonError('');
                setReasonDialog({ open: true, mode: 'reject', shopId: shop.id, title: t('Reject this shop?') });
                return;
            }

            if (action === 'suspend') {
                setReason('');
                setReasonError('');
                setDuration('7');
                setReasonDialog({ open: true, mode: 'suspend', shopId: shop.id, title: t('Suspend this shop?') });
                return;
            }

            const labels: Record<'approve' | 'reactivate', { title: string; message: string }> = {
                approve: { title: t('Approve this shop?'), message: t('The shop will become active and visible to customers.') },
                reactivate: { title: t('Reactivate this shop?'), message: t('The shop will be able to sell again.') },
            };

            setConfirm({
                open: true,
                ...labels[action],
                run: () => router.post(routes[action], {}, { preserveScroll: true }),
            });
        },
        [t],
    );

    const handleFilterChange = (key: keyof FilterParams, value: string | number | undefined) => {
        setLocalFilters((previous) => ({ ...previous, [key]: value }));
    };

    const handleApplyFilters = () => {
        const payload = Object.fromEntries(
            Object.entries(localFilters || {}).filter(([, value]) => value !== undefined && value !== null && value !== ''),
        ) as Record<string, string | number | boolean>;

        router.get('/admin/shops', payload, { preserveState: true });
    };

    const pageIds = shops.data.map((shop) => shop.id);
    const allSelected = pageIds.length > 0 && pageIds.every((id) => selectedIds.includes(id));

    const toggleShop = (id: number, checked: boolean) => {
        setSelectedIds((previous) => (checked ? [...new Set([...previous, id])] : previous.filter((value) => value !== id)));
    };

    const toggleAll = (checked: boolean) => {
        setSelectedIds((previous) => {
            if (checked) {
                return [...new Set([...previous, ...pageIds])];
            }

            return previous.filter((id) => !pageIds.includes(id));
        });
    };

    const openBulkApprove = () => {
        setConfirm({
            open: true,
            title: t('Approve selected shops?'),
            message: `${selectedIds.length} ${t('shops will become active.')}`,
            run: () =>
                router.post('/admin/shops/bulk-approve', { shop_ids: selectedIds }, { preserveScroll: true, onSuccess: () => setSelectedIds([]) }),
        });
    };

    const openBulkReject = () => {
        setReason('');
        setReasonError('');
        setReasonDialog({ open: true, mode: 'bulkReject', shopId: null, title: t('Reject selected shops?') });
    };

    const submitReason = () => {
        if (reason.trim().length < 10) {
            setReasonError(t('Rejection reason must contain at least 10 characters.'));
            return;
        }

        if (reasonDialog.mode === 'bulkReject') {
            router.post(
                '/admin/shops/bulk-reject',
                { shop_ids: selectedIds, reason: reason.trim() },
                { preserveScroll: true, onSuccess: () => setSelectedIds([]) },
            );
        } else if (reasonDialog.mode === 'reject' && reasonDialog.shopId) {
            router.post(`/admin/shops/${reasonDialog.shopId}/reject`, { reason: reason.trim() }, { preserveScroll: true });
        } else if (reasonDialog.mode === 'suspend' && reasonDialog.shopId) {
            const days = Number.parseInt(duration, 10);
            if (!Number.isInteger(days) || days < 1 || days > 365) {
                setReasonError(t('Please enter a valid suspension duration between 1 and 365 days.'));
                return;
            }
            router.post(`/admin/shops/${reasonDialog.shopId}/suspend`, { reason: reason.trim(), duration_days: days }, { preserveScroll: true });
        }

        setReasonDialog({ open: false, mode: 'reject', shopId: null, title: '' });
    };

    const columns = [
        {
            key: 'select',
            header: (
                <input
                    type="checkbox"
                    className={styles.tableCheckbox}
                    checked={allSelected}
                    onChange={(event) => toggleAll(event.target.checked)}
                    aria-label={t('Select all shops')}
                />
            ),
            cell: (shop: Shop) => (
                <input
                    type="checkbox"
                    className={styles.tableCheckbox}
                    checked={selectedIds.includes(shop.id)}
                    onChange={(event) => toggleShop(shop.id, event.target.checked)}
                    aria-label={`${t('Select shop')} ${shop.name ?? shop.username ?? shop.id}`}
                />
            ),
        },
        {
            key: 'name',
            header: t('Shop Name'),
            cell: (shop: Shop) => <span className={styles.cellTitle}>{shop.name?.trim() || '-'}</span>,
        },
        {
            key: 'owner',
            header: t('Owner'),
            cell: (shop: Shop) => {
                const fallbackName = `${shop.first_name ?? ''} ${shop.last_name ?? ''}`.trim();
                const ownerName =
                    (fallbackName.length ? fallbackName : undefined) ||
                    (shop.username?.trim() ? shop.username : undefined) ||
                    `${t('Shop')} #${shop.id}`;

                return <span className={styles.muted}>{ownerName}</span>;
            },
        },
        {
            key: 'email',
            header: 'Email',
            cell: (shop: Shop) => <span className={styles.muted}>{shop.email || '-'}</span>,
        },
        {
            key: 'created_at',
            header: t('Joined'),
            cell: (shop: Shop) => <span className={styles.numeric}>{formatDate(shop.created_at)}</span>,
        },
        {
            key: 'status',
            header: t('Status'),
            cell: (shop: Shop) => <Badge tone={statusTones[shop.shop_status]}>{statusLabelMap[shop.shop_status]}</Badge>,
        },
        {
            key: 'products',
            header: t('Products'),
            align: 'right' as const,
            cell: (shop: Shop) => <span className={styles.numeric}>{formatNumber(shop.products_count ?? 0)}</span>,
        },
        {
            key: 'orders',
            header: t('Orders'),
            align: 'right' as const,
            cell: (shop: Shop) => <span className={styles.numeric}>{formatNumber(shop.orders_count ?? 0)}</span>,
        },
        {
            key: 'revenue',
            header: t('Revenue'),
            align: 'right' as const,
            cell: (shop: Shop) => <span className={styles.price}>{formatVnd(Number(shop.total_revenue ?? 0))}</span>,
        },
        {
            key: 'violations',
            header: t('Open Violations'),
            align: 'right' as const,
            cell: (shop: Shop) => <span className={styles.numeric}>{shop.open_violations_count ?? 0}</span>,
        },
        {
            key: 'last_activity',
            header: t('Last Activity'),
            cell: (shop: Shop) => <span className={styles.faint}>{formatRelative(shop.last_activity, t('N/A'))}</span>,
        },
        {
            key: 'actions',
            header: t('Actions'),
            cell: (shop: Shop) => {
                const actions = [
                    {
                        label: t('View'),
                        icon: Eye,
                        onClick: () => router.get(`/admin/shops/${shop.id}`),
                    },
                ];

                if (shop.shop_status === 'pending') {
                    actions.push(
                        { label: t('Approve'), icon: Check, onClick: () => handleShopAction(shop, 'approve') },
                        { label: t('Reject'), icon: X, onClick: () => handleShopAction(shop, 'reject') },
                    );
                }

                if (shop.shop_status === 'active') {
                    actions.push({ label: t('Suspend'), icon: PauseCircle, onClick: () => handleShopAction(shop, 'suspend') });
                }

                if (shop.shop_status === 'suspended') {
                    actions.push({ label: t('Reactivate'), icon: RotateCcw, onClick: () => handleShopAction(shop, 'reactivate') });
                }

                return <ActionDropdown actions={actions} />;
            },
        },
    ];

    const summaryItems = [
        { icon: Store, value: formatNumber(metrics?.total ?? 0), label: t('Total Shops') },
        { icon: CheckCircle2, value: formatNumber(metrics?.active ?? 0), label: t('Active') },
        { icon: Clock, value: formatNumber(metrics?.pending ?? 0), label: t('Pending') },
        { icon: PauseCircle, value: formatNumber(metrics?.suspended ?? 0), label: t('Suspended') },
        { icon: XCircle, value: formatNumber(metrics?.rejected ?? 0), label: t('Rejected') },
    ];

    const paginationFilters = useMemo(() => {
        const entries = Object.entries(filters ?? {}).filter(([, value]) => value !== undefined && value !== null && value !== '');
        return Object.fromEntries(entries) as Record<string, string | number | boolean | undefined>;
    }, [filters]);

    return (
        <WorkspaceLayout>
            <Head title={t('Shop Management')} />

            <FilterPanel
                title={t('Shop Management')}
                breadcrumbs={[
                    { label: t('Dashboard'), href: '/admin/dashboard' },
                    { label: t('Shops'), href: '#', active: true },
                ]}
                onApplyFilters={handleApplyFilters}
                searchConfig={{
                    value: localFilters.search || '',
                    onChange: (value) => handleFilterChange('search', value),
                    placeholder: t('Search shops...'),
                }}
                filterConfigs={[
                    {
                        value: localFilters.status || '',
                        onChange: (value) => handleFilterChange('status', value),
                        label: t('All Statuses'),
                        options: [
                            { value: 'pending', label: t('Pending') },
                            { value: 'active', label: t('Active') },
                            { value: 'suspended', label: t('Suspended') },
                            { value: 'rejected', label: t('Rejected') },
                        ],
                    },
                ]}
            />

            <Insights items={summaryItems} />

            <div className={styles.quickActions}>
                <Link href="/admin/shops/dashboard" className={styles.quickAction}>
                    <BarChart3 aria-hidden="true" />
                    {t('Shop Dashboard')}
                </Link>
                <Link href="/admin/shops/pending" className={styles.quickAction}>
                    <Clock aria-hidden="true" />
                    {t('Pending Shops')}
                </Link>
            </div>

            {selectedIds.length > 0 && (
                <div className={styles.bulkBar}>
                    <span className={styles.bulkCount}>
                        {selectedIds.length} {t('selected')}
                    </span>
                    <Button type="button" variant="primary" size="sm" onClick={openBulkApprove}>
                        <Check aria-hidden="true" />
                        {t('Approve selected')}
                    </Button>
                    <Button type="button" variant="destructive" size="sm" onClick={openBulkReject}>
                        <X aria-hidden="true" />
                        {t('Reject selected')}
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => setSelectedIds([])}>
                        {t('Clear selection')}
                    </Button>
                </div>
            )}

            <DataTable columns={columns} data={shops.data} headerTitle={t('Shop List')} headerIcon={Store} emptyMessage={t('No shops found')} />

            <Pagination links={shops.links ?? []} filters={paginationFilters} />

            <ConfirmationModal
                isOpen={confirm.open}
                onClose={() => setConfirm({ open: false, title: '', message: '', run: () => {} })}
                onConfirm={confirm.run}
                title={confirm.title}
                message={confirm.message}
            />

            <Dialog
                open={reasonDialog.open}
                onOpenChange={(open) => {
                    if (!open) {
                        setReasonDialog({ open: false, mode: 'reject', shopId: null, title: '' });
                    }
                }}
                title={reasonDialog.title}
                size="md"
                footer={
                    <>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => setReasonDialog({ open: false, mode: 'reject', shopId: null, title: '' })}
                        >
                            {t('Cancel')}
                        </Button>
                        <Button type="button" variant="primary" onClick={submitReason}>
                            {t('Confirm')}
                        </Button>
                    </>
                }
            >
                <div className={styles.dialogField}>
                    <label className={styles.filterLabel} htmlFor="shop-reason">
                        {t('Reason')}
                    </label>
                    <textarea
                        id="shop-reason"
                        className={styles.textArea}
                        value={reason}
                        onChange={(event) => setReason(event.target.value)}
                        placeholder={t('Provide a reason (min 10 characters).')}
                    />
                </div>

                {reasonDialog.mode === 'suspend' && (
                    <div className={styles.dialogField}>
                        <label className={styles.filterLabel} htmlFor="shop-duration">
                            {t('Suspension days (1-365)')}
                        </label>
                        <input
                            id="shop-duration"
                            type="number"
                            min="1"
                            max="365"
                            className="sn-input"
                            value={duration}
                            onChange={(event) => setDuration(event.target.value)}
                        />
                    </div>
                )}

                {reasonError && <p className={styles.fileError}>{reasonError}</p>}
            </Dialog>
        </WorkspaceLayout>
    );
}

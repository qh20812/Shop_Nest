import Toast from '@/components/admin/users/Toast';
import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import ActionButtons, { type ActionConfig } from '@/components/ui/action-buttons';
import ConfirmationModal from '@/components/ui/confirmation-modal';
import { DataTable, type DataTableColumn } from '@/components/ui/data-table';
import FilterPanel from '@/components/ui/filter-panel';
import Insights from '@/components/ui/insights';
import Pagination from '@/components/ui/pagination';
import { Progress } from '@/components/ui/progress';
import StatusBadge from '@/components/ui/status-badge';
import { formatDate, formatVnd } from '@/lib/format';
import { useTranslation } from '@/lib/i18n';
import { Head, router, usePage } from '@inertiajs/react';
import { Eye, Gift, Pause, Pencil, Play, PlayCircle, Plus, Target, Trash2, Wallet } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import styles from '../seller.module.css';

interface PromotionProduct {
    product_id: number;
    name: string;
    sku: string;
}

interface Promotion {
    promotion_id: number;
    name: string;
    type: string;
    status?: string;
    value: number;
    start_date: string;
    end_date: string;
    is_active: boolean;
    allocated_budget: number;
    spent_budget: number;
    roi_percentage?: number | null;
    products?: PromotionProduct[];
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PromotionsPaginator {
    data: Promotion[];
    links: PaginationLink[];
    meta?: {
        total?: number;
        current_page?: number;
        last_page?: number;
        per_page?: number;
    };
}

interface Wallet {
    balance: number;
    currency: string;
    total_earned?: number;
    total_spent?: number;
}

interface FlashMessages {
    success?: string;
    error?: string;
}

interface PageProps extends Record<string, unknown> {
    promotions?: PromotionsPaginator;
    filters?: {
        search?: string;
        status?: string;
        date_range?: string;
        budget_range?: string;
    };
    pagination?: {
        total?: number;
    };
    wallet?: Wallet;
    flash?: FlashMessages;
}

type ConfirmAction = 'pause' | 'resume' | 'delete';

interface ConfirmModalState {
    isOpen: boolean;
    promotionId: number | null;
    promotionName: string;
    action: ConfirmAction | null;
    title: string;
    message: string;
}

const formatDateRange = (start: string, end: string) => {
    const startLabel = formatDate(start);
    const endLabel = formatDate(end);

    if (!startLabel && !endLabel) {
        return '';
    }

    if (!endLabel) {
        return startLabel;
    }

    return `${startLabel} - ${endLabel}`;
};

const getCsrfToken = () => {
    const tokenTag = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement | null;
    return tokenTag?.content ?? '';
};

const getDiscountLabel = (promotion: Promotion, translate: (key: string) => string) => {
    const typeKey = String(promotion.type ?? '').toLowerCase();
    const value = Number(promotion.value ?? 0);

    switch (typeKey) {
        case 'percentage':
            return `${translate('Percentage Discount')}: ${value}%`;
        case 'fixed_amount':
            return `${translate('Fixed Discount')}: ${formatVnd(value)}`;
        case 'free_shipping':
            return translate('Free Shipping Promotion');
        case 'buy_x_get_y':
            return translate('Bundle Offer');
        default:
            return translate('Custom Promotion');
    }
};

const getRoiClass = (value: number | null | undefined) => {
    const roi = Number(value ?? 0);

    if (roi >= 100) {
        return styles.roiPositive;
    }

    if (roi >= 50) {
        return styles.roiNeutral;
    }

    return styles.roiNegative;
};

const getPercentValue = (spent: number, allocated: number) => {
    if (allocated <= 0) {
        return 0;
    }

    const ratio = (spent / allocated) * 100;

    if (!Number.isFinite(ratio) || ratio < 0) {
        return 0;
    }

    return Math.min(100, Math.round(ratio));
};

export default function Index() {
    const { t } = useTranslation();
    const page = usePage<PageProps>().props;
    const promotionsPayload = useMemo(() => page.promotions ?? { data: [], links: [] }, [page.promotions]);
    const filters = page.filters ?? {};
    const wallet = page.wallet;

    const [search, setSearch] = useState(filters.search ?? '');
    const [statusFilter, setStatusFilter] = useState(filters.status ?? '');
    const [dateRange, setDateRange] = useState(filters.date_range ?? '');
    const [budgetRange, setBudgetRange] = useState(filters.budget_range ?? '');
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [confirmModal, setConfirmModal] = useState<ConfirmModalState>({
        isOpen: false,
        promotionId: null,
        promotionName: '',
        action: null,
        title: '',
        message: '',
    });

    const promotionRows = useMemo(() => promotionsPayload.data ?? [], [promotionsPayload]);
    const paginationLinks = promotionsPayload.links ?? [];
    const totalPromotions = page.pagination?.total ?? promotionsPayload.meta?.total ?? promotionRows.length;

    const promotionMetrics = useMemo(() => {
        const now = new Date();
        let active = 0;

        promotionRows.forEach((promotion) => {
            const start = promotion.start_date ? new Date(promotion.start_date) : null;
            const end = promotion.end_date ? new Date(promotion.end_date) : null;
            const isExpired = end !== null && end < now;
            const isUpcoming = start !== null && start > now;

            if (promotion.is_active && !isExpired && !isUpcoming) {
                active += 1;
            }
        });

        return { active };
    }, [promotionRows]);

    useEffect(() => {
        const flashMessages = page.flash ?? {};

        if (flashMessages.success) {
            setToast({ type: 'success', message: flashMessages.success });
        } else if (flashMessages.error) {
            setToast({ type: 'error', message: flashMessages.error });
        }
    }, [page.flash]);

    const closeToast = () => setToast(null);

    const handleApplyFilters = () => {
        router.get(
            '/seller/promotions',
            {
                search: search || undefined,
                status: statusFilter || undefined,
                date_range: dateRange || undefined,
                budget_range: budgetRange || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const joinLabelWithDate = useCallback(
        (labelKey: string, dateValue: string) => {
            const formatted = formatDate(dateValue);
            return formatted ? `${t(labelKey)} ${formatted}` : t(labelKey);
        },
        [t],
    );

    const determineStatus = useCallback(
        (promotion: Promotion) => {
            const apiStatus = promotion.status;
            const now = new Date();
            const startDate = promotion.start_date ? new Date(promotion.start_date) : null;
            const endDate = promotion.end_date ? new Date(promotion.end_date) : null;

            if (apiStatus === 'paused') {
                return {
                    badge: 'paused',
                    label: t('Paused'),
                    helper: endDate ? joinLabelWithDate('Paused until', promotion.end_date) : t('Promotion is paused'),
                };
            }

            if (apiStatus === 'expired' || (endDate && endDate < now)) {
                return {
                    badge: 'expired',
                    label: t('Expired'),
                    helper: joinLabelWithDate('Ended on', promotion.end_date),
                };
            }

            if (apiStatus === 'draft' || apiStatus === 'upcoming' || (startDate && startDate > now)) {
                return {
                    badge: 'upcoming',
                    label: t('Upcoming'),
                    helper: joinLabelWithDate('Starts on', promotion.start_date),
                };
            }

            return {
                badge: 'active',
                label: t('Active'),
                helper: endDate ? joinLabelWithDate('Ends on', promotion.end_date) : t('Currently running'),
            };
        },
        [joinLabelWithDate, t],
    );

    const openConfirmModal = useCallback(
        (promotion: Promotion, action: ConfirmAction) => {
            const promotionName = promotion.name ?? t('Unnamed Promotion');
            let title = '';
            let message = '';

            if (action === 'pause') {
                title = t('Pause Promotion');
                message = `${t('Are you sure you want to pause this promotion?')} "${promotionName}". ${t('Campaign delivery will stop immediately.')}`;
            } else if (action === 'resume') {
                title = t('Resume Promotion');
                message = `${t('Resume this promotion?')} "${promotionName}". ${t('Remaining budget will continue to spend.')}`;
            } else {
                title = t('Delete Promotion');
                message = `${t('This will permanently remove the promotion')} "${promotionName}". ${t('This action cannot be undone.')}`;
            }

            setConfirmModal({
                isOpen: true,
                promotionId: promotion.promotion_id,
                promotionName,
                action,
                title,
                message,
            });
        },
        [t],
    );

    const closeConfirmModal = () => {
        setConfirmModal({
            isOpen: false,
            promotionId: null,
            promotionName: '',
            action: null,
            title: '',
            message: '',
        });
    };

    const performStatusMutation = async (promotionId: number, action: 'pause' | 'resume') => {
        try {
            const response = await fetch(`/seller/promotions/${promotionId}/${action}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': getCsrfToken(),
                },
                body: JSON.stringify({}),
            });

            if (!response.ok) {
                const errorPayload = await response.json().catch(() => ({}));
                const message =
                    errorPayload?.message ?? (action === 'pause' ? t('Unable to pause the promotion.') : t('Unable to resume the promotion.'));
                throw new Error(message);
            }

            const payload = await response.json().catch(() => ({ message: '' }));
            const successMessage =
                payload?.message ?? (action === 'pause' ? t('Promotion paused successfully.') : t('Promotion resumed successfully.'));

            setToast({ type: 'success', message: successMessage });
            router.reload({ only: ['promotions', 'pagination'] });
        } catch (error) {
            const fallback = action === 'pause' ? t('Unable to pause the promotion.') : t('Unable to resume the promotion.');
            setToast({ type: 'error', message: error instanceof Error ? error.message : fallback });
        }
    };

    const handleConfirmAction = async () => {
        if (!confirmModal.promotionId || !confirmModal.action) {
            return;
        }

        if (confirmModal.action === 'delete') {
            router.delete(`/seller/promotions/${confirmModal.promotionId}`, {
                preserveScroll: true,
            });
            return;
        }

        await performStatusMutation(confirmModal.promotionId, confirmModal.action);
    };

    const buildActionButtons = useCallback(
        (promotion: Promotion): ActionConfig[] => {
            const statusSnapshot = determineStatus(promotion);
            const actions: ActionConfig[] = [];

            actions.push(
                {
                    type: 'link',
                    href: `/seller/promotions/${promotion.promotion_id}`,
                    variant: 'primary',
                    icon: Eye,
                    label: t('View'),
                },
                {
                    type: 'link',
                    href: `/seller/promotions/${promotion.promotion_id}/edit`,
                    variant: 'primary',
                    icon: Pencil,
                    label: t('Edit'),
                },
            );

            if (statusSnapshot.badge === 'active') {
                actions.push({
                    type: 'button',
                    onClick: () => openConfirmModal(promotion, 'pause'),
                    variant: 'danger',
                    icon: Pause,
                    label: t('Pause'),
                });
            } else if (statusSnapshot.badge === 'paused') {
                actions.push({
                    type: 'button',
                    onClick: () => openConfirmModal(promotion, 'resume'),
                    variant: 'primary',
                    icon: Play,
                    label: t('Resume'),
                });
            }

            actions.push({
                type: 'button',
                onClick: () => openConfirmModal(promotion, 'delete'),
                variant: 'danger',
                icon: Trash2,
                label: t('Delete'),
            });

            return actions;
        },
        [determineStatus, openConfirmModal, t],
    );

    const columns = useMemo<DataTableColumn<Promotion>[]>(
        () => [
            {
                key: 'promotion_name',
                header: t('Promotion'),
                cell: (promotion) => (
                    <div className={styles.promotionCell}>
                        <span className={styles.promotionName}>{promotion.name}</span>
                        <span className={styles.cellMeta}>{getDiscountLabel(promotion, t)}</span>
                        <span className={styles.promotionMeta}>
                            {t('Products')}: {promotion.products?.length ?? 0} · {formatDateRange(promotion.start_date, promotion.end_date)}
                        </span>
                    </div>
                ),
            },
            {
                key: 'promotion_budget',
                header: t('Budget'),
                cell: (promotion) => {
                    const allocated = Number(promotion.allocated_budget ?? 0);
                    const spent = Number(promotion.spent_budget ?? 0);
                    const percent = getPercentValue(spent, allocated);
                    const isOverBudget = spent > allocated && allocated > 0;

                    return (
                        <div className={styles.budgetCell}>
                            <span className={styles.budgetAmount}>
                                {formatVnd(spent)} / {formatVnd(allocated)}
                            </span>
                            <Progress value={percent} tone={isOverBudget ? 'danger' : 'accent'} />
                            <span className={styles.budgetCaption}>
                                {t('Remains')}: {formatVnd(Math.max(allocated - spent, 0))}
                            </span>
                        </div>
                    );
                },
            },
            {
                key: 'promotion_status',
                header: t('Status'),
                cell: (promotion) => {
                    const statusSnapshot = determineStatus(promotion);

                    return (
                        <div className={styles.statusCell}>
                            <StatusBadge status={statusSnapshot.badge} />
                            <span className={styles.statusHelper}>{statusSnapshot.helper}</span>
                        </div>
                    );
                },
            },
            {
                key: 'promotion_performance',
                header: t('Performance'),
                align: 'right',
                cell: (promotion) => (
                    <div className={styles.performanceCell}>
                        <span className={getRoiClass(promotion.roi_percentage ?? 0)}>
                            {t('ROI')}: {Number(promotion.roi_percentage ?? 0).toFixed(1)}%
                        </span>
                        <span>
                            {t('Allocated')}: {formatVnd(Number(promotion.allocated_budget ?? 0))}
                        </span>
                        <span>
                            {t('Spent')}: {formatVnd(Number(promotion.spent_budget ?? 0))}
                        </span>
                    </div>
                ),
            },
            {
                key: 'promotion_actions',
                header: t('Actions'),
                align: 'right',
                cell: (promotion) => <ActionButtons actions={buildActionButtons(promotion)} />,
            },
        ],
        [buildActionButtons, determineStatus, t],
    );

    const insightsData = [
        { icon: Target, value: totalPromotions.toLocaleString('vi-VN'), label: t('Total Promotions') },
        { icon: PlayCircle, value: promotionMetrics.active.toLocaleString('vi-VN'), label: t('Active Campaigns') },
        { icon: Wallet, value: formatVnd(Number(wallet?.balance ?? 0)), label: t('Wallet Balance') },
    ];

    return (
        <WorkspaceLayout>
            <Head title={t('My Promotions')} />

            {toast && <Toast type={toast.type} message={toast.message} onClose={closeToast} />}

            <FilterPanel
                title={t('My Promotions')}
                breadcrumbs={[
                    { label: t('Seller Dashboard'), href: '/seller/dashboard' },
                    { label: t('Promotions'), href: '/seller/promotions', active: true },
                ]}
                searchConfig={{
                    value: search,
                    onChange: setSearch,
                    placeholder: t('Search promotions...'),
                }}
                filterConfigs={[
                    {
                        value: statusFilter,
                        onChange: setStatusFilter,
                        label: t('-- All Statuses --'),
                        options: [
                            { value: 'active', label: t('Active') },
                            { value: 'paused', label: t('Paused') },
                            { value: 'upcoming', label: t('Upcoming') },
                            { value: 'expired', label: t('Expired') },
                        ],
                    },
                    {
                        value: dateRange,
                        onChange: setDateRange,
                        label: t('-- Date Range --'),
                        options: [
                            { value: 'last_7_days', label: t('Last 7 days') },
                            { value: 'last_30_days', label: t('Last 30 days') },
                            { value: 'last_90_days', label: t('Last 90 days') },
                        ],
                    },
                    {
                        value: budgetRange,
                        onChange: setBudgetRange,
                        label: t('-- Budget Range --'),
                        options: [
                            { value: '0-1000000', label: t('Under 1M VND') },
                            { value: '1000000-5000000', label: t('1M - 5M VND') },
                            { value: '5000000+', label: t('Above 5M VND') },
                        ],
                    },
                ]}
                buttonConfigs={[
                    {
                        href: '/seller/promotions/create',
                        label: t('Create Promotion'),
                        icon: Plus,
                        color: 'primary',
                    },
                ]}
                onApplyFilters={handleApplyFilters}
            />

            <Insights items={insightsData} columns={3} />

            <DataTable
                columns={columns}
                data={promotionRows}
                headerTitle={`${t('Promotions')} (${totalPromotions})`}
                headerIcon={Gift}
                emptyMessage={t('No promotions found')}
            />

            <Pagination
                links={paginationLinks}
                filters={{
                    search: search || undefined,
                    status: statusFilter || undefined,
                    date_range: dateRange || undefined,
                    budget_range: budgetRange || undefined,
                }}
            />

            <ConfirmationModal
                isOpen={confirmModal.isOpen}
                onClose={closeConfirmModal}
                onConfirm={handleConfirmAction}
                title={confirmModal.title}
                message={confirmModal.message}
            />
        </WorkspaceLayout>
    );
}

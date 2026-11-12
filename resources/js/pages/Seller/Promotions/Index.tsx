import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AppLayout from '../../../layouts/app/AppLayout';
import FilterPanel from '@/components/ui/FilterPanel';
import DataTable from '@/components/ui/DataTable';
import Pagination from '@/components/ui/Pagination';
import StatusBadge from '@/components/ui/StatusBadge';
import ActionButtons, { ActionConfig } from '@/components/ui/ActionButtons';
import ConfirmationModal from '@/components/ui/ConfirmationModal';
import Toast from '@/components/admin/users/Toast';
import { useTranslation } from '../../../lib/i18n';
import '@/../css/Page.css';

interface PromotionProduct {
    product_id: number;
    name: string;
    sku: string;
}

interface Promotion {
    promotion_id: number;
    name: string;
    type: string;
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

const formatCurrency = (value: number | string | null | undefined, currency: string = 'VND') => {
    const numericValue = Number(value ?? 0);
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
    }).format(Number.isFinite(numericValue) ? numericValue : 0);
};

const formatDate = (value: string | null | undefined) => {
    if (!value) {
        return '';
    }

    return new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(new Date(value));
};

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
            return `${translate('Fixed Discount')}: ${formatCurrency(value)}`;
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
        return 'positive';
    }

    if (roi >= 50) {
        return 'neutral';
    }

    return 'negative';
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
        let paused = 0;
        let expired = 0;
        let upcoming = 0;
        let allocated = 0;
        let spent = 0;

        promotionRows.forEach((promotion) => {
            const start = promotion.start_date ? new Date(promotion.start_date) : null;
            const end = promotion.end_date ? new Date(promotion.end_date) : null;
            const isExpired = end !== null && end < now;
            const isUpcoming = start !== null && start > now;

            allocated += Number(promotion.allocated_budget ?? 0);
            spent += Number(promotion.spent_budget ?? 0);

            if (!promotion.is_active) {
                paused += 1;
            } else if (isExpired) {
                expired += 1;
            } else if (isUpcoming) {
                upcoming += 1;
            } else {
                active += 1;
            }
        });

        return {
            active,
            paused,
            expired,
            upcoming,
            allocated,
            spent,
        };
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
        router.get('/seller/promotions', {
            search: search || undefined,
            status: statusFilter || undefined,
            date_range: dateRange || undefined,
            budget_range: budgetRange || undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const joinLabelWithDate = useCallback((labelKey: string, dateValue: string) => {
        const formatted = formatDate(dateValue);
        return formatted ? `${t(labelKey)} ${formatted}` : t(labelKey);
    }, [t]);

    const determineStatus = useCallback((promotion: Promotion) => {
        const now = new Date();
        const startDate = promotion.start_date ? new Date(promotion.start_date) : null;
        const endDate = promotion.end_date ? new Date(promotion.end_date) : null;

        if (!promotion.is_active) {
            return {
                badge: 'Paused',
                label: t('Paused'),
                helper: endDate ? joinLabelWithDate('Paused until', promotion.end_date) : t('Promotion is paused'),
            };
        }

        if (endDate && endDate < now) {
            return {
                badge: 'Expired',
                label: t('Expired'),
                helper: joinLabelWithDate('Ended on', promotion.end_date),
            };
        }

        if (startDate && startDate > now) {
            return {
                badge: 'Upcoming',
                label: t('Upcoming'),
                helper: joinLabelWithDate('Starts on', promotion.start_date),
            };
        }

        return {
            badge: 'active',
            label: t('Active'),
            helper: endDate ? joinLabelWithDate('Ends on', promotion.end_date) : t('Currently running'),
        };
    }, [joinLabelWithDate, t]);

    const openConfirmModal = useCallback((promotion: Promotion, action: ConfirmAction) => {
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
    }, [t]);

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
                const message = errorPayload?.message ?? (action === 'pause' ? t('Unable to pause the promotion.') : t('Unable to resume the promotion.'));
                throw new Error(message);
            }

            const payload = await response.json().catch(() => ({ message: '' }));
            const successMessage = payload?.message ?? (action === 'pause' ? t('Promotion paused successfully.') : t('Promotion resumed successfully.'));

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

    const buildActionButtons = useCallback((promotion: Promotion): ActionConfig[] => {
        const statusSnapshot = determineStatus(promotion);
        const actions: ActionConfig[] = [
            {
                type: 'link',
                href: `/seller/promotions/${promotion.promotion_id}`,
                variant: 'primary',
                icon: 'bx bx-show',
                label: t('View'),
            },
            {
                type: 'link',
                href: `/seller/promotions/${promotion.promotion_id}/edit`,
                variant: 'primary',
                icon: 'bx bx-edit-alt',
                label: t('Edit'),
            },
        ];

        if (statusSnapshot.badge === 'active') {
            actions.push({
                type: 'button',
                onClick: () => openConfirmModal(promotion, 'pause'),
                variant: 'danger',
                icon: 'bx bx-pause',
                label: t('Pause'),
            });
        } else if (statusSnapshot.badge === 'Paused' || statusSnapshot.badge === 'Expired') {
            actions.push({
                type: 'button',
                onClick: () => openConfirmModal(promotion, 'resume'),
                variant: 'primary',
                icon: 'bx bx-play',
                label: t('Resume'),
            });
        }

        actions.push({
            type: 'button',
            onClick: () => openConfirmModal(promotion, 'delete'),
            variant: 'danger',
            icon: 'bx bx-trash',
            label: t('Delete'),
        });

        return actions;
    }, [determineStatus, openConfirmModal, t]);

    const columns = useMemo(() => [
        {
            id: 'promotion_name',
            header: t('Promotion'),
            cell: (promotion: Promotion) => (
                <div className="promotion-cell">
                    <div className="promotion-name">{promotion.name}</div>
                    <div className="promotion-discount">{getDiscountLabel(promotion, t)}</div>
                    <div className="promotion-meta">
                        {t('Products')}: {promotion.products?.length ?? 0} · {formatDateRange(promotion.start_date, promotion.end_date)}
                    </div>
                </div>
            ),
        },
        {
            id: 'promotion_budget',
            header: t('Budget'),
            cell: (promotion: Promotion) => {
                const allocated = Number(promotion.allocated_budget ?? 0);
                const spent = Number(promotion.spent_budget ?? 0);
                const percent = getPercentValue(spent, allocated);
                const isOverBudget = spent > allocated && allocated > 0;

                return (
                    <div className="promotion-budget">
                        <div className={`promotion-budget-amount${isOverBudget ? ' over-budget' : ''}`}>
                            {formatCurrency(spent)} / {formatCurrency(allocated)}
                        </div>
                        <progress
                            className={`promotion-progress${isOverBudget ? ' over-budget' : ''}`}
                            value={percent}
                            max={100}
                        >
                            {percent}%
                        </progress>
                        <div className="promotion-budget-caption">
                            {t('Remains')}: {formatCurrency(Math.max(allocated - spent, 0))}
                        </div>
                    </div>
                );
            },
        },
        {
            id: 'promotion_status',
            header: t('Status'),
            cell: (promotion: Promotion) => {
                const statusSnapshot = determineStatus(promotion);

                return (
                    <div className="promotion-status">
                        <StatusBadge status={statusSnapshot.badge} />
                        <div className="promotion-status-text">{statusSnapshot.helper}</div>
                    </div>
                );
            },
        },
        {
            id: 'promotion_performance',
            header: t('Performance'),
            cell: (promotion: Promotion) => (
                <div className="promotion-performance">
                    <div className={`promotion-roi ${getRoiClass(promotion.roi_percentage ?? 0)}`}>
                        {t('ROI')}: {Number(promotion.roi_percentage ?? 0).toFixed(1)}%
                    </div>
                    <div className="promotion-performance-metric">
                        <strong>{t('Allocated')}:</strong> {formatCurrency(promotion.allocated_budget)}
                    </div>
                    <div className="promotion-performance-metric">
                        <strong>{t('Spent')}:</strong> {formatCurrency(promotion.spent_budget)}
                    </div>
                </div>
            ),
        },
        {
            id: 'promotion_actions',
            header: t('Actions'),
            cell: (promotion: Promotion) => <ActionButtons actions={buildActionButtons(promotion)} />,
        },
    ], [buildActionButtons, determineStatus, t]);

    return (
        <AppLayout>
            <Head title={t('My Promotions')} />

            {toast && (
                <Toast
                    type={toast.type}
                    message={toast.message}
                    onClose={closeToast}
                />
            )}

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
                        icon: 'bx bx-plus',
                        color: 'primary',
                    },
                ]}
                onApplyFilters={handleApplyFilters}
            />

            <ul className="insights promotion-insights">
                <li>
                    <i className="bx bx-target-lock"></i>
                    <span className="info">
                        <h3>{totalPromotions}</h3>
                        <p>{t('Total Promotions')}</p>
                    </span>
                </li>
                <li>
                    <i className="bx bx-play-circle"></i>
                    <span className="info">
                        <h3>{promotionMetrics.active}</h3>
                        <p>{t('Active Campaigns')}</p>
                    </span>
                </li>
                <li>
                    <i className="bx bx-wallet"></i>
                    <span className="info">
                        <h3>{formatCurrency(wallet?.balance ?? 0, wallet?.currency ?? 'VND')}</h3>
                        <p>{t('Wallet Balance')}</p>
                    </span>
                </li>
            </ul>

            <DataTable
                columns={columns}
                data={promotionRows}
                headerTitle={`${t('Promotions')} (${totalPromotions})`}
                headerIcon="bx bx-gift"
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
        </AppLayout>
    );
}

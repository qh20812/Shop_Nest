import { Head, router, usePage } from '@inertiajs/react';
import { Check, Clock, Eye, Store, X } from 'lucide-react';
import { useMemo, useState } from 'react';

import ActionDropdown from '@/components/ui/action-dropdown';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import ConfirmationModal from '@/components/ui/confirmation-modal';
import DataTable from '@/components/ui/data-table';
import { Dialog } from '@/components/ui/dialog';
import Header from '@/components/ui/header';
import Insights from '@/components/ui/insights';
import Pagination from '@/components/ui/pagination';
import AppLayout from '@/layouts/app/AppLayout';
import { formatDate, formatNumber, formatVnd } from '@/lib/format';
import { useTranslation } from '@/lib/i18n';

import styles from '@/components/admin/admin.module.css';
import type { Shop, ShopCollection, ShopMetrics } from './types';

interface PageProps extends Record<string, unknown> {
    shops: ShopCollection & {
        links?: Array<{ url: string | null; label: string; active: boolean }>;
    };
    filters: Record<string, string | number | undefined>;
    metrics?: ShopMetrics;
}

export default function Pending() {
    const { t } = useTranslation();
    const { shops, filters = {}, metrics } = usePage<PageProps>().props;

    const [confirmApprove, setConfirmApprove] = useState<{ open: boolean; shopId: number | null; name: string }>({
        open: false,
        shopId: null,
        name: '',
    });
    const [rejectTarget, setRejectTarget] = useState<{ open: boolean; shopId: number | null; name: string }>({
        open: false,
        shopId: null,
        name: '',
    });
    const [reason, setReason] = useState('');
    const [reasonError, setReasonError] = useState('');

    const columns = useMemo(
        () => [
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
                cell: () => <Badge tone="warning">{t('Pending')}</Badge>,
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
                key: 'actions',
                header: t('Actions'),
                cell: (shop: Shop) => (
                    <ActionDropdown
                        actions={[
                            { label: t('View'), icon: Eye, onClick: () => router.get(`/admin/shops/${shop.id}`) },
                            {
                                label: t('Approve'),
                                icon: Check,
                                onClick: () => setConfirmApprove({ open: true, shopId: shop.id, name: shop.name ?? shop.username ?? '' }),
                            },
                            {
                                label: t('Reject'),
                                icon: X,
                                onClick: () => {
                                    setReason('');
                                    setReasonError('');
                                    setRejectTarget({ open: true, shopId: shop.id, name: shop.name ?? shop.username ?? '' });
                                },
                            },
                        ]}
                    />
                ),
            },
        ],
        [t],
    );

    const summaryItems = [
        { icon: Store, value: formatNumber(metrics?.total ?? shops.total ?? 0), label: t('Total Shops') },
        { icon: Clock, value: formatNumber(metrics?.pending ?? shops.total ?? 0), label: t('Pending') },
    ];

    const submitReject = () => {
        if (!rejectTarget.shopId) {
            return;
        }

        if (reason.trim().length < 10) {
            setReasonError(t('Rejection reason must contain at least 10 characters.'));
            return;
        }

        router.post(`/admin/shops/${rejectTarget.shopId}/reject`, { reason: reason.trim() }, { preserveScroll: true });
        setRejectTarget({ open: false, shopId: null, name: '' });
    };

    return (
        <AppLayout>
            <Head title={t('Pending Shops')} />

            <Header
                title={t('Pending Shops')}
                breadcrumbs={[
                    { label: t('Dashboard'), href: '/admin/dashboard' },
                    { label: t('Shops'), href: '/admin/shops' },
                    { label: t('Pending'), href: '/admin/shops/pending', active: true },
                ]}
            />

            <Insights items={summaryItems} columns={3} />

            <DataTable
                columns={columns}
                data={shops.data}
                headerTitle={t('Pending Shop List')}
                headerIcon={Clock}
                emptyMessage={t('No pending shops')}
            />

            <Pagination links={shops.links ?? []} filters={filters} />

            <ConfirmationModal
                isOpen={confirmApprove.open}
                onClose={() => setConfirmApprove({ open: false, shopId: null, name: '' })}
                onConfirm={() => {
                    if (confirmApprove.shopId) {
                        router.post(`/admin/shops/${confirmApprove.shopId}/approve`, {}, { preserveScroll: true });
                    }
                }}
                title={t('Approve this shop?')}
                message={`${confirmApprove.name} ${t('will become active and visible to customers.')}`}
            />

            <Dialog
                open={rejectTarget.open}
                onOpenChange={(open) => {
                    if (!open) {
                        setRejectTarget({ open: false, shopId: null, name: '' });
                    }
                }}
                title={t('Reject this shop?')}
                size="md"
                footer={
                    <>
                        <Button type="button" variant="secondary" onClick={() => setRejectTarget({ open: false, shopId: null, name: '' })}>
                            {t('Cancel')}
                        </Button>
                        <Button type="button" variant="primary" onClick={submitReject}>
                            {t('Confirm')}
                        </Button>
                    </>
                }
            >
                <div className={styles.dialogField}>
                    <label className={styles.filterLabel} htmlFor="pending-shop-reason">
                        {t('Reason')}
                    </label>
                    <textarea
                        id="pending-shop-reason"
                        className={styles.textArea}
                        value={reason}
                        onChange={(event) => setReason(event.target.value)}
                        placeholder={t('Provide a reason (min 10 characters).')}
                    />
                </div>
                {reasonError && <p className={styles.fileError}>{reasonError}</p>}
            </Dialog>
        </AppLayout>
    );
}

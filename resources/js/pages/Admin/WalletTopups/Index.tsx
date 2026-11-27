import { Head, router, usePage } from '@inertiajs/react';
import { Search, Wallet } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import adminStyles from '@/components/admin/admin.module.css';
import { PageHeader } from '@/components/layout/PageHeader';
import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import DataTable from '@/components/ui/data-table';
import FormField from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import Pagination from '@/components/ui/pagination';
import { Select } from '@/components/ui/select';
import { LiveStatus } from '@/components/wallet/LiveStatus';
import type { AdminFilters, AdminQueueState, AdminTopup, Paginated } from '@/components/wallet/types';
import { topupStatusKeys, topupStatusTones } from '@/components/wallet/wallet-status';
import { useAdminTopupQueue } from '@/hooks/useAdminTopupQueue';
import { cx } from '@/lib/cx';
import { formatDate, formatNumber, formatTime, formatVnd } from '@/lib/format';
import { useTranslation } from '@/lib/i18n';

import { TopupReviewDialog } from './TopupReviewDialog';

import styles from './WalletTopups.module.css';

type PageProps = {
    topups: Paginated<AdminTopup>;
    filters: AdminFilters;
    statusOptions: Record<string, string>;
    statusCounts: Record<string, number>;
    server_time: string;
} & Record<string, unknown>;

const RAIL_STATUSES = ['transferred', 'pending', 'approved', 'rejected', 'expired'] as const;

export default function Index() {
    const { t } = useTranslation();
    const { topups, filters, statusOptions, statusCounts, server_time: serverTime } = usePage<PageProps>().props;

    const initial = useMemo<AdminQueueState>(
        () => ({ topups, statusCounts, filters, server_time: serverTime }),
        [topups, statusCounts, filters, serverTime],
    );

    const queue = useAdminTopupQueue(initial);

    const [status, setStatus] = useState(filters.status);
    const [code, setCode] = useState(filters.code);
    const [selected, setSelected] = useState<AdminTopup | null>(null);
    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        setStatus(filters.status);
        setCode(filters.code);
    }, [filters.status, filters.code]);

    useEffect(() => {
        const timer = window.setInterval(() => setNow(Date.now()), 30000);

        return () => window.clearInterval(timer);
    }, []);

    const visit = (nextStatus: string, nextCode: string) => {
        router.get(
            '/admin/wallet-topups',
            {
                status: nextStatus || undefined,
                code: nextCode || undefined,
            },
            { preserveState: true, preserveScroll: true },
        );
    };

    const waitingLabel = (topup: AdminTopup): string => {
        if (topup.status !== 'pending' && topup.status !== 'transferred') {
            return '-';
        }

        const since = topup.transferred_at ?? topup.created_at;

        if (!since) {
            return '-';
        }

        const milliseconds = now - new Date(since).getTime();

        if (!Number.isFinite(milliseconds) || milliseconds < 0) {
            return '-';
        }

        const minutes = Math.floor(milliseconds / 60000);

        if (minutes < 60) {
            return `${minutes} ${t('minutes')}`;
        }

        return `${Math.floor(minutes / 60)} ${t('hours')}`;
    };

    const hasFilters = Boolean(filters.code) || filters.status !== 'transferred';
    const rangeLabel =
        queue.topups.total > 0
            ? `${formatNumber(queue.topups.from ?? 0)}-${formatNumber(queue.topups.to ?? 0)} / ${formatNumber(queue.topups.total)}`
            : formatNumber(0);

    const columns = [
        {
            key: 'user',
            header: t('User'),
            cell: (topup: AdminTopup) => (
                <div className={styles.userCell}>
                    <span className={styles.userName}>{topup.user?.username ?? '-'}</span>
                    {topup.user?.email && <span className={styles.userEmail}>{topup.user.email}</span>}
                </div>
            ),
        },
        {
            key: 'code',
            header: t('Code'),
            cell: (topup: AdminTopup) => <span className={styles.code}>{topup.code}</span>,
        },
        {
            key: 'declared',
            header: t('Declared amount'),
            align: 'right' as const,
            cell: (topup: AdminTopup) => <span className={styles.amount}>{formatVnd(topup.amount_declared)}</span>,
        },
        {
            key: 'received',
            header: t('Credited amount'),
            align: 'right' as const,
            className: styles.hideSm,
            cell: (topup: AdminTopup) => {
                if (topup.amount_received === null) {
                    return <span className={styles.muted}>-</span>;
                }

                const difference = topup.amount_received - topup.amount_declared;

                return (
                    <div className={styles.amountCell}>
                        <span className={styles.amount}>{formatVnd(topup.amount_received)}</span>
                        {Math.abs(difference) >= 1 && (
                            <span className={styles.delta}>
                                {difference > 0 ? '+' : '-'} {formatVnd(Math.abs(difference))}
                            </span>
                        )}
                    </div>
                );
            },
        },
        {
            key: 'status',
            header: t('Status'),
            cell: (topup: AdminTopup) => <Badge tone={topupStatusTones[topup.status]}>{t(topupStatusKeys[topup.status])}</Badge>,
        },
        {
            key: 'waiting',
            header: t('Waiting'),
            className: styles.hideSm,
            cell: (topup: AdminTopup) => <span className={styles.muted}>{waitingLabel(topup)}</span>,
        },
        {
            key: 'expires',
            header: t('Expires at'),
            className: styles.hideSm,
            cell: (topup: AdminTopup) => <span className={styles.muted}>{`${formatDate(topup.expires_at)} ${formatTime(topup.expires_at)}`}</span>,
        },
        {
            key: 'actions',
            header: t('Actions'),
            cell: (topup: AdminTopup) => (
                <Button type="button" variant="secondary" size="sm" onClick={() => setSelected(topup)}>
                    {topup.status === 'pending' || topup.status === 'transferred' ? t('Approve') : t('View')}
                </Button>
            ),
        },
    ];

    return (
        <WorkspaceLayout>
            <Head title={t('Review top-ups')} />

            <div className={adminStyles.stack}>
                <PageHeader
                    breadcrumbs={[
                        { label: t('Dashboard'), href: '/admin/dashboard' },
                        { label: t('Review top-ups'), current: true },
                    ]}
                    title={t('Review top-ups')}
                    description={t('Match bank transfers and credit wallets.')}
                    count={formatNumber(queue.topups.total)}
                    actions={
                        <LiveStatus
                            lastUpdatedAt={queue.lastUpdatedAt}
                            refreshing={queue.refreshing}
                            failed={queue.failed}
                            onRefresh={queue.refresh}
                        />
                    }
                />

                <dl className={styles.rail}>
                    {RAIL_STATUSES.map((key) => (
                        <div key={key} className={styles.railItem}>
                            <dt className={styles.railLabel}>{t(topupStatusKeys[key])}</dt>
                            <dd className={styles.railValue}>{formatNumber(queue.statusCounts[key] ?? 0)}</dd>
                        </div>
                    ))}
                </dl>

                <form
                    className={cx(styles.filters, 'sn-glass-surface')}
                    aria-label={t('Filter')}
                    onSubmit={(event) => {
                        event.preventDefault();
                        visit(status, code.trim());
                    }}
                >
                    <FormField label={t('Status')} htmlFor="wallet-topup-status-filter">
                        <Select id="wallet-topup-status-filter" value={status} onChange={(event) => setStatus(event.target.value)} surface="glass">
                            {Object.entries(statusOptions).map(([value, label]) => (
                                <option key={value} value={value}>
                                    {t(label)}
                                </option>
                            ))}
                        </Select>
                    </FormField>

                    <FormField label={t('Code')} htmlFor="wallet-topup-code-filter">
                        <Input
                            id="wallet-topup-code-filter"
                            type="search"
                            value={code}
                            maxLength={6}
                            onChange={(event) => setCode(event.target.value.toUpperCase())}
                            placeholder={t('Search by top-up code...')}
                            leadingIcon={Search}
                            surface="glass"
                        />
                    </FormField>

                    <div className={styles.filterActions}>
                        <Button type="submit" variant="primary" leftIcon={Search}>
                            {t('Filter')}
                        </Button>
                        {hasFilters && (
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => {
                                    setStatus('transferred');
                                    setCode('');
                                    visit('transferred', '');
                                }}
                            >
                                {t('Clear filters')}
                            </Button>
                        )}
                    </div>
                </form>

                <DataTable
                    columns={columns}
                    data={queue.topups.data}
                    headerTitle={t('Top-up requests')}
                    headerIcon={Wallet}
                    headerMeta={rangeLabel}
                    rowClassName={(topup) => (queue.newIds.includes(topup.topup_id) ? styles.newRow : undefined)}
                    emptyMessage={!filters.code && filters.status === 'transferred' ? t('No top-ups to review') : t('No top-ups match the filters.')}
                />

                {queue.topups.last_page > 1 && <Pagination links={queue.topups.links} filters={{ status: filters.status, code: filters.code }} />}
            </div>

            <TopupReviewDialog
                topup={selected}
                onClose={() => setSelected(null)}
                onSuccess={(reviewed, counts) => {
                    queue.applyReviewed(reviewed, counts);
                    void queue.refresh();
                }}
            />
        </WorkspaceLayout>
    );
}

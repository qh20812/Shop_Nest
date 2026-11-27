import { Head, router, usePage } from '@inertiajs/react';
import { Filter, Users as UsersIcon } from 'lucide-react';
import React, { useMemo, useState } from 'react';

import AnalyticsCard from '@/components/admin/analytics/AnalyticsCard';
import type { AnalyticsChartPoint as ChartDataPoint } from '@/components/admin/analytics/AnalyticsChart';
import AnalyticsChart from '@/components/admin/analytics/AnalyticsChart';
import AnalyticsFilters, { type AnalyticsFilterState, type AnalyticsFilterValue } from '@/components/admin/analytics/AnalyticsFilters';
import type { AnalyticsTableColumn } from '@/components/admin/analytics/AnalyticsTable';
import AnalyticsTable from '@/components/admin/analytics/AnalyticsTable';
import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import { Button } from '@/components/ui/button';
import Header from '@/components/ui/header';
import StatusBadge from '@/components/ui/status-badge';
import { formatNumber } from '@/lib/format';
import { useTranslation } from '@/lib/i18n';
import { formatMoney, resolveCurrencyCode } from '@/lib/utils';

import styles from '@/components/admin/admin.module.css';

type UserSegmentPoint = {
    segmentId?: number;
    label: string;
    value: number;
    [key: string]: string | number | null | undefined;
};

interface UserRetentionMetrics {
    thirtyDay?: number;
    ninetyDay?: number;
    totalCustomers?: number;
    [key: string]: number | undefined;
}

interface UserActiveMetrics {
    last24h?: number;
    last7d?: number;
    ordersLast30d?: number;
    [key: string]: number | undefined;
}

interface UserDetailInput extends Record<string, unknown> {
    id?: number | string;
    user_id?: number | string;
    name?: string;
    full_name?: string;
    email?: string | null;
    joined_at?: string;
    joinDate?: string;
    created_at?: string;
    orders_count?: number;
    ordersCount?: number;
    total_spent?: number;
    totalSpent?: number;
    last_activity?: string | null;
    lastActivity?: string | null;
    status?: string | null;
    role?: string | null;
    segment?: string | null;
}

type UserDetailRow = {
    id: string;
    name: string;
    email: string;
    joinedAt: string | null;
    ordersCount: number;
    totalSpent: number;
    lastActivity: string | null;
    status: string | null;
    role?: string | null;
    segment?: string | null;
    [key: string]: string | number | null | undefined;
};

interface UsersAnalyticsPayload extends Record<string, unknown> {
    growthSeries?: ChartDataPoint[];
    segments?: UserSegmentPoint[];
    retention?: UserRetentionMetrics;
    activeUsers?: UserActiveMetrics;
    filters?: Record<string, unknown>;
    details?: UserDetailInput[];
    table?: UserDetailInput[];
    userTable?: UserDetailInput[];
    records?: UserDetailInput[];
}

interface UsersPageProps extends Record<string, unknown> {
    users?: UsersAnalyticsPayload;
    filters?: Record<string, unknown>;
    availableRanges?: string[];
    locale?: string;
    currency?: string | { code?: string };
    currencyCode?: string;
}

type UserFilterState = AnalyticsFilterState & {
    date_from: AnalyticsFilterValue;
    date_to: AnalyticsFilterValue;
    role: AnalyticsFilterValue;
    segment_id: AnalyticsFilterValue;
};

type FilterPayload = Record<string, string | number>;

function normalizeFilterValue(value: unknown, fallback: AnalyticsFilterValue = ''): AnalyticsFilterValue {
    if (value === null || value === undefined) {
        return fallback;
    }

    if (typeof value === 'string' || typeof value === 'number') {
        return value;
    }

    if (typeof value === 'boolean') {
        return value ? '1' : '0';
    }

    return fallback;
}

function cleanupFilters(filters: AnalyticsFilterState): FilterPayload {
    const payload: FilterPayload = {};

    Object.entries(filters).forEach(([key, rawValue]) => {
        if (typeof rawValue === 'number') {
            payload[key] = rawValue;
            return;
        }

        if (typeof rawValue === 'string' && rawValue !== '') {
            payload[key] = rawValue;
        }
    });

    return payload;
}

const Users: React.FC = () => {
    const { props } = usePage<UsersPageProps>();
    const analytics = useMemo<UsersAnalyticsPayload>(() => props.users ?? {}, [props.users]);
    const initialFilters = props.filters ?? {};
    const locale = typeof props.locale === 'string' ? props.locale : 'vi';
    const currency = resolveCurrencyCode(props.currencyCode ?? props.currency);
    const { t } = useTranslation();

    const [filters, setFilters] = useState<UserFilterState>(() => ({
        date_from: normalizeFilterValue(initialFilters['date_from'], ''),
        date_to: normalizeFilterValue(initialFilters['date_to'], ''),
        segment_id: normalizeFilterValue(initialFilters['segment_id'], ''),
        role: normalizeFilterValue(initialFilters['role'], ''),
    }));

    const growthSeries = useMemo<ChartDataPoint[]>(() => (Array.isArray(analytics.growthSeries) ? analytics.growthSeries : []), [analytics]);
    const segments = useMemo<UserSegmentPoint[]>(() => (Array.isArray(analytics.segments) ? analytics.segments : []), [analytics]);
    const retention = useMemo<UserRetentionMetrics>(() => analytics.retention ?? {}, [analytics]);
    const activeUsers = useMemo<UserActiveMetrics>(() => analytics.activeUsers ?? {}, [analytics]);

    const money = useMemo(() => (value: number) => formatMoney(value, currency, locale), [currency, locale]);
    const dateFormatter = useMemo(
        () =>
            new Intl.DateTimeFormat(locale.startsWith('vi') ? 'vi-VN' : locale, {
                dateStyle: 'medium',
                timeStyle: 'short',
            }),
        [locale],
    );

    const totalUsers = retention.totalCustomers ?? 0;
    const latestNewUsers = growthSeries.at(-1)?.value ?? 0;
    const activeLast7d = activeUsers.last7d ?? 0;
    const retention30 = retention.thirtyDay ?? 0;
    const retention90 = retention.ninetyDay ?? 0;
    const retentionChange = retention30 - retention90;

    const activeUsersSeries: ChartDataPoint[] = useMemo(
        () => [
            { label: t('Last 24 Hours'), value: activeUsers.last24h ?? 0 },
            { label: t('Last 7 Days'), value: activeUsers.last7d ?? 0 },
            { label: t('Orders Last 30 Days'), value: activeUsers.ordersLast30d ?? 0 },
        ],
        [activeUsers.last24h, activeUsers.last7d, activeUsers.ordersLast30d, t],
    );

    const segmentChartData: ChartDataPoint[] = useMemo(
        () => segments.map((segment) => ({ label: segment.label, value: segment.value ?? 0, segmentId: segment.segmentId })),
        [segments],
    );

    const detailRows: UserDetailRow[] = useMemo(() => {
        const candidateKeys = ['details', 'table', 'userTable', 'records', 'rows'];
        let source: unknown[] = [];

        for (const key of candidateKeys) {
            const value = (analytics as Record<string, unknown>)[key];
            if (Array.isArray(value)) {
                source = value;
                break;
            }
        }

        return source.map((entry, index) => {
            const item = entry as UserDetailInput;
            const idValue = item.id ?? item.user_id ?? index + 1;

            return {
                id: String(idValue),
                name: item.name ?? item.full_name ?? t('Unknown User'),
                email: item.email ?? '',
                joinedAt: item.joined_at ?? item.joinDate ?? item.created_at ?? null,
                ordersCount: Number(item.orders_count ?? item.ordersCount ?? 0),
                totalSpent: Number(item.total_spent ?? item.totalSpent ?? 0),
                lastActivity: item.last_activity ?? item.lastActivity ?? null,
                status: item.status ?? null,
                role: item.role ?? null,
                segment: item.segment ?? null,
            };
        });
    }, [analytics, t]);

    const tableColumns: AnalyticsTableColumn<UserDetailRow>[] = useMemo(
        () => [
            {
                key: 'name',
                label: t('User'),
                sortable: false,
                render: (value, row) => (
                    <div className={styles.cellStack}>
                        <span className={styles.cellTitle}>{String(value ?? '')}</span>
                        {row.email ? <span className={styles.cellMeta}>{row.email}</span> : null}
                    </div>
                ),
            },
            {
                key: 'role',
                label: t('Role'),
                sortable: false,
                render: (value) => (value ? t(String(value)) : t('N/A')),
            },
            {
                key: 'segment',
                label: t('Segment'),
                sortable: false,
                render: (value) => (value ? String(value) : t('Unassigned')),
            },
            {
                key: 'joinedAt',
                label: t('Joined'),
                sortable: false,
                render: (value) => {
                    if (!value || typeof value !== 'string') {
                        return t('Unknown');
                    }

                    const parsed = new Date(value);
                    return Number.isNaN(parsed.valueOf()) ? value : dateFormatter.format(parsed);
                },
            },
            {
                key: 'ordersCount',
                label: t('Orders'),
                sortable: false,
                align: 'right',
                render: (value) => formatNumber(Number(value ?? 0)),
            },
            {
                key: 'totalSpent',
                label: t('Total Spent'),
                sortable: false,
                align: 'right',
                render: (value) => money(Number(value ?? 0)),
            },
            {
                key: 'lastActivity',
                label: t('Last Activity'),
                sortable: false,
                render: (value) => {
                    if (!value || typeof value !== 'string') {
                        return t('Unknown');
                    }

                    const parsed = new Date(value);
                    return Number.isNaN(parsed.valueOf()) ? value : dateFormatter.format(parsed);
                },
            },
            {
                key: 'status',
                label: t('Status'),
                sortable: false,
                render: (value) => (value ? <StatusBadge status={String(value)} type="general" /> : t('Unknown')),
            },
        ],
        [dateFormatter, money, t],
    );

    const handleFilterChange = (updated: AnalyticsFilterState) => {
        setFilters(updated as UserFilterState);
    };

    const handleApplyFilters = () => {
        router.get('/admin/analytics/users', cleanupFilters(filters), { preserveState: true, preserveScroll: true });
    };

    const handleResetFilters = () => {
        setFilters({ date_from: '', date_to: '', segment_id: '', role: '' });
        router.get('/admin/analytics/users', {}, { preserveState: true, preserveScroll: true });
    };

    return (
        <WorkspaceLayout>
            <Head title={t('User Analytics')} />
            <Header
                title={t('User Analytics')}
                breadcrumbs={[
                    { label: t('Dashboard'), href: '/admin/dashboard' },
                    { label: t('Analytics'), href: '/admin/analytics' },
                    { label: t('User Analytics'), href: '/admin/analytics/users', active: true },
                ]}
            />

            <div className={styles.stack}>
                <section className={styles.section}>
                    <p className={styles.muted}>
                        {t('Understand how users engage with the platform, monitor retention trends, and identify key segments.')}
                    </p>
                </section>

                <AnalyticsFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    title={t('Filter User Data')}
                    description={t('Adjust timeframe or narrow down segments to analyze specific user cohorts.')}
                    onReset={handleResetFilters}
                >
                    <div className={styles.filterActions}>
                        <Button type="button" variant="primary" onClick={handleApplyFilters}>
                            <Filter aria-hidden="true" />
                            {t('Apply Filters')}
                        </Button>
                    </div>
                </AnalyticsFilters>

                <ul className={styles.kpiList}>
                    <AnalyticsCard
                        title={t('Total Users')}
                        value={formatNumber(totalUsers)}
                        tooltip={t('Number of registered users across the platform.')}
                    />
                    <AnalyticsCard
                        title={t('New Users (Current Period)')}
                        value={formatNumber(latestNewUsers)}
                        tooltip={t('Users acquired within the selected reporting range.')}
                    />
                    <AnalyticsCard
                        title={t('Active Users (7d)')}
                        value={formatNumber(activeLast7d)}
                        tooltip={t('Unique users active over the past 7 days.')}
                    />
                    <AnalyticsCard
                        title={t('30-Day Retention')}
                        value={`${retention30.toFixed(1)}%`}
                        change={retentionChange}
                        changeLabel={t('vs 90-day retention')}
                        tooltip={t('Percentage of users returning within 30 days compared to the 90-day baseline.')}
                    />
                </ul>

                <section className={styles.chartGrid}>
                    <AnalyticsChart
                        type="line"
                        data={growthSeries}
                        title={t('User Growth Trend')}
                        description={t('New users acquired over the selected time range.')}
                        valueLabel={t('New Users')}
                    />
                    <AnalyticsChart
                        type="pie"
                        data={segmentChartData}
                        title={t('Segment Distribution')}
                        description={t('Relative size of user segments contributing to activity.')}
                        legend
                    />
                </section>

                <AnalyticsChart
                    type="bar"
                    data={activeUsersSeries}
                    title={t('Active User Engagement')}
                    description={t('Comparison of users active within recent engagement windows.')}
                    valueLabel={t('Users')}
                />

                <AnalyticsTable
                    data={detailRows}
                    columns={tableColumns}
                    headerTitle={t('User Cohort Details')}
                    headerIcon={<UsersIcon aria-hidden="true" />}
                    emptyMessage={t('No user details available for the selected filters.')}
                    rowKey={(row) => row.id}
                />
            </div>
        </WorkspaceLayout>
    );
};

export default Users;

import { Head, Link, usePage } from '@inertiajs/react';
import { BarChart3, DollarSign, FileText, Package, ShoppingBag, Users } from 'lucide-react';
import React, { useMemo } from 'react';

import AnalyticsCard from '@/components/admin/analytics/AnalyticsCard';
import type { AnalyticsChartPoint as ChartDataPoint } from '@/components/admin/analytics/AnalyticsChart';
import AnalyticsChart from '@/components/admin/analytics/AnalyticsChart';
import type { AnalyticsTableColumn } from '@/components/admin/analytics/AnalyticsTable';
import AnalyticsTable from '@/components/admin/analytics/AnalyticsTable';
import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/ui/header';
import { formatDecimal, formatNumber } from '@/lib/format';
import { useTranslation } from '@/lib/i18n';
import { formatMoney, resolveCurrencyCode } from '@/lib/utils';

import styles from '@/components/admin/admin.module.css';

interface UserGrowthMetric {
    current: number;
    previous: number;
    change: number;
}

interface AnalyticsKpiData {
    totalRevenue: number;
    pendingOrders: number;
    userGrowth: UserGrowthMetric;
    systemHealth: number;
}

interface RecentActivityRaw {
    id?: string | number;
    reference?: string;
    type?: string;
    description?: string;
    status?: string;
    occurred_at?: string;
    created_at?: string;
    actor?: string;
    entity?: string;
    message?: string;
    source?: string;
}

interface AnalyticsPageProps extends Record<string, unknown> {
    stats: AnalyticsKpiData;
    revenueChart: ChartDataPoint[];
    userGrowthChart: ChartDataPoint[];
    recentActivities?: RecentActivityRaw[];
    meta?: {
        generatedAt?: string;
    };
    currency?: string | { code?: string };
    currencyCode?: string;
    locale?: string;
}

type NormalizedActivity = Record<string, unknown> & {
    id: string;
    reference: string;
    type: string;
    description: string;
    status: string;
    occurredAt: string;
    actor?: string;
};

const statusTone = (status: string) => {
    const value = status.toLowerCase();
    if (value === 'success' || value === 'completed') return 'success' as const;
    if (value === 'danger' || value === 'error' || value === 'failed') return 'danger' as const;
    if (value === 'warning' || value === 'pending') return 'warning' as const;
    if (value === 'accent' || value === 'info') return 'accent' as const;
    return 'neutral' as const;
};

const Index: React.FC = () => {
    const { props } = usePage<AnalyticsPageProps>();
    const { stats, revenueChart, userGrowthChart, recentActivities = [], meta } = props;
    const locale = props.locale ?? 'vi';
    const currencyCode = resolveCurrencyCode(props.currencyCode ?? props.currency);
    const { t } = useTranslation();

    const money = useMemo(() => (value: number) => formatMoney(value, currencyCode, locale), [currencyCode, locale]);

    const lastGeneratedAt = useMemo(() => {
        if (!meta?.generatedAt) {
            return null;
        }

        const parsed = new Date(meta.generatedAt);
        if (Number.isNaN(parsed.getTime())) {
            return null;
        }

        return new Intl.DateTimeFormat(locale.startsWith('vi') ? 'vi-VN' : locale, {
            dateStyle: 'medium',
            timeStyle: 'short',
        }).format(parsed);
    }, [meta?.generatedAt, locale]);

    const normalizedActivities: NormalizedActivity[] = useMemo(() => {
        return recentActivities.map((activity, index) => {
            const reference =
                activity.reference || activity.entity || activity.message || (activity.id ? `#${activity.id}` : `activity-${index + 1}`);

            return {
                id: String(activity.id ?? `activity-${index + 1}`),
                reference: String(reference),
                type: activity.type ?? 'activity',
                description: activity.description || activity.message || t('No additional details'),
                status: activity.status ?? 'info',
                occurredAt: activity.occurred_at || activity.created_at || '',
                actor: activity.actor ?? activity.source,
            };
        });
    }, [recentActivities, t]);

    const activityColumns: AnalyticsTableColumn<NormalizedActivity>[] = useMemo(
        () => [
            {
                key: 'reference',
                label: t('Reference'),
                sortable: false,
                render: (value, row) => (
                    <div className={styles.cellStack}>
                        <span className={styles.cellTitle}>{String(value ?? '')}</span>
                        {row.actor ? <span className={styles.cellMeta}>{row.actor}</span> : null}
                    </div>
                ),
            },
            {
                key: 'type',
                label: t('Type'),
                sortable: false,
                render: (value) => <span className={styles.faint}>{t(String(value))}</span>,
            },
            {
                key: 'description',
                label: t('Details'),
                sortable: false,
            },
            {
                key: 'status',
                label: t('Status'),
                sortable: false,
                render: (value) => <Badge tone={statusTone(String(value))}>{t(String(value))}</Badge>,
            },
            {
                key: 'occurredAt',
                label: t('Timestamp'),
                sortable: false,
                render: (value) => {
                    if (typeof value !== 'string' || value.length === 0) {
                        return t('Unknown');
                    }

                    const parsed = new Date(value);
                    if (Number.isNaN(parsed.getTime())) {
                        return value;
                    }

                    return new Intl.DateTimeFormat(locale.startsWith('vi') ? 'vi-VN' : locale, {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                    }).format(parsed);
                },
            },
        ],
        [locale, t],
    );

    const kpiCards = useMemo(() => {
        if (!stats) {
            return [];
        }

        return [
            <AnalyticsCard
                key="total-revenue"
                title={t('Total Revenue')}
                value={money(stats.totalRevenue)}
                tooltip={t('Total revenue generated in the selected period')}
            />,
            <AnalyticsCard
                key="pending-orders"
                title={t('Pending Orders')}
                value={formatNumber(stats.pendingOrders)}
                tooltip={t('Orders awaiting confirmation or processing')}
            />,
            <AnalyticsCard
                key="user-growth"
                title={t('User Growth')}
                value={formatNumber(stats.userGrowth.current)}
                change={stats.userGrowth.change}
                changeLabel={t('vs previous period')}
                tooltip={t('New users acquired compared to the previous period')}
            />,
            <AnalyticsCard
                key="system-health"
                title={t('System Health')}
                value={`${formatDecimal(stats.systemHealth)}%`}
                tooltip={t('Completion rate of successful orders in the period')}
            />,
        ];
    }, [money, stats, t]);

    const quickActions = [
        { href: '/admin/analytics/revenue', icon: DollarSign, label: t('View Revenue Analytics') },
        { href: '/admin/analytics/users', icon: Users, label: t('View User Analytics') },
        { href: '/admin/analytics/products', icon: Package, label: t('View Product Analytics') },
        { href: '/admin/analytics/orders', icon: ShoppingBag, label: t('View Order Analytics') },
        { href: '/admin/analytics/reports', icon: FileText, label: t('Generate Custom Reports') },
    ];

    return (
        <WorkspaceLayout>
            <Head title={t('Analytics Overview')} />
            <Header
                title={t('Analytics Overview')}
                breadcrumbs={[
                    { label: t('Dashboard'), href: '/admin/dashboard' },
                    { label: t('Analytics'), href: '/admin/analytics' },
                ]}
            />

            <div className={styles.stack}>
                <section className={styles.section}>
                    <div className={styles.sectionHead}>
                        <h2 className={styles.sectionTitle}>
                            <BarChart3 aria-hidden="true" className={styles.sectionIcon} />
                            {t('Overview')}
                        </h2>
                        {lastGeneratedAt ? (
                            <span className={styles.sectionMeta}>
                                {t('Last updated at')} {lastGeneratedAt}
                            </span>
                        ) : null}
                    </div>
                    <p className={styles.muted}>{t('Monitor platform performance, track key business metrics, and explore trends at a glance.')}</p>
                </section>

                <section className={styles.section}>
                    <div className={styles.sectionHead}>
                        <h2 className={styles.sectionTitle}>{t('Quick Actions')}</h2>
                    </div>
                    <div className={styles.quickActions}>
                        {quickActions.map((action) => {
                            const Icon = action.icon;

                            return (
                                <Link key={action.href} href={action.href} className={styles.quickAction}>
                                    <Icon aria-hidden="true" />
                                    <span>{action.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </section>

                <ul className={styles.kpiList}>{kpiCards}</ul>

                <section className={styles.chartGrid}>
                    <AnalyticsChart
                        type="line"
                        data={revenueChart}
                        title={t('Revenue Trend')}
                        description={t('Daily revenue within the selected range')}
                        valueFormatter={money}
                        valueLabel={t('Revenue')}
                    />
                    <AnalyticsChart
                        type="bar"
                        data={userGrowthChart}
                        title={t('User Growth Trend')}
                        description={t('New users acquired over time')}
                        valueLabel={t('New Users')}
                    />
                </section>

                <AnalyticsTable
                    data={normalizedActivities}
                    columns={activityColumns}
                    headerTitle={t('Recent Platform Activity')}
                    headerIcon={<BarChart3 aria-hidden="true" />}
                    emptyMessage={t('No recent activity recorded')}
                    rowKey={(row) => row.id}
                />
            </div>
        </WorkspaceLayout>
    );
};

export default Index;

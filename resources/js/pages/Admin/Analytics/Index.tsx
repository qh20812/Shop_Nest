import React, { useMemo, useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app/AppLayout';
import { useTranslation } from '@/lib/i18n';
import { resolveCurrencyCode } from '@/lib/utils';
import AnalyticsCard from '@/Components/Analytics/AnalyticsCard';
import AnalyticsChart from '@/Components/Analytics/AnalyticsChart';
import type { AnalyticsChartPoint as ChartDataPoint } from '@/Components/Analytics/AnalyticsChart';
import AnalyticsTable from '@/Components/Analytics/AnalyticsTable';
import type { AnalyticsTableColumn } from '@/Components/Analytics/AnalyticsTable';
import QuickFilter from '@/Components/Analytics/QuickFilter';
import type { QuickFilterOption } from '@/Components/Analytics/QuickFilter';
import '@/../css/Page.css';
import Header from '@/Components/ui/Header';

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

const percentFormatter = new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 1,
});

const Index: React.FC = () => {
    const { props } = usePage<AnalyticsPageProps>();
    const { stats, revenueChart, userGrowthChart, recentActivities = [], meta } = props;
    const locale = props.locale ?? 'en';
    const resolvedCurrency = resolveCurrencyCode(props.currency);

    const currencyFormatter = React.useMemo(() => new Intl.NumberFormat(
        locale.startsWith('vi') ? 'vi-VN' : 'en-US',
        {
            style: 'currency',
            currency: resolvedCurrency,
            maximumFractionDigits: 0,
        }
    ), [locale, resolvedCurrency]);
    const { t } = useTranslation();

    const [selectedRange, setSelectedRange] = useState<string>('7days');

    const quickFilterOptions: QuickFilterOption[] = useMemo(
        () => [
            { label: t('Last 7 days'), value: '7days' },
            { label: t('Last 30 days'), value: '30days' },
            { label: t('Last 12 months'), value: '12months' },
        ],
        []
    );

    const handleRangeChange = (value: string) => {
        setSelectedRange(value);
        // Future enhancement: trigger server-side refresh once backend supports custom ranges.
    };

    const lastGeneratedAt = useMemo(() => {
        if (!meta?.generatedAt) {
            return null;
        }

        try {
            const parsed = new Date(meta.generatedAt);
            if (Number.isNaN(parsed.getTime())) {
                return null;
            }

            return new Intl.DateTimeFormat(locale, {
                dateStyle: 'medium',
                timeStyle: 'short',
            }).format(parsed);
        } catch {
            return null;
        }
    }, [meta?.generatedAt, locale]);

    const userGrowthChange = stats?.userGrowth?.change ?? 0;
    const userGrowthLabel = useMemo(() => {
        if (!stats?.userGrowth) {
            return '';
        }

        return t('vs previous period');
    }, [stats?.userGrowth, t]);

    const normalizedActivities: NormalizedActivity[] = useMemo(() => {
        return recentActivities.map((activity, index) => {
            const reference =
                activity.reference ||
                activity.entity ||
                activity.message ||
                (activity.id ? `#${activity.id}` : `activity-${index + 1}`);

            const occurredAt = activity.occurred_at || activity.created_at || '';

            return {
                id: String(activity.id ?? `activity-${index + 1}`),
                reference: String(reference),
                type: activity.type ?? 'activity',
                description: activity.description || activity.message || t('No additional details'),
                status: activity.status ?? 'info',
                occurredAt,
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
                    <div className="analytics-activity__reference">
                        <strong>{value as string}</strong>
                        {row.actor ? <span className="analytics-activity__actor">{row.actor}</span> : null}
                    </div>
                ),
            },
            {
                key: 'type',
                label: t('Type'),
                sortable: false,
                render: (value) => <span className="analytics-activity__type">{t(String(value))}</span>,
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
                render: (value) => (
                    <span className={`status ${String(value)}`}>
                        {t(String(value))}
                    </span>
                ),
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

                    return new Intl.DateTimeFormat(locale, {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                    }).format(parsed);
                },
            },
        ],
        [locale, t]
    );

    const kpiCards = useMemo(() => {
        if (!stats) {
            return [];
        }

        return [
            (
                <AnalyticsCard
                    key="total-revenue"
                    title={t('Total Revenue')}
                    value={currencyFormatter.format(stats.totalRevenue)}
                    icon="bx bx-line-chart"
                    color="blue"
                    tooltip={t('Total revenue generated in the selected period')}
                />
            ),
            (
                <AnalyticsCard
                    key="pending-orders"
                    title={t('Pending Orders')}
                    value={stats.pendingOrders.toLocaleString(locale)}
                    icon="bx bx-receipt"
                    color="yellow"
                    tooltip={t('Orders awaiting confirmation or processing')}
                />
            ),
            (
                <AnalyticsCard
                    key="user-growth"
                    title={t('User Growth')}
                    value={stats.userGrowth.current.toLocaleString(locale)}
                    change={userGrowthChange}
                    changeLabel={userGrowthLabel}
                    icon="bx bx-user-plus"
                    color="green"
                    tooltip={t('New users acquired compared to the previous period')}
                />
            ),
            (
                <AnalyticsCard
                    key="system-health"
                    title={t('System Health')}
                    value={`${percentFormatter.format(stats.systemHealth)}%`}
                    icon="bx bx-shield-quarter"
                    color="neutral"
                    tooltip={t('Completion rate of successful orders in the period')}
                />
            ),
        ];
    }, [currencyFormatter, locale, stats, t, userGrowthChange, userGrowthLabel]);

    const quickActions = useMemo(
        () => [
            {
                href: '/admin/analytics/revenue',
                icon: 'bx bx-dollar',
                label: t('View Revenue Analytics'),
            },
            {
                href: '/admin/analytics/users',
                icon: 'bx bx-group',
                label: t('View User Analytics'),
            },
            {
                href: '/admin/analytics/products',
                icon: 'bx bx-package',
                label: t('View Product Analytics'),
            },
            {
                href: '/admin/analytics/orders',
                icon: 'bx bx-shopping-bag',
                label: t('View Order Analytics'),
            },
            {
                href: '/admin/analytics/reports',
                icon: 'bx bx-file',
                label: t('Generate Custom Reports'),
            },
        ],
        [t]
    );

    return (
        <AppLayout>
            <Head title={t('Analytics Overview')} />
            <Header title={t('Analytics Overview')} breadcrumbs={[
                { label: t('Dashboard'), href: '/admin/dashboard' },
                { label: t('Analytics'), href: '/admin/analytics' },
            ]}/>
            <div className="inventory-page analytics-page">
                <section className="inventory-section analytics-page__header">
                    <div className="analytics-page__heading">
                        {/* <h1>{t('Analytics Overview')}</h1> */}
                        <p className="analytics-page__subtitle">
                            {t('Monitor platform performance, track key business metrics, and explore trends at a glance.')}
                        </p>
                        {lastGeneratedAt ? (
                            <span className="analytics-page__meta">
                                {t('Last updated at')} {lastGeneratedAt}
                            </span>
                        ) : null}
                    </div>

                    <QuickFilter options={quickFilterOptions} activeValue={selectedRange} onChange={handleRangeChange} />
                </section>

                <section className="inventory-section analytics-page__actions">
                    <h2>{t('Quick Actions')}</h2>
                    <div className="analytics-page__actions-grid">
                        {quickActions.map((action) => (
                            <Link key={action.href} href={action.href} className="inventory-link-button analytics-page__action-link">
                                <i className={`bx ${action.icon}`}></i>
                                <span>{action.label}</span>
                            </Link>
                        ))}
                    </div>
                </section>

                <section className="inventory-section analytics-page__kpis">
                    <ul className="insights analytics-page__insights-grid">{kpiCards}</ul>
                </section>

                <section className="inventory-section analytics-page__charts">
                    <div className="analytics-page__charts-grid">
                        <AnalyticsChart
                            type="line"
                            data={revenueChart}
                            title={t('Revenue Trend')}
                            description={t('Daily revenue within the selected range')}
                        />
                        <AnalyticsChart
                            type="area"
                            data={userGrowthChart}
                            title={t('User Growth Trend')}
                            description={t('New users acquired over time')}
                        />
                    </div>
                </section>

                <section className="inventory-section analytics-page__table">
                    <AnalyticsTable
                        data={normalizedActivities}
                        columns={activityColumns}
                        headerTitle={t('Recent Platform Activity')}
                        headerIcon="bx bx-time"
                        emptyMessage={t('No recent activity recorded')}
                        rowKey={(row) => row.id}
                    />
                </section>

                
            </div>
        </AppLayout>
    );
};

export default Index;

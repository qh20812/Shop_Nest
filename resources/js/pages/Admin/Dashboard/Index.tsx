import { Head, usePage } from '@inertiajs/react';
import { Receipt, UserPlus } from 'lucide-react';
import { useMemo } from 'react';

import AnalyticsChart from '@/components/admin/analytics/AnalyticsChart';
import { PageHeader } from '@/components/layout/PageHeader';
import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import Avatar from '@/components/ui/avatar';
import DataTable from '@/components/ui/data-table';
import StatusBadge from '@/components/ui/status-badge';
import { formatDate, formatNumber, formatTime } from '@/lib/format';
import { useTranslation } from '@/lib/i18n';
import { formatCurrency, formatMoney, resolveCurrencyCode } from '@/lib/utils';

import adminStyles from '@/components/admin/admin.module.css';
import styles from './Dashboard.module.css';

interface Stats {
    total_revenue: number;
    pending_orders: number;
    user_growth_monthly: number;
    system_health: number;
}

interface Customer {
    id?: number;
    username: string;
    first_name?: string;
    last_name?: string;
    avatar?: string;
    avatar_url?: string;
}

interface Order {
    id?: number;
    order_id?: number;
    order_number?: string;
    created_at: string;
    status: string;
    total_amount?: number | string;
    total_amount_base?: number | string;
    total_amount_converted?: number;
    currency_code?: string;
    customer: Customer;
}

interface User {
    id: number;
    username: string;
    created_at: string;
}

interface RevenueChartPoint {
    date: string;
    label: string;
    revenue: number;
}

interface UserGrowthChartPoint {
    week: string;
    label: string;
    users: number;
}

interface DashboardProps extends Record<string, unknown> {
    stats?: Stats;
    recentOrders?: Order[];
    newUsers?: User[];
    revenueChart?: RevenueChartPoint[];
    userGrowthChart?: UserGrowthChartPoint[];
    currency?: { code?: string; rates?: Record<string, number> };
    currencyCode?: string;
    meta?: {
        currencyCode?: string;
        baseCurrency?: string;
        conversionRate?: number;
        locale?: string;
        generatedAt?: string;
    };
}

export default function Index() {
    const { t, locale } = useTranslation();
    const page = usePage<DashboardProps>();
    const props = page.props;

    const stats = props.stats ?? {
        total_revenue: 0,
        pending_orders: 0,
        user_growth_monthly: 0,
        system_health: 0,
    };

    const recentOrders = Array.isArray(props.recentOrders) ? props.recentOrders : [];
    const newUsers = Array.isArray(props.newUsers) ? props.newUsers : [];
    const revenueChart = Array.isArray(props.revenueChart) ? props.revenueChart : [];
    const userGrowthChart = Array.isArray(props.userGrowthChart) ? props.userGrowthChart : [];

    const currencyCode = props.currencyCode ?? props.meta?.currencyCode ?? resolveCurrencyCode(props.currency);

    const money = useMemo(() => (value: number) => formatMoney(value, currencyCode, locale), [currencyCode, locale]);

    const generatedAt = typeof props.meta?.generatedAt === 'string' ? props.meta.generatedAt : null;
    const updatedLabel =
        generatedAt && !Number.isNaN(new Date(generatedAt).getTime())
            ? `${t('Last updated at')} ${formatDate(generatedAt)} ${formatTime(generatedAt)}`
            : undefined;

    const breadcrumbs = [
        { label: t('Dashboard'), href: '/admin/dashboard' },
        { label: t('Overview'), current: true },
    ];

    const growth = Number.isFinite(stats.user_growth_monthly) ? stats.user_growth_monthly.toFixed(2) : '0.00';
    const health = Number.isFinite(stats.system_health) ? stats.system_health.toFixed(2) : '0.00';

    const kpis = [
        {
            key: 'revenue',
            label: t('Total Revenue'),
            value: formatCurrency(stats.total_revenue, {
                from: currencyCode,
                to: currencyCode,
                rates: {},
                locale,
                abbreviate: true,
            }),
            tooltip: money(stats.total_revenue),
        },
        {
            key: 'pending',
            label: t('Pending Orders'),
            value: formatNumber(stats.pending_orders),
            tooltip: t('Pending orders awaiting action'),
        },
        {
            key: 'growth',
            label: t('User Growth (Monthly)'),
            value: `${growth}%`,
            tooltip: t('User growth compared to last month'),
        },
        {
            key: 'health',
            label: t('System Health'),
            value: `${health}%`,
            tooltip: t('Percentage of orders completed successfully'),
        },
    ];

    const revenueChartData = revenueChart.map((point) => ({ label: point.label, value: point.revenue }));

    const userGrowthChartData = userGrowthChart.map((point) => ({ label: point.label, value: point.users }));

    const orderColumns = useMemo(
        () => [
            {
                key: 'customer',
                header: t('User'),
                cell: (order: Order) => {
                    const customer = order.customer;
                    const userForAvatar = {
                        id: customer?.id || 0,
                        username: customer?.username || 'N/A',
                        first_name: customer?.first_name || '',
                        last_name: customer?.last_name || '',
                        avatar: customer?.avatar,
                        avatar_url: customer?.avatar_url,
                    };

                    if (userForAvatar.avatar && !userForAvatar.avatar.startsWith('http')) {
                        userForAvatar.avatar = `/storage/${userForAvatar.avatar}`;
                    }

                    return (
                        <div className={adminStyles.avatarCell}>
                            <Avatar user={userForAvatar} size={36} />
                            <span className={adminStyles.avatarName}>{userForAvatar.username}</span>
                        </div>
                    );
                },
            },
            {
                key: 'created_at',
                header: t('Order Date'),
                cell: (order: Order) => <span className={adminStyles.numeric}>{formatDate(order.created_at)}</span>,
            },
            {
                key: 'status',
                header: t('Status'),
                cell: (order: Order) => <StatusBadge status={order.status} type="order" />,
            },
            {
                key: 'total',
                header: t('Total Amount'),
                align: 'right' as const,
                cell: (order: Order) => {
                    const orderCurrency = order.currency_code ?? currencyCode;
                    const totalForDisplay =
                        typeof order.total_amount_converted === 'number'
                            ? order.total_amount_converted
                            : Number(order.total_amount ?? order.total_amount_base ?? 0);

                    return (
                        <span className={adminStyles.price}>
                            {formatCurrency(totalForDisplay, {
                                from: orderCurrency,
                                to: orderCurrency,
                                rates: {},
                                locale,
                            })}
                        </span>
                    );
                },
            },
        ],
        [currencyCode, locale, t],
    );

    return (
        <WorkspaceLayout>
            <Head title={t('Dashboard')} />

            <div className={styles.page}>
                <PageHeader breadcrumbs={breadcrumbs} title={t('Dashboard')} description={updatedLabel} />

                <h2 className="sn-visually-hidden">{t('Overview')}</h2>

                <dl className={styles.kpiRail}>
                    {kpis.map((kpi) => (
                        <div key={kpi.key} className={styles.kpi} title={kpi.tooltip}>
                            <dt className={styles.kpiLabel}>{kpi.label}</dt>
                            <dd className={styles.kpiValue}>{kpi.value}</dd>
                        </div>
                    ))}
                </dl>

                <section className={styles.signalGrid} aria-label={t('Overview charts')}>
                    <AnalyticsChart
                        type="area"
                        data={revenueChartData}
                        title={t('Revenue Trend')}
                        description={t('Last 7 days')}
                        height={300}
                        valueFormatter={money}
                        valueLabel={t('Revenue')}
                    />
                    <AnalyticsChart
                        type="bar"
                        data={userGrowthChartData}
                        title={t('User Growth')}
                        description={t('Last 4 weeks')}
                        height={300}
                        colors={['var(--sn-color-accent)']}
                        valueLabel={t('Users')}
                    />
                </section>

                <div className={styles.ledgerGrid}>
                    <div className={styles.orders}>
                        <DataTable
                            columns={orderColumns}
                            data={recentOrders}
                            headerTitle={t('Recent Orders')}
                            headerIcon={Receipt}
                            headerMeta={recentOrders.length}
                            emptyMessage={t('No recent orders')}
                        />
                    </div>

                    <section className={styles.arrivals} aria-labelledby="dashboard-new-users">
                        <div className={styles.ledgerHead}>
                            <h2 id="dashboard-new-users" className={styles.ledgerTitle}>
                                <UserPlus aria-hidden="true" className={styles.ledgerIcon} />
                                {t('New Users')}
                            </h2>
                            <span className={styles.ledgerMeta}>{newUsers.length}</span>
                        </div>

                        {newUsers.length > 0 ? (
                            <ul className={styles.ledgerList}>
                                {newUsers.map((user) => (
                                    <li key={user.id} className={styles.ledgerRow}>
                                        <span className={styles.ledgerName}>{user.username}</span>
                                        <span className={styles.ledgerDate}>{formatDate(user.created_at)}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className={styles.ledgerEmpty}>{t('No new users')}</p>
                        )}
                    </section>
                </div>
            </div>
        </WorkspaceLayout>
    );
}

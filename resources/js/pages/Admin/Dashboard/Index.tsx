import { Head, usePage } from '@inertiajs/react';
import { Clock, HeartPulse, Receipt, TrendingUp, UserPlus, Wallet } from 'lucide-react';
import { useMemo } from 'react';

import AnalyticsChart from '@/components/admin/analytics/AnalyticsChart';
import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import Avatar from '@/components/ui/avatar';
import DataTable from '@/components/ui/data-table';
import Header from '@/components/ui/header';
import Insights from '@/components/ui/insights';
import StatusBadge from '@/components/ui/status-badge';
import { formatDate } from '@/lib/format';
import { useTranslation } from '@/lib/i18n';
import { formatCurrency, resolveCurrencyCode } from '@/lib/utils';

import styles from '@/components/admin/admin.module.css';

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

    const breadcrumbs = [
        { label: t('Dashboard'), href: '/admin/dashboard' },
        { label: t('Overview'), href: '#', active: true },
    ];

    const insightsData = [
        {
            icon: Clock,
            value: stats.pending_orders.toLocaleString('vi-VN'),
            label: t('Pending Orders'),
            tooltip: t('Pending orders awaiting action'),
        },
        {
            icon: TrendingUp,
            value: `${Number.isFinite(stats.user_growth_monthly) ? stats.user_growth_monthly.toFixed(2) : '0.00'}%`,
            label: t('User Growth (Monthly)'),
            tooltip: t('User growth compared to last month'),
        },
        {
            icon: HeartPulse,
            value: `${Number.isFinite(stats.system_health) ? stats.system_health.toFixed(2) : '0.00'}%`,
            label: t('System Health'),
            tooltip: t('Percentage of orders completed successfully'),
        },
        {
            icon: Wallet,
            value: formatCurrency(stats.total_revenue, {
                from: currencyCode,
                to: currencyCode,
                rates: {},
                locale,
                abbreviate: true,
            }),
            label: t('Total Revenue'),
            tooltip: formatCurrency(stats.total_revenue, {
                from: currencyCode,
                to: currencyCode,
                rates: {},
                locale,
            }),
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
                        <div className={styles.avatarCell}>
                            <Avatar user={userForAvatar} size={36} />
                            <span className={styles.avatarName}>{userForAvatar.username}</span>
                        </div>
                    );
                },
            },
            {
                key: 'created_at',
                header: t('Order Date'),
                cell: (order: Order) => <span className={styles.numeric}>{formatDate(order.created_at)}</span>,
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
                        <span className={styles.price}>
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
            <Header title={t('Dashboard')} breadcrumbs={breadcrumbs} />

            <Insights items={insightsData} />

            <section className={styles.chartGrid} aria-label={t('Overview charts')}>
                <AnalyticsChart type="line" data={revenueChartData} title={t('Revenue Trend')} description={t('Last 7 days')} />
                <AnalyticsChart type="bar" data={userGrowthChartData} title={t('User Growth')} description={t('Last 4 weeks')} />
            </section>

            <DataTable
                columns={orderColumns}
                data={recentOrders}
                headerTitle={t('Recent Orders')}
                headerIcon={Receipt}
                emptyMessage={t('No recent orders')}
            />

            <section className={styles.section}>
                <div className={styles.sectionHead}>
                    <h2 className={styles.sectionTitle}>
                        <UserPlus aria-hidden="true" className={styles.sectionIcon} />
                        {t('New Users')}
                    </h2>
                    <span className={styles.sectionMeta}>{newUsers.length}</span>
                </div>

                {newUsers.length > 0 ? (
                    <div className={styles.stackTight}>
                        {newUsers.map((user) => (
                            <div key={user.id} className={styles.avatarCell}>
                                <span className={styles.avatarName}>{user.username}</span>
                                <span className={styles.avatarMeta}>{formatDate(user.created_at)}</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className={styles.muted}>{t('No new users')}</p>
                )}
            </section>
        </WorkspaceLayout>
    );
}

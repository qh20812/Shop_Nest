import { Head, router, usePage } from '@inertiajs/react';
import { CheckCircle2, Clock, PauseCircle, Store, Wallet, XCircle } from 'lucide-react';
import { useMemo } from 'react';

import AnalyticsChart from '@/components/admin/analytics/AnalyticsChart';
import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import { Badge } from '@/components/ui/badge';
import DataTable from '@/components/ui/data-table';
import Header from '@/components/ui/header';
import Insights from '@/components/ui/insights';
import { Select } from '@/components/ui/select';
import { formatNumber, formatVnd } from '@/lib/format';
import { useTranslation } from '@/lib/i18n';

import styles from '@/components/admin/admin.module.css';

interface TopShop {
    id: number;
    username: string;
    shop_status: string;
    total_revenue: number;
}

interface ShopMetrics {
    totalShops: number;
    activeShops: number;
    pendingShops: number;
    suspendedShops: number;
    rejectedShops: number;
    totalRevenue: number;
    topShops: TopShop[];
}

interface TrendPoint {
    month: string;
    revenue: number;
}

interface PageProps extends Record<string, unknown> {
    metrics: ShopMetrics;
    trend: TrendPoint[];
    filters: { months: number };
}

export default function Dashboard() {
    const { t } = useTranslation();
    const { metrics, trend = [], filters } = usePage<PageProps>().props;
    const months = filters?.months ?? 6;

    const chartData = useMemo(() => trend.map((point) => ({ label: point.month, value: point.revenue })), [trend]);

    const summaryItems = [
        { icon: Store, value: formatNumber(metrics.totalShops), label: t('Total Shops') },
        { icon: CheckCircle2, value: formatNumber(metrics.activeShops), label: t('Active') },
        { icon: Clock, value: formatNumber(metrics.pendingShops), label: t('Pending') },
        { icon: PauseCircle, value: formatNumber(metrics.suspendedShops), label: t('Suspended') },
        { icon: XCircle, value: formatNumber(metrics.rejectedShops), label: t('Rejected') },
        { icon: Wallet, value: formatVnd(metrics.totalRevenue), label: t('Total Revenue') },
    ];

    const columns = [
        {
            key: 'username',
            header: t('Shop'),
            cell: (shop: TopShop) => <span className={styles.cellTitle}>{shop.username}</span>,
        },
        {
            key: 'shop_status',
            header: t('Status'),
            cell: (shop: TopShop) => <Badge tone={shop.shop_status === 'active' ? 'success' : 'neutral'}>{t(ucfirst(shop.shop_status))}</Badge>,
        },
        {
            key: 'total_revenue',
            header: t('Revenue'),
            align: 'right' as const,
            cell: (shop: TopShop) => <span className={styles.price}>{formatVnd(Number(shop.total_revenue ?? 0))}</span>,
        },
    ];

    return (
        <WorkspaceLayout>
            <Head title={t('Shop Dashboard')} />

            <Header
                title={t('Shop Dashboard')}
                breadcrumbs={[
                    { label: t('Dashboard'), href: '/admin/dashboard' },
                    { label: t('Shops'), href: '/admin/shops' },
                    { label: t('Shop Dashboard'), href: '/admin/shops/dashboard', active: true },
                ]}
            />

            <Insights items={summaryItems} columns={3} />

            <div className={`${styles.filterBar} sn-glass-surface`}>
                <div className={styles.filterField}>
                    <span className={styles.filterLabel}>{t('Trend range')}</span>
                    <Select
                        value={String(months)}
                        aria-label={t('Trend range')}
                        surface="glass"
                        onChange={(event) => router.get('/admin/shops/dashboard', { months: event.target.value }, { preserveState: true })}
                    >
                        <option value="3">{t('Last 3 months')}</option>
                        <option value="6">{t('Last 6 months')}</option>
                        <option value="12">{t('Last 12 months')}</option>
                    </Select>
                </div>
            </div>

            <AnalyticsChart
                type="line"
                data={chartData}
                title={t('Revenue Trend')}
                description={t('Global shop revenue by month')}
                valueFormatter={formatVnd}
                valueLabel={t('Revenue')}
            />

            <DataTable
                columns={columns}
                data={metrics.topShops ?? []}
                headerTitle={t('Top Shops')}
                headerIcon={Store}
                emptyMessage={t('No shop revenue recorded')}
            />
        </WorkspaceLayout>
    );
}

const ucfirst = (value: string) => (value ? value.charAt(0).toUpperCase() + value.slice(1) : value);

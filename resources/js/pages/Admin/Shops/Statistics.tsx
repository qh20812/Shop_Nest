import { Head, router, usePage } from '@inertiajs/react';
import { BarChart3, Filter, Package, ShoppingBag, Store, Users } from 'lucide-react';
import { useMemo, useState } from 'react';

import AnalyticsChart from '@/components/admin/analytics/AnalyticsChart';
import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import { Button } from '@/components/ui/button';
import Header from '@/components/ui/header';
import { Input } from '@/components/ui/input';
import Insights from '@/components/ui/insights';
import { formatNumber, formatVnd } from '@/lib/format';
import { useTranslation } from '@/lib/i18n';

import styles from '@/components/admin/admin.module.css';

interface ShopSummary {
    id: number;
    username?: string;
    first_name?: string;
    last_name?: string;
    shop_status?: string;
}

interface Statistics {
    products?: {
        total?: number;
        active?: number;
        inactive?: number;
        lowStockVariants?: number;
        outOfStockVariants?: number;
    };
    orders?: {
        orders?: number;
        itemsSold?: number;
        revenue?: number;
    };
    trend?: Array<{ month: string; orders: number; revenue: number }>;
    recentCustomers?: Array<{ id?: number; username?: string; first_name?: string; last_name?: string } | null>;
}

interface PageProps extends Record<string, unknown> {
    shop: ShopSummary;
    filters: { from?: string | null; to?: string | null };
    statistics: Statistics;
}

export default function Statistics() {
    const { t } = useTranslation();
    const { shop, filters = {}, statistics = {} } = usePage<PageProps>().props;

    const [from, setFrom] = useState(filters.from ?? '');
    const [to, setTo] = useState(filters.to ?? '');

    const shopName = shop.username || `${shop.first_name ?? ''} ${shop.last_name ?? ''}`.trim() || `#${shop.id}`;

    const chartData = useMemo(() => (statistics.trend ?? []).map((point) => ({ label: point.month, value: point.revenue })), [statistics.trend]);

    const summaryItems = [
        { icon: Package, value: formatNumber(statistics.products?.total ?? 0), label: t('Total Products') },
        { icon: ShoppingBag, value: formatNumber(statistics.orders?.orders ?? 0), label: t('Orders') },
        { icon: Store, value: formatNumber(statistics.orders?.itemsSold ?? 0), label: t('Items Sold') },
        { icon: BarChart3, value: formatVnd(statistics.orders?.revenue ?? 0), label: t('Revenue') },
    ];

    const applyFilters = () => {
        router.get(`/admin/shops/${shop.id}/statistics`, { from: from || undefined, to: to || undefined }, { preserveState: true });
    };

    return (
        <WorkspaceLayout>
            <Head title={`${shopName} - ${t('Shop Statistics')}`} />

            <Header
                title={t('Shop Statistics')}
                breadcrumbs={[
                    { label: t('Dashboard'), href: '/admin/dashboard' },
                    { label: t('Shops'), href: '/admin/shops' },
                    { label: shopName, href: `/admin/shops/${shop.id}` },
                    { label: t('Statistics'), href: `/admin/shops/${shop.id}/statistics`, active: true },
                ]}
            />

            <section className={`${styles.filterSection} sn-glass-surface`}>
                <div className={styles.sectionHead}>
                    <h2 className={styles.sectionTitle}>
                        <Filter aria-hidden="true" className={styles.sectionIcon} />
                        {t('Date Range')}
                    </h2>
                </div>
                <div className={styles.filterRow}>
                    <div className={styles.filterField}>
                        <span className={styles.filterLabel}>{t('From')}</span>
                        <Input
                            type="date"
                            value={from}
                            onChange={(event) => setFrom(event.target.value)}
                            aria-label={t('From date')}
                            surface="glass"
                        />
                    </div>
                    <div className={styles.filterField}>
                        <span className={styles.filterLabel}>{t('To')}</span>
                        <Input type="date" value={to} onChange={(event) => setTo(event.target.value)} aria-label={t('To date')} surface="glass" />
                    </div>
                    <div className={styles.filterActions}>
                        <Button type="button" variant="primary" onClick={applyFilters}>
                            {t('Apply')}
                        </Button>
                    </div>
                </div>
            </section>

            <Insights items={summaryItems} />

            <AnalyticsChart
                type="line"
                data={chartData}
                title={t('Revenue Trend')}
                description={t('Monthly revenue for this shop')}
                valueFormatter={formatVnd}
                valueLabel={t('Revenue')}
            />

            <section className={styles.section}>
                <div className={styles.sectionHead}>
                    <h2 className={styles.sectionTitle}>
                        <Package aria-hidden="true" className={styles.sectionIcon} />
                        {t('Product Statistics')}
                    </h2>
                </div>
                <div className={styles.detailGrid}>
                    <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>{t('Total Products')}</span>
                        <span className={styles.detailValue}>{formatNumber(statistics.products?.total ?? 0)}</span>
                    </div>
                    <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>{t('Active')}</span>
                        <span className={styles.detailValue}>{formatNumber(statistics.products?.active ?? 0)}</span>
                    </div>
                    <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>{t('Inactive')}</span>
                        <span className={styles.detailValue}>{formatNumber(statistics.products?.inactive ?? 0)}</span>
                    </div>
                    <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>{t('Low Stock Variants')}</span>
                        <span className={styles.detailValue}>{formatNumber(statistics.products?.lowStockVariants ?? 0)}</span>
                    </div>
                    <div className={styles.detailItem}>
                        <span className={styles.detailLabel}>{t('Out of Stock Variants')}</span>
                        <span className={styles.detailValue}>{formatNumber(statistics.products?.outOfStockVariants ?? 0)}</span>
                    </div>
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.sectionHead}>
                    <h2 className={styles.sectionTitle}>
                        <Users aria-hidden="true" className={styles.sectionIcon} />
                        {t('Recent Customers')}
                    </h2>
                </div>
                {statistics.recentCustomers && statistics.recentCustomers.length > 0 ? (
                    <ul className={styles.logList}>
                        {statistics.recentCustomers.map((customer, index) => {
                            const name = customer
                                ? `${customer.first_name ?? ''} ${customer.last_name ?? ''}`.trim() || customer.username || '-'
                                : '-';

                            return (
                                <li key={customer?.id ?? index} className={styles.logItem}>
                                    <span className={styles.logReason}>{name}</span>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <p className={styles.muted}>{t('No customer activity recorded')}</p>
                )}
            </section>
        </WorkspaceLayout>
    );
}

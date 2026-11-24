import { Head, router, usePage } from '@inertiajs/react';
import { BarChart3, DollarSign, Filter } from 'lucide-react';
import React, { useMemo, useState } from 'react';

import AnalyticsCard from '@/components/admin/analytics/AnalyticsCard';
import type { AnalyticsChartPoint as ChartDataPoint } from '@/components/admin/analytics/AnalyticsChart';
import AnalyticsChart from '@/components/admin/analytics/AnalyticsChart';
import AnalyticsFilters, { type AnalyticsFilterState, type AnalyticsFilterValue } from '@/components/admin/analytics/AnalyticsFilters';
import type { AnalyticsTableColumn } from '@/components/admin/analytics/AnalyticsTable';
import AnalyticsTable from '@/components/admin/analytics/AnalyticsTable';
import ExportButton from '@/components/admin/analytics/ExportButton';
import { Button } from '@/components/ui/button';
import Header from '@/components/ui/header';
import AppLayout from '@/layouts/app/AppLayout';
import { formatNumber, formatVnd } from '@/lib/format';
import { useTranslation } from '@/lib/i18n';

import styles from '@/components/admin/admin.module.css';

type RevenueBreakdownPoint = {
    label: string;
    value: number;
    [key: string]: string | number | null | undefined;
};

interface RevenueTopProduct extends Record<string, string | number | null | undefined> {
    productId: number;
    variantId: number;
    label: string;
    sku?: string | null;
    revenue: number;
    quantity: number;
}

interface RevenueAnalyticsData {
    timeSeries: ChartDataPoint[];
    byCategory: RevenueBreakdownPoint[];
    bySeller: RevenueBreakdownPoint[];
    topProducts: RevenueTopProduct[];
    filters?: Record<string, unknown>;
}

interface RevenuePageProps extends Record<string, unknown> {
    revenue: RevenueAnalyticsData;
    filters: Record<string, unknown>;
    availablePeriods: string[];
    locale?: string;
}

type TopProductRow = RevenueTopProduct & {
    share: number;
    [key: string]: string | number | null | undefined;
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

const Revenue: React.FC = () => {
    const { props } = usePage<RevenuePageProps>();
    const { t } = useTranslation();
    const revenue = props.revenue ?? { timeSeries: [], byCategory: [], bySeller: [], topProducts: [] };
    const initialFilters = props.filters ?? {};
    const pageDescription = t('Analyze revenue trends, track top-performing segments, and export financial insights.');

    const [filters, setFilters] = useState<AnalyticsFilterState>(() => ({
        period: normalizeFilterValue(initialFilters.period, '30days'),
        date_from: normalizeFilterValue(initialFilters.date_from, ''),
        date_to: normalizeFilterValue(initialFilters.date_to, ''),
        category_id: normalizeFilterValue(initialFilters.category_id, ''),
        seller_id: normalizeFilterValue(initialFilters.seller_id, ''),
        brand_id: normalizeFilterValue(initialFilters.brand_id, ''),
    }));

    const totalRevenue = useMemo(() => (revenue.timeSeries ?? []).reduce((sum, point) => sum + (point.value ?? 0), 0), [revenue.timeSeries]);

    const topProducts: TopProductRow[] = useMemo(() => {
        const total = totalRevenue > 0 ? totalRevenue : revenue.topProducts.reduce((sum, product) => sum + product.revenue, 0);
        if (total === 0) {
            return revenue.topProducts.map((product) => ({ ...product, share: 0 }));
        }

        return revenue.topProducts.map((product) => ({ ...product, share: product.revenue / total }));
    }, [revenue.topProducts, totalRevenue]);

    const averageOrderValue = useMemo(() => {
        const totalQuantity = revenue.topProducts.reduce((sum, product) => sum + product.quantity, 0);
        if (totalQuantity === 0) {
            return 0;
        }
        return totalRevenue / totalQuantity;
    }, [revenue.topProducts, totalRevenue]);

    const growthRate = useMemo(() => {
        const points = revenue.timeSeries ?? [];
        if (points.length < 2) {
            return 0;
        }
        const lastValue = points[points.length - 1].value ?? 0;
        const previousValue = points[points.length - 2].value ?? 1;
        if (previousValue === 0) {
            return lastValue > 0 ? 100 : 0;
        }
        return ((lastValue - previousValue) / previousValue) * 100;
    }, [revenue.timeSeries]);

    const tableColumns: AnalyticsTableColumn<TopProductRow>[] = useMemo(
        () => [
            { key: 'label', label: t('Product'), sortable: false },
            {
                key: 'sku',
                label: t('SKU'),
                sortable: false,
                render: (value) => (value ? String(value) : t('N/A')),
            },
            {
                key: 'quantity',
                label: t('Quantity Sold'),
                sortable: false,
                align: 'right',
                render: (value) => formatNumber(Number(value ?? 0)),
            },
            {
                key: 'revenue',
                label: t('Revenue'),
                sortable: false,
                align: 'right',
                render: (_, row) => formatVnd(Number(row.revenue ?? 0)),
            },
            {
                key: 'share',
                label: t('% of Total'),
                sortable: false,
                align: 'right',
                render: (value) => `${(Number(value ?? 0) * 100).toFixed(1)}%`,
            },
        ],
        [t],
    );

    const handleFilterChange = (updated: AnalyticsFilterState) => {
        setFilters(updated);
    };

    const handleApplyFilters = () => {
        router.get('/admin/analytics/revenue', cleanupFilters(filters), { preserveState: true, preserveScroll: true });
    };

    const handleResetFilters = () => {
        const resetState: AnalyticsFilterState = {
            period: '30days',
            date_from: '',
            date_to: '',
            category_id: '',
            seller_id: '',
            brand_id: '',
        };
        setFilters(resetState);
        router.get('/admin/analytics/revenue', cleanupFilters(resetState), { preserveState: true, preserveScroll: true });
    };

    const handleExport = (format: 'csv' | 'json') => {
        router.get(
            '/admin/analytics/reports',
            {
                type: 'revenue',
                export_format: format,
                download: true,
                ...cleanupFilters(filters),
            },
            { preserveScroll: true },
        );
    };

    const quickRanges = useMemo(() => {
        const ranges = props.availablePeriods ?? [];
        const labels: Record<string, string> = {
            '7days': t('Last 7 Days'),
            '14days': t('Last 14 Days'),
            '30days': t('Last 30 Days'),
            '90days': t('Last 90 Days'),
            '12months': t('Last 12 Months'),
        };
        return ranges.map((value) => ({ label: labels[value] ?? value, value }));
    }, [props.availablePeriods, t]);

    return (
        <AppLayout>
            <Head title={t('Revenue Analytics')} />
            <Header
                title={t('Revenue Analytics')}
                breadcrumbs={[
                    { label: t('Dashboard'), href: '/admin/dashboard' },
                    { label: t('Analytics'), href: '/admin/analytics' },
                    { label: t('Revenue Analytics'), href: '/admin/analytics/revenue', active: true },
                ]}
            />

            <div className={styles.stack}>
                <section className={styles.section}>
                    <div className={styles.sectionHead}>
                        <h2 className={styles.sectionTitle}>
                            <DollarSign aria-hidden="true" className={styles.sectionIcon} />
                            {t('Revenue Analytics')}
                        </h2>
                        <div className={styles.actions}>
                            <ExportButton label={t('Export CSV')} onClick={() => handleExport('csv')} />
                            <ExportButton label={t('Export JSON')} variant="secondary" onClick={() => handleExport('json')} />
                        </div>
                    </div>
                    <p className={styles.muted}>{pageDescription}</p>
                </section>

                <section className={styles.section}>
                    <AnalyticsFilters
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        availableOptions={{}}
                        title={t('Filter Revenue Data')}
                        description={t('Adjust the period or apply advanced filters to refine the revenue analytics view.')}
                        quickRanges={quickRanges}
                        onReset={handleResetFilters}
                    >
                        <div className={styles.filterActions}>
                            <Button type="button" variant="primary" onClick={handleApplyFilters}>
                                <Filter aria-hidden="true" />
                                {t('Apply Filters')}
                            </Button>
                        </div>
                    </AnalyticsFilters>
                </section>

                <section className={styles.section}>
                    <ul className={styles.kpiList}>
                        <AnalyticsCard
                            title={t('Total Revenue')}
                            value={formatVnd(totalRevenue)}
                            tooltip={t('Aggregate revenue within the selected filter range.')}
                        />
                        <AnalyticsCard
                            title={t('Revenue Growth')}
                            value={`${growthRate >= 0 ? '+' : ''}${growthRate.toFixed(1)}%`}
                            change={growthRate}
                            changeLabel={t('vs previous data point')}
                            tooltip={t('Change compared to the previous data point in the series.')}
                        />
                        <AnalyticsCard
                            title={t('Average Order Value')}
                            value={formatVnd(averageOrderValue)}
                            tooltip={t('Approximate average revenue per order based on available data.')}
                        />
                    </ul>
                </section>

                <section className={styles.chartGrid}>
                    <AnalyticsChart
                        type="line"
                        data={revenue.timeSeries ?? []}
                        title={t('Revenue Over Time')}
                        description={t('Track revenue fluctuations throughout the selected period.')}
                    />
                    <AnalyticsChart
                        type="pie"
                        data={revenue.byCategory ?? []}
                        title={t('Revenue by Category')}
                        description={t('Compare revenue contribution across product categories.')}
                        legend
                    />
                </section>

                <section className={styles.chartGrid}>
                    <AnalyticsChart
                        type="bar"
                        data={revenue.bySeller ?? []}
                        title={t('Top Sellers by Revenue')}
                        description={t('Identify sellers driving the highest revenue.')}
                    />
                    <AnalyticsChart
                        type="bar"
                        data={revenue.topProducts.slice(0, 10).map((product) => ({ label: product.label, value: product.revenue }))}
                        title={t('Top Products Revenue')}
                        description={t('Revenue distribution of leading products.')}
                    />
                </section>

                <AnalyticsTable
                    data={topProducts}
                    columns={tableColumns}
                    headerTitle={t('Top Products Breakdown')}
                    headerIcon={<BarChart3 aria-hidden="true" />}
                    emptyMessage={t('No product revenue data available for the selected filters.')}
                    rowKey={(row) => `${row.productId}-${row.variantId}`}
                />
            </div>
        </AppLayout>
    );
};

function cleanupFilters(filters: AnalyticsFilterState): FilterPayload {
    const payload: FilterPayload = {};

    Object.entries(filters).forEach(([key, value]) => {
        if (typeof value === 'number') {
            payload[key] = value;
            return;
        }

        if (typeof value === 'string' && value !== '') {
            payload[key] = value;
        }
    });

    return payload;
}

export default Revenue;

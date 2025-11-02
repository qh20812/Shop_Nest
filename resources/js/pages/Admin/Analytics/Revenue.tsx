import React, { useMemo, useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app/AppLayout';
import { useTranslation } from '@/lib/i18n';
import AnalyticsFilters, { AnalyticsFilterState, AnalyticsFilterValue } from '@/Components/Analytics/AnalyticsFilters';
import AnalyticsCard from '@/Components/Analytics/AnalyticsCard';
import AnalyticsChart from '@/Components/Analytics/AnalyticsChart';
import type { AnalyticsChartPoint as ChartDataPoint } from '@/Components/Analytics/AnalyticsChart';
import AnalyticsTable from '@/Components/Analytics/AnalyticsTable';
import type { AnalyticsTableColumn } from '@/Components/Analytics/AnalyticsTable';
import ExportButton from '@/Components/Analytics/ExportButton';
import '@/../css/Page.css';

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

const formatCurrency = (value: number, locale = 'vi-VN'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);
};

const Revenue: React.FC = () => {
  const { props } = usePage<RevenuePageProps>();
  const { t } = useTranslation();
  const revenue = props.revenue ?? { timeSeries: [], byCategory: [], bySeller: [], topProducts: [] };
  const initialFilters = props.filters ?? {};
  const locale = typeof props.locale === 'string' ? props.locale : 'en';

  const [filters, setFilters] = useState<AnalyticsFilterState>((): AnalyticsFilterState => ({
    period: normalizeFilterValue(initialFilters.period, '30days'),
    date_from: normalizeFilterValue(initialFilters.date_from, ''),
    date_to: normalizeFilterValue(initialFilters.date_to, ''),
    category_id: normalizeFilterValue(initialFilters.category_id, ''),
    seller_id: normalizeFilterValue(initialFilters.seller_id, ''),
    brand_id: normalizeFilterValue(initialFilters.brand_id, ''),
  }));

  const totalRevenue = useMemo(() => {
    return revenue.timeSeries?.reduce((sum, point) => sum + (point.value ?? 0), 0);
  }, [revenue.timeSeries]);

  const topProducts: TopProductRow[] = useMemo(() => {
    const total = totalRevenue > 0 ? totalRevenue : revenue.topProducts.reduce((sum, product) => sum + product.revenue, 0);
    if (total === 0) {
      return revenue.topProducts.map((product) => ({ ...product, share: 0 }));
    }

    return revenue.topProducts.map((product) => ({
      ...product,
      share: product.revenue / total,
    }));
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
      {
        key: 'label',
        label: t('Product'),
        sortable: false,
      },
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
        render: (value) => Number(value ?? 0).toLocaleString(locale),
        align: 'right',
      },
      {
        key: 'revenue',
        label: t('Revenue'),
        sortable: false,
        render: (_, row) => formatCurrency(row.revenue, locale),
        align: 'right',
      },
      {
        key: 'share',
        label: t('% of Total'),
        sortable: false,
        render: (value) => `${(Number(value ?? 0) * 100).toFixed(1)}%`,
        align: 'right',
      },
    ],
    [locale, t]
  );

  const handleFilterChange = (updated: AnalyticsFilterState) => {
    setFilters(updated);
  };

  const handleApplyFilters = () => {
  router.get('/admin/analytics/revenue', cleanupFilters(filters), {
      preserveState: true,
      preserveScroll: true,
    });
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
  router.get('/admin/analytics/revenue', cleanupFilters(resetState), {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleExport = (format: 'csv' | 'json' | 'pdf') => {
    router.get(
      '/admin/analytics/reports',
      {
        type: 'revenue',
        export_format: format,
        download: true,
        ...cleanupFilters(filters),
      },
      {
        preserveScroll: true,
      }
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
      <div className="inventory-page analytics-page analytics-page--revenue">
        <section className="inventory-section analytics-page__header">
          <div className="analytics-page__heading">
            <h1>{t('Revenue Analytics')}</h1>
            <p className="analytics-page__subtitle">
              {t('Analyze revenue trends, track top-performing segments, and export financial insights.')}
            </p>
          </div>

          <div className="analytics-page__header-actions">
            <ExportButton label={t('Export CSV')} onClick={() => handleExport('csv')} />
            <ExportButton label={t('Export JSON')} variant="secondary" onClick={() => handleExport('json')} />
          </div>
        </section>

        <section className="inventory-section analytics-page__filters">
          <AnalyticsFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            availableOptions={{}}
            title={t('Filter Revenue Data')}
            description={t('Adjust the period or apply advanced filters to refine the revenue analytics view.')}
            quickRanges={quickRanges}
            onReset={handleResetFilters}
          >
            <div className="analytics-filters__actions-row">
              <button type="button" className="inventory-link-button" onClick={handleApplyFilters}>
                <i className="bx bx-filter"></i>
                {t('Apply Filters')}
              </button>
            </div>
          </AnalyticsFilters>
        </section>

        <section className="inventory-section analytics-page__kpis">
          <ul className="insights analytics-page__insights-grid">
            <AnalyticsCard
              title={t('Total Revenue')}
              value={formatCurrency(totalRevenue, locale)}
              icon="bx bx-line-chart"
              color="blue"
              tooltip={t('Aggregate revenue within the selected filter range.')}
            />
            <AnalyticsCard
              title={t('Revenue Growth')}
              value={`${growthRate >= 0 ? '+' : ''}${growthRate.toFixed(1)}%`}
              change={growthRate}
              changeLabel={t('vs previous data point')}
              icon="bx bx-trending-up"
              color={growthRate >= 0 ? 'green' : 'red'}
              tooltip={t('Change compared to the previous data point in the series.')}
            />
            <AnalyticsCard
              title={t('Average Order Value')}
              value={formatCurrency(averageOrderValue, locale)}
              icon="bx bx-dollar"
              color="yellow"
              tooltip={t('Approximate average revenue per order based on available data.')}
            />
          </ul>
        </section>

        <section className="inventory-section analytics-page__charts">
          <div className="analytics-page__charts-grid analytics-page__charts-grid--two">
            <AnalyticsChart
              type="line"
              data={revenue.timeSeries ?? []}
              title={t('Revenue Over Time')}
              description={t('Track revenue fluctuations throughout the selected period.')}
              legend={false}
            />
            <AnalyticsChart
              type="pie"
              data={revenue.byCategory ?? []}
              title={t('Revenue by Category')}
              description={t('Compare revenue contribution across product categories.')}
              legend
            />
          </div>

          <div className="analytics-page__charts-grid analytics-page__charts-grid--two">
            <AnalyticsChart
              type="bar"
              data={revenue.bySeller ?? []}
              title={t('Top Sellers by Revenue')}
              description={t('Identify sellers driving the highest revenue.')}
              legend={false}
            />
            <AnalyticsChart
              type="bar"
              data={revenue.topProducts.slice(0, 10).map((product) => ({ label: product.label, value: product.revenue }))}
              title={t('Top Products Revenue')}
              description={t('Revenue distribution of leading products.')}
              legend={false}
            />
          </div>
        </section>

        <section className="inventory-section analytics-page__table">
          <AnalyticsTable
            data={topProducts}
            columns={tableColumns}
            headerTitle={t('Top Products Breakdown')}
            headerIcon="bx bx-star"
            emptyMessage={t('No product revenue data available for the selected filters.')}
            rowKey={(row) => `${row.productId}-${row.variantId}`}
          />
        </section>
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

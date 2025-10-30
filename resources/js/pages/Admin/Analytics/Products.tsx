import React, { useMemo, useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app/AppLayout';
import { useTranslation } from '@/lib/i18n';
import { resolveCurrencyCode } from '@/lib/utils';
import AnalyticsFilters, { AnalyticsFilterState, AnalyticsFilterValue } from '@/Components/Analytics/AnalyticsFilters';
import AnalyticsCard from '@/Components/Analytics/AnalyticsCard';
import AnalyticsChart from '@/Components/Analytics/AnalyticsChart';
import type { AnalyticsChartPoint as ChartDataPoint } from '@/Components/Analytics/AnalyticsChart';
import AnalyticsTable from '@/Components/Analytics/AnalyticsTable';
import type { AnalyticsTableColumn } from '@/Components/Analytics/AnalyticsTable';
import '@/../css/Page.css';

type ProductRevenuePoint = {
  productId: number;
  variantId: number;
  label: string;
  sku?: string | null;
  revenue: number;
  quantity: number;
  [key: string]: string | number | null | undefined;
};

type CategoryPerformancePoint = {
  categoryId?: number | null;
  label: string;
  value: number;
  [key: string]: string | number | null | undefined;
};

type InventoryTurnoverPoint = {
  variantId: number;
  productId: number;
  label: string;
  sku?: string | null;
  unitsSold: number;
  netChange: number;
  [key: string]: string | number | null | undefined;
};

type LowStockPoint = {
  variantId: number;
  productId: number;
  label: string;
  sku?: string | null;
  stock: number;
  [key: string]: string | number | null | undefined;
};

interface ProductAnalyticsPayload extends Record<string, unknown> {
  topProducts?: ProductRevenuePoint[];
  categoryPerformance?: CategoryPerformancePoint[];
  inventoryTurnover?: InventoryTurnoverPoint[];
  lowStock?: LowStockPoint[];
  filters?: Record<string, unknown>;
}

interface ProductsPageProps extends Record<string, unknown> {
  products?: ProductAnalyticsPayload;
  filters?: Record<string, unknown>;
  locale?: string;
  currency?: string;
}

type ProductFilterState = AnalyticsFilterState & {
  date_from: AnalyticsFilterValue;
  date_to: AnalyticsFilterValue;
  seller_id: AnalyticsFilterValue;
  category_id: AnalyticsFilterValue;
  brand_id: AnalyticsFilterValue;
  low_stock_threshold: AnalyticsFilterValue;
};

type FilterPayload = Record<string, string | number>;

type ProductTableRow = {
  id: string;
  name: string;
  sku: string;
  revenue: number;
  quantity: number;
  unitsSold: number;
  netChange: number;
  stock: number | null;
  status: 'healthy' | 'low' | 'out';
  [key: string]: string | number | null | undefined;
};

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

const Products: React.FC = () => {
  const { props } = usePage<ProductsPageProps>();
  const analytics = useMemo<ProductAnalyticsPayload>(() => props.products ?? {}, [props.products]);
  const initialFilters = props.filters ?? {};
  const locale = typeof props.locale === 'string' ? props.locale : 'en';
  const currency = resolveCurrencyCode(props.currency);
  const { t } = useTranslation();

  const [filters, setFilters] = useState<ProductFilterState>(() => ({
    date_from: normalizeFilterValue(initialFilters['date_from'], ''),
    date_to: normalizeFilterValue(initialFilters['date_to'], ''),
    seller_id: normalizeFilterValue(initialFilters['seller_id'], ''),
    category_id: normalizeFilterValue(initialFilters['category_id'], ''),
    brand_id: normalizeFilterValue(initialFilters['brand_id'], ''),
    low_stock_threshold: normalizeFilterValue(initialFilters['low_stock_threshold'], ''),
  }));

  const topProducts = useMemo<ProductRevenuePoint[]>(
    () => (Array.isArray(analytics.topProducts) ? analytics.topProducts : []),
    [analytics]
  );

  const categoryPerformance = useMemo<CategoryPerformancePoint[]>(
    () => (Array.isArray(analytics.categoryPerformance) ? analytics.categoryPerformance : []),
    [analytics]
  );

  const inventoryTurnover = useMemo<InventoryTurnoverPoint[]>(
    () => (Array.isArray(analytics.inventoryTurnover) ? analytics.inventoryTurnover : []),
    [analytics]
  );

  const lowStock = useMemo<LowStockPoint[]>(
    () => (Array.isArray(analytics.lowStock) ? analytics.lowStock : []),
    [analytics]
  );

  const numberFormatter = useMemo(() => new Intl.NumberFormat(locale), [locale]);
  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
      }),
    [currency, locale]
  );

  const uniqueProductCount = useMemo(() => {
    const identifiers = new Set<number>();
    topProducts.forEach((item) => identifiers.add(item.productId));
    inventoryTurnover.forEach((item) => identifiers.add(item.productId));
    lowStock.forEach((item) => identifiers.add(item.productId));
    return identifiers.size;
  }, [inventoryTurnover, lowStock, topProducts]);

  const lowStockCount = lowStock.length;
  const outOfStockCount = useMemo(() => lowStock.filter((item) => item.stock === 0).length, [lowStock]);

  const totalUnitsSold = useMemo(
    () => inventoryTurnover.reduce((sum, item) => sum + (item.unitsSold ?? 0), 0),
    [inventoryTurnover]
  );

  const avgUnitsSold = uniqueProductCount > 0 ? totalUnitsSold / uniqueProductCount : 0;

  const inventoryMap = useMemo(() => {
    const map = new Map<number, InventoryTurnoverPoint>();
    inventoryTurnover.forEach((item) => map.set(item.variantId, item));
    return map;
  }, [inventoryTurnover]);

  const lowStockMap = useMemo(() => {
    const map = new Map<number, LowStockPoint>();
    lowStock.forEach((item) => map.set(item.variantId, item));
    return map;
  }, [lowStock]);

  const productTableRows: ProductTableRow[] = useMemo(() => {
    if (topProducts.length === 0) {
      return [];
    }

    return topProducts.map((product) => {
      const turnover = inventoryMap.get(product.variantId);
      const lowStockEntry = lowStockMap.get(product.variantId);
      const stock = lowStockEntry?.stock ?? null;
      const status: ProductTableRow['status'] = stock === null
        ? 'healthy'
        : stock === 0
          ? 'out'
          : 'low';

      return {
        id: `${product.productId}-${product.variantId}`,
        name: product.label,
        sku: product.sku ?? t('N/A'),
        revenue: product.revenue,
        quantity: product.quantity,
        unitsSold: turnover?.unitsSold ?? product.quantity,
        netChange: turnover?.netChange ?? 0,
        stock,
        status,
      };
    });
  }, [inventoryMap, lowStockMap, topProducts, t]);

  const topProductsChartData: ChartDataPoint[] = useMemo(
    () =>
      topProducts.slice(0, 10).map((product) => ({
        label: product.label,
        value: product.revenue,
        sku: product.sku,
      })),
    [topProducts]
  );

  const inventoryTrendData: ChartDataPoint[] = useMemo(
    () =>
      inventoryTurnover.map((item) => ({
        label: item.sku ?? item.label,
        value: item.netChange,
        unitsSold: item.unitsSold,
      })),
    [inventoryTurnover]
  );

  const tableColumns: AnalyticsTableColumn<ProductTableRow>[] = useMemo(
    () => [
      {
        key: 'name',
        label: t('Product'),
        sortable: false,
        render: (value, row) => (
          <div className="analytics-product__name">
            <strong>{String(value ?? '')}</strong>
            <span className="analytics-product__sku">{t('SKU')}: {row.sku}</span>
          </div>
        ),
      },
      {
        key: 'quantity',
        label: t('Units Ordered'),
        sortable: false,
        align: 'right',
        render: (value) => numberFormatter.format(Number(value ?? 0)),
      },
      {
        key: 'unitsSold',
        label: t('Units Sold'),
        sortable: false,
        align: 'right',
        render: (value) => numberFormatter.format(Number(value ?? 0)),
      },
      {
        key: 'revenue',
        label: t('Revenue'),
        sortable: false,
        align: 'right',
        render: (value) => currencyFormatter.format(Number(value ?? 0)),
      },
      {
        key: 'netChange',
        label: t('Net Change'),
        sortable: false,
        align: 'right',
        render: (value) => numberFormatter.format(Number(value ?? 0)),
      },
      {
        key: 'stock',
        label: t('Stock'),
        sortable: false,
        align: 'right',
        render: (value, row) => {
          if (value === null || value === undefined) {
            return t('N/A');
          }

          const badgeClass = row.status === 'out' ? 'status pending' : row.status === 'low' ? 'status process' : 'status completed';
          return <span className={badgeClass}>{numberFormatter.format(Number(value ?? 0))}</span>;
        },
      },
    ],
    [currencyFormatter, numberFormatter, t]
  );

  const handleFilterChange = (updated: AnalyticsFilterState) => {
    setFilters(updated as ProductFilterState);
  };

  const handleApplyFilters = () => {
    router.get('/admin/analytics/products', cleanupFilters(filters), {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleResetFilters = () => {
    const resetState: ProductFilterState = {
      date_from: '',
      date_to: '',
      seller_id: '',
      category_id: '',
      brand_id: '',
      low_stock_threshold: '',
    };
    setFilters(resetState);

    router.get('/admin/analytics/products', {}, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  return (
    <AppLayout>
      <Head title={t('Product Analytics')} />
      <div className="inventory-page analytics-page analytics-page--products">
        <section className="inventory-section analytics-page__header">
          <div className="analytics-page__heading">
            <h1>{t('Product Analytics')}</h1>
            <p className="analytics-page__subtitle">
              {t('Track product performance, monitor inventory health, and surface opportunities for restocking.')}
            </p>
          </div>
        </section>

        <section className="inventory-section analytics-page__filters">
          <AnalyticsFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            title={t('Filter Product Data')}
            description={t('Select a timeframe or narrow by seller, category, or brand to focus the analysis.')}
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
              title={t('Tracked Products')}
              value={numberFormatter.format(uniqueProductCount)}
              icon="bx bx-package"
              color="blue"
              tooltip={t('Unique products represented across revenue, turnover, and inventory metrics.')}
            />
            <AnalyticsCard
              title={t('Low Stock Items')}
              value={numberFormatter.format(lowStockCount)}
              icon="bx bx-down-arrow-circle"
              color="yellow"
              tooltip={t('Variants currently at or below the configured low stock threshold.')}
            />
            <AnalyticsCard
              title={t('Out of Stock Variants')}
              value={numberFormatter.format(outOfStockCount)}
              icon="bx bx-error"
              color={outOfStockCount > 0 ? 'red' : 'green'}
              tooltip={t('Variants requiring immediate replenishment to avoid lost sales.')}
            />
            <AnalyticsCard
              title={t('Avg Units Sold')}
              value={numberFormatter.format(Math.round(avgUnitsSold))}
              icon="bx bx-stats"
              color="green"
              tooltip={t('Average units sold per tracked product within the selected filters.')}
            />
          </ul>
        </section>

        <section className="inventory-section analytics-page__charts">
          <div className="analytics-page__charts-grid analytics-page__charts-grid--two">
            <AnalyticsChart
              type="bar"
              data={topProductsChartData}
              title={t('Top Product Revenue')}
              description={t('Highest grossing products within the filtered range.')}
              legend={false}
            />
            <AnalyticsChart
              type="pie"
              data={categoryPerformance}
              title={t('Category Contribution')}
              description={t('Revenue distribution across product categories.')}
              legend
            />
          </div>

          <div className="analytics-page__charts-grid analytics-page__charts-grid--single">
            <AnalyticsChart
              type="line"
              data={inventoryTrendData}
              title={t('Inventory Net Change by Variant')}
              description={t('Net quantity movement to highlight fast-selling variants and stock drains.')}
              legend={false}
            />
          </div>
        </section>

        <section className="inventory-section analytics-page__table">
          <AnalyticsTable
            data={productTableRows}
            columns={tableColumns}
            headerTitle={t('Product Performance Details')}
            headerIcon="bx bx-package"
            emptyMessage={t('No product analytics available for the selected filters.')}
            rowKey={(row) => row.id}
          />
        </section>
      </div>
    </AppLayout>
  );
};

export default Products;

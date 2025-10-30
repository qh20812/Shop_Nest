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
import StatusBadge from '@/Components/ui/StatusBadge';
import '@/../css/Page.css';

type OrderStatusSummary = {
  status: string;
  label: string;
  value: number;
  [key: string]: string | number | null | undefined;
};

type FulfillmentMetrics = {
  avgToShipHours?: number;
  avgShipToDeliverHours?: number;
  avgTotalHours?: number;
  [key: string]: number | undefined;
};

type ConversionMetrics = {
  cartAdds?: number;
  checkoutStarts?: number;
  checkoutCompletes?: number;
  orders?: number;
  cartToCheckoutRate?: number;
  checkoutToOrderRate?: number;
  [key: string]: number | undefined;
};

interface OrderRecordInput extends Record<string, unknown> {
  id?: number | string;
  order_id?: number | string;
  number?: string;
  code?: string;
  customer?: string;
  customer_name?: string;
  customerName?: string;
  created_at?: string;
  placed_at?: string;
  date?: string;
  status?: string;
  total_amount?: number;
  totalAmount?: number;
  items_count?: number;
  itemsCount?: number;
  payment_method?: string;
  paymentMethod?: string;
}

type OrderRecordRow = {
  id: string;
  orderNumber: string;
  customer: string;
  placedAt: string | null;
  status: string;
  total: number;
  items: number;
  paymentMethod?: string | null;
  [key: string]: string | number | null | undefined;
};

interface OrderAnalyticsPayload extends Record<string, unknown> {
  statusDistribution?: OrderStatusSummary[];
  averageOrderValue?: number;
  fulfillment?: FulfillmentMetrics;
  disputeRate?: number;
  conversion?: ConversionMetrics;
  filters?: Record<string, unknown>;
  orders?: OrderRecordInput[];
  rows?: OrderRecordInput[];
  records?: OrderRecordInput[];
  table?: OrderRecordInput[];
}

interface OrdersPageProps extends Record<string, unknown> {
  orders?: OrderAnalyticsPayload;
  filters?: Record<string, unknown>;
  statusOptions?: Record<string, string>;
  locale?: string;
  currency?: string;
}

type OrderFilterState = AnalyticsFilterState & {
  date_from: AnalyticsFilterValue;
  date_to: AnalyticsFilterValue;
  seller_id: AnalyticsFilterValue;
  category_id: AnalyticsFilterValue;
  customer_id: AnalyticsFilterValue;
};

type FilterPayload = Record<string, string | number | string[]>;

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

function cleanupFilters(filters: AnalyticsFilterState): Record<string, string | number> {
  const payload: Record<string, string | number> = {};

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

const Orders: React.FC = () => {
  const { props } = usePage<OrdersPageProps>();
  const analytics = useMemo<OrderAnalyticsPayload>(() => props.orders ?? {}, [props.orders]);
  const initialFilters = props.filters ?? {};
  const locale = typeof props.locale === 'string' ? props.locale : 'en';
  const currency = resolveCurrencyCode(props.currency);
  const { t } = useTranslation();

  const [filters, setFilters] = useState<OrderFilterState>(() => ({
    date_from: normalizeFilterValue(initialFilters['date_from'], ''),
    date_to: normalizeFilterValue(initialFilters['date_to'], ''),
    seller_id: normalizeFilterValue(initialFilters['seller_id'], ''),
    category_id: normalizeFilterValue(initialFilters['category_id'], ''),
    customer_id: normalizeFilterValue(initialFilters['customer_id'], ''),
  }));
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(() => {
    const statusFilter = initialFilters['status'];
    if (Array.isArray(statusFilter)) {
      return statusFilter.map((status) => String(status));
    }
    if (typeof statusFilter === 'string' && statusFilter !== '') {
      return [statusFilter];
    }
    return [];
  });

  const statusDistribution = useMemo<OrderStatusSummary[]>(
    () => (Array.isArray(analytics.statusDistribution) ? analytics.statusDistribution : []),
    [analytics]
  );

  const fulfillment = useMemo<FulfillmentMetrics>(() => analytics.fulfillment ?? {}, [analytics]);
  const conversion = useMemo<ConversionMetrics>(() => analytics.conversion ?? {}, [analytics]);
  const disputeRate = analytics.disputeRate ?? 0;
  const averageOrderValue = analytics.averageOrderValue ?? 0;

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
  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
    [locale]
  );

  const totalOrders = useMemo(
    () => statusDistribution.reduce((sum, status) => sum + (status.value ?? 0), 0),
    [statusDistribution]
  );

  const fulfillmentRate = conversion.checkoutToOrderRate ?? 0;
  const avgFulfillmentHours = fulfillment.avgTotalHours ?? 0;

  const statusChartData: ChartDataPoint[] = useMemo(
    () =>
      statusDistribution.map((entry) => ({
        label: entry.label ?? entry.status,
        value: entry.value ?? 0,
        status: entry.status,
      })),
    [statusDistribution]
  );

  const conversionSeries: ChartDataPoint[] = useMemo(() => {
    const stages: Array<[string, number]> = [
      [t('Cart Adds'), conversion.cartAdds ?? 0],
      [t('Checkout Starts'), conversion.checkoutStarts ?? 0],
      [t('Checkout Completes'), conversion.checkoutCompletes ?? 0],
      [t('Orders'), conversion.orders ?? totalOrders],
    ];

    return stages.map(([label, value]) => ({ label, value }));
  }, [conversion.cartAdds, conversion.checkoutCompletes, conversion.checkoutStarts, conversion.orders, t, totalOrders]);

  const paymentMethodData: ChartDataPoint[] = useMemo(() => [], []);

  const tableSource = useMemo(() => {
    const candidates: Array<OrderRecordInput[] | undefined> = [
      analytics.orders,
      analytics.rows,
      analytics.records,
      analytics.table,
    ];

    return candidates.find((candidate): candidate is OrderRecordInput[] => Array.isArray(candidate)) ?? [];
  }, [analytics.orders, analytics.records, analytics.rows, analytics.table]);

  const tableRows: OrderRecordRow[] = useMemo(
    () =>
      tableSource.map((item, index) => {
        const identifier = item.id ?? item.order_id ?? `order-${index + 1}`;
        const orderNumber =
          item.number ?? item.code ?? (typeof identifier === 'number' ? `#${identifier}` : String(identifier));
        const placedAt = item.placed_at ?? item.created_at ?? item.date ?? null;
        const rawStatus = item.status ?? 'pending_confirmation';

        return {
          id: String(identifier),
          orderNumber,
          customer: item.customer ?? item.customer_name ?? item.customerName ?? t('Unknown Customer'),
          placedAt,
          status: String(rawStatus),
          total: Number(item.total_amount ?? item.totalAmount ?? 0),
          items: Number(item.items_count ?? item.itemsCount ?? 0),
          paymentMethod: item.payment_method ?? item.paymentMethod ?? null,
        };
      }),
    [tableSource, t]
  );

  const tableColumns: AnalyticsTableColumn<OrderRecordRow>[] = useMemo(
    () => [
      {
        key: 'orderNumber',
        label: t('Order'),
        sortable: false,
        render: (value) => <strong>{String(value ?? '')}</strong>,
      },
      {
        key: 'customer',
        label: t('Customer'),
        sortable: false,
      },
      {
        key: 'placedAt',
        label: t('Placed At'),
        sortable: false,
        render: (value) => {
          if (!value || typeof value !== 'string') {
            return t('Unknown');
          }

          const parsed = new Date(value);
          if (Number.isNaN(parsed.valueOf())) {
            return value;
          }

          return dateFormatter.format(parsed);
        },
      },
      {
        key: 'status',
        label: t('Status'),
        sortable: false,
        render: (value) => <StatusBadge status={String(value ?? '')} type="order" />,
      },
      {
        key: 'items',
        label: t('Items'),
        sortable: false,
        align: 'right',
        render: (value) => numberFormatter.format(Number(value ?? 0)),
      },
      {
        key: 'total',
        label: t('Total'),
        sortable: false,
        align: 'right',
        render: (value) => currencyFormatter.format(Number(value ?? 0)),
      },
      {
        key: 'paymentMethod',
        label: t('Payment Method'),
        sortable: false,
        render: (value) => (value ? t(String(value)) : t('Unknown')),
      },
    ],
    [currencyFormatter, dateFormatter, numberFormatter, t]
  );

  const statusOptions = useMemo(() => Object.entries(props.statusOptions ?? {}), [props.statusOptions]);

  const handleFilterChange = (updated: AnalyticsFilterState) => {
    setFilters(updated as OrderFilterState);
  };

  const handleStatusToggle = (status: string) => {
    setSelectedStatuses((previous) => {
      if (previous.includes(status)) {
        return previous.filter((value) => value !== status);
      }
      return [...previous, status];
    });
  };

  const handleApplyFilters = () => {
    const payload: FilterPayload = {
      ...cleanupFilters(filters),
    };

    if (selectedStatuses.length > 0) {
      payload.status = selectedStatuses;
    }

    router.get('/admin/analytics/orders', payload, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleResetFilters = () => {
    const resetState: OrderFilterState = {
      date_from: '',
      date_to: '',
      seller_id: '',
      category_id: '',
      customer_id: '',
    };
    setFilters(resetState);
    setSelectedStatuses([]);

    router.get('/admin/analytics/orders', {}, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  return (
    <AppLayout>
      <Head title={t('Order Analytics')} />
      <div className="inventory-page analytics-page analytics-page--orders">
        <section className="inventory-section analytics-page__header">
          <div className="analytics-page__heading">
            <h1>{t('Order Analytics')}</h1>
            <p className="analytics-page__subtitle">
              {t('Track fulfillment health, monitor status distribution, and review conversion performance across the order funnel.')}
            </p>
          </div>
        </section>

        <section className="inventory-section analytics-page__filters">
          <AnalyticsFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            title={t('Filter Order Data')}
            description={t('Choose a date range or narrow by seller, category, or specific customers.')}
            onReset={handleResetFilters}
          >
            {statusOptions.length > 0 ? (
              <div className="analytics-filters__custom-group">
                <span className="analytics-filters__label">{t('Order Status')}</span>
                <div className="analytics-filters__checkbox-grid">
                  {statusOptions.map(([value, label]) => {
                    const checked = selectedStatuses.includes(value);
                    return (
                      <label key={value} className="analytics-filters__checkbox">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handleStatusToggle(value)}
                        />
                        <span>{t(label)}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ) : null}

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
              title={t('Total Orders')}
              value={numberFormatter.format(totalOrders)}
              icon="bx bx-cart"
              color="blue"
              tooltip={t('Orders counted within the selected filters and statuses.')}
            />
            <AnalyticsCard
              title={t('Average Order Value')}
              value={currencyFormatter.format(averageOrderValue)}
              icon="bx bx-dollar"
              color="green"
              tooltip={t('Mean revenue per order during the selected period.')}
            />
            <AnalyticsCard
              title={t('Fulfillment Rate')}
              value={`${(fulfillmentRate ?? 0).toFixed(1)}%`}
              icon="bx bx-transfer"
              color={fulfillmentRate >= 90 ? 'green' : fulfillmentRate >= 70 ? 'yellow' : 'red'}
              tooltip={`${t('Ratio of successful checkouts converting into completed orders.')} ${t('Average fulfillment time')}: ${avgFulfillmentHours.toFixed(1)}h`}
            />
            <AnalyticsCard
              title={t('Dispute Rate')}
              value={`${(disputeRate ?? 0).toFixed(2)}%`}
              icon="bx bx-error-circle"
              color={disputeRate <= 2 ? 'green' : disputeRate <= 5 ? 'yellow' : 'red'}
              tooltip={t('Percentage of orders that resulted in disputes for the chosen timeframe.')}
            />
          </ul>
        </section>

        <section className="inventory-section analytics-page__charts">
          <div className="analytics-page__charts-grid analytics-page__charts-grid--two">
            <AnalyticsChart
              type="bar"
              data={statusChartData}
              title={t('Status Distribution')}
              description={t('Visual breakdown of orders across fulfillment statuses.')}
              legend={false}
            />
            <AnalyticsChart
              type="line"
              data={conversionSeries}
              title={t('Order Funnel Volume')}
              description={t('Volume flowing through each stage of the conversion funnel.')}
              legend={false}
            />
          </div>

          <div className="analytics-page__charts-grid analytics-page__charts-grid--two">
            <AnalyticsChart
              type="pie"
              data={paymentMethodData}
              title={t('Payment Methods')}
              description={t('Payment method distribution for completed orders.')}
              legend
            />
            <AnalyticsChart
              type="funnel"
              data={conversionSeries}
              title={t('Checkout Conversion Funnel')}
              description={t('Funnel visualization from cart activity to completed orders.')}
            />
          </div>
        </section>

        <section className="inventory-section analytics-page__table">
          <AnalyticsTable
            data={tableRows}
            columns={tableColumns}
            headerTitle={t('Recent Orders Overview')}
            headerIcon="bx bx-receipt"
            emptyMessage={t('No order records available for the selected filters.')}
            rowKey={(row) => row.id}
          />
        </section>
      </div>
    </AppLayout>
  );
};

export default Orders;

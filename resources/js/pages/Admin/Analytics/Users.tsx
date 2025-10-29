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
import QuickFilter, { QuickFilterOption } from '@/Components/Analytics/QuickFilter';
import StatusBadge from '@/Components/ui/StatusBadge';
import '@/../css/Page.css';

type UserSegmentPoint = {
  segmentId?: number;
  label: string;
  value: number;
  [key: string]: string | number | null | undefined;
};

interface UserRetentionMetrics {
  thirtyDay?: number;
  ninetyDay?: number;
  totalCustomers?: number;
  [key: string]: number | undefined;
}

interface UserActiveMetrics {
  last24h?: number;
  last7d?: number;
  ordersLast30d?: number;
  [key: string]: number | undefined;
}

interface UserDetailInput extends Record<string, unknown> {
  id?: number | string;
  user_id?: number | string;
  name?: string;
  full_name?: string;
  email?: string | null;
  joined_at?: string;
  joinDate?: string;
  created_at?: string;
  orders_count?: number;
  ordersCount?: number;
  total_spent?: number;
  totalSpent?: number;
  last_activity?: string | null;
  lastActivity?: string | null;
  status?: string | null;
  role?: string | null;
  segment?: string | null;
}

type UserDetailRow = {
  id: string;
  name: string;
  email: string;
  joinedAt: string | null;
  ordersCount: number;
  totalSpent: number;
  lastActivity: string | null;
  status: string | null;
  role?: string | null;
  segment?: string | null;
  [key: string]: string | number | null | undefined;
};

interface UsersAnalyticsPayload extends Record<string, unknown> {
  growthSeries?: ChartDataPoint[];
  segments?: UserSegmentPoint[];
  retention?: UserRetentionMetrics;
  activeUsers?: UserActiveMetrics;
  filters?: Record<string, unknown>;
  details?: UserDetailInput[];
  table?: UserDetailInput[];
  userTable?: UserDetailInput[];
  records?: UserDetailInput[];
}

interface UsersPageProps extends Record<string, unknown> {
  users?: UsersAnalyticsPayload;
  filters?: Record<string, unknown>;
  availableRanges?: string[];
  locale?: string;
  currency?: string;
}

type UserFilterState = AnalyticsFilterState & {
  date_from: AnalyticsFilterValue;
  date_to: AnalyticsFilterValue;
  role: AnalyticsFilterValue;
  segment_id: AnalyticsFilterValue;
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

const Users: React.FC = () => {
  const { props } = usePage<UsersPageProps>();
  const analytics = useMemo<UsersAnalyticsPayload>(() => props.users ?? {}, [props.users]);
  const initialFilters = props.filters ?? {};
  const locale = typeof props.locale === 'string' ? props.locale : 'en';
  const currency = typeof props.currency === 'string' ? props.currency : 'VND';
  const { t } = useTranslation();

  const [range, setRange] = useState<string>(String(normalizeFilterValue(initialFilters['range'], '4weeks')));
  const [filters, setFilters] = useState<UserFilterState>(() => ({
    date_from: normalizeFilterValue(initialFilters['date_from'], ''),
    date_to: normalizeFilterValue(initialFilters['date_to'], ''),
    segment_id: normalizeFilterValue(initialFilters['segment_id'], ''),
    role: normalizeFilterValue(initialFilters['role'], ''),
  }));

  const growthSeries = useMemo<ChartDataPoint[]>(
    () => (Array.isArray(analytics.growthSeries) ? analytics.growthSeries : []),
    [analytics]
  );

  const segments = useMemo<UserSegmentPoint[]>(
    () => (Array.isArray(analytics.segments) ? analytics.segments : []),
    [analytics]
  );

  const retention = useMemo<UserRetentionMetrics>(() => analytics.retention ?? {}, [analytics]);
  const activeUsers = useMemo<UserActiveMetrics>(() => analytics.activeUsers ?? {}, [analytics]);

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

  const totalUsers = retention.totalCustomers ?? 0;
  const latestNewUsers = growthSeries.at(-1)?.value ?? 0;
  const activeLast7d = activeUsers.last7d ?? 0;
  const retention30 = retention.thirtyDay ?? 0;
  const retention90 = retention.ninetyDay ?? 0;

  const retentionChange = retention30 - retention90;

  const activeUsersSeries: ChartDataPoint[] = useMemo(
    () => [
      { label: t('Last 24 Hours'), value: activeUsers.last24h ?? 0 },
      { label: t('Last 7 Days'), value: activeUsers.last7d ?? 0 },
      { label: t('Orders Last 30 Days'), value: activeUsers.ordersLast30d ?? 0 },
    ],
    [activeUsers.last24h, activeUsers.last7d, activeUsers.ordersLast30d, t]
  );

  const segmentChartData: ChartDataPoint[] = useMemo(
    () =>
      segments.map((segment) => ({
        label: segment.label,
        value: segment.value ?? 0,
        segmentId: segment.segmentId,
      })),
    [segments]
  );

  const quickRangeOptions: QuickFilterOption[] = useMemo(() => {
    const available = Array.isArray(props.availableRanges) ? props.availableRanges : [];
    const labels: Record<string, string> = {
      '4weeks': t('Last 4 Weeks'),
      '6months': t('Last 6 Months'),
      '12months': t('Last 12 Months'),
    };

    return available.map((value) => ({ label: labels[value] ?? value, value }));
  }, [props.availableRanges, t]);

  const detailRows: UserDetailRow[] = useMemo(() => {
    const candidateKeys = ['details', 'table', 'userTable', 'records', 'rows'];
    let source: unknown[] = [];

    for (const key of candidateKeys) {
      const value = (analytics as Record<string, unknown>)[key];
      if (Array.isArray(value)) {
        source = value;
        break;
      }
    }

    return source.map((entry, index) => {
      const item = entry as UserDetailInput;
      const idValue = item.id ?? item.user_id ?? index + 1;
      const joinedAt = item.joined_at ?? item.joinDate ?? item.created_at ?? null;
      const lastActivity = item.last_activity ?? item.lastActivity ?? null;

      return {
        id: String(idValue),
        name: item.name ?? item.full_name ?? t('Unknown User'),
        email: item.email ?? '',
        joinedAt: joinedAt,
        ordersCount: Number(item.orders_count ?? item.ordersCount ?? 0),
        totalSpent: Number(item.total_spent ?? item.totalSpent ?? 0),
        lastActivity: lastActivity,
        status: item.status ?? null,
        role: item.role ?? null,
        segment: item.segment ?? null,
      };
    });
  }, [analytics, t]);

  const tableColumns: AnalyticsTableColumn<UserDetailRow>[] = useMemo(
    () => [
      {
        key: 'name',
        label: t('User'),
        sortable: false,
        render: (value, row) => (
          <div className="analytics-user__name">
            <strong>{String(value ?? '')}</strong>
            {row.email ? <span className="analytics-user__email">{row.email}</span> : null}
          </div>
        ),
      },
      {
        key: 'role',
        label: t('Role'),
        sortable: false,
        render: (value) => (value ? t(String(value)) : t('N/A')),
      },
      {
        key: 'segment',
        label: t('Segment'),
        sortable: false,
        render: (value) => (value ? String(value) : t('Unassigned')),
      },
      {
        key: 'joinedAt',
        label: t('Joined'),
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
        key: 'ordersCount',
        label: t('Orders'),
        sortable: false,
        align: 'right',
        render: (value) => numberFormatter.format(Number(value ?? 0)),
      },
      {
        key: 'totalSpent',
        label: t('Total Spent'),
        sortable: false,
        align: 'right',
        render: (value) => currencyFormatter.format(Number(value ?? 0)),
      },
      {
        key: 'lastActivity',
        label: t('Last Activity'),
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
        render: (value) => (value ? <StatusBadge status={String(value)} type="general" /> : t('Unknown')),
      },
    ],
    [currencyFormatter, dateFormatter, numberFormatter, t]
  );

  const handleFilterChange = (updated: AnalyticsFilterState) => {
    setFilters(updated as UserFilterState);
  };

  const handleApplyFilters = () => {
    const payload: FilterPayload = {
      ...cleanupFilters(filters),
    };

    if (range && range !== '') {
      payload['range'] = range;
    }

    router.get('/admin/analytics/users', payload, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleResetFilters = () => {
    const resetState: UserFilterState = {
      date_from: '',
      date_to: '',
      segment_id: '',
      role: '',
    };
    setFilters(resetState);
    setRange('4weeks');

    router.get('/admin/analytics/users', { range: '4weeks' }, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  return (
    <AppLayout>
      <Head title={t('User Analytics')} />
      <div className="inventory-page analytics-page analytics-page--users">
        <section className="inventory-section analytics-page__header">
          <div className="analytics-page__heading">
            <h1>{t('User Analytics')}</h1>
            <p className="analytics-page__subtitle">
              {t('Understand how users engage with the platform, monitor retention trends, and identify key segments.')}
            </p>
          </div>

          {quickRangeOptions.length > 0 ? (
            <QuickFilter options={quickRangeOptions} activeValue={range} onChange={setRange} />
          ) : null}
        </section>

        <section className="inventory-section analytics-page__filters">
          <AnalyticsFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            title={t('Filter User Data')}
            description={t('Adjust timeframe or narrow down segments to analyze specific user cohorts.')}
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
              title={t('Total Users')}
              value={numberFormatter.format(totalUsers)}
              icon="bx bx-group"
              color="blue"
              tooltip={t('Number of registered users across the platform.')}
            />
            <AnalyticsCard
              title={t('New Users (Current Period)')}
              value={numberFormatter.format(latestNewUsers)}
              icon="bx bx-user-plus"
              color="green"
              tooltip={t('Users acquired within the selected reporting range.')}
            />
            <AnalyticsCard
              title={t('Active Users (7d)')}
              value={numberFormatter.format(activeLast7d)}
              icon="bx bx-bolt-circle"
              color="yellow"
              tooltip={t('Unique users active over the past 7 days.')}
            />
            <AnalyticsCard
              title={t('30-Day Retention')}
              value={`${retention30.toFixed(1)}%`}
              change={retentionChange}
              changeLabel={t('vs 90-day retention')}
              icon="bx bx-repeat"
              color={retentionChange >= 0 ? 'green' : 'red'}
              tooltip={t('Percentage of users returning within 30 days compared to the 90-day baseline.')}
            />
          </ul>
        </section>

        <section className="inventory-section analytics-page__charts">
          <div className="analytics-page__charts-grid analytics-page__charts-grid--two">
            <AnalyticsChart
              type="line"
              data={growthSeries}
              title={t('User Growth Trend')}
              description={t('New users acquired over the selected time range.')}
            />
            <AnalyticsChart
              type="pie"
              data={segmentChartData}
              title={t('Segment Distribution')}
              description={t('Relative size of user segments contributing to activity.')}
              legend
            />
          </div>

          <div className="analytics-page__charts-grid analytics-page__charts-grid--single">
            <AnalyticsChart
              type="area"
              data={activeUsersSeries}
              title={t('Active User Engagement')}
              description={t('Comparison of users active within recent engagement windows.')}
              legend={false}
            />
          </div>
        </section>

        <section className="inventory-section analytics-page__table">
          <AnalyticsTable
            data={detailRows}
            columns={tableColumns}
            headerTitle={t('User Cohort Details')}
            headerIcon="bx bx-id-card"
            emptyMessage={t('No user details available for the selected filters.')}
            rowKey={(row) => row.id}
          />
        </section>
      </div>
    </AppLayout>
  );
};

export default Users;

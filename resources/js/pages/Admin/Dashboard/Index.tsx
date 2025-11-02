import React, { useMemo } from 'react';
import AppLayout from '@/layouts/app/AppLayout';
import Header from '@/Components/ui/Header';
import Insights from '@/Components/ui/Insights';
import Avatar from '@/Components/ui/Avatar';
import { useTranslation } from '../../../lib/i18n';
import { usePage } from '@inertiajs/react';
import { formatCurrency, resolveCurrencyCode } from '@/lib/utils';
// import '@/../css/app.css';
import '@/../css/Page.css';
import {Head} from '@inertiajs/react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from 'recharts';

// Định nghĩa TypeScript interfaces
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

type OrderStatusKey =
  | 'pending_confirmation'
  | 'processing'
  | 'pending_assignment'
  | 'assigned_to_shipper'
  | 'delivering'
  | 'delivered'
  | 'completed'
  | 'cancelled'
  | 'returned';

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

  const currencyCode = props.currencyCode
    ?? props.meta?.currencyCode
    ?? resolveCurrencyCode(props.currency)
    ?? 'USD';

  const revenueChartData = revenueChart;
  const userGrowthChartData = userGrowthChart;

  const breadcrumbs = [
    { label: t('Dashboard'), href: '/admin/dashboard' },
    { label: t('Overview'), href: '#', active: true }
  ];

  // Tạo insightsData từ stats động
  const insightsData = [
    {
      icon: 'bx-time',
      value: stats.pending_orders.toLocaleString(locale),
    label: t('Pending Orders'),
    tooltip: t('Pending orders awaiting action')
    },
    {
      icon: 'bx-trending-up',
      value: `${Number.isFinite(stats.user_growth_monthly) ? stats.user_growth_monthly.toFixed(2) : '0.00'}%`,
      label: t('User Growth (Monthly)'),
      tooltip: t('User growth compared to last month')
    },
    {
      icon: 'bx-heart-circle',
      value: `${Number.isFinite(stats.system_health) ? stats.system_health.toFixed(2) : '0.00'}%`,
      label: t('System Health'),
      tooltip: t('Percentage of orders completed successfully')
    },
    {
      icon: 'bx-dollar-circle',
      value: formatCurrency(stats.total_revenue, {
        from: currencyCode,
        to: currencyCode,
        rates: {},
        locale,
        abbreviate: true
      }),
      label: t('Total Revenue'),
      tooltip: formatCurrency(stats.total_revenue, {
        from: currencyCode,
        to: currencyCode,
        rates: {},
        locale
      })
    },
  ];

  const orderStatusMap = useMemo<Record<OrderStatusKey, { className: string; label: string }>>(
    () => ({
      pending_confirmation: { className: 'pending', label: t('Pending Confirmation') },
      processing: { className: 'process', label: t('Processing') },
      pending_assignment: { className: 'process', label: t('Pending Assignment') },
      assigned_to_shipper: { className: 'process', label: t('Assigned to Shipper') },
      delivering: { className: 'process', label: t('Delivering') },
      delivered: { className: 'completed', label: t('Delivered') },
      completed: { className: 'completed', label: t('Completed') },
      cancelled: { className: 'pending', label: t('Cancelled') },
      returned: { className: 'pending', label: t('Returned') },
    }),
    [t],
  );

  const getOrderStatus = (status: string) => {
    return orderStatusMap[status as OrderStatusKey] ?? { className: 'pending', label: t('Pending') };
  };

  // Helper function để format ngày
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const handleDownloadCSV = () => {
    console.log('Download CSV clicked');
  };

  return (
    <AppLayout>
      <Head title={t('Dashboard')} />
      <Header
        title={t('Dashboard')}
        breadcrumbs={breadcrumbs}
        reportButton={{
          label: t('Download CSV'),
          icon: 'bx-cloud-download',
          onClick: handleDownloadCSV
        }}
      />
      
      <Insights items={insightsData} />

      <section className="charts">
        <div className="chart-card">
          <div className="chart-header">
            <h3>{t('Revenue Trend')}</h3>
            <span>{t('Last 7 days')}</span>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={revenueChartData} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(value: number) => formatCurrency(value, { from: currencyCode, to: currencyCode, rates: {}, locale, abbreviate: true })} width={80} />
                <Tooltip
                  formatter={(value: number) => [
                    formatCurrency(value, { from: currencyCode, to: currencyCode, rates: {}, locale }),
                    t('Revenue'),
                  ]}
                  labelFormatter={(label: string) => `${t('Date')}: ${label}`}
                />
                <Line type="monotone" dataKey="revenue" stroke="#1976D2" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>{t('User Growth')}</h3>
            <span>{t('Last 4 weeks')}</span>
          </div>
          <div className="chart-body">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={userGrowthChartData} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} width={40} />
                <Tooltip
                  formatter={(value: number) => [value.toLocaleString(locale), t('New Users')]}
                  labelFormatter={(label: string) => `${t('Week')}: ${label}`}
                />
                <Bar dataKey="users" fill="#388E3C" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      <div className="bottom-data">
        <div className="orders">
          <div className="header">
            <i className='bx bx-receipt'></i>
            <h3>{t('Recent Orders')}</h3>
          </div>
          <table>
            <thead>
              <tr>
                <th>{t('User')}</th>
                <th>{t('Order Date')}</th>
                <th>{t('Status')}</th>
                <th>{t('Total Amount')}</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders && recentOrders.length > 0 ? (
                recentOrders.map((order) => {
                  const { className, label } = getOrderStatus(order.status);
                  const rowKey = order.id ?? order.order_id ?? order.order_number ?? order.created_at;
                  
                  // Create safe user object for Avatar component
                  const userForAvatar = order.customer ? {
                    id: order.customer.id || 0,
                    username: order.customer.username || 'N/A',
                    first_name: order.customer.first_name || '',
                    last_name: order.customer.last_name || '',
                    avatar: order.customer.avatar,
                    avatar_url: order.customer.avatar_url,
                  } : {
                    id: 0,
                    username: 'N/A',
                    first_name: '',
                    last_name: '',
                    avatar: undefined,
                    avatar_url: undefined,
                  };

                  // Normalize avatar path if it's relative
                  if (userForAvatar.avatar && !userForAvatar.avatar.startsWith('http')) {
                    userForAvatar.avatar = `/storage/${userForAvatar.avatar}`;
                  }

                  const orderCurrency = order.currency_code ?? currencyCode;
                  const totalForDisplay = typeof order.total_amount_converted === 'number'
                    ? order.total_amount_converted
                    : Number(order.total_amount ?? order.total_amount_base ?? 0);

                  return (
                    <tr key={String(rowKey)}>
                      <td style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Avatar user={userForAvatar} size={36} />
                        <p style={{ margin: 0 }}>{userForAvatar.username}</p>
                      </td>
                      <td>{formatDate(order.created_at)}</td>
                      <td>
                        <span className={`status ${className}`}>
                          {label}
                        </span>
                      </td>
                      <td>
                        {formatCurrency(totalForDisplay, {
                          from: orderCurrency,
                          to: orderCurrency,
                          rates: {},
                          locale,
                        })}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '20px' }}>
                    {t('No recent orders')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="reminders">
          <div className="header">
            <i className='bx bx-user-plus'></i>
            <h3>{t('New Users')}</h3>
          </div>
          <ul className="task-list">
            {newUsers && newUsers.length > 0 ? (
              newUsers.map((user) => (
                <li key={user.id} className="completed">
                  <div className="task-title">
                    <i className='bx bx-user'></i>
                    <p>{user.username}</p>
                  </div>
                  <small style={{ color: 'var(--dark-grey)', fontSize: '12px' }}>
                    {formatDate(user.created_at)}
                  </small>
                </li>
              ))
            ) : (
              <li className="not-completed">
                <div className="task-title">
                  <i className='bx bx-info-circle'></i>
                  <p>{t('No new users')}</p>
                </div>
              </li>
            )}
          </ul>
        </div>
      </div>
    </AppLayout>
  );
}

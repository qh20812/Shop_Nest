import React, { useMemo } from 'react';
import AppLayout from '@/layouts/app/AppLayout';
import Header from '@/components/ui/Header';
import Insights from '@/components/ui/Insights';
import Avatar from '@/components/ui/Avatar';
import { useTranslation } from '../../../lib/i18n';
import { usePage } from '@inertiajs/react';
import { formatCurrency, resolveCurrencyCode } from '@/lib/utils';
import '@/../css/Page.css';
import { Head } from '@inertiajs/react';
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

interface Stats {
  total_revenue: number;
  pending_orders: number;
  total_products: number;
  shop_rating: number;
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

interface RevenueChartPoint {
  date: string;
  label: string;
  revenue: number;
}

interface DashboardProps extends Record<string, unknown> {
  stats?: Stats;
  recentOrders?: Order[];
  revenueChart?: RevenueChartPoint[];
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

export default function SellerDashboard() {
  const { t, locale } = useTranslation();
  const page = usePage<DashboardProps>();
  const props = page.props;

  const stats = props.stats ?? {
    total_revenue: 0,
    pending_orders: 0,
    total_products: 0,
    shop_rating: 0,
  };

  const recentOrders = Array.isArray(props.recentOrders) ? props.recentOrders : [];
  const revenueChart = Array.isArray(props.revenueChart) ? props.revenueChart : [];

  const currencyCode =
    props.currencyCode ?? props.meta?.currencyCode ?? resolveCurrencyCode(props.currency) ?? 'USD';

  const revenueChartData = revenueChart;

  const breadcrumbs = [
    { label: t('Dashboard'), href: '/seller/dashboard', active: true },
  ];

  const insightsData = [
    {
      icon: 'bx-time',
      value: stats.pending_orders.toLocaleString(locale),
      label: t('Pending Orders'),
    },
    {
      icon: 'bx-package',
      value: stats.total_products.toLocaleString(locale),
      label: t('Total Products'),
    },
    {
      icon: 'bx-star',
      value: `${stats.shop_rating.toFixed(1)}/5`,
      label: t('Shop Rating'),
    },
    {
      icon: 'bx-dollar-circle',
      value: formatCurrency(stats.total_revenue, {
        from: currencyCode,
        to: currencyCode,
        rates: {},
        locale,
        abbreviate: true,
      }),
      label: t('Total Revenue'),
    },
  ];

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('vi-VN');

  return (
    <AppLayout
      sidebarItems={[
        { icon: 'bx-basket', label: t('Orders'), href: '/seller/orders' },
        { icon: 'bx-package', label: t('Products'), href: '/seller/products' },
        { icon: 'bx-gift', label: t('Promotion'), href: '/seller/promotions' },
        { icon: 'bx-line-chart', label: t('Report'), href: '/seller/reports' },
        { icon: 'bx-store', label: t('Shop'), href: '/seller/shop' },
        { icon: 'bx-wallet', label: t('Wallet'), href: '/seller/wallet' },
      ]}
    >
      <Head title={t('Seller Dashboard')} />
      <Header title={t('Seller Dashboard')} breadcrumbs={breadcrumbs} />

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
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#1976D2" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>{t('Recent Orders')}</h3>
          </div>
          <table>
            <thead>
              <tr>
                <th>{t('Customer')}</th>
                <th>{t('Date')}</th>
                <th>{t('Total')}</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => {
                  const rowKey = order.id ?? order.order_id ?? order.order_number ?? order.created_at;
                  const customer = order.customer;
                  return (
                    <tr key={String(rowKey)}>
                      <td style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Avatar user={customer} size={36} />
                        <p>{customer.username}</p>
                      </td>
                      <td>{formatDate(order.created_at)}</td>
                      <td>
                        {formatCurrency(order.total_amount_converted ?? order.total_amount ?? 0, {
                          from: order.currency_code ?? currencyCode,
                          to: order.currency_code ?? currencyCode,
                          rates: {},
                          locale,
                        })}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={3} style={{ textAlign: 'center', padding: '20px' }}>
                    {t('No recent orders')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </AppLayout>
  );
}
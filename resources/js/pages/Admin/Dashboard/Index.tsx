import React from 'react';
import AppLayout from '@/layouts/app/AppLayout';
import Header from '@/components/admin/Header';
import Insights from '@/components/admin/Insights';
import { useTranslation } from '../../../lib/i18n';
import { usePage } from '@inertiajs/react';
import { formatNumber } from '@/lib/utils';
import '@/../css/app.css';
import '@/../css/Page.css';
import {Head} from '@inertiajs/react';

// Định nghĩa TypeScript interfaces
interface Stats {
  total_revenue: number;
  total_orders: number;
  new_users: number;
  total_products: number;
}

interface Customer {
  username: string;
}

interface Order {
  id: number;
  order_number?: string;
  created_at: string;
  status: number;
  customer: Customer;
}

interface User {
  id: number;
  username: string;
  created_at: string;
}

interface DashboardProps {
  stats: Stats;
  recentOrders: Order[];
  newUsers: User[];
  [key: string]: unknown;
}

export default function Index() {
  const { t } = useTranslation();
  const { stats, recentOrders, newUsers } = usePage<DashboardProps>().props;

  const breadcrumbs = [
    { label: t('Analytics'), href: '#' },
    { label: t('Shop'), href: '#', active: true },
  ];

  // Tạo insightsData từ stats động
  const insightsData = [
    { 
      icon: 'bx-calendar-check', 
      value: stats.total_orders.toLocaleString(), 
      label: t('Total Orders'),
      tooltip: `Total ${stats.total_orders} orders`
    },
    { 
      icon: 'bx-user-plus', 
      value: stats.new_users.toLocaleString(), 
      label: t('New Users'),
      tooltip: `Total ${stats.new_users} new users`
    },
    { 
      icon: 'bx-package', 
      value: stats.total_products.toLocaleString(), 
      label: t('Total Products'),
      tooltip: `Total ${stats.total_products} products`
    },
    { 
      icon: 'bx-dollar-circle', 
      value: formatNumber(stats.total_revenue), 
      label: t('Total Revenue'),
      tooltip: `$${stats.total_revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    },
  ];

  // Helper function để chuyển đổi status thành className và text
  const getOrderStatus = (status: number) => {
    switch (status) {
      case 1:
        return { className: 'pending', text: t('Pending') };
      case 2:
        return { className: 'process', text: t('Processing') };
      case 3:
        return { className: 'completed', text: t('Completed') };
      default:
        return { className: 'pending', text: t('Pending') };
    }
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

      <div className="bottom-data">
        <div className="orders">
          <div className="header">
            <i className='bx bx-receipt'></i>
            <h3>{t('Recent Orders')}</h3>
            <i className='bx bx-filter'></i>
            <i className='bx bx-search'></i>
          </div>
          <table>
            <thead>
              <tr>
                <th>{t('User')}</th>
                <th>{t('Order Date')}</th>
                <th>{t('Status')}</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders && recentOrders.length > 0 ? (
                recentOrders.map((order) => {
                  const orderStatus = getOrderStatus(order.status);
                  return (
                    <tr key={order.id}>
                      <td>
                        <img src="/logo.svg" alt="User" />
                        <p>{order.customer?.username || 'N/A'}</p>
                      </td>
                      <td>{formatDate(order.created_at)}</td>
                      <td>
                        <span className={`status ${orderStatus.className}`}>
                          {orderStatus.text}
                        </span>
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

        <div className="reminders">
          <div className="header">
            <i className='bx bx-user-plus'></i>
            <h3>{t('New Users')}</h3>
            <i className='bx bx-filter'></i>
            <i className='bx bx-search'></i>
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

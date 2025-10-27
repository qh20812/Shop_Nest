import React from 'react';
import AppLayout from '@/layouts/app/AppLayout';
import Header from '@/Components/ui/Header';
import Insights from '@/Components/ui/Insights';
import Avatar from '@/Components/ui/Avatar';
import { useTranslation } from '../../../lib/i18n';
import { usePage } from '@inertiajs/react';
import { formatCurrency } from '@/lib/utils';
// import '@/../css/app.css';
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
  id?: number;
  username: string;
  first_name?: string;
  last_name?: string;
  avatar?: string;
  avatar_url?: string;
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

interface Currency {
  code: string;
  rates: Record<string, number>;
}

interface DashboardProps {
  stats: Stats;
  recentOrders: Order[];
  newUsers: User[];
  currency: Currency;
  [key: string]: unknown;
}

export default function Index() {
  const { t, locale } = useTranslation();
  const { stats, recentOrders, newUsers, currency } = usePage<DashboardProps>().props;

  const breadcrumbs = [
    { label: t('Dashboard'), href: '/admin/dashboard' },
    { label: t('Overview'), href: '#', active: true }
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
      value: formatCurrency(stats.total_revenue, { 
        from: 'USD', 
        to: currency.code, 
        rates: currency.rates, 
        locale, 
        abbreviate: true 
      }),
      label: t('Total Revenue'),
      tooltip: formatCurrency(stats.total_revenue, { 
        from: 'USD', 
        to: currency.code, 
        rates: currency.rates, 
        locale 
      })
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

                  return (
                    <tr key={order.id}>
                      <td style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Avatar user={userForAvatar} size={36} />
                        <p style={{ margin: 0 }}>{userForAvatar.username}</p>
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

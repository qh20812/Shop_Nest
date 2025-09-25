import React from 'react';
import AppLayout from '@/layouts/app/AppLayout';
import Head from '@/components/admin/Head';
import Insights from '@/components/admin/Insights';
import { useTranslation } from '../../../lib/i18n';
import '@/../css/app.css';
import '@/../css/Page.css';


export default function Index() {
  const { t } = useTranslation();
  const sidebarItems = [
    { icon: 'bxs-dashboard', label: t('Dashboard'), href: '/admin/dashboard' },
    { icon: 'bx-store-alt', label: t('Shop'), href: '/admin/products' },
    { icon: 'bx-analyse', label: t('Analytics'), href: '/admin/analytics' },
    { icon: 'bx-message-square-dots', label: t('Tickets'), href: '/admin/tickets' },
    { icon: 'bx-group', label: t('Users'), href: '/admin/users' },
    { icon: 'bx-cog', label: t('Settings'), href: '/admin/settings' },
  ];

  const breadcrumbs = [
    { label: t('Analytics'), href: '#' },
    { label: t('Shop'), href: '#', active: true },
  ];

  const insightsData = [
    { icon: 'bx-calendar-check', value: '1,074', label: t('Paid Order') },
    { icon: 'bx-show-alt', value: '3,944', label: t('Site Visit') },
    { icon: 'bx-line-chart', value: '14,721', label: t('Searches') },
    { icon: 'bx-dollar-circle', value: '$6,742', label: t('Total Sales') },
  ];

  const handleDownloadCSV = () => {
    console.log('Download CSV clicked');
  };

  return (
    <AppLayout sidebarItems={sidebarItems}>
      <Head 
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
              <tr>
                <td>
                  <img src="/logo.svg" alt="User" />
                  <p>John Doe</p>
                </td>
                <td>14-08-2023</td>
                <td><span className="status completed">{t('Completed')}</span></td>
              </tr>
              <tr>
                <td>
                  <img src="/logo.svg" alt="User" />
                  <p>Jane Smith</p>
                </td>
                <td>14-08-2023</td>
                <td><span className="status pending">{t('Pending')}</span></td>
              </tr>
              <tr>
                <td>
                  <img src="/logo.svg" alt="User" />
                  <p>Bob Johnson</p>
                </td>
                <td>14-08-2023</td>
                <td><span className="status process">{t('Processing')}</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="reminders">
          <div className="header">
            <i className='bx bx-note'></i>
            <h3>{t('Reminders')}</h3>
            <i className='bx bx-filter'></i>
            <i className='bx bx-plus'></i>
          </div>
          <ul className="task-list">
            <li className="completed">
              <div className="task-title">
                <i className='bx bx-check-circle'></i>
                <p>{t('Start Our Meeting')}</p>
              </div>
              <i className='bx bx-dots-vertical-rounded'></i>
            </li>
            <li className="completed">
              <div className="task-title">
                <i className='bx bx-check-circle'></i>
                <p>{t('Analyse Our Site')}</p>
              </div>
              <i className='bx bx-dots-vertical-rounded'></i>
            </li>
            <li className="not-completed">
              <div className="task-title">
                <i className='bx bx-x-circle'></i>
                <p>{t('Play Football')}</p>
              </div>
              <i className='bx bx-dots-vertical-rounded'></i>
            </li>
          </ul>
        </div>
      </div>
    </AppLayout>
  );
}

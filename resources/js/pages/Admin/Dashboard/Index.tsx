import React from 'react';
import AppLayout from '@/layouts/app/AppLayout';
import Head from '@/components/admin/Head';
import Insights from '@/components/admin/Insights';
import '@/../css/app.css';
import '@/../css/Page.css';


export default function Index() {
  const sidebarItems = [
    { icon: 'bxs-dashboard', label: 'Dashboard', href: '/admin/dashboard' },
    { icon: 'bx-store-alt', label: 'Shop', href: '/admin/products' },
    { icon: 'bx-analyse', label: 'Analytics', href: '/admin/analytics' },
    { icon: 'bx-message-square-dots', label: 'Tickets', href: '/admin/tickets' },
    { icon: 'bx-group', label: 'Users', href: '/admin/users' },
    { icon: 'bx-cog', label: 'Settings', href: '/admin/settings' },
  ];

  const breadcrumbs = [
    { label: 'Analytics', href: '#' },
    { label: 'Shop', href: '#', active: true },
  ];

  const insightsData = [
    { icon: 'bx-calendar-check', value: '1,074', label: 'Paid Order' },
    { icon: 'bx-show-alt', value: '3,944', label: 'Site Visit' },
    { icon: 'bx-line-chart', value: '14,721', label: 'Searches' },
    { icon: 'bx-dollar-circle', value: '$6,742', label: 'Total Sales' },
  ];

  const handleDownloadCSV = () => {
    console.log('Download CSV clicked');
  };

  return (
    <AppLayout sidebarItems={sidebarItems}>
      <Head 
        title="Dashboard"
        breadcrumbs={breadcrumbs}
        reportButton={{
          label: 'Download CSV',
          icon: 'bx-cloud-download',
          onClick: handleDownloadCSV
        }}
      />
      
      <Insights items={insightsData} />

      <div className="bottom-data">
        <div className="orders">
          <div className="header">
            <i className='bx bx-receipt'></i>
            <h3>Recent Orders</h3>
            <i className='bx bx-filter'></i>
            <i className='bx bx-search'></i>
          </div>
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Order Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <img src="/logo.svg" alt="User" />
                  <p>John Doe</p>
                </td>
                <td>14-08-2023</td>
                <td><span className="status completed">Completed</span></td>
              </tr>
              <tr>
                <td>
                  <img src="/logo.svg" alt="User" />
                  <p>Jane Smith</p>
                </td>
                <td>14-08-2023</td>
                <td><span className="status pending">Pending</span></td>
              </tr>
              <tr>
                <td>
                  <img src="/logo.svg" alt="User" />
                  <p>Bob Johnson</p>
                </td>
                <td>14-08-2023</td>
                <td><span className="status process">Processing</span></td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="reminders">
          <div className="header">
            <i className='bx bx-note'></i>
            <h3>Reminders</h3>
            <i className='bx bx-filter'></i>
            <i className='bx bx-plus'></i>
          </div>
          <ul className="task-list">
            <li className="completed">
              <div className="task-title">
                <i className='bx bx-check-circle'></i>
                <p>Start Our Meeting</p>
              </div>
              <i className='bx bx-dots-vertical-rounded'></i>
            </li>
            <li className="completed">
              <div className="task-title">
                <i className='bx bx-check-circle'></i>
                <p>Analyse Our Site</p>
              </div>
              <i className='bx bx-dots-vertical-rounded'></i>
            </li>
            <li className="not-completed">
              <div className="task-title">
                <i className='bx bx-x-circle'></i>
                <p>Play Football</p>
              </div>
              <i className='bx bx-dots-vertical-rounded'></i>
            </li>
          </ul>
        </div>
      </div>
    </AppLayout>
  );
}

import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app/AppLayout';
import FilterPanel from '@/components/ui/FilterPanel';
import DataTable from '@/components/ui/DataTable';
import ActionDropdown from '@/components/ui/ActionDropdown';
import Tooltip from '@/components/ui/Tooltip';
import StatusBadge from '@/components/ui/StatusBadge';
import Pagination from '@/components/ui/Pagination';
import { useTranslation } from '@/lib/i18n';
import { formatCurrency as formatCurrencyUtil } from '@/lib/utils';

interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

interface Order {
  order_id: number;
  order_number: string;
  customer: Customer;
  customer_id: number;
  total_amount: string;
  status: string; // Changed from number to string for enum values
  payment_status: string; // Changed from number to string for enum values
  created_at: string;
}

interface OrdersData {
  data: Order[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from?: number;
  to?: number;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
}

interface PageProps {
  orders: OrdersData;
  filters: {
    status?: string;
    payment_status?: string;
    from_date?: string;
    to_date?: string;
    search?: string;
  };
  statusOptions: Record<string, string>; // Changed from number to string keys
  paymentStatusOptions: Record<string, string>; // Changed from number to string keys
  orderSummary: {
    totalCount: number;
    pendingCount: number;
    completedCount: number;
    cancelledCount: number;
  };
  currency?: string;
  exchangeRates?: Record<string, number>;
}

export default function Index({ orders, filters, statusOptions, paymentStatusOptions, orderSummary, currency = 'VND', exchangeRates = {} }: PageProps) {
  const { t, locale } = useTranslation();
  
  // Filter states
  const [search, setSearch] = useState(filters.search || '');
  const [status, setStatus] = useState(filters.status || '');
  const [paymentStatus, setPaymentStatus] = useState(filters.payment_status || '');
  const [fromDate, setFromDate] = useState(filters.from_date || '');
  const [toDate, setToDate] = useState(filters.to_date || '');

  // Apply filters
  const handleApplyFilters = () => {
    router.get('/admin/orders', {
      search: search || undefined,
      status: status || undefined,
      payment_status: paymentStatus || undefined,
      from_date: fromDate || undefined,
      to_date: toDate || undefined,
    }, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearch('');
    setStatus('');
    setPaymentStatus('');
    setFromDate('');
    setToDate('');
    router.get('/admin/orders');
  };

  // Auto-apply search filter on typing (debounced)
  // useEffect(() => {
  //   const delayTimer = setTimeout(() => {
  //     if (search !== filters.search) {
  //       router.get('/admin/orders', {
          
  //         search: search || undefined,
  //       }, {
  //         preserveState: true,
  //         preserveScroll: true,
  //       });
  //     }
  //   }, 500);

  //   return () => clearTimeout(delayTimer);
  // }, [search, filters.search]);

  // Format currency using utils function with currency support
  const formatCurrency = (amount: string | number) => {
    return formatCurrencyUtil(Number(amount), {
      from: 'USD',
      to: currency,
      rates: exchangeRates,
      locale,
      abbreviate: true
    });
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get action items for each order
  const getOrderActions = (order: Order) => [
    {
      label: 'View Details',
      icon: 'bx-show',
      onClick: () => router.visit(`/admin/orders/${order.order_id}`),
      color: 'primary' as const
    },
    {
      label: 'Assign Shipper',
      icon: 'bx-user-plus',
      onClick: () => alert('Assign shipper functionality - to be implemented'),
      color: 'success' as const,
      disabled: ['assigned_to_shipper', 'delivering', 'delivered', 'completed'].includes(order.status) // Disabled if shipped or delivered
    },
    {
      label: 'Update Status',
      icon: 'bx-edit',
      onClick: () => alert('Update status functionality - to be implemented'),
      color: 'warning' as const
    },
    {
      label: 'Process Refund',
      icon: 'bx-money',
      onClick: () => alert('Process refund functionality - to be implemented'),
      color: 'danger' as const,
      disabled: order.payment_status !== 'paid' // Only allow refunds for paid orders
    },
    {
      label: 'Print Invoice',
      icon: 'bx-printer',
      onClick: () => alert('Print invoice functionality - to be implemented'),
      color: 'primary' as const
    },
    {
      label: 'Cancel Order',
      icon: 'bx-x-circle',
      onClick: () => {
        if (confirm('Are you sure you want to cancel this order?')) {
          alert('Cancel order functionality - to be implemented');
        }
      },
      color: 'danger' as const,
      disabled: ['assigned_to_shipper', 'delivering', 'delivered', 'completed'].includes(order.status) // Disabled if shipped or delivered
    }
  ];

  // Table columns configuration
  const columns = [
    {
      header: 'Order ID',
      cell: (order: Order) => (
        <Tooltip content={`Order Number: ${order.order_number}`}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: '600', color: 'var(--primary)' }}>
              #{order.order_id}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--dark-grey)' }}>
              {order.order_number}
            </span>
          </div>
        </Tooltip>
      )
    },
    {
      header: 'Customer',
      cell: (order: Order) => (
        <Tooltip content={`Email: ${order.customer.email}`}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: '500' }}>
              {order.customer.first_name} {order.customer.last_name}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--dark-grey)' }}>
              {order.customer.email}
            </span>
          </div>
        </Tooltip>
      )
    },
    {
      header: 'Date',
      cell: (order: Order) => (
        <Tooltip content={`Created: ${formatDate(order.created_at)}`}>
          <span style={{ fontSize: '14px' }}>
            {formatDate(order.created_at)}
          </span>
        </Tooltip>
      )
    },
    {
      header: 'Total Amount',
      cell: (order: Order) => (
        <span style={{ fontWeight: '600', color: 'var(--success)' }}>
          {formatCurrency(order.total_amount)}
        </span>
      )
    },
    {
      header: 'Status',
      cell: (order: Order) => (
        <StatusBadge status={order.status} type="order" />
      )
    },
    {
      header: 'Payment',
      cell: (order: Order) => (
        <StatusBadge status={order.payment_status} type="payment" />
      )
    },
    {
      header: 'Actions',
      cell: (order: Order) => (
        <ActionDropdown actions={getOrderActions(order)} />
      )
    }
  ];

  // Breadcrumb configuration
  const breadcrumbs = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Orders', href: '/admin/orders', active: true }
  ];

  // Search configuration
  const searchConfig = {
    value: search,
    onChange: setSearch,
    placeholder: t('Search by order number, customer name or email...')
  };

  // Filter configurations
  const filterConfigs = [
    {
      value: status,
      onChange: setStatus,
      label: t('-- All Statuses --'),
      options: Object.entries(statusOptions).map(([value, label]) => ({
        value: value,
        label: label
      }))
    },
    {
      value: paymentStatus,
      onChange: setPaymentStatus,
      label: t('-- All Payment Statuses --'),
      options: Object.entries(paymentStatusOptions).map(([value, label]) => ({
        value: value,
        label: label
      }))
    }
  ];

  return (
    <AppLayout>
      <Head title="Orders Management" />

      {/* Header with filters */}
      <FilterPanel
        title="Orders Management"
        breadcrumbs={breadcrumbs}
        onApplyFilters={handleApplyFilters}
        searchConfig={searchConfig}
        filterConfigs={filterConfigs}
        reportButtonConfig={{
          label: t('Export Orders'),
          icon: 'bx-export',
          onClick: () => alert('Export functionality - to be implemented')
        }}
      />

      {/* Date Range Filters */}
      <div style={{
        background: 'var(--light)',
        padding: '16px 24px',
        borderRadius: '20px',
        marginBottom: '24px',
        display: 'flex',
        gap: '16px',
        alignItems: 'center',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <label style={{ fontSize: '14px', color: 'var(--dark)', fontWeight: '500' }}>
            {t('From')}:
          </label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid var(--grey)',
              borderRadius: '6px',
              fontSize: '14px',
              background: 'var(--light)',
              color: 'var(--dark)'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <label style={{ fontSize: '14px', color: 'var(--dark)', fontWeight: '500' }}>
            {t('To')}:
          </label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid var(--grey)',
              borderRadius: '6px',
              fontSize: '14px',
              background: 'var(--light)',
              color: 'var(--dark)'
            }}
          />
        </div>

        <button
          onClick={handleApplyFilters}
          style={{
            padding: '8px 16px',
            background: 'var(--primary)',
            color: 'var(--light)',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <i className="bx bx-filter"></i>
          {t('Apply')}
        </button>

        <button
          onClick={handleResetFilters}
          style={{
            padding: '8px 16px',
            background: 'var(--grey)',
            color: 'var(--dark)',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <i className="bx bx-reset"></i>
          {t('Reset')}
        </button>
      </div>

      {/* Orders Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{
          background: 'var(--light)',
          padding: '20px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            background: 'var(--light-primary)',
            color: 'var(--primary)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <i className="bx bx-receipt" style={{ fontSize: '24px' }}></i>
          </div>
          <div>
            <h4 style={{ margin: 0, color: 'var(--dark)', fontSize: '18px' }}>
              {orderSummary.totalCount}
            </h4>
            <p style={{ margin: 0, color: 'var(--dark-grey)', fontSize: '14px' }}>
              {t('Total Orders')}
            </p>
          </div>
        </div>

        <div style={{
          background: 'var(--light)',
          padding: '20px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            background: 'var(--light-warning)',
            color: 'var(--warning)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <i className="bx bx-time" style={{ fontSize: '24px' }}></i>
          </div>
          <div>
            <h4 style={{ margin: 0, color: 'var(--dark)', fontSize: '18px' }}>
              {orderSummary.pendingCount}
            </h4>
            <p style={{ margin: 0, color: 'var(--dark-grey)', fontSize: '14px' }}>
              {t('Pending Orders')}
            </p>
          </div>
        </div>

        <div style={{
          background: 'var(--light)',
          padding: '20px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            background: 'var(--light-success)',
            color: 'var(--success)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <i className="bx bx-check-circle" style={{ fontSize: '24px' }}></i>
          </div>
          <div>
            <h4 style={{ margin: 0, color: 'var(--dark)', fontSize: '18px' }}>
              {orderSummary.completedCount}
            </h4>
            <p style={{ margin: 0, color: 'var(--dark-grey)', fontSize: '14px' }}>
              {t('Completed Orders')}
            </p>
          </div>
        </div>

        <div style={{
          background: 'var(--light)',
          padding: '20px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            background: 'var(--light-danger)',
            color: 'var(--danger)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
          <i className="bx bx-x-circle" style={{ fontSize: '24px' }}></i>
          </div>
          <div>
            <h4 style={{ margin: 0, color: 'var(--dark)', fontSize: '18px' }}>
              {orderSummary.cancelledCount}
            </h4>
            <p style={{ margin: 0, color: 'var(--dark-grey)', fontSize: '14px' }}>
              {t('Cancelled Orders')}
            </p>
          </div>
        </div>
      </div>

      {/* Orders DataTable */}
      <DataTable
        columns={columns}
        data={orders.data}
        headerTitle="Orders List"
        headerIcon="bx-receipt"
        emptyMessage="No orders found"
      />

      {/* Pagination */}
      <Pagination links={orders.links} />
    </AppLayout>
  );
}

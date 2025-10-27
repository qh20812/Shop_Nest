import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app/AppLayout';
import FilterPanel from '@/Components/ui/FilterPanel';
import Pagination from '@/Components/ui/Pagination';
import { useTranslation } from '@/lib/i18n';
import OrderSummaryCards from '@/Components/admin/orders/OrderSummaryCards';
import OrderFilterPanel from '@/Components/admin/orders/OrderFilterPanel';
import OrderTable from '@/Components/admin/orders/OrderTable';

interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

interface Order {
  id: number;
  order_id: number;
  order_number: string;
  customer: Customer;
  customer_id: number;
  total_amount: number;
  status: string;
  payment_status: string;
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
  statusOptions: Record<string, string>;
  paymentStatusOptions: Record<string, string>;
  orderSummary: {
    totalCount: number;
    pendingCount: number;
    completedCount: number;
    cancelledCount: number;
  };

}

export default function Index({ 
  orders, 
  filters, 
  statusOptions, 
  paymentStatusOptions, 
  orderSummary, 
 
}: PageProps) {
  const { t } = useTranslation();
  
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



  // Date range filter handlers
  const handleDateRangeApply = (from: string, to: string) => {
    setFromDate(from);
    setToDate(to);
    router.get('/admin/orders', {
      search: search || undefined,
      status: status || undefined,
      payment_status: paymentStatus || undefined,
      from_date: from || undefined,
      to_date: to || undefined,
    }, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleDateRangeReset = () => {
    setFromDate('');
    setToDate('');
    router.get('/admin/orders', {
      search: search || undefined,
      status: status || undefined,
      payment_status: paymentStatus || undefined,
    }, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  // Order action handlers
  const handleViewDetails = (orderId: number) => {
    router.get(`/admin/orders/${orderId}`);
  };

  const handleAssignShipper = (orderId: number) => {
    router.get(`/admin/orders/${orderId}/assign-shipper`);
  };

  const handleUpdateStatus = (orderId: number) => {
    router.get(`/admin/orders/${orderId}/update-status`);
  };

  const handleProcessRefund = (orderId: number) => {
    router.post(`/admin/orders/${orderId}/refund`);
  };

  const handlePrintInvoice = (orderId: number) => {
    window.open(`/admin/orders/${orderId}/invoice`, '_blank');
  };

  const handleCancelOrder = (orderId: number) => {
    if (confirm(t('Are you sure you want to cancel this order?'))) {
      router.post(`/admin/orders/${orderId}/cancel`);
    }
  };

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
      <OrderFilterPanel
        fromDate={fromDate}
        toDate={toDate}
        onApply={handleDateRangeApply}
        onReset={handleDateRangeReset}
      />

      {/* Orders Summary Cards */}
      <OrderSummaryCards orderSummary={orderSummary} />

      {/* Orders DataTable */}
      <OrderTable
        orders={orders.data}
        onViewDetails={handleViewDetails}
        onAssignShipper={handleAssignShipper}
        onUpdateStatus={handleUpdateStatus}
        onProcessRefund={handleProcessRefund}
        onPrintInvoice={handlePrintInvoice}
        onCancelOrder={handleCancelOrder}
      />

      {/* Pagination */}
      <Pagination 
        links={orders.links}
        filters={{
          search,
          status,
          payment_status: paymentStatus,
          from_date: fromDate,
          to_date: toDate
        }}
        preserveState={true}
        preserveScroll={true}
      />
    </AppLayout>
  );
}
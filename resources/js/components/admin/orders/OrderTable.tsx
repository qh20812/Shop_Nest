import React from 'react';
import DataTable from '../../ui/DataTable';
import StatusBadge from '../../ui/StatusBadge';
import ActionDropdown from '../../ui/ActionDropdown';
import { useTranslation } from '@/lib/i18n';

interface Customer {
  first_name: string;
  last_name: string;
  email: string;
}

interface Order {
  id: number;
  order_id: number;
  order_number: string;
  customer: Customer;
  total_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
}

interface OrderTableProps {
  orders: Order[];
  onViewDetails: (orderId: number) => void;
  onAssignShipper: (orderId: number) => void;
  onUpdateStatus: (orderId: number) => void;
  onProcessRefund: (orderId: number) => void;
  onPrintInvoice: (orderId: number) => void;
  onCancelOrder: (orderId: number) => void;
}

export default function OrderTable({
  orders,
  onViewDetails,
  onAssignShipper,
  onUpdateStatus,
  onProcessRefund,
  onPrintInvoice,
  onCancelOrder
}: OrderTableProps) {
  const { t } = useTranslation();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getOrderActions = (order: Order) => [
    {
      label: 'View Details',
      icon: 'bx-show',
      onClick: () => onViewDetails(order.order_id),
      color: 'primary' as const
    },
    {
      label: 'Assign Shipper',
      icon: 'bx-user-plus',
      onClick: () => onAssignShipper(order.order_id),
      color: 'success' as const,
      disabled: ['assigned_to_shipper', 'delivering', 'delivered', 'completed'].includes(order.status)
    },
    {
      label: 'Update Status',
      icon: 'bx-edit',
      onClick: () => onUpdateStatus(order.order_id),
      color: 'warning' as const
    },
    {
      label: 'Process Refund',
      icon: 'bx-money',
      onClick: () => onProcessRefund(order.order_id),
      color: 'danger' as const,
      disabled: order.payment_status !== 'paid'
    },
    {
      label: 'Print Invoice',
      icon: 'bx-printer',
      onClick: () => onPrintInvoice(order.order_id),
      color: 'primary' as const
    },
    {
      label: 'Cancel Order',
      icon: 'bx-x-circle',
      onClick: () => onCancelOrder(order.order_id),
      color: 'danger' as const,
      disabled: ['assigned_to_shipper', 'delivering', 'delivered', 'completed'].includes(order.status)
    }
  ];

  const columns = [
    {
      header: 'Order Number',
      cell: (order: Order) => (
        <span style={{ fontFamily: 'monospace', fontSize: '14px' }}>
          {order.order_number}
        </span>
      )
    },
    {
      header: 'Customer',
      cell: (order: Order) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontWeight: '500' }}>
            {order.customer.first_name} {order.customer.last_name}
          </span>
          <span style={{ fontSize: '12px', color: 'var(--dark-grey)' }}>
            {order.customer.email}
          </span>
        </div>
      )
    },
    {
      header: 'Date',
      cell: (order: Order) => (
        <span style={{ fontSize: '14px' }}>
          {formatDate(order.created_at)}
        </span>
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

  return (
    <DataTable
      columns={columns}
      data={orders}
      headerTitle="Orders List"
      headerIcon="bx-receipt"
      emptyMessage="No orders found"
    />
  );
}
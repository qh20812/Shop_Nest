import React from 'react';
import ActionDropdown from '../../ui/ActionDropdown';

interface Order {
  order_id: number;
  order_number: string;
  status: string;
  payment_status: string;
}

interface OrderActionsDropdownProps {
  order: Order;
  onViewDetails: (orderId: number) => void;
  onAssignShipper: (orderId: number) => void;
  onUpdateStatus: (orderId: number) => void;
  onProcessRefund: (orderId: number) => void;
  onPrintInvoice: (orderId: number) => void;
  onCancelOrder: (orderId: number) => void;
}

export default function OrderActionsDropdown({
  order,
  onViewDetails,
  onAssignShipper,
  onUpdateStatus,
  onProcessRefund,
  onPrintInvoice,
  onCancelOrder
}: OrderActionsDropdownProps) {
  const actions = [
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

  return <ActionDropdown actions={actions} />;
}

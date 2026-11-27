import { usePage } from '@inertiajs/react';
import { Eye, Receipt } from 'lucide-react';
import React from 'react';

import ActionButtons, { type ActionConfig } from '@/components/ui/action-buttons';
import DataTable from '@/components/ui/data-table';
import StatusBadge from '@/components/ui/status-badge';
import { formatDateTime, formatOrderCode } from '@/lib/format';
import { useTranslation } from '@/lib/i18n';
import { resolveCurrencyCode } from '@/lib/utils';

import styles from './Orders.module.css';

interface Customer {
    first_name: string;
    last_name: string;
    email: string;
}

interface Order {
    id: number;
    order_id: number;
    order_number: string;
    customer?: Customer | null;
    total_amount: number;
    total_amount_base?: number;
    currency?: string;
    status: string;
    payment_status: string;
    created_at: string;
}

interface OrderTableProps {
    orders: Order[];
    headerMeta?: React.ReactNode;
    emptyMessage?: string;
}

export default function OrderTable({ orders, headerMeta, emptyMessage }: OrderTableProps) {
    const { t } = useTranslation();
    const { props } = usePage<{ currency?: string | { code?: string } }>();
    const fallbackCurrency = resolveCurrencyCode(props.currency);

    const formatAmount = React.useCallback(
        (amount: number, currencyOverride?: string) => {
            const currencyCode = currencyOverride ?? fallbackCurrency;

            return new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: currencyCode,
                maximumFractionDigits: 0,
            }).format(amount);
        },
        [fallbackCurrency],
    );

    const columns = [
        {
            key: 'order',
            header: t('Order'),
            cell: (order: Order) => (
                <div className={styles.orderCell}>
                    <span className={styles.orderNumber}>{formatOrderCode(order.order_number)}</span>
                    <span className={styles.orderDate}>{formatDateTime(order.created_at)}</span>
                </div>
            ),
        },
        {
            key: 'customer',
            header: t('Customer'),
            cell: (order: Order) => {
                const customerName = order.customer ? `${order.customer.first_name} ${order.customer.last_name}` : t('Guest Customer');

                return (
                    <div>
                        <span className={styles.customerName}>{customerName}</span>
                        {order.customer?.email && <span className={styles.customerMeta}>{order.customer.email}</span>}
                    </div>
                );
            },
        },
        {
            key: 'total_amount',
            header: t('Total Amount'),
            align: 'right' as const,
            cell: (order: Order) => <span className={styles.amount}>{formatAmount(order.total_amount, order.currency)}</span>,
        },
        {
            key: 'status',
            header: t('Status'),
            cell: (order: Order) => <StatusBadge status={order.status} type="order" />,
        },
        {
            key: 'payment_status',
            header: t('Payment'),
            cell: (order: Order) => <StatusBadge status={order.payment_status} type="payment" />,
        },
        {
            key: 'actions',
            header: t('Actions'),
            cell: (order: Order) => {
                const actions: ActionConfig[] = [
                    {
                        type: 'link',
                        href: `/admin/orders/${order.order_id}`,
                        variant: 'primary',
                        icon: Eye,
                        label: t('View'),
                    },
                ];

                return <ActionButtons actions={actions} />;
            },
        },
    ];

    return (
        <DataTable
            columns={columns}
            data={orders}
            headerTitle={t('Orders List')}
            headerIcon={Receipt}
            headerMeta={headerMeta}
            emptyMessage={emptyMessage}
        />
    );
}

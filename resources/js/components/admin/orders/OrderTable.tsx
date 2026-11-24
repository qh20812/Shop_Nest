import { usePage } from '@inertiajs/react';
import React from 'react';

import DataTable from '@/components/ui/data-table';
import StatusBadge from '@/components/ui/status-badge';
import { formatDateTime } from '@/lib/format';
import { useTranslation } from '@/lib/i18n';
import { resolveCurrencyCode } from '@/lib/utils';

import styles from '../admin.module.css';

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
    total_amount_base?: number;
    currency?: string;
    status: string;
    payment_status: string;
    created_at: string;
}

interface OrderTableProps {
    orders: Order[];
}

export default function OrderTable({ orders }: OrderTableProps) {
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
            key: 'order_number',
            header: t('Order Number'),
            cell: (order: Order) => <span className={styles.numeric}>{order.order_number}</span>,
        },
        {
            key: 'customer',
            header: t('Customer'),
            cell: (order: Order) => (
                <div className={styles.cellStack}>
                    <span className={styles.cellTitle}>
                        {order.customer.first_name} {order.customer.last_name}
                    </span>
                    <span className={styles.cellMeta}>{order.customer.email}</span>
                </div>
            ),
        },
        {
            key: 'created_at',
            header: t('Date'),
            cell: (order: Order) => <span className={styles.numeric}>{formatDateTime(order.created_at)}</span>,
        },
        {
            key: 'total_amount',
            header: t('Total Amount'),
            align: 'right' as const,
            cell: (order: Order) => <span className={styles.price}>{formatAmount(order.total_amount, order.currency)}</span>,
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
    ];

    return <DataTable columns={columns} data={orders} headerTitle={t('Orders List')} emptyMessage={t('No orders found')} />;
}

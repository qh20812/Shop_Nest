import Toast from '@/components/admin/users/Toast';
import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import { Button } from '@/components/ui/button';
import { DataTable, type DataTableColumn } from '@/components/ui/data-table';
import FilterPanel from '@/components/ui/filter-panel';
import Pagination from '@/components/ui/pagination';
import StatusBadge from '@/components/ui/status-badge';
import { formatDateTime, formatVnd } from '@/lib/format';
import { useTranslation } from '@/lib/i18n';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ShoppingCart } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import styles from '../seller.module.css';

interface Customer {
    id: number;
    first_name: string;
    last_name: string;
    email?: string;
    phone?: string;
}

interface Order {
    order_id: number;
    order_number: string;
    total_amount: number;
    status: number;
    created_at: string;
    customer: Customer;
}

interface PageProps extends Record<string, unknown> {
    orders: {
        data: Order[];
        links: { url: string | null; label: string; active: boolean }[];
        meta?: { total?: number; per_page?: number; current_page?: number };
    };
    filters?: { search?: string; status?: string };
    stats?: { [k: string]: number };
    flash?: { success?: string; error?: string };
}

const STATUS_OPTIONS = [
    { value: '', label: 'All' },
    { value: '0', label: 'Pending' },
    { value: '1', label: 'Processing' },
    { value: '2', label: 'Shipped' },
    { value: '3', label: 'Delivered' },
    { value: '4', label: 'Cancelled' },
];

export default function Index() {
    const { t } = useTranslation();
    const { orders, filters = {}, stats, flash } = usePage<PageProps>().props;

    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    useEffect(() => {
        if (flash?.success) setToast({ type: 'success', message: flash.success });
        else if (flash?.error) setToast({ type: 'error', message: flash.error });
    }, [flash]);

    const applyFilters = (pageUrl?: string) => {
        const url = pageUrl || '/seller/orders';
        router.get(
            url,
            { search, status },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const orderColumns = useMemo<DataTableColumn<Order>[]>(
        () => [
            {
                key: 'order_number',
                header: t('Order Code'),
                cell: (order) => <span className={styles.numeric}>#{order.order_number}</span>,
            },
            {
                key: 'customer',
                header: t('Customer'),
                cell: (order) => (
                    <div className={styles.cellStack}>
                        <span className={styles.cellTitle}>
                            {order.customer.first_name} {order.customer.last_name}
                        </span>
                        {order.customer.email && <span className={styles.cellMeta}>{order.customer.email}</span>}
                    </div>
                ),
            },
            {
                key: 'created_at',
                header: t('Created At'),
                cell: (order) => <span className={styles.numeric}>{formatDateTime(order.created_at)}</span>,
            },
            {
                key: 'total_amount',
                header: t('Total Amount'),
                align: 'right',
                cell: (order) => <span className={styles.price}>{formatVnd(order.total_amount)}</span>,
            },
            {
                key: 'status',
                header: t('Status'),
                cell: (order) => <StatusBadge status={order.status} type="order" />,
            },
            {
                key: 'action',
                header: t('Action'),
                align: 'right',
                cell: (order) => (
                    <Button asChild variant="secondary" size="sm">
                        <Link href={`/seller/orders/${order.order_id}`}>{t('View Details')}</Link>
                    </Button>
                ),
            },
        ],
        [t],
    );

    return (
        <WorkspaceLayout>
            <Head title={t('Orders List')} />

            {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

            <FilterPanel
                title={t('Orders Management')}
                breadcrumbs={[
                    { label: t('Seller Dashboard'), href: '/seller/dashboard' },
                    { label: t('Orders'), href: '/seller/orders', active: true },
                ]}
                searchConfig={{
                    value: search,
                    onChange: setSearch,
                    placeholder: t('Search by order code or customer name...'),
                }}
                filterConfigs={[
                    {
                        value: status,
                        onChange: setStatus,
                        label: t('-- Status --'),
                        options: STATUS_OPTIONS.map((option) => ({
                            value: option.value,
                            label: t(option.label),
                        })),
                    },
                ]}
                onApplyFilters={() => applyFilters('/seller/orders')}
            />

            {stats && Object.keys(stats).length > 0 && (
                <div className={styles.actions}>
                    {Object.entries(stats).map(([key, value]) => (
                        <div key={key} className={styles.metricCard}>
                            <div className={styles.metricBody}>
                                <span className={styles.metricLabel}>{key}</span>
                                <span className={styles.metricValue}>{value}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <DataTable
                columns={orderColumns}
                data={orders?.data || []}
                headerTitle={t('Orders List')}
                headerIcon={ShoppingCart}
                emptyMessage={t('No orders found')}
            />

            <Pagination links={orders?.links || []} filters={{ search, status }} />
        </WorkspaceLayout>
    );
}

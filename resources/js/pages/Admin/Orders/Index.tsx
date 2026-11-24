import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

import OrderFilterPanel from '@/components/admin/orders/OrderFilterPanel';
import OrderSummaryCards from '@/components/admin/orders/OrderSummaryCards';
import OrderTable from '@/components/admin/orders/OrderTable';
import FilterPanel from '@/components/ui/filter-panel';
import Pagination from '@/components/ui/pagination';
import AppLayout from '@/layouts/app/AppLayout';
import { useTranslation } from '@/lib/i18n';

import styles from '@/components/admin/admin.module.css';

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
    total_amount_base?: number;
    currency?: string;
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
    currencyCode?: string;
    conversionRate?: number;
}

export default function Index({ orders, filters, statusOptions, paymentStatusOptions, orderSummary }: PageProps) {
    const { t } = useTranslation();

    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [paymentStatus, setPaymentStatus] = useState(filters.payment_status || '');
    const [fromDate, setFromDate] = useState(filters.from_date || '');
    const [toDate, setToDate] = useState(filters.to_date || '');

    const handleApplyFilters = () => {
        router.get(
            '/admin/orders',
            {
                search: search || undefined,
                status: status || undefined,
                payment_status: paymentStatus || undefined,
                from_date: fromDate || undefined,
                to_date: toDate || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleDateRangeApply = (from: string, to: string) => {
        setFromDate(from);
        setToDate(to);
        router.get(
            '/admin/orders',
            {
                search: search || undefined,
                status: status || undefined,
                payment_status: paymentStatus || undefined,
                from_date: from || undefined,
                to_date: to || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleDateRangeReset = () => {
        setFromDate('');
        setToDate('');
        router.get(
            '/admin/orders',
            {
                search: search || undefined,
                status: status || undefined,
                payment_status: paymentStatus || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    return (
        <AppLayout>
            <Head title={t('Orders Management')} />

            <div className={styles.stack}>
                <FilterPanel
                    title={t('Orders Management')}
                    breadcrumbs={[
                        { label: t('Dashboard'), href: '/admin/dashboard' },
                        { label: t('Orders'), href: '/admin/orders', active: true },
                    ]}
                    onApplyFilters={handleApplyFilters}
                    searchConfig={{
                        value: search,
                        onChange: setSearch,
                        placeholder: t('Search by order number, customer name or email...'),
                    }}
                    filterConfigs={[
                        {
                            value: status,
                            onChange: setStatus,
                            label: t('-- All Statuses --'),
                            options: Object.entries(statusOptions).map(([value, label]) => ({ value, label })),
                        },
                        {
                            value: paymentStatus,
                            onChange: setPaymentStatus,
                            label: t('-- All Payment Statuses --'),
                            options: Object.entries(paymentStatusOptions).map(([value, label]) => ({ value, label })),
                        },
                    ]}
                >
                    <OrderFilterPanel fromDate={fromDate} toDate={toDate} onApply={handleDateRangeApply} onReset={handleDateRangeReset} />
                </FilterPanel>

                <OrderSummaryCards orderSummary={orderSummary} />

                <OrderTable orders={orders.data} />

                <Pagination
                    links={orders.links}
                    filters={{
                        search,
                        status,
                        payment_status: paymentStatus,
                        from_date: fromDate,
                        to_date: toDate,
                    }}
                    preserveState
                    preserveScroll
                />
            </div>
        </AppLayout>
    );
}

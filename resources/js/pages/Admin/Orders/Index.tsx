import { Head, router } from '@inertiajs/react';
import { RotateCcw, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

import OrderFilterPanel from '@/components/admin/orders/OrderFilterPanel';
import OrderSummaryCards from '@/components/admin/orders/OrderSummaryCards';
import OrderTable from '@/components/admin/orders/OrderTable';
import Toast from '@/components/admin/users/Toast';
import { PageHeader } from '@/components/layout/PageHeader';
import WorkspaceLayout from '@/components/layout/WorkspaceLayout';
import { Button } from '@/components/ui/button';
import FormField from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import Pagination from '@/components/ui/pagination';
import { Select } from '@/components/ui/select';
import { cx } from '@/lib/cx';
import { formatNumber } from '@/lib/format';
import { useTranslation } from '@/lib/i18n';

import adminStyles from '@/components/admin/admin.module.css';
import styles from '@/components/admin/orders/Orders.module.css';

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
    flash?: { success?: string; error?: string };
    currencyCode?: string;
    conversionRate?: number;
    [key: string]: unknown;
}

export default function Index({ orders, filters = {}, statusOptions = {}, paymentStatusOptions = {}, orderSummary, flash }: PageProps) {
    const { t } = useTranslation();

    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [paymentStatus, setPaymentStatus] = useState(filters.payment_status || '');
    const [fromDate, setFromDate] = useState(filters.from_date || '');
    const [toDate, setToDate] = useState(filters.to_date || '');
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    useEffect(() => {
        setSearch(filters.search || '');
        setStatus(filters.status || '');
        setPaymentStatus(filters.payment_status || '');
        setFromDate(filters.from_date || '');
        setToDate(filters.to_date || '');
    }, [filters.search, filters.status, filters.payment_status, filters.from_date, filters.to_date]);

    useEffect(() => {
        if (flash?.success) {
            setToast({ type: 'success', message: flash.success });
        } else if (flash?.error) {
            setToast({ type: 'error', message: flash.error });
        }
    }, [flash?.success, flash?.error]);

    const applyFilters = () => {
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

    const resetFilters = () => {
        setSearch('');
        setStatus('');
        setPaymentStatus('');
        setFromDate('');
        setToDate('');

        router.get('/admin/orders', {}, { preserveState: true, preserveScroll: true });
    };

    const visibleTotal = orders.total ?? 0;
    const hasFilters = Boolean(filters.search || filters.status || filters.payment_status || filters.from_date || filters.to_date);
    const rangeLabel =
        visibleTotal > 0 ? `${formatNumber(orders.from ?? 0)}-${formatNumber(orders.to ?? 0)} / ${formatNumber(visibleTotal)}` : formatNumber(0);

    return (
        <WorkspaceLayout>
            <Head title={t('Orders Management')} />

            {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

            <div className={adminStyles.stack}>
                <PageHeader
                    breadcrumbs={[
                        { label: t('Dashboard'), href: '/admin/dashboard' },
                        { label: t('Orders'), current: true },
                    ]}
                    title={t('Orders Management')}
                    count={formatNumber(visibleTotal)}
                />

                <form
                    className={cx(styles.filters, 'sn-glass-surface')}
                    aria-label={t('Filters')}
                    onSubmit={(event) => {
                        event.preventDefault();
                        applyFilters();
                    }}
                >
                    <div className={styles.searchField}>
                        <FormField label={t('Search')} htmlFor="order-search">
                            <Input
                                id="order-search"
                                type="search"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder={t('Search by order number, customer name or email...')}
                                leadingIcon={Search}
                                surface="glass"
                            />
                        </FormField>
                    </div>

                    <div className={styles.statusField}>
                        <FormField label={t('Status')} htmlFor="order-status-filter">
                            <Select id="order-status-filter" value={status} onChange={(event) => setStatus(event.target.value)} surface="glass">
                                <option value="">{t('All Statuses')}</option>
                                {Object.entries(statusOptions).map(([value, label]) => (
                                    <option key={value} value={value}>
                                        {t(label)}
                                    </option>
                                ))}
                            </Select>
                        </FormField>
                    </div>

                    <div className={styles.paymentField}>
                        <FormField label={t('Payment Status')} htmlFor="order-payment-filter">
                            <Select
                                id="order-payment-filter"
                                value={paymentStatus}
                                onChange={(event) => setPaymentStatus(event.target.value)}
                                surface="glass"
                            >
                                <option value="">{t('All Payment Statuses')}</option>
                                {Object.entries(paymentStatusOptions).map(([value, label]) => (
                                    <option key={value} value={value}>
                                        {t(label)}
                                    </option>
                                ))}
                            </Select>
                        </FormField>
                    </div>

                    <div className={styles.dates}>
                        <OrderFilterPanel fromDate={fromDate} toDate={toDate} onFromDateChange={setFromDate} onToDateChange={setToDate} />
                    </div>

                    <div className={styles.filterActions}>
                        <Button type="button" variant="secondary" onClick={resetFilters}>
                            <RotateCcw aria-hidden="true" />
                            {t('Reset')}
                        </Button>
                        <Button type="submit" variant="primary" leftIcon={Search}>
                            {t('Apply')}
                        </Button>
                    </div>
                </form>

                <OrderSummaryCards orderSummary={orderSummary} />

                <div className={styles.table}>
                    <OrderTable
                        orders={orders.data}
                        headerMeta={rangeLabel}
                        emptyMessage={hasFilters ? t('No orders match the filters.') : t('No orders found')}
                    />
                </div>

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
        </WorkspaceLayout>
    );
}

import { Head, router, usePage } from '@inertiajs/react';
import { ClipboardList } from 'lucide-react';
import * as React from 'react';

import { OrderTable } from '@/components/commerce/OrderTable';
import { AccountLayout } from '@/components/layout/AccountLayout';
import { SearchInput } from '@/components/ui/search-input';
import { Tabs } from '@/components/ui/tabs';
import { useTranslation } from '@/lib/i18n';

import styles from '../customer.module.css';

interface OrderRow {
    id: number;
    code: string;
    status: string;
    payment_status: string;
    total: number;
    created_at: string;
    can_cancel?: boolean;
}

interface PageProps extends Record<string, unknown> {
    orders?: OrderRow[];
    filters?: {
        search?: string;
        status?: string;
    };
}

const statusTabKeys = [
    { value: 'all', labelKey: 'All' },
    { value: 'pending', labelKey: 'Pending' },
    { value: 'processing', labelKey: 'Processing' },
    { value: 'shipped', labelKey: 'Delivering' },
    { value: 'delivered', labelKey: 'Delivered' },
    { value: 'canceled', labelKey: 'Cancelled' },
];

export default function OrdersIndex() {
    const { t } = useTranslation();
    const { orders = [], filters = {} } = usePage<PageProps>().props;
    const [search, setSearch] = React.useState(filters.search ?? '');
    const activeStatus = filters.status ?? 'all';

    const visit = (next: { search?: string; status?: string }) => {
        router.get(
            '/user/orders',
            {
                search: next.search ?? search,
                status: next.status ?? activeStatus,
            },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    React.useEffect(() => {
        const timer = window.setTimeout(() => {
            if (search !== (filters.search ?? '')) {
                visit({ search });
            }
        }, 450);

        return () => window.clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const handleStatus = (status: string) => {
        visit({ status });
    };

    const tableRows = orders.map((order) => ({
        id: order.id,
        code: order.code,
        status: order.status,
        paymentStatus: order.payment_status,
        total: order.total,
        createdAt: order.created_at,
        canCancel: order.can_cancel,
    }));

    return (
        <AccountLayout
            active="orders"
            breadcrumbs={[{ label: t('Market'), href: '/' }, { label: t('Account') }, { label: t('Orders') }]}
            eyebrow={t('Account')}
            title={t('My orders')}
            description={t('Track status, payment and delivery progress for every order you placed.')}
            count={t(':count orders', { count: orders.length })}
            actions={
                <div className={styles.searchWrap}>
                    <SearchInput
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        onSubmit={(value) => visit({ search: value })}
                        onClear={() => {
                            setSearch('');
                            visit({ search: '' });
                        }}
                        placeholder={t('Search by order code...')}
                        size="sm"
                        aria-label={t('Search orders')}
                    />
                </div>
            }
        >
            <Head title={t('My orders')} />

            <div className={styles.stack}>
                <Tabs
                    items={statusTabKeys.map((tab) => ({
                        value: tab.value,
                        label: t(tab.labelKey),
                        icon: tab.value === 'all' ? ClipboardList : undefined,
                    }))}
                    value={activeStatus}
                    onValueChange={handleStatus}
                    variant="filter"
                    ariaLabel={t('Filter orders by status')}
                />

                <OrderTable orders={tableRows} emptyDescription={t('Your first order will appear here once you place it.')} />

                <p className={styles.fineprint}>{t('The 50 newest purchases are shown. Use search for older codes.')}</p>
            </div>
        </AccountLayout>
    );
}

import { Head, router, usePage } from '@inertiajs/react';
import { RotateCcw } from 'lucide-react';
import { useMemo, useState } from 'react';

import Alert from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import DataTable from '@/components/ui/data-table';
import FilterPanel from '@/components/ui/filter-panel';
import Pagination from '@/components/ui/pagination';
import AppLayout from '@/layouts/app/AppLayout';
import { formatDateTime } from '@/lib/format';
import { useTranslation } from '@/lib/i18n';

import styles from '@/components/admin/admin.module.css';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Order {
    id: number;
    code: string;
}

interface ReturnRequest {
    return_id: number;
    description: string;
    status: number;
    customer: User;
    order: Order;
    created_at: string;
}

interface PageProps {
    returns: {
        data: ReturnRequest[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: { search?: string; status?: string };
    flash?: { success?: string; error?: string };
    [key: string]: unknown;
}

const statusMeta: Record<number, { label: string; tone: 'warning' | 'accent' | 'danger' | 'success' | 'neutral' }> = {
    1: { label: 'Pending', tone: 'warning' },
    2: { label: 'Approved', tone: 'accent' },
    3: { label: 'Rejected', tone: 'danger' },
    4: { label: 'Refunded', tone: 'success' },
    5: { label: 'Exchanged', tone: 'success' },
};

export default function Index() {
    const { t } = useTranslation();
    const { returns = { data: [], links: [] }, filters = {}, flash = {} } = usePage<PageProps>().props;

    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');

    const applyFilters = () => {
        router.get('/admin/returns', { search, status }, { preserveState: true });
    };

    const columns = useMemo(
        () => [
            {
                key: 'return_id',
                header: 'ID',
                cell: (request: ReturnRequest) => <span className={styles.numeric}>#{request.return_id}</span>,
            },
            {
                key: 'customer',
                header: t('Customer'),
                cell: (request: ReturnRequest) => (
                    <div className={styles.cellStack}>
                        <span className={styles.cellTitle}>{request.customer?.name}</span>
                        <span className={styles.cellMeta}>{request.customer?.email}</span>
                    </div>
                ),
            },
            {
                key: 'order',
                header: t('Order'),
                cell: (request: ReturnRequest) => <span className={styles.numeric}>{request.order?.code ? `#${request.order.code}` : '-'}</span>,
            },
            {
                key: 'description',
                header: t('Description'),
                cell: (request: ReturnRequest) => <span className={styles.brandMeta}>{request.description}</span>,
            },
            {
                key: 'status',
                header: t('Status'),
                cell: (request: ReturnRequest) => {
                    const meta = statusMeta[request.status] ?? { label: 'Unknown', tone: 'neutral' as const };
                    return <Badge tone={meta.tone}>{t(meta.label)}</Badge>;
                },
            },
            {
                key: 'created_at',
                header: t('Created Date'),
                cell: (request: ReturnRequest) => <span className={styles.numeric}>{formatDateTime(request.created_at)}</span>,
            },
        ],
        [t],
    );

    return (
        <AppLayout>
            <Head title={t('Return Management')} />

            {flash?.success && <Alert tone="success" title={flash.success} className={styles.stackTight} />}
            {flash?.error && <Alert tone="danger" title={flash.error} className={styles.stackTight} />}

            <FilterPanel
                title={t('Return Management')}
                breadcrumbs={[
                    { label: t('Dashboard'), href: '/admin/dashboard' },
                    { label: t('Returns'), href: '/admin/returns', active: true },
                ]}
                searchConfig={{
                    value: search,
                    onChange: setSearch,
                    placeholder: t('Search returns...'),
                }}
                filterConfigs={[
                    {
                        value: status,
                        onChange: setStatus,
                        label: t('-- All Statuses --'),
                        options: [
                            { value: '1', label: t('Pending') },
                            { value: '2', label: t('Approved') },
                            { value: '3', label: t('Rejected') },
                            { value: '4', label: t('Refunded') },
                            { value: '5', label: t('Exchanged') },
                        ],
                    },
                ]}
                onApplyFilters={applyFilters}
            />

            <DataTable
                columns={columns}
                data={returns.data}
                headerTitle={t('Return Requests')}
                headerIcon={RotateCcw}
                emptyMessage={t('No return requests found')}
            />

            <Pagination links={returns.links} filters={{ search, status }} preserveState preserveScroll />
        </AppLayout>
    );
}

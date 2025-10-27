import Toast from '@/Components/admin/users/Toast';
import DataTable from '@/Components/ui/DataTable';
import FilterPanel from '@/Components/ui/FilterPanel';
import Pagination from '@/Components/ui/Pagination';
import AppLayout from '@/layouts/app/AppLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

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

interface PageProps {
    orders: {
        data: Order[];
        links: { url: string | null; label: string; active: boolean }[];
        meta?: { total?: number; per_page?: number; current_page?: number };
    };
    filters?: { search?: string; status?: string };
    stats?: { [k: string]: number };
    flash?: { success?: string; error?: string };
    [key: string]: unknown;
}


const STATUS_OPTIONS = [
    { value: '', label: 'All' },
    { value: '0', label: 'Pending' },
    { value: '1', label: 'Processing' },
    { value: '2', label: 'Shipped' },
    { value: '3', label: 'Delivered' },
    { value: '4', label: 'Cancelled' },
];


const getStatusInfo = (status: number) => {
    switch (Number(status)) {
        case 0:
            return { text: 'Pending', className: 'bg-yellow-100 text-yellow-800' };
        case 1:
            return { text: 'Processing', className: 'bg-blue-100 text-blue-800' };
        case 2:
            return { text: 'Shipped', className: 'bg-indigo-100 text-indigo-800' };
        case 3:
            return { text: 'Delivered', className: 'bg-green-100 text-green-800' };
        case 4:
            return { text: 'Cancelled', className: 'bg-red-100 text-red-800' };
        default:
            return { text: 'Unknown', className: 'bg-gray-100 text-gray-800' };
    }
};

export default function Index() {
    const { orders, filters = {}, stats, flash } = usePage<PageProps>().props;

    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (flash?.success) setToast({ type: 'success', message: flash.success });
        else if (flash?.error) setToast({ type: 'error', message: flash.error });
    }, [flash]);

    const applyFilters = (pageUrl?: string) => {
        setLoading(true);
        const url = pageUrl || '/seller/orders';
        router.get(
            url,
            { search, status },
            {
                preserveState: true,
                replace: true,
                onFinish: () => setLoading(false),
            },
        );
    };

    const orderColumns = [
        {
            header: 'Order Code',
            cell: (order: Order) => `#${order.order_number}`,
        },
        {
            header: 'Customer',
            cell: (order: Order) => `${order.customer.first_name} ${order.customer.last_name}`,
        },
        {
            header: 'Created At',
            cell: (order: Order) => new Date(order.created_at).toLocaleString('en-US'),
        },
        {
            header: 'Total Amount',
            cell: (order: Order) => `$${order.total_amount.toLocaleString('en-US')}`,
        },
        {
            header: 'Status',
            cell: (order: Order) => {
                const s = getStatusInfo(order.status);
                return (
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${s.className}`}>
                        {s.text}
                    </span>
                );
            },
        },
        {
            header: 'Action',
            cell: (order: Order) => (
                <Link
                    href={`/seller/orders/${order.order_id}`}
                    className="text-blue-500 hover:underline"
                >
                    View Details
                </Link>
            ),
        },
    ];

    return (
        <AppLayout>
            <Head title="Orders List" />

            {/* Stats summary (if provided by backend) */}
            {stats && (
                <div className="mb-4 flex flex-wrap gap-3">
                    {Object.entries(stats).map(([k, v]) => (
                        <div key={k} className="rounded border bg-gray-50 px-3 py-2">
                            <div className="text-sm font-medium">{k}</div>
                            <div className="text-lg font-bold">{v}</div>
                        </div>
                    ))}
                </div>
            )}

            {/* Toast message */}
            {toast && (
                <Toast
                    type={toast.type}
                    message={toast.message}
                    onClose={() => setToast(null)}
                />
            )}

            {/* Filter panel */}
            <FilterPanel
                title="Orders Management"
                breadcrumbs={[
                    { label: 'Seller Dashboard', href: '/seller/dashboard' },
                    { label: 'Orders', href: '/seller/orders', active: true },
                ]}
                searchConfig={{
                    value: search,
                    onChange: setSearch,
                    placeholder: 'Search by order code or customer name...',
                }}
                filterConfigs={[
                    {
                        value: status,
                        onChange: setStatus,
                        label: '-- Status --',
                        options: STATUS_OPTIONS.map((o) => ({
                            value: o.value,
                            label: o.label,
                        })),
                    },
                ]}
                onApplyFilters={() => applyFilters('/seller/orders')}
            />

            {/* Orders table */}
            <DataTable
                columns={orderColumns}
                data={orders?.data || []}
                headerTitle="Orders List"
                headerIcon="bx-cart"
                emptyMessage="No orders found"
                {...({ loading } as any)}
            />

            {/* Pagination */}
            <Pagination
                links={orders?.links || []}
                {...({
                    onClick: (linkUrl: string | null) => {
                        if (!linkUrl) return;
                        applyFilters(linkUrl);
                    },
                } as any)}
            />
        </AppLayout>
    );
}

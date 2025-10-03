
import DataTable from '@/components/ui/DataTable';
import FilterPanel from '@/components/ui/FilterPanel';
import Pagination from '@/components/ui/Pagination';
import Toast from '@/components/admin/users/Toast';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AppLayout from '../../../layouts/app/AppLayout';

interface Customer {
    id: number;
    first_name: string;
    last_name: string;
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
    };
    filters: { search?: string; status?: string };
    flash?: { success?: string; error?: string };
    [key: string]: unknown;
}

// Helper hiển thị trạng thái
const getStatusInfo = (status: number): { text: string; className: string } => {
    switch (status) {
        case 1:
            return { text: 'Đang chờ xử lý', className: 'bg-yellow-100 text-yellow-800' };
        case 2:
            return { text: 'Đang xử lý', className: 'bg-blue-100 text-blue-800' };
        case 3:
            return { text: 'Đã giao hàng', className: 'bg-indigo-100 text-indigo-800' };
        case 4:
            return { text: 'Đã giao', className: 'bg-green-100 text-green-800' };
        case 5:
            return { text: 'Đã hủy', className: 'bg-red-100 text-red-800' };
        default:
            return { text: 'Không xác định', className: 'bg-gray-100 text-gray-800' };
    }
};

export default function Index() {
    const { orders, filters = {}, flash } = usePage<PageProps>().props;

    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    useEffect(() => {
        if (flash?.success) {
            setToast({ type: 'success', message: flash.success });
        } else if (flash?.error) {
            setToast({ type: 'error', message: flash.error });
        }
    }, [flash]);

    const applyFilters = () => {
        router.get('/admin/orders', { search, status }, { preserveState: true });
    };

    const orderColumns = [
        {
            header: 'Mã đơn hàng',
            cell: (order: Order) => `#${order.order_number}`,
        },
        {
            header: 'Khách hàng',
            cell: (order: Order) => `${order.customer.first_name} ${order.customer.last_name}`,
        },
        {
            header: 'Ngày đặt',
            cell: (order: Order) => new Date(order.created_at).toLocaleDateString('vi-VN'),
        },
        {
            header: 'Tổng tiền',
            cell: (order: Order) => `${order.total_amount.toLocaleString('vi-VN')} ₫`,
        },
        {
            header: 'Trạng thái',
            cell: (order: Order) => {
                const statusInfo = getStatusInfo(order.status);
                return <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusInfo.className}`}>{statusInfo.text} </span>;
            },
        },
        {
            header: 'Hành động',
            cell: (order: Order) => (
                <Link href={route('seller.orders.show', order.order_id)} className="text-blue-500 hover:underline">
                    Xem chi tiết{' '}
                </Link>
            ),
        },
    ];

    return (
        <AppLayout>
            {' '}
            <Head title="Quản lý Đơn hàng" />
            ```
            {/* Thông báo */}
            {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
            {/* Bộ lọc */}
            <FilterPanel
                title="Order Management"
                breadcrumbs={[
                    { label: 'Admin', href: '#' },
                    { label: 'Orders', href: '#', active: true },
                ]}
                searchConfig={{
                    value: search,
                    onChange: setSearch,
                    placeholder: 'Tìm theo mã đơn hàng...',
                }}
                filterConfigs={[
                    {
                        value: status,
                        onChange: setStatus,
                        label: '-- Trạng thái --',
                        options: [
                            { value: '1', label: 'Đang chờ xử lý' },
                            { value: '2', label: 'Đang xử lý' },
                            { value: '3', label: 'Đã giao hàng' },
                            { value: '4', label: 'Đã giao' },
                            { value: '5', label: 'Đã hủy' },
                        ],
                    },
                ]}
                onApplyFilters={applyFilters}
            />
            {/* Bảng dữ liệu */}
            <DataTable
                columns={orderColumns}
                data={orders.data}
                headerTitle="Danh sách đơn hàng"
                headerIcon="bx-cart"
                emptyMessage="Không có đơn hàng nào"
            />
            {/* Phân trang */}
            <Pagination links={orders.links} />
        </AppLayout>
    );
}

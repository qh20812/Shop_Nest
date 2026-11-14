import { Head, router, usePage } from '@inertiajs/react';
import { ClipboardList } from 'lucide-react';
import * as React from 'react';

import { OrderTable } from '@/components/commerce/OrderTable';
import { AccountLayout } from '@/components/layout/AccountLayout';
import { SearchInput } from '@/components/ui/search-input';
import { Tabs } from '@/components/ui/tabs';

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

const statusTabs = [
    { value: 'all', label: 'Tất cả' },
    { value: 'pending', label: 'Chờ xử lý' },
    { value: 'processing', label: 'Đang xử lý' },
    { value: 'shipped', label: 'Đang giao' },
    { value: 'delivered', label: 'Đã giao' },
    { value: 'canceled', label: 'Đã huỷ' },
];

export default function OrdersIndex() {
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
            breadcrumbs={[{ label: 'Chợ', href: '/' }, { label: 'Tài khoản' }, { label: 'Đơn hàng' }]}
            eyebrow="Tài khoản"
            title="Đơn hàng của tôi"
            description="Theo dõi trạng thái, thanh toán và tiến trình giao hàng của mọi đơn đã đặt."
            count={`${orders.length} đơn`}
            actions={
                <div className="w-full sm:w-72">
                    <SearchInput
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        onSubmit={(value) => visit({ search: value })}
                        onClear={() => {
                            setSearch('');
                            visit({ search: '' });
                        }}
                        placeholder="Tìm theo mã đơn..."
                        size="sm"
                        aria-label="Tìm đơn hàng"
                    />
                </div>
            }
        >
            <Head title="Đơn hàng của tôi" />

            <div className="flex flex-col gap-5">
                <Tabs
                    items={statusTabs.map((tab) => ({ value: tab.value, label: tab.label, icon: tab.value === 'all' ? ClipboardList : undefined }))}
                    value={activeStatus}
                    onValueChange={handleStatus}
                    variant="filter"
                    ariaLabel="Lọc đơn hàng theo trạng thái"
                />

                <OrderTable orders={tableRows} emptyDescription="Khi bạn đặt món đầu tiên, đơn hàng sẽ xuất hiện tại đây." />

                <p className="text-label-micro text-ink-faint">
                    Danh sách hiển thị tối đa 50 đơn gần nhất. Dùng ô tìm kiếm để tra cứu mã đơn cũ hơn.
                </p>
            </div>
        </AccountLayout>
    );
}

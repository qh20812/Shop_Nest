import { Link } from '@inertiajs/react';
import { ChevronRight, PackageSearch } from 'lucide-react';

import { OrderStatusBadge } from '@/components/commerce/OrderStatusBadge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { formatVnd } from '@/lib/format';
import { backendOrderStatusLabel, normalizeOrderStatus, paymentStatusLabel, paymentStatusTone } from '@/lib/status';
import { cn } from '@/lib/utils';

type OrderTableRow = {
    id: number | string;
    code: string;
    status: string;
    paymentStatus?: string;
    total: number;
    createdAt?: string;
    canCancel?: boolean;
};

type OrderTableProps = {
    orders: OrderTableRow[];
    loading?: boolean;
    emptyTitle?: string;
    emptyDescription?: string;
    className?: string;
};

export function OrderTable({
    orders,
    loading = false,
    emptyTitle = 'Chưa có đơn hàng nào',
    emptyDescription = 'Đơn hàng bạn đặt sẽ xuất hiện tại đây để theo dõi.',
    className,
}: OrderTableProps) {
    if (loading) {
        return (
            <div className={cn('flex flex-col gap-3', className)}>
                {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="flex items-center gap-4 rounded-card border border-border bg-warm-porcelain p-4">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="ml-auto h-4 w-20" />
                    </div>
                ))}
            </div>
        );
    }

    if (orders.length === 0) {
        return <EmptyState icon={PackageSearch} title={emptyTitle} description={emptyDescription} />;
    }

    return (
        <div className={className}>
            <div className="hidden overflow-hidden rounded-card border border-border bg-warm-porcelain md:block">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead className="border-b border-border bg-raw-linen/50">
                            <tr>
                                {['Mã đơn', 'Ngày tạo', 'Trạng thái', 'Thanh toán', 'Tổng tiền', ''].map((header, index) => (
                                    <th
                                        key={header || index}
                                        scope="col"
                                        className="px-4 py-3 font-sans text-label-micro font-medium tracking-[0.12em] text-ink-muted uppercase"
                                    >
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {orders.map((order) => {
                                const paymentStatus = order.paymentStatus ?? 'unpaid';

                                return (
                                    <tr key={order.id} className="transition-colors hover:bg-rice-paper/60">
                                        <td className="px-4 py-3">
                                            <Link
                                                href={`/user/orders/${order.id}`}
                                                className="focus-ring font-mono text-label-code font-semibold text-ink transition-colors hover:text-lacquer-red"
                                            >
                                                {order.code}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3 font-mono text-label-micro text-ink-muted">{order.createdAt ?? '—'}</td>
                                        <td className="px-4 py-3">
                                            <OrderStatusBadge
                                                status={normalizeOrderStatus(order.status)}
                                                label={backendOrderStatusLabel(order.status)}
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge tone={paymentStatusTone[paymentStatus] ?? 'neutral'} dot>
                                                {paymentStatusLabel[paymentStatus] ?? paymentStatus}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 font-mono text-label-code font-semibold text-ink">{formatVnd(order.total)}</td>
                                        <td className="px-4 py-3 text-right">
                                            <Button variant="ghost" size="sm" asChild rightIcon={ChevronRight}>
                                                <Link href={`/user/orders/${order.id}`}>Xem</Link>
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <ul className="flex flex-col gap-3 md:hidden">
                {orders.map((order) => {
                    const paymentStatus = order.paymentStatus ?? 'unpaid';

                    return (
                        <li key={order.id}>
                            <Link
                                href={`/user/orders/${order.id}`}
                                className="focus-ring flex flex-col gap-3 rounded-card border border-border bg-warm-porcelain p-4 transition-colors hover:border-ink-muted"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex flex-col gap-0.5">
                                        <span className="font-mono text-label-code font-semibold text-ink">{order.code}</span>
                                        <span className="font-mono text-label-micro text-ink-faint">{order.createdAt ?? '—'}</span>
                                    </div>
                                    <OrderStatusBadge status={normalizeOrderStatus(order.status)} label={backendOrderStatusLabel(order.status)} />
                                </div>
                                <div className="flex items-center justify-between gap-3">
                                    <Badge tone={paymentStatusTone[paymentStatus] ?? 'neutral'} dot>
                                        {paymentStatusLabel[paymentStatus] ?? paymentStatus}
                                    </Badge>
                                    <span className="font-mono text-body-sm font-semibold text-ink">{formatVnd(order.total)}</span>
                                </div>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export type { OrderTableProps, OrderTableRow };
export default OrderTable;

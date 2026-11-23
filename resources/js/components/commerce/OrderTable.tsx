import { Link } from '@inertiajs/react';
import { ChevronRight, PackageSearch } from 'lucide-react';

import { OrderStatusBadge } from '@/components/commerce/OrderStatusBadge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { cx } from '@/lib/cx';
import { formatVnd } from '@/lib/format';
import { backendOrderStatusLabel, normalizeOrderStatus, paymentStatusLabel, paymentStatusTone } from '@/lib/status';

import styles from './commerce.module.css';

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
            <div className={cx(styles.orderCards, className)}>
                {Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className={styles.orderSkeletonRow}>
                        <Skeleton className={styles.orderSkeletonCode} />
                        <Skeleton className={styles.orderSkeletonDate} />
                        <Skeleton className={cx(styles.orderSkeletonAmount, styles.orderSkeletonSpacer)} />
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
            <div className={styles.orderTableWrap}>
                <div className={styles.orderTableScroll}>
                    <table className={styles.orderTable}>
                        <thead className={styles.orderTableHead}>
                            <tr>
                                {['Mã đơn', 'Ngày tạo', 'Trạng thái', 'Thanh toán', 'Tổng tiền', ''].map((header, index) => (
                                    <th key={header || index} scope="col">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => {
                                const paymentStatus = order.paymentStatus ?? 'unpaid';

                                return (
                                    <tr key={order.id} className={styles.orderTableRow}>
                                        <td className={styles.orderTableCell}>
                                            <Link href={`/user/orders/${order.id}`} className={styles.orderTableLink}>
                                                {order.code}
                                            </Link>
                                        </td>
                                        <td className={styles.orderTableCell}>
                                            <span className={styles.orderTableDate}>{order.createdAt ?? '-'}</span>
                                        </td>
                                        <td className={styles.orderTableCell}>
                                            <OrderStatusBadge
                                                status={normalizeOrderStatus(order.status)}
                                                label={backendOrderStatusLabel(order.status)}
                                            />
                                        </td>
                                        <td className={styles.orderTableCell}>
                                            <Badge tone={paymentStatusTone[paymentStatus] ?? 'neutral'} dot>
                                                {paymentStatusLabel[paymentStatus] ?? paymentStatus}
                                            </Badge>
                                        </td>
                                        <td className={styles.orderTableCell}>
                                            <span className={styles.orderTableAmount}>{formatVnd(order.total)}</span>
                                        </td>
                                        <td className={cx(styles.orderTableCell, styles.orderTableAction)}>
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

            <ul className={styles.orderCards}>
                {orders.map((order) => {
                    const paymentStatus = order.paymentStatus ?? 'unpaid';

                    return (
                        <li key={order.id}>
                            <Link href={`/user/orders/${order.id}`} className={styles.orderCard}>
                                <div className={styles.orderCardTop}>
                                    <div>
                                        <span className={styles.orderCardCode}>{order.code}</span>
                                        <span className={styles.orderCardDate}>{order.createdAt ?? '-'}</span>
                                    </div>
                                    <OrderStatusBadge status={normalizeOrderStatus(order.status)} label={backendOrderStatusLabel(order.status)} />
                                </div>
                                <div className={styles.orderCardBottom}>
                                    <Badge tone={paymentStatusTone[paymentStatus] ?? 'neutral'} dot>
                                        {paymentStatusLabel[paymentStatus] ?? paymentStatus}
                                    </Badge>
                                    <span className={styles.orderCardAmount}>{formatVnd(order.total)}</span>
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

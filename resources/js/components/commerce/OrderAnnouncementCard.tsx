import { Link } from '@inertiajs/react';
import { Package, ReceiptText } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { cx } from '@/lib/cx';
import { formatVnd } from '@/lib/format';
import { backendOrderStatusLabel } from '@/lib/status';

import styles from './commerce.module.css';

type OrderAnnouncementModel = {
    id: number | string;
    code: string;
    status?: string;
    total?: number;
    itemCount?: number;
    createdAt?: string;
    url?: string;
};

type OrderAnnouncementCardProps = {
    order: OrderAnnouncementModel;
    className?: string;
};

export function OrderAnnouncementCard({ order, className }: OrderAnnouncementCardProps) {
    const href = order.url ?? `/user/orders/${order.id}`;

    return (
        <Link href={href} className={cx(styles.announcement, className)}>
            <div className={styles.announcementTop}>
                <span className={styles.announcementIcon}>
                    <ReceiptText aria-hidden="true" />
                </span>
                <div className={styles.announcementBody}>
                    <span className={styles.announcementCode}>{order.code}</span>
                    <span className={styles.announcementMeta}>
                        {order.itemCount ? `${order.itemCount} sản phẩm` : 'Đơn hàng'}
                        {order.createdAt ? ` · ${order.createdAt}` : ''}
                    </span>
                </div>
                {order.status ? (
                    <Badge tone="accent" size="sm" dot>
                        {backendOrderStatusLabel(order.status)}
                    </Badge>
                ) : null}
            </div>

            <div className={styles.announcementBottom}>
                <span className={styles.announcementHint}>
                    <Package aria-hidden="true" />
                    Xem chi tiết đơn
                </span>
                {typeof order.total === 'number' ? <span className={styles.announcementTotal}>{formatVnd(order.total)}</span> : null}
            </div>
        </Link>
    );
}

export type { OrderAnnouncementCardProps, OrderAnnouncementModel };
export default OrderAnnouncementCard;

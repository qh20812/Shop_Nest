import { useTranslation } from '@/lib/i18n';
import { Link } from '@inertiajs/react';
import { Package, ReceiptText } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { useMoney } from '@/hooks/useMoney';
import { cx } from '@/lib/cx';
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
    const { t } = useTranslation();
    const { money } = useMoney();
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
                        {order.itemCount ? t(':count items', { count: order.itemCount }) : t('Order')}
                        {order.createdAt ? ` · ${order.createdAt}` : ''}
                    </span>
                </div>
                {order.status ? (
                    <Badge tone="accent" size="sm" dot>
                        {backendOrderStatusLabel(order.status, t)}
                    </Badge>
                ) : null}
            </div>

            <div className={styles.announcementBottom}>
                <span className={styles.announcementHint}>
                    <Package aria-hidden="true" />
                    {t('View order details')}
                </span>
                {typeof order.total === 'number' ? <span className={styles.announcementTotal}>{money(order.total)}</span> : null}
            </div>
        </Link>
    );
}

export type { OrderAnnouncementCardProps, OrderAnnouncementModel };
export default OrderAnnouncementCard;

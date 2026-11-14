import { Link } from '@inertiajs/react';
import { Package, ReceiptText } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { formatVnd } from '@/lib/format';
import { backendOrderStatusLabel } from '@/lib/status';
import { cn } from '@/lib/utils';

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
        <Link
            href={href}
            className={cn(
                'focus-ring flex w-full flex-col gap-2 rounded-control border border-border bg-warm-porcelain p-3 transition-colors hover:border-ink-muted',
                className,
            )}
        >
            <div className="flex items-center gap-2">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-chip bg-lacquer-wash text-lacquer-red">
                    <ReceiptText aria-hidden="true" className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                    <span className="block truncate font-mono text-label-code font-semibold text-ink">{order.code}</span>
                    <span className="block text-label-micro text-ink-faint">
                        {order.itemCount ? `${order.itemCount} sản phẩm` : 'Đơn hàng'}
                        {order.createdAt ? ` · ${order.createdAt}` : ''}
                    </span>
                </div>
                {order.status && (
                    <Badge tone="accent" size="sm" dot>
                        {backendOrderStatusLabel(order.status)}
                    </Badge>
                )}
            </div>

            <div className="flex items-center justify-between border-t border-border pt-2">
                <span className="inline-flex items-center gap-1.5 text-label-micro text-ink-muted">
                    <Package aria-hidden="true" className="size-3.5" />
                    Xem chi tiết đơn
                </span>
                {typeof order.total === 'number' && (
                    <span className="font-mono text-label-code font-semibold text-ink">{formatVnd(order.total)}</span>
                )}
            </div>
        </Link>
    );
}

export type { OrderAnnouncementCardProps, OrderAnnouncementModel };
export default OrderAnnouncementCard;

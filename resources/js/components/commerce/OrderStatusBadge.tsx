import { Badge } from '@/components/ui/badge';
import { orderStatusLabel, orderStatusTone } from '@/lib/status';
import type { OrderStatus } from '@/types/commerce';

type OrderStatusBadgeProps = {
    status: OrderStatus;
    label?: string;
    dot?: boolean;
    className?: string;
};

export function OrderStatusBadge({ status, label, dot = true, className }: OrderStatusBadgeProps) {
    return (
        <Badge tone={orderStatusTone[status]} dot={dot} className={className}>
            {label ?? orderStatusLabel[status]}
        </Badge>
    );
}

export default OrderStatusBadge;

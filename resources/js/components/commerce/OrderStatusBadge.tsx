import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/lib/i18n';
import { orderStatusKey, orderStatusTone } from '@/lib/status';
import type { OrderStatus } from '@/types/commerce';

type OrderStatusBadgeProps = {
    status: OrderStatus;
    label?: string;
    dot?: boolean;
    className?: string;
};

export function OrderStatusBadge({ status, label, dot = true, className }: OrderStatusBadgeProps) {
    const { t } = useTranslation();
    return (
        <Badge tone={orderStatusTone[status]} dot={dot} className={className}>
            {label ?? t(orderStatusKey[status])}
        </Badge>
    );
}

export default OrderStatusBadge;

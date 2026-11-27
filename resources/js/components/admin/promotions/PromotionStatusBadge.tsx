import { Badge, type BadgeTone } from '@/components/ui/badge';
import { useTranslation } from '@/lib/i18n';

import { promotionStatusLabel } from './promotion-display';

const STATUS_TONES: Record<string, BadgeTone> = {
    draft: 'neutral',
    active: 'success',
    paused: 'warning',
    expired: 'outline',
};

interface PromotionStatusBadgeProps {
    status: string;
}

export default function PromotionStatusBadge({ status }: PromotionStatusBadgeProps) {
    const { t } = useTranslation();

    return <Badge tone={STATUS_TONES[status] ?? 'neutral'}>{promotionStatusLabel(status, t)}</Badge>;
}

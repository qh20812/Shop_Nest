import type { BadgeTone } from '@/components/ui/badge';

import type { TopupStatus } from './types';

export const topupStatusTones: Record<TopupStatus, BadgeTone> = {
    pending: 'warning',
    transferred: 'accent',
    approved: 'success',
    rejected: 'danger',
    expired: 'neutral',
};

export const topupStatusKeys: Record<TopupStatus, string> = {
    pending: 'Waiting for transfer',
    transferred: 'Reported as transferred',
    approved: 'Approved',
    rejected: 'Rejected',
    expired: 'Expired',
};

export const transactionTypeKeys: Record<string, string> = {
    top_up: 'Top up',
    purchase: 'Order payment',
    refund: 'Refund',
    promotion_budget: 'Promotion budget',
    promotion_refund: 'Promotion budget refund',
    adjustment: 'Adjustment',
    migration: 'Wallet migration',
};

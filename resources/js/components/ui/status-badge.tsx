import { useTranslation } from '../../lib/i18n';

import { Badge, type BadgeTone } from './badge';

interface StatusBadgeProps {
    status: string | number;
    type?: 'order' | 'payment' | 'general';
}

const ORDER_NUMBER_TONES: Record<number, BadgeTone> = {
    0: 'warning',
    1: 'accent',
    2: 'accent',
    3: 'success',
    4: 'warning',
};

const ORDER_STRING_TONES: Record<string, BadgeTone> = {
    pending_confirmation: 'warning',
    processing: 'accent',
    pending_assignment: 'accent',
    assigned_to_shipper: 'accent',
    delivering: 'accent',
    delivered: 'success',
    completed: 'success',
    cancelled: 'warning',
    returned: 'warning',
    pending: 'warning',
    shipped: 'accent',
};

const PAYMENT_NUMBER_TONES: Record<number, BadgeTone> = {
    0: 'warning',
    1: 'success',
    2: 'warning',
    3: 'accent',
};

const PAYMENT_STRING_TONES: Record<string, BadgeTone> = {
    paid: 'success',
    unpaid: 'warning',
    pending: 'warning',
    failed: 'warning',
    refunded: 'accent',
};

const GENERAL_TONES: Record<string, BadgeTone> = {
    approved: 'success',
    pending: 'warning',
    draft: 'warning',
    paused: 'accent',
    suspended: 'accent',
    rejected: 'warning',
    active: 'success',
    expired: 'warning',
    inactive: 'warning',
    hidden: 'accent',
};

function getStatusTone(status: string | number, type: string): BadgeTone {
    if (type === 'order') {
        if (typeof status === 'number') {
            return ORDER_NUMBER_TONES[status] ?? 'warning';
        }

        return ORDER_STRING_TONES[status] ?? 'warning';
    }

    if (type === 'payment') {
        if (typeof status === 'number') {
            return PAYMENT_NUMBER_TONES[status] ?? 'warning';
        }

        return PAYMENT_STRING_TONES[status] ?? 'warning';
    }

    return GENERAL_TONES[String(status)] ?? 'warning';
}

export default function StatusBadge({ status, type = 'general' }: StatusBadgeProps) {
    const { t } = useTranslation();

    const getStatusText = (value: string | number, statusType: string) => {
        if (statusType === 'order') {
            if (typeof value === 'number') {
                switch (value) {
                    case 0:
                        return t('Pending');
                    case 1:
                        return t('Processing');
                    case 2:
                        return t('Shipped');
                    case 3:
                        return t('Delivered');
                    case 4:
                        return t('Cancelled');
                    default:
                        return t('Unknown');
                }
            }

            switch (value) {
                case 'pending_confirmation':
                    return t('Pending Confirmation');
                case 'processing':
                    return t('Processing');
                case 'pending_assignment':
                    return t('Pending Assignment');
                case 'assigned_to_shipper':
                    return t('Assigned to Shipper');
                case 'delivering':
                    return t('Delivering');
                case 'delivered':
                    return t('Delivered');
                case 'completed':
                    return t('Completed');
                case 'cancelled':
                    return t('Cancelled');
                case 'returned':
                    return t('Returned');
                case 'pending':
                    return t('Pending Confirmation');
                case 'shipped':
                    return t('Delivering');
                default:
                    return t('Unknown');
            }
        }

        if (statusType === 'payment') {
            if (typeof value === 'number') {
                switch (value) {
                    case 0:
                        return t('Unpaid');
                    case 1:
                        return t('Paid');
                    case 2:
                        return t('Failed');
                    case 3:
                        return t('Refunded');
                    default:
                        return t('Unknown');
                }
            }

            switch (value) {
                case 'paid':
                    return t('Paid');
                case 'unpaid':
                    return t('Unpaid');
                case 'pending':
                    return t('Pending');
                case 'failed':
                    return t('Failed');
                case 'refunded':
                    return t('Refunded');
                default:
                    return t('Unknown');
            }
        }

        switch (value) {
            case 'pending':
                return t('Pending');
            case 'approved':
                return t('Approved');
            case 'rejected':
                return t('Rejected');
            case 'suspended':
                return t('Suspended');
            case 'draft':
                return t('Draft');
            case 'paused':
                return t('Paused');
            case 'active':
                return t('Active');
            case 'expired':
                return t('Expired');
            case 'inactive':
                return t('Inactive');
            case 'hidden':
                return t('Hidden');
            default:
                return String(value);
        }
    };

    return (
        <Badge tone={getStatusTone(status, type)} size="sm">
            {getStatusText(status, type)}
        </Badge>
    );
}

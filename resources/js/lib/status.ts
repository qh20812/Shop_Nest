import type { OrderStatus, StatusTone, StockStatus } from '@/types/commerce';

type Translator = (key: string) => string;

const backendOrderStatusMap: Record<string, OrderStatus> = {
    pending_confirmation: 'pending',
    processing: 'confirmed',
    pending_assignment: 'confirmed',
    assigned_to_shipper: 'shipping',
    delivering: 'shipping',
    shipped: 'shipping',
    delivered: 'completed',
    completed: 'completed',
    cancelled: 'cancelled',
    canceled: 'cancelled',
    returned: 'returned',
    returned_refunded: 'refunded',
};

const backendOrderStatusKeyMap: Record<string, string> = {
    pending_confirmation: 'Pending confirmation',
    processing: 'Processing',
    pending_assignment: 'Awaiting driver assignment',
    assigned_to_shipper: 'Handed to driver',
    delivering: 'Delivering',
    shipped: 'Delivering',
    delivered: 'Delivered',
    completed: 'Completed',
    cancelled: 'Cancelled',
    canceled: 'Cancelled',
    returned: 'Returned',
    returned_refunded: 'Refunded',
};

/**
 * Map a backend order status (snake_case enum) to the frontend status set.
 */
export function normalizeOrderStatus(status?: string | null): OrderStatus {
    if (!status) {
        return 'pending';
    }

    return backendOrderStatusMap[status] ?? 'pending';
}

/**
 * Human-readable label for a backend order status.
 */
export function backendOrderStatusLabel(status?: string | null, t?: Translator): string {
    const key = status ? backendOrderStatusKeyMap[status] : undefined;

    if (key) {
        return t ? t(key) : key;
    }

    if (!status) {
        return t ? t('Unknown') : 'Unknown';
    }

    return status.replace(/_/g, ' ');
}

export const paymentStatusKey: Record<string, string> = {
    unpaid: 'Unpaid',
    paid: 'Paid',
    failed: 'Failed',
    refunded: 'Refunded',
};

export const paymentStatusTone: Record<string, StatusTone> = {
    unpaid: 'warning',
    paid: 'success',
    failed: 'danger',
    refunded: 'accent',
};

export function normalizePaymentStatus(status?: string | null): string {
    if (!status) {
        return 'unpaid';
    }

    return status;
}

export const orderStatusTone: Record<OrderStatus, StatusTone> = {
    pending: 'warning',
    confirmed: 'accent',
    shipping: 'warning',
    completed: 'success',
    cancelled: 'neutral',
    returned: 'warning',
    refunded: 'success',
};

export const orderStatusKey: Record<OrderStatus, string> = {
    pending: 'Pending confirmation',
    confirmed: 'Confirmed',
    shipping: 'Shipping',
    completed: 'Completed',
    cancelled: 'Cancelled',
    returned: 'Returned',
    refunded: 'Refunded',
};

export const stockTone: Record<StockStatus, StatusTone> = {
    in: 'success',
    low: 'warning',
    out: 'danger',
};

export const stockKey: Record<StockStatus, string> = {
    in: 'In stock',
    low: 'Low stock',
    out: 'Out of stock',
};

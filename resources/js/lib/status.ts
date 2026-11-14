import type { OrderStatus, StatusTone, StockStatus } from '@/types/commerce';

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

const backendOrderStatusLabelMap: Record<string, string> = {
    pending_confirmation: 'Chờ xác nhận',
    processing: 'Đang xử lý',
    pending_assignment: 'Chờ phân tài xế',
    assigned_to_shipper: 'Đã giao tài xế',
    delivering: 'Đang giao',
    shipped: 'Đang giao',
    delivered: 'Đã giao',
    completed: 'Hoàn thành',
    cancelled: 'Đã huỷ',
    canceled: 'Đã huỷ',
    returned: 'Đã trả hàng',
    returned_refunded: 'Đã hoàn tiền',
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
export function backendOrderStatusLabel(status?: string | null): string {
    if (!status) {
        return 'Không xác định';
    }

    return backendOrderStatusLabelMap[status] ?? status.replace(/_/g, ' ');
}

export const paymentStatusLabel: Record<string, string> = {
    unpaid: 'Chưa thanh toán',
    paid: 'Đã thanh toán',
    failed: 'Thất bại',
    refunded: 'Đã hoàn tiền',
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

export const orderStatusLabel: Record<OrderStatus, string> = {
    pending: 'Chờ xác nhận',
    confirmed: 'Đã xác nhận',
    shipping: 'Đang giao',
    completed: 'Hoàn thành',
    cancelled: 'Đã huỷ',
    returned: 'Trả hàng',
    refunded: 'Đã hoàn tiền',
};

export const stockTone: Record<StockStatus, StatusTone> = {
    in: 'success',
    low: 'warning',
    out: 'danger',
};

export const stockLabel: Record<StockStatus, string> = {
    in: 'Còn hàng',
    low: 'Sắp hết',
    out: 'Hết hàng',
};

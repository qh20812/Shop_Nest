import type { OrderStatus, StatusTone, StockStatus } from '@/types/commerce';

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

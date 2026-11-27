import { formatNumber, formatVnd } from '@/lib/format';

export type Translator = (key: string, replacements?: Record<string, string | number>) => string;

export interface PromotionSeller {
    id?: number;
    username?: string | null;
    first_name?: string | null;
    last_name?: string | null;
    email?: string | null;
}

export interface PromotionScopeFields {
    created_by_type?: string | null;
    seller?: PromotionSeller | null;
}

export const PROMOTION_STATUS_LABELS: Record<string, string> = {
    draft: 'Upcoming',
    active: 'Active',
    paused: 'Paused',
    expired: 'Expired',
};

export const PROMOTION_TYPE_LABELS: Record<string, string> = {
    percentage: 'Percentage Discount',
    fixed_amount: 'Fixed Amount Discount',
    free_shipping: 'Free Shipping',
    buy_x_get_y: 'Buy X Get Y',
};

export const promotionStatusLabel = (status: string, t: Translator): string => {
    const key = PROMOTION_STATUS_LABELS[status];

    return key ? t(key) : status;
};

export const promotionSellerName = (seller?: PromotionSeller | null): string => {
    if (!seller) {
        return '';
    }

    return [seller.first_name, seller.last_name].filter(Boolean).join(' ').trim() || seller.username || '';
};

export const promotionScopeLabel = (promotion: PromotionScopeFields, t: Translator): string => {
    if (promotion.created_by_type === 'seller') {
        return promotionSellerName(promotion.seller) || t('Seller');
    }

    return t('Platform');
};

export const promotionTypeLabel = (type: string, typeOptions: Record<string, string> | undefined, t: Translator): string =>
    t(typeOptions?.[type] ?? type);

export const promotionValueLabel = (type: string, value: number | string | null | undefined): string => {
    if (value === null || value === undefined || value === '') {
        return '-';
    }

    const numeric = Number(value);

    if (!Number.isFinite(numeric)) {
        return '-';
    }

    if (type === 'percentage') {
        return `${formatNumber(numeric, { maximumFractionDigits: 2 })}%`;
    }

    return formatVnd(numeric);
};

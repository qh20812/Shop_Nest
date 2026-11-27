import { usePage } from '@inertiajs/react';

type CurrencyPayload = {
    code?: string;
    rates?: Record<string, number>;
};

type PageProps = {
    locale?: string;
    currency?: CurrencyPayload | string;
    [key: string]: unknown;
};

/**
 * Giá trong DB luôn là VND. Khi người dùng chọn đơn vị tiền tệ khác, chỉ
 * quy đổi ở lớp hiển thị (đơn hàng/Stripe vẫn thanh toán bằng VND).
 */
const BASE_CURRENCY = 'VND';

const FALLBACK_RATES: Record<string, number> = {
    VND: 25000,
    USD: 1,
};

export function useMoney() {
    const { props } = usePage<PageProps>();
    const payload = props.currency;
    const code = (typeof payload === 'string' ? payload : payload?.code) ?? BASE_CURRENCY;
    const currency = code.toUpperCase();
    const rates = (typeof payload === 'object' && payload?.rates) || FALLBACK_RATES;
    const locale = props.locale === 'en' ? 'en-US' : 'vi-VN';

    const money = (value: number | null | undefined): string => {
        const amount = typeof value === 'number' && Number.isFinite(value) ? value : 0;

        let converted = amount;

        if (currency !== BASE_CURRENCY) {
            const baseRate = rates[BASE_CURRENCY] ?? FALLBACK_RATES[BASE_CURRENCY];
            const targetRate = rates[currency] ?? 1;

            if (baseRate > 0) {
                converted = (amount / baseRate) * targetRate;
            }
        }

        const fractionDigits = currency === 'VND' ? 0 : 2;

        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency,
            minimumFractionDigits: fractionDigits,
            maximumFractionDigits: fractionDigits,
        }).format(converted);
    };

    return { money, currency, locale };
}

export default useMoney;

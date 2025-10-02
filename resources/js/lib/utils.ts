import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface FormatCurrencyOptions {
    from: string;
    to: string;
    rates: Record<string, number>;
    locale: string;
    abbreviate?: boolean;
}

export function formatCurrency(value: number, options: FormatCurrencyOptions): string {
    // Handle null or undefined inputs
    if (value == null) {
        return new Intl.NumberFormat(options.locale, {
            style: 'currency',
            currency: options.to,
        }).format(0);
    }

    // Convert currency if needed
    let convertedValue = value;
    if (options.from !== options.to) {
        if (options.from === 'USD' && options.rates[options.to]) {
            // Converting from USD to other currency
            convertedValue = value * options.rates[options.to];
        } else if (options.to === 'USD' && options.rates[options.from]) {
            // Converting from other currency to USD
            convertedValue = value / options.rates[options.from];
        } else if (options.rates[options.from] && options.rates[options.to]) {
            // Converting between two non-USD currencies
            const toUsd = value / options.rates[options.from];
            convertedValue = toUsd * options.rates[options.to];
        }
    }

    // Apply abbreviation if requested
    if (options.abbreviate && Math.abs(convertedValue) >= 1000) {
        // Define tier-based abbreviation system for reliable large number handling
        const tiers = [
            { value: 1e12, vi: ' nghìn tỷ', en: 'T' },
            { value: 1e9,  vi: ' tỷ',       en: 'B' },
            { value: 1e6,  vi: 'tr',        en: 'M' },
            { value: 1e3,  vi: 'K',         en: 'K' },
        ];

        // Find the appropriate tier for the converted value
        let abbreviatedValue = convertedValue;
        let suffix = '';

        for (const tier of tiers) {
            if (Math.abs(convertedValue) >= tier.value) {
                abbreviatedValue = convertedValue / tier.value;
                suffix = options.locale.startsWith('vi') ? tier.vi : tier.en;
                break;
            }
        }

        // Format only the number part (without currency symbol)
        const numberPart = new Intl.NumberFormat(options.locale, {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
        }).format(Math.abs(abbreviatedValue));

        // Extract currency symbol using formatToParts for reliable symbol extraction
        const currencySymbol = new Intl.NumberFormat(options.locale, {
            style: 'currency',
            currency: options.to,
        }).formatToParts(0).find(part => part.type === 'currency')?.value || options.to;

        // Handle negative values
        const sign = convertedValue < 0 ? '-' : '';

        // Construct final string based on locale
        if (options.locale.startsWith('vi')) {
            // Vietnamese format: [sign][number][suffix] [symbol]
            return suffix ? `${sign}${numberPart}${suffix} ${currencySymbol}` : `${sign}${numberPart} ${currencySymbol}`;
        } else {
            // English/other locales format: [symbol][sign][number][suffix]
            return suffix ? `${currencySymbol}${sign}${numberPart}${suffix}` : `${currencySymbol}${sign}${numberPart}`;
        }
    }

    // Format without abbreviation
    return new Intl.NumberFormat(options.locale, {
        style: 'currency',
        currency: options.to,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(convertedValue);
}

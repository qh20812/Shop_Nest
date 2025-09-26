import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
    // Handle null or undefined inputs
    if (num == null) {
        return '$0';
    }

    // For numbers less than 1,000, return with exactly two decimal places
    if (num < 1000) {
        return `$${num.toFixed(2)}`;
    }

    // For larger numbers, abbreviate with suffixes
    const suffixes = ['', 'K', 'M', 'B'];
    let suffixIndex = 0;
    let value = num;

    while (value >= 1000 && suffixIndex < suffixes.length - 1) {
        value /= 1000;
        suffixIndex++;
    }

    // Round to one decimal place for abbreviated numbers
    return `$${value.toFixed(1)}${suffixes[suffixIndex]}`;
}

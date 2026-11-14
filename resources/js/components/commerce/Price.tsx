import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { formatVnd } from '@/lib/format';
import { cn } from '@/lib/utils';

const priceVariants = cva('font-mono font-semibold leading-none', {
    variants: {
        size: {
            sm: 'text-body-sm',
            md: 'text-body-md',
            lg: 'text-headline-3',
            xl: 'text-headline-1',
        },
        tone: {
            accent: 'text-lacquer-red',
            ink: 'text-ink',
            muted: 'text-ink-muted',
        },
    },
    defaultVariants: {
        size: 'md',
        tone: 'accent',
    },
});

type PriceProps = React.ComponentProps<'span'> &
    VariantProps<typeof priceVariants> & {
        value: number;
        compareAt?: number;
        showDiscount?: boolean;
    };

export function Price({ className, value, compareAt, showDiscount = true, size, tone, ...props }: PriceProps) {
    const discount = compareAt && compareAt > value ? Math.round((1 - value / compareAt) * 100) : null;

    return (
        <span className={cn('inline-flex flex-wrap items-baseline gap-2', className)} {...props}>
            <span className={priceVariants({ size, tone })}>{formatVnd(value)}</span>
            {compareAt && compareAt > value && <span className="font-mono text-body-sm text-ink-faint line-through">{formatVnd(compareAt)}</span>}
            {showDiscount && discount !== null && discount > 0 && (
                <span className="rounded-chip bg-lacquer-wash px-1.5 py-0.5 font-mono text-label-micro font-semibold text-lacquer-deep">
                    -{discount}%
                </span>
            )}
        </span>
    );
}

export { priceVariants };
export type { PriceProps };
export default Price;

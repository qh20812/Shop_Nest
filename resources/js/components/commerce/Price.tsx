import * as React from 'react';

import { cx } from '@/lib/cx';
import { formatVnd } from '@/lib/format';

import styles from './commerce.module.css';

type PriceSize = 'sm' | 'md' | 'lg' | 'xl';
type PriceTone = 'accent' | 'ink' | 'muted';

type PriceVariantProps = { size?: PriceSize; tone?: PriceTone };

const priceVariants: (props?: PriceVariantProps) => string = () => styles.priceRoot;

type PriceProps = React.ComponentProps<'span'> &
    PriceVariantProps & {
        value: number;
        compareAt?: number;
        showDiscount?: boolean;
    };

export function Price({ className, value, compareAt, showDiscount = true, size = 'md', tone = 'accent', ...props }: PriceProps) {
    const discount = compareAt && compareAt > value ? Math.round((1 - value / compareAt) * 100) : null;

    return (
        <span className={cx(styles.priceRoot, className)} data-size={size} data-tone={tone} {...props}>
            <span className={styles.priceValue}>{formatVnd(value)}</span>
            {compareAt && compareAt > value && <span className={styles.priceCompare}>{formatVnd(compareAt)}</span>}
            {showDiscount && discount !== null && discount > 0 && <span className={styles.priceDiscount}>-{discount}%</span>}
        </span>
    );
}

export { priceVariants };
export type { PriceProps, PriceSize, PriceTone };
export default Price;

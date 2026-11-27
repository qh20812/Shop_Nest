import { useTranslation } from '@/lib/i18n';
import { Star, StarHalf } from 'lucide-react';

import { cx } from '@/lib/cx';
import { formatDecimal, formatNumber } from '@/lib/format';

import styles from './commerce.module.css';

type RatingProps = {
    value: number;
    count?: number;
    compact?: boolean;
    chip?: boolean;
    showValue?: boolean;
    className?: string;
};

export function Rating({ value, count, compact = false, chip = false, showValue = true, className }: RatingProps) {
    const { t } = useTranslation();
    const safeValue = Math.min(Math.max(value, 0), 5);

    if (compact) {
        return (
            <span
                className={cx(styles.rating, chip && styles.ratingChip, className)}
                aria-label={
                    t(':value out of 5', { value: formatDecimal(safeValue) }) +
                    (typeof count === 'number' ? `, ${t(':count reviews', { count: formatNumber(count) })}` : '')
                }
            >
                <Star aria-hidden="true" className={cx(styles.star, styles.starFilled)} />
                <span className={styles.ratingValue}>{formatDecimal(safeValue)}</span>
                {typeof count === 'number' && <span className={styles.ratingCount}>({formatNumber(count)})</span>}
            </span>
        );
    }

    return (
        <span
            className={cx(styles.rating, className)}
            aria-label={
                t(':value out of 5', { value: formatDecimal(safeValue) }) +
                (typeof count === 'number' ? `, ${t(':count reviews', { count: formatNumber(count) })}` : '')
            }
        >
            <span className={styles.ratingStars} aria-hidden="true">
                {[0, 1, 2, 3, 4].map((index) => {
                    if (safeValue >= index + 1) {
                        return <Star key={index} className={cx(styles.star, styles.starFilled)} />;
                    }

                    if (safeValue >= index + 0.5) {
                        return <StarHalf key={index} className={cx(styles.star, styles.starFilled)} />;
                    }

                    return <Star key={index} className={cx(styles.star, styles.starEmpty)} />;
                })}
            </span>
            {showValue && <span className={styles.ratingValue}>{formatDecimal(safeValue)}</span>}
            {typeof count === 'number' && <span className={styles.ratingCount}>({t(':count reviews', { count: formatNumber(count) })})</span>}
        </span>
    );
}

export default Rating;

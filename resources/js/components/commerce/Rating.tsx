import { Star, StarHalf } from 'lucide-react';

import { cx } from '@/lib/cx';
import { formatDecimal, formatNumber } from '@/lib/format';

import styles from './commerce.module.css';

type RatingProps = {
    value: number;
    count?: number;
    compact?: boolean;
    showValue?: boolean;
    className?: string;
};

export function Rating({ value, count, compact = false, showValue = true, className }: RatingProps) {
    const safeValue = Math.min(Math.max(value, 0), 5);

    if (compact) {
        return (
            <span
                className={cx(styles.rating, className)}
                aria-label={`${formatDecimal(safeValue)} trên 5${typeof count === 'number' ? `, ${formatNumber(count)} đánh giá` : ''}`}
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
            aria-label={`${formatDecimal(safeValue)} trên 5${typeof count === 'number' ? `, ${formatNumber(count)} đánh giá` : ''}`}
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
            {typeof count === 'number' && <span className={styles.ratingCount}>({formatNumber(count)} đánh giá)</span>}
        </span>
    );
}

export default Rating;

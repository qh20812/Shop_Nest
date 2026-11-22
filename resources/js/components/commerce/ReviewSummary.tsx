import { Progress } from '@/components/ui/progress';
import { cx } from '@/lib/cx';
import { formatDecimal, formatNumber } from '@/lib/format';

import { Rating } from './Rating';
import styles from './commerce.module.css';

type RatingBreakdown = {
    rating: number;
    count: number;
    percentage: number;
};

type ReviewSummaryProps = {
    rating: number;
    count: number;
    breakdown: RatingBreakdown[];
    activeFilter?: number | null;
    onFilter?: (rating: number | null) => void;
    className?: string;
};

export function ReviewSummary({ rating, count, breakdown, activeFilter, onFilter, className }: ReviewSummaryProps) {
    return (
        <div className={cx(styles.reviewSummary, className)}>
            <div className={styles.reviewSummaryLeft}>
                <span className={styles.reviewScore}>{formatDecimal(rating)}</span>
                <Rating value={rating} showValue={false} className={styles.reviewSummaryRating} />
                <span className={styles.reviewSummaryCount}>{formatNumber(count)} đánh giá</span>
            </div>

            <div className={styles.reviewBreakdown}>
                {breakdown.map((item) => (
                    <button
                        key={item.rating}
                        type="button"
                        onClick={() => onFilter?.(activeFilter === item.rating ? null : item.rating)}
                        className={styles.reviewBreakdownRow}
                        data-active={activeFilter === item.rating ? 'true' : undefined}
                    >
                        <span className={styles.reviewBreakdownLabel}>{item.rating} sao</span>
                        <Progress value={item.percentage} tone="warning" className={styles.reviewBreakdownBar} />
                        <span className={styles.reviewBreakdownCount}>
                            {item.percentage}% ({formatNumber(item.count)})
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}

export type { RatingBreakdown, ReviewSummaryProps };
export default ReviewSummary;

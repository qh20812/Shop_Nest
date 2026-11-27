import { Progress } from '@/components/ui/progress';
import { cx } from '@/lib/cx';
import { formatDecimal, formatNumber } from '@/lib/format';
import { useTranslation } from '@/lib/i18n';

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
    const { t } = useTranslation();
    const interactive = Boolean(onFilter);

    return (
        <div className={cx(styles.reviewSummary, className)}>
            <div className={styles.reviewSummaryLeft}>
                <span className={styles.reviewScore}>{formatDecimal(rating)}</span>
                <Rating value={rating} showValue={false} className={styles.reviewSummaryRating} />
                <span className={styles.reviewSummaryCount}>{t(':count reviews', { count: formatNumber(count) })}</span>
            </div>

            <div className={styles.reviewBreakdown}>
                {breakdown.map((item) => {
                    const content = (
                        <>
                            <span className={styles.reviewBreakdownLabel}>{t(':rating stars', { rating: item.rating })}</span>
                            <Progress value={item.percentage} tone="warning" className={styles.reviewBreakdownBar} />
                            <span className={styles.reviewBreakdownCount}>
                                {item.percentage}% ({formatNumber(item.count)})
                            </span>
                        </>
                    );

                    if (interactive) {
                        return (
                            <button
                                key={item.rating}
                                type="button"
                                onClick={() => onFilter?.(activeFilter === item.rating ? null : item.rating)}
                                className={styles.reviewBreakdownRow}
                                data-interactive="true"
                                data-active={activeFilter === item.rating ? 'true' : undefined}
                            >
                                {content}
                            </button>
                        );
                    }

                    return (
                        <div key={item.rating} className={styles.reviewBreakdownRow}>
                            {content}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export type { RatingBreakdown, ReviewSummaryProps };
export default ReviewSummary;

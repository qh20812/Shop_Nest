import { Progress } from '@/components/ui/progress';
import { formatDecimal, formatNumber } from '@/lib/format';
import { cn } from '@/lib/utils';

import { Rating } from './Rating';

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
        <div className={cn('grid gap-6 rounded-card border border-border bg-rice-paper/60 p-5 md:grid-cols-12 md:items-center', className)}>
            <div className="flex flex-col items-center justify-center text-center md:col-span-4 md:border-r md:border-border">
                <span className="font-mono text-headline-1 leading-none font-bold text-ink">{formatDecimal(rating)}</span>
                <Rating value={rating} showValue={false} className="mt-2" />
                <span className="mt-2 text-body-sm text-ink-muted">{formatNumber(count)} đánh giá</span>
            </div>

            <div className="flex flex-col gap-2 md:col-span-8">
                {breakdown.map((item) => (
                    <button
                        key={item.rating}
                        type="button"
                        onClick={() => onFilter?.(activeFilter === item.rating ? null : item.rating)}
                        className={cn(
                            'focus-ring flex items-center gap-3 rounded-chip px-1 py-1 text-left transition-colors hover:bg-warm-porcelain',
                            activeFilter === item.rating && 'bg-warm-porcelain',
                        )}
                    >
                        <span className="w-10 shrink-0 font-mono text-label-code text-ink">{item.rating} sao</span>
                        <Progress value={item.percentage} tone="warning" className="flex-1" />
                        <span className="w-20 shrink-0 text-right font-mono text-label-micro text-ink-muted">
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

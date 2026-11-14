import { Star, StarHalf } from 'lucide-react';

import { formatDecimal, formatNumber } from '@/lib/format';
import { cn } from '@/lib/utils';

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
            <span className={cn('inline-flex items-center gap-1 text-body-sm text-ink-muted', className)}>
                <Star aria-hidden="true" className="size-3.5 fill-turmeric text-turmeric" />
                <span className="font-mono text-label-code text-ink">{formatDecimal(safeValue)}</span>
                {typeof count === 'number' && <span>({formatNumber(count)})</span>}
            </span>
        );
    }

    return (
        <span
            className={cn('inline-flex flex-wrap items-center gap-1.5 text-body-sm text-ink-muted', className)}
            aria-label={`${formatDecimal(safeValue)} trên 5${typeof count === 'number' ? `, ${formatNumber(count)} đánh giá` : ''}`}
        >
            <span className="inline-flex items-center gap-0.5" aria-hidden="true">
                {[0, 1, 2, 3, 4].map((index) => {
                    if (safeValue >= index + 1) {
                        return <Star key={index} className="size-3.5 fill-turmeric text-turmeric" />;
                    }

                    if (safeValue >= index + 0.5) {
                        return <StarHalf key={index} className="size-3.5 fill-turmeric text-turmeric" />;
                    }

                    return <Star key={index} className="size-3.5 text-ink-faint" />;
                })}
            </span>
            {showValue && <span className="font-mono text-label-code text-ink">{formatDecimal(safeValue)}</span>}
            {typeof count === 'number' && <span>({formatNumber(count)} đánh giá)</span>}
        </span>
    );
}

export default Rating;

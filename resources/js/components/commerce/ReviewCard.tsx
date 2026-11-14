import { BadgeCheck } from 'lucide-react';

import Avatar from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

import { Rating } from './Rating';

type ReviewModel = {
    id: number | string;
    user: {
        name: string;
        avatar?: string | null;
    };
    rating: number;
    comment: string;
    createdAt: string;
    verified?: boolean;
};

type ReviewCardProps = {
    review: ReviewModel;
    className?: string;
};

export function ReviewCard({ review, className }: ReviewCardProps) {
    return (
        <article className={cn('flex items-start gap-3 border-t border-border py-5 first:border-t-0 first:pt-0', className)}>
            <Avatar name={review.user.name} src={review.user.avatar} size="md" />
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-body-sm font-semibold text-ink">{review.user.name}</span>
                    {review.verified && (
                        <Badge tone="success" size="sm" icon={BadgeCheck}>
                            Đã mua
                        </Badge>
                    )}
                    <span className="ml-auto font-mono text-label-micro text-ink-faint">{review.createdAt}</span>
                </div>
                <Rating value={review.rating} compact showValue={false} />
                <p className="text-body-sm leading-relaxed text-ink-muted">{review.comment}</p>
            </div>
        </article>
    );
}

export type { ReviewCardProps, ReviewModel };
export default ReviewCard;

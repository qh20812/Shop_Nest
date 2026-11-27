import { useTranslation } from '@/lib/i18n';
import { BadgeCheck } from 'lucide-react';

import Avatar from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cx } from '@/lib/cx';

import { Rating } from './Rating';
import styles from './commerce.module.css';

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
    const { t } = useTranslation();
    return (
        <article className={cx(styles.reviewCard, className)}>
            <Avatar name={review.user.name} src={review.user.avatar} size="md" />
            <div className={styles.reviewBody}>
                <div className={styles.reviewHead}>
                    <span className={styles.reviewName}>{review.user.name}</span>
                    {review.verified && (
                        <Badge tone="success" size="sm" icon={BadgeCheck}>
                            {t('Verified purchase')}
                        </Badge>
                    )}
                    <span className={styles.reviewDate}>{review.createdAt}</span>
                </div>
                <Rating value={review.rating} compact showValue={false} />
                {review.comment && <p className={styles.reviewText}>{review.comment}</p>}
            </div>
        </article>
    );
}

export type { ReviewCardProps, ReviewModel };
export default ReviewCard;

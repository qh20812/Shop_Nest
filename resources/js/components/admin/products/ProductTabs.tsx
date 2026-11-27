import { Star } from 'lucide-react';
import { useState } from 'react';

import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs } from '@/components/ui/tabs';
import { cx } from '@/lib/cx';
import { formatDate, formatDecimal } from '@/lib/format';
import { useTranslation } from '@/lib/i18n';
import { decodeHtmlEntities } from '@/utils/htmlUtils';

import styles from './products.module.css';

interface ReviewUser {
    id?: number;
    username?: string | null;
    first_name?: string | null;
    last_name?: string | null;
    avatar?: string | null;
}

interface Review {
    review_id: number;
    rating: number | string;
    comment?: string | null;
    is_approved?: boolean | number | string;
    created_at?: string | null;
    user?: ReviewUser | null;
}

interface ProductTabsProps {
    description?: string | Record<string, string> | null;
    reviews?: Review[];
}

const resolveDescription = (value: string | Record<string, string> | null | undefined, locale: string, fallback: string): string => {
    if (!value) {
        return fallback;
    }

    if (typeof value === 'string') {
        return value;
    }

    return value[locale] ?? value.en ?? Object.values(value)[0] ?? fallback;
};

export default function ProductTabs({ description, reviews = [] }: ProductTabsProps) {
    const { t, locale } = useTranslation();
    const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');

    const descriptionText = decodeHtmlEntities(resolveDescription(description, locale, ''));
    const averageRating = reviews.length > 0 ? reviews.reduce((total, review) => total + Number(review.rating ?? 0), 0) / reviews.length : 0;

    const renderStars = (rating: number) => (
        <span className={styles.stars} aria-label={`${rating}/5`}>
            {[1, 2, 3, 4, 5].map((position) => (
                <Star key={position} aria-hidden="true" className={cx(styles.star, position <= rating && styles.starFilled)} />
            ))}
        </span>
    );

    return (
        <section className={styles.tabsPanel}>
            <Tabs
                items={[
                    { value: 'description', label: t('Description') },
                    { value: 'reviews', label: t('Reviews'), count: reviews.length },
                ]}
                value={activeTab}
                onValueChange={(value) => setActiveTab(value as 'description' | 'reviews')}
                ariaLabel={t('Product Details')}
                className={styles.tabs}
            />

            <div className={styles.tabBody}>
                {activeTab === 'description' ? (
                    descriptionText ? (
                        <p className={styles.description}>{descriptionText}</p>
                    ) : (
                        <p className={styles.emptyNote}>{t('No description available')}</p>
                    )
                ) : reviews.length === 0 ? (
                    <p className={styles.emptyNote}>{t('No reviews yet')}</p>
                ) : (
                    <>
                        <div className={styles.ratingSummary}>
                            <span className={styles.averageValue}>{formatDecimal(averageRating)}</span>
                            <div className={styles.averageBody}>
                                {renderStars(Math.round(averageRating))}
                                <span className={styles.averageMeta}>
                                    {t('Average Rating')}: {reviews.length} {t('Reviews').toLowerCase()}
                                </span>
                            </div>
                        </div>

                        <ul className={styles.reviewList}>
                            {reviews.map((review) => {
                                const reviewer = review.user;
                                const reviewerName =
                                    [reviewer?.first_name, reviewer?.last_name].filter(Boolean).join(' ').trim() ||
                                    reviewer?.username ||
                                    t('Anonymous User');
                                const rating = Number(review.rating) || 0;
                                const isPendingReview = review.is_approved === false || review.is_approved === 0 || review.is_approved === '0';

                                return (
                                    <li key={review.review_id} className={styles.review}>
                                        <Avatar user={reviewer ?? undefined} size="sm" />
                                        <div className={styles.reviewBody}>
                                            <div className={styles.reviewHead}>
                                                <span className={styles.reviewName}>{reviewerName}</span>
                                                {renderStars(rating)}
                                                {isPendingReview && <Badge tone="warning">{t('Pending review')}</Badge>}
                                                {review.created_at && <span className={styles.reviewDate}>{formatDate(review.created_at)}</span>}
                                            </div>
                                            {review.comment && <p className={styles.reviewComment}>{decodeHtmlEntities(review.comment)}</p>}
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </>
                )}
            </div>
        </section>
    );
}

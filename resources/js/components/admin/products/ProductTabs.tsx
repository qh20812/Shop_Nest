import { MessageSquare, Star } from 'lucide-react';
import { useState } from 'react';

import { formatDate } from '../../../lib/format';
import { useTranslation } from '../../../lib/i18n';
import { decodeHtmlEntities } from '../../../utils/htmlUtils';
import { Tabs } from '../../ui/tabs';

import styles from './products.module.css';

interface Review {
    review_id: number;
    rating: number;
    comment: string;
    created_at: string;
    user: {
        user_id: number;
        username: string;
        first_name: string;
        last_name: string;
    };
}

interface ProductTabsProps {
    description: { en: string; vi: string };
    reviews: Review[];
}

export default function ProductTabs({ description, reviews }: ProductTabsProps) {
    const { t, locale } = useTranslation();
    const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description');

    const getDescription = (): string => {
        if (!description) return t('No description available');
        let desc = '';
        if (typeof description === 'string') {
            desc = description;
        } else {
            desc = description[locale as keyof typeof description] || description.en || t('No description available');
        }
        return decodeHtmlEntities(desc);
    };

    const renderStars = (rating: number) => {
        const stars = [];
        for (let index = 1; index <= 5; index += 1) {
            const filled = index <= rating;
            stars.push(<Star key={index} aria-hidden="true" className={`${styles.star} ${filled ? styles.starFilled : ''}`.trim()} />);
        }
        return stars;
    };

    return (
        <div className={styles.tabs}>
            <Tabs
                items={[
                    { value: 'description', label: t('Description') },
                    { value: 'reviews', label: t('Reviews'), count: reviews.length },
                ]}
                value={activeTab}
                onValueChange={(value) => setActiveTab(value as 'description' | 'reviews')}
                ariaLabel={t('Product details')}
            />

            <div className={styles.tabContent}>
                {activeTab === 'description' && <div className={styles.description}>{getDescription()}</div>}

                {activeTab === 'reviews' && (
                    <div className={styles.reviews}>
                        {reviews.length === 0 ? (
                            <div className={styles.noReviews}>
                                <MessageSquare aria-hidden="true" className={styles.noReviewsIcon} />
                                <p>{t('No reviews yet')}</p>
                                <p>{t('Be the first to review this product!')}</p>
                            </div>
                        ) : (
                            reviews.map((review) => {
                                const fullName = `${review.user.first_name || ''} ${review.user.last_name || ''}`.trim();

                                return (
                                    <article key={review.review_id} className={styles.review}>
                                        <div className={styles.reviewHead}>
                                            <span className={styles.reviewUser}>{fullName || review.user.username || t('Anonymous User')}</span>
                                            <span className={styles.stars} aria-label={`${review.rating}/5`}>
                                                {renderStars(review.rating)}
                                            </span>
                                            <span className={styles.reviewDate}>{formatDate(review.created_at)}</span>
                                        </div>
                                        <div className={styles.reviewComment}>{decodeHtmlEntities(review.comment)}</div>
                                    </article>
                                );
                            })
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

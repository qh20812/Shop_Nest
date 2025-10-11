import React, { useState } from 'react';
import { useTranslation } from '../../../lib/i18n';
import { decodeHtmlEntities } from '../../../utils/htmlUtils';

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

    // Helper function to get localized description with HTML entity decoding
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

    // Helper function to format date
    const formatDate = (dateString: string): string => {
        try {
            return new Date(dateString).toLocaleDateString(locale === 'vi' ? 'vi-VN' : 'en-US');
        } catch {
            return dateString;
        }
    };

    // Helper function to render star rating
    const renderStars = (rating: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <i
                    key={i}
                    className={`bx ${i <= rating ? 'bxs-star' : 'bx-star'} product-tabs__star ${
                        i <= rating ? 'product-tabs__star--filled' : ''
                    }`}
                ></i>
            );
        }
        return stars;
    };

    return (
        <div className="product-tabs">
            {/* Tab Navigation */}
            <div className="product-tabs__nav">
                <button
                    type="button"
                    className={`product-tabs__button ${
                        activeTab === 'description' ? 'product-tabs__button--active' : ''
                    }`}
                    onClick={() => setActiveTab('description')}
                >
                    {t('Description')}
                </button>
                <button
                    type="button"
                    className={`product-tabs__button ${
                        activeTab === 'reviews' ? 'product-tabs__button--active' : ''
                    }`}
                    onClick={() => setActiveTab('reviews')}
                >
                    {t('Reviews')} ({reviews.length})
                </button>
            </div>

            {/* Tab Content */}
            <div className="product-tabs__content">
                {activeTab === 'description' && (
                    <div className="product-tabs__description">
                        <div className="product-tabs__description-content">
                            {getDescription()}
                        </div>
                    </div>
                )}

                {activeTab === 'reviews' && (
                    <div className="product-tabs__reviews">
                        {reviews.length === 0 ? (
                            <div className="product-tabs__no-reviews">
                                <i className="bx bx-comment"></i>
                                <p>{t('No reviews yet')}</p>
                                <p>{t('Be the first to review this product!')}</p>
                            </div>
                        ) : (
                            <div className="product-tabs__reviews-list">
                                {reviews.map((review) => (
                                    <div key={review.review_id} className="product-tabs__review">
                                        <div className="product-tabs__review-header">
                                            <div className="product-tabs__review-user">
                                                <strong>
                                                    {(() => {
                                                        const fullName = `${review.user.first_name || ''} ${review.user.last_name || ''}`.trim();
                                                        return fullName || review.user.username || 'Anonymous User';
                                                    })()}
                                                </strong>
                                            </div>
                                            <div className="product-tabs__review-rating">
                                                {renderStars(review.rating)}
                                            </div>
                                            <div className="product-tabs__review-date">
                                                {formatDate(review.created_at)}
                                            </div>
                                        </div>
                                        <div className="product-tabs__review-comment">
                                            {decodeHtmlEntities(review.comment)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
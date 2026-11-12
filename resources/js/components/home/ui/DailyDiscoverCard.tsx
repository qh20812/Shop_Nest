import React from 'react';
import { useTranslation } from '@/lib/i18n';
import '@/../css/ProductCard.css';

interface DailyDiscoverCardProps {
    image: string;
    name: string;
    rating: number;
    currentPrice: number;
    originalPrice?: number;
    isSale?: boolean;
    isNew?: boolean;
    href?: string;
    onFavorite?: () => void;
    favorited?: boolean;
}

export default function DailyDiscoverCard({
    image,
    name,
    rating,
    currentPrice,
    originalPrice,
    isSale = false,
    isNew = false,
    href,
    onFavorite,
    favorited = false
}: DailyDiscoverCardProps) {

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const renderStars = (rating: number) => {
        const safeRating = rating ?? 0;
        const stars = [];
        const fullStars = Math.floor(safeRating);
        const hasHalfStar = safeRating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        // Full stars
        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <i key={`full-${i}`} className="bi bi-star-fill product-rating-star filled"></i>
            );
        }

        // Half star
        if (hasHalfStar) {
            stars.push(
                <i key="half" className="bi bi-star-half product-rating-star half"></i>
            );
        }

        // Empty stars
        for (let i = 0; i < emptyStars; i++) {
            stars.push(
                <i key={`empty-${i}`} className="bi bi-star product-rating-star empty"></i>
            );
        }

        return stars;
    };

    const { t } = useTranslation();

    return (
        <div className="product-card">
            {/* Favorite button remains clickable and will not trigger navigation when clicked */}
            <button
                className={`product-favorite-btn ${favorited ? 'favorited' : ''}`}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onFavorite?.(); }}
                  aria-label={favorited ? t('wishlist.remove') : t('wishlist.add')}
                aria-pressed={favorited}
            >
                {/* Inline SVGs so the filled/outline states are always available regardless of icon font */}
                {favorited ? (
                    <svg className="product-favorite-icon" viewBox="0 0 24 24" role="img" aria-hidden="true">
                        <path fill="currentColor" d="M12 21s-7-4.35-8.5-7A4.5 4.5 0 0 1 8 4.5 4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 4-2.5A4.5 4.5 0 0 1 20.5 14C19 16.65 12 21 12 21z"/>
                    </svg>
                ) : (
                    <svg className="product-favorite-icon" viewBox="0 0 24 24" role="img" aria-hidden="true">
                        <path fill="none" stroke="currentColor" strokeWidth="1.5" d="M12 21s-7-4.35-8.5-7A4.5 4.5 0 0 1 8 4.5a4.5 4.5 0 0 1 4 2.4 4.5 4.5 0 0 1 4-2.4A4.5 4.5 0 0 1 20.5 14C19 16.65 12 21 12 21z"/>
                    </svg>
                )}
            </button>

            {href ? (
                <a href={href} className="product-card-link" aria-label={name}>
                    <div className="product-card-image">
                        <div 
                            className="product-card-image-wrapper" 
                            style={{ backgroundImage: `url(${image})` }}
                            role="img"
                            aria-label={name}
                        />
                        {(isSale || isNew) && (
                            <div className="product-card-badges">
                                {isSale && typeof originalPrice === 'number' && originalPrice > currentPrice && (
                                    <span className="product-badge product-badge-sale">
                                        {Math.round(((originalPrice - currentPrice) / originalPrice) * 100)}%
                                    </span>
                                )}
                                {isNew && (
                                    <span className="product-badge product-badge-new">New</span>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="product-card-content">
                        <h3 className="product-card-title">{name}</h3>

                        <div className="product-card-rating">
                            <div className="product-rating-stars">
                                {renderStars(rating ?? 0)}
                            </div>
                            <p className="product-rating-value">({(rating ?? 0).toFixed(1)})</p>
                        </div>

                        <div className="product-card-price">
                            <div className="product-price-group">
                                <p className="product-current-price">{formatPrice(currentPrice)}</p>
                                {typeof originalPrice === 'number' && originalPrice > currentPrice && (
                                    <p className="product-original-price">{formatPrice(originalPrice)}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </a>
            ) : (
                <>
                    <div className="product-card-image">
                        <div 
                            className="product-card-image-wrapper" 
                            style={{ backgroundImage: `url(${image})` }}
                            role="img"
                            aria-label={name}
                        />
                        {(isSale || isNew) && (
                            <div className="product-card-badges">
                                {isSale && typeof originalPrice === 'number' && originalPrice > currentPrice && (
                                    <span className="product-badge product-badge-sale">
                                        {Math.round(((originalPrice - currentPrice) / originalPrice) * 100)}%
                                    </span>
                                )}
                                {isNew && (
                                    <span className="product-badge product-badge-new">New</span>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="product-card-content">
                        <h3 className="product-card-title">{name}</h3>

                        <div className="product-card-rating">
                            <div className="product-rating-stars">
                                {renderStars(rating ?? 0)}
                            </div>
                            <p className="product-rating-value">({(rating ?? 0).toFixed(1)})</p>
                        </div>

                        <div className="product-card-price">
                            <div className="product-price-group">
                                <p className="product-current-price">{formatPrice(currentPrice)}</p>
                                {typeof originalPrice === 'number' && originalPrice > currentPrice && (
                                    <p className="product-original-price">{formatPrice(originalPrice)}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

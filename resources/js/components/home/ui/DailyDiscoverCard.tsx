import React from 'react';
import '@/../css/ProductCard.css';

interface DailyDiscoverCardProps {
    image: string;
    name: string;
    rating: number;
    currentPrice: number;
    originalPrice?: number;
    isSale?: boolean;
    isNew?: boolean;
    onAddToCart?: () => void;
    onViewDetails?: () => void;
    onFavorite?: () => void;
}

export default function DailyDiscoverCard({
    image,
    name,
    rating,
    currentPrice,
    originalPrice,
    isSale = false,
    isNew = false,
    onAddToCart,
    onViewDetails,
    onFavorite
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

    return (
        <div className="product-card">
            <div className="product-card-image">
                <div 
                    className="product-card-image-wrapper" 
                    style={{ backgroundImage: `url(${image})` }}
                    role="img"
                    aria-label={name}
                />
                
                {(isSale || isNew) && (
                    <div className="product-card-badges">
                        {isSale && originalPrice && originalPrice > currentPrice && (
                            <span className="product-badge product-badge-sale">
                                {Math.round(((originalPrice - currentPrice) / originalPrice) * 100)}%
                            </span>
                        )}
                        {isNew && (
                            <span className="product-badge product-badge-new">New</span>
                        )}
                    </div>
                )}

                <button 
                    className="product-favorite-btn"
                    onClick={onFavorite}
                    aria-label="Add to favorites"
                >
                    <i className="bi bi-heart product-favorite-icon"></i>
                </button>
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
                        {originalPrice && originalPrice > currentPrice && (
                            <p className="product-original-price">{formatPrice(originalPrice)}</p>
                        )}
                    </div>
                </div>

                <div className="product-card-actions">
                    <button 
                        className="product-btn product-btn-primary"
                        onClick={onAddToCart}
                    >
                        <i className="bi bi-cart-plus product-btn-icon"></i>
                        <span className="product-btn-text">Add to Cart</span>
                    </button>
                    <button 
                        className="product-btn product-btn-secondary"
                        onClick={onViewDetails}
                    >
                        <span className="product-btn-text">View Details</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
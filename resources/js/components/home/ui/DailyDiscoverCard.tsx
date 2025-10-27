import React from 'react';

interface DailyDiscoverCardProps {
    image: string;
    name: string;
    discountPercent?: number | null;
    price: number;
    originalPrice?: number;
    rating: number;
    reviewCount: number;
    onClick?: () => void;
}

export default function DailyDiscoverCard({
    image,
    name,
    discountPercent,
    price,
    originalPrice,
    rating,
    reviewCount,
    onClick
}: DailyDiscoverCardProps) {
    const handleCardClick = () => {
        if (onClick) {
            onClick();
        }
    };

    const renderStars = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<i key={i} className="bi bi-star-fill"></i>);
        }

        if (hasHalfStar) {
            stars.push(<i key="half" className="bi bi-star-half"></i>);
        }

        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<i key={`empty-${i}`} className="bi bi-star"></i>);
        }

        return stars;
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    return (
        <div className="daily-discover-card" onClick={handleCardClick}>
            <div className="daily-card-image">
                <img src={image} alt={name} />
                {discountPercent && (
                    <div className="daily-discount-badge">-{discountPercent}%</div>
                )}
            </div>
            
            <div className="daily-card-content">
                <h3 className="daily-card-title">{name}</h3>
                
                <div className="daily-card-rating">
                    <div className="daily-rating-stars">
                        {renderStars(rating)}
                    </div>
                    <span className="daily-rating-count">({reviewCount})</span>
                </div>
                
                <div className="daily-card-price">
                    <span className="daily-sale-price">{formatPrice(price)}</span>
                    {originalPrice && originalPrice > price && (
                        <span className="daily-original-price">{formatPrice(originalPrice)}</span>
                    )}
                </div>
            </div>
            
            <div className="daily-card-hover-action">
                <span>Tìm sản phẩm tương tự</span>
            </div>
        </div>
    );
}
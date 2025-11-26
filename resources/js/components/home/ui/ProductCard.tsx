import React from 'react';
import { Link } from '@inertiajs/react';
import '@/../css/home-style/search-product-card.css';

interface ProductCardProps {
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

export default function ProductCard({
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
}: ProductCardProps) {

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

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <i key={`full-${i}`} className="bi bi-star-fill search-product-rating-star filled"></i>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <i key="half" className="bi bi-star-half search-product-rating-star half"></i>
      );
    }

    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <i key={`empty-${i}`} className="bi bi-star search-product-rating-star empty"></i>
      );
    }

    return stars;
  };

  return (
    <div className="search-product-card">
      <button
        className={`search-product-favorite-btn ${favorited ? 'favorited' : ''}`}
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onFavorite?.(); }}
        aria-label={favorited ? 'Remove from wishlist' : 'Add to wishlist'}
        aria-pressed={favorited}
      >
        {favorited ? (
          <svg className="search-product-favorite-icon" viewBox="0 0 24 24" role="img" aria-hidden="true">
            <path fill="currentColor" d="M12 21s-7-4.35-8.5-7A4.5 4.5 0 0 1 8 4.5 4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 4-2.5A4.5 4.5 0 0 1 20.5 14C19 16.65 12 21 12 21z"/>
          </svg>
        ) : (
          <svg className="search-product-favorite-icon" viewBox="0 0 24 24" role="img" aria-hidden="true">
            <path fill="none" stroke="currentColor" strokeWidth="1.5" d="M12 21s-7-4.35-8.5-7A4.5 4.5 0 0 1 8 4.5a4.5 4.5 0 0 1 4 2.4 4.5 4.5 0 0 1 4-2.4A4.5 4.5 0 0 1 20.5 14C19 16.65 12 21 12 21z"/>
          </svg>
        )}
      </button>

      {href ? (
        <Link href={href} className="search-product-card-link" aria-label={name}>
          <div className="search-product-card-image">
            <div
              className="search-product-card-image-wrapper"
              style={{ backgroundImage: `url(${image})` }}
              role="img"
              aria-label={name}
            />
            {(isSale || isNew) && (
              <div className="search-product-card-badges">
                        {isSale && typeof originalPrice === 'number' && originalPrice > currentPrice && (
                  <span className="search-product-badge search-product-badge-sale">
                    {Math.round(((originalPrice - currentPrice) / originalPrice) * 100)}%
                  </span>
                )}
                {isNew && (
                  <span className="search-product-badge search-product-badge-new">New</span>
                )}
              </div>
            )}
          </div>

          <div className="search-product-card-content">
            <h3 className="search-product-card-title">{name}</h3>

            <div className="search-product-card-rating">
              <div className="search-product-rating-stars">
                {renderStars(rating ?? 0)}
              </div>
              <p className="search-product-rating-value">({(rating ?? 0).toFixed(1)})</p>
            </div>

            <div className="search-product-card-price">
              <div className="search-product-price-group">
                <p className="search-product-current-price">{formatPrice(currentPrice)}</p>
                {typeof originalPrice === 'number' && originalPrice > currentPrice && (
                  <p className="search-product-original-price">{formatPrice(originalPrice)}</p>
                )}
              </div>
            </div>
          </div>
          </Link>
      ) : (
        <>
          <div className="search-product-card-image">
            <div
              className="search-product-card-image-wrapper"
              style={{ backgroundImage: `url(${image})` }}
              role="img"
              aria-label={name}
            />
            {(isSale || isNew) && (
              <div className="search-product-card-badges">
                {isSale && typeof originalPrice === 'number' && originalPrice > currentPrice && (
                  <span className="search-product-badge search-product-badge-sale">
                    {Math.round(((originalPrice - currentPrice) / originalPrice) * 100)}%
                  </span>
                )}
                {isNew && (
                  <span className="search-product-badge search-product-badge-new">New</span>
                )}
              </div>
            )}
          </div>

          <div className="search-product-card-content">
            <h3 className="search-product-card-title">{name}</h3>

            <div className="search-product-card-rating">
              <div className="search-product-rating-stars">
                {renderStars(rating ?? 0)}
              </div>
              <p className="search-product-rating-value">({(rating ?? 0).toFixed(1)})</p>
            </div>

            <div className="search-product-card-price">
              <div className="search-product-price-group">
                <p className="search-product-current-price">{formatPrice(currentPrice)}</p>
                {typeof originalPrice === 'number' && originalPrice > currentPrice && (
                  <p className="search-product-original-price">{formatPrice(originalPrice)}</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

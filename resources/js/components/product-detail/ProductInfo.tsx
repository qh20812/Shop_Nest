import React from 'react';

interface RatingSummary {
  average: number;
  count: number;
}

interface ProductInfoProps {
  name: string;
  brandName?: string | null;
  categoryName?: string | null;
  rating: RatingSummary;
  soldCount: number;
  minPrice: number;
  maxPrice: number;
  selectedPrice?: number | null;
  selectedOriginalPrice?: number | null;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);
}

export default function ProductInfo({
  name,
  brandName,
  categoryName,
  rating,
  soldCount,
  minPrice,
  maxPrice,
  selectedPrice,
  selectedOriginalPrice,
}: ProductInfoProps) {
  const hasPriceRange = minPrice !== maxPrice;
  const priceLabel = hasPriceRange
    ? `${formatCurrency(minPrice)} - ${formatCurrency(maxPrice)}`
    : formatCurrency(minPrice);

  const activePrice = selectedPrice ?? minPrice;
  const originalPrice = typeof selectedOriginalPrice === 'number' && selectedOriginalPrice > activePrice ? selectedOriginalPrice : null;

  return (
    <div className="product-info-panel">
      <div className="product-info-header">
        <h1 className="product-title">{name}</h1>
        <div className="product-meta">
          {brandName && <span className="product-meta-item">Thương hiệu: <strong>{brandName}</strong></span>}
          {categoryName && <span className="product-meta-item">Danh mục: <strong>{categoryName}</strong></span>}
        </div>
        <div className="product-rating-row">
          <div className="product-rating">
            <span className="rating-value">{rating.average.toFixed(1)}</span>
            <div className="rating-stars" aria-label={`Đánh giá trung bình ${rating.average.toFixed(1)} trên 5`}>
              {[1, 2, 3, 4, 5].map((star) => (
                <i
                  key={star}
                  className={`bi ${rating.average >= star ? 'bi-star-fill' : rating.average >= star - 0.5 ? 'bi-star-half' : 'bi-star'}`}
                />
              ))}
            </div>
            <span className="rating-count">({rating.count} đánh giá)</span>
          </div>
          <div className="product-sold">Đã bán {soldCount}</div>
        </div>
      </div>

      <div className="product-price-box">
        <div className="product-price-current">{formatCurrency(activePrice)}</div>
        {typeof originalPrice === 'number' && (
          <div className="product-price-original">{formatCurrency(originalPrice)}</div>
        )}
        {selectedPrice == null && (
          <div className="product-price-range">{priceLabel}</div>
        )}
      </div>
    </div>
  );
}

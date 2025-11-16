import React from 'react';
import { formatVnd, toNumericPrice, type PriceLike } from '@/utils/price';
import { resolveLocalizedString, type LocalizedValue } from '@/utils/localization';

interface ProductCardProps {
  image: string;
  name: LocalizedValue;
  variant?: LocalizedValue;
  price: PriceLike;
  originalPrice?: PriceLike;
  quantity?: number | string;
  showQuantity?: boolean;
  onRemove?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  image,
  name,
  variant,
  price,
  originalPrice,
  quantity = 1,
  showQuantity = true,
  onRemove,
}) => {
  const textLocale = typeof window !== 'undefined' ? window.navigator?.language ?? 'vi' : 'vi';
  const currencyLocale = 'vi-VN';
  const resolvedName = resolveLocalizedString(name, textLocale);
  const resolvedVariant = variant ? resolveLocalizedString(variant, textLocale) : '';
  const numericQuantity = (() => {
    if (typeof quantity === 'number' && Number.isFinite(quantity)) {
      return Math.max(1, Math.floor(quantity));
    }

    const parsed = Number(quantity);
    return Number.isFinite(parsed) && parsed > 0 ? Math.max(1, Math.floor(parsed)) : 1;
  })();
  const safePrice = toNumericPrice(price);
  const originalPriceValue =
    typeof originalPrice !== 'undefined' ? toNumericPrice(originalPrice) : null;
  const showOriginal = originalPriceValue !== null && originalPriceValue > safePrice;
  const total = safePrice * numericQuantity;

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: '80px 1fr auto', 
      gap: 'var(--spacing-md)', 
      padding: 'var(--spacing-md)', 
      background: 'var(--surface)', 
      borderRadius: 'var(--border-radius-md)', 
      border: '1px solid var(--border-color)', 
      transition: 'all var(--transition-normal)' 
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = 'none';
    }}
    >
      {/* Product Image */}
      <img 
        src={image} 
        alt={resolvedName || 'Product image'} 
        style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--grey)' }}
      />
      
      {/* Product Details */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 'var(--line-height-tight)', margin: 0 }}>
          {resolvedName}
        </h3>
        
        {resolvedVariant && (
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
            {resolvedVariant}
          </p>
        )}
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)', marginTop: '4px' }}>
          <span style={{ fontSize: 'var(--font-size-base)', fontWeight: 600, color: 'var(--danger)' }}>
            {formatVnd(safePrice, currencyLocale)}
          </span>
          {showOriginal && originalPriceValue !== null && (
            <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--dark-grey)', textDecoration: 'line-through' }}>
              {formatVnd(originalPriceValue, currencyLocale)}
            </span>
          )}
        </div>
      </div>
      
      {/* Quantity & Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 'var(--spacing-xs)' }}>
        {showQuantity && (
          <>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', margin: 0 }}>
              x{numericQuantity}
            </p>
            <p style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
          {formatVnd(total, currencyLocale)}
            </p>
          </>
        )}
        
        {onRemove && (
          <button
            onClick={onRemove}
            style={{ 
              padding: 'var(--spacing-xs)', 
              color: 'var(--danger)', 
              fontSize: 'var(--font-size-xl)', 
              background: 'transparent', 
              border: 'none', 
              borderRadius: '50%', 
              cursor: 'pointer', 
              transition: 'background var(--transition-normal)' 
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--light-danger)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
            aria-label="Remove item"
          >
            <i className="fas fa-times"></i>
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;

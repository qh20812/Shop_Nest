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
    <div className="grid grid-cols-[80px_1fr_auto] gap-4 p-4 bg-white rounded-lg border border-gray-200 transition-all duration-300 hover:shadow-lg">
      {/* Product Image */}
      <img 
        src={image} 
        alt={resolvedName || 'Product image'} 
        className="w-20 h-20 object-cover rounded-md border border-gray-100"
      />
      
      {/* Product Details */}
      <div className="flex flex-col gap-1.5">
        <h3 className="text-[15px] font-semibold text-gray-900 leading-tight">
          {resolvedName}
        </h3>
        
        {resolvedVariant && (
          <p className="text-[13px] text-gray-500">
            {resolvedVariant}
          </p>
        )}
        
        <div className="flex items-center gap-2 mt-1">
          <span className="text-base font-semibold text-red-600">
            {formatVnd(safePrice, currencyLocale)}
          </span>
          {showOriginal && originalPriceValue !== null && (
            <span className="text-sm text-gray-400 line-through">
              {formatVnd(originalPriceValue, currencyLocale)}
            </span>
          )}
        </div>
      </div>
      
      {/* Quantity & Actions */}
      <div className="flex flex-col items-end gap-2">
        {showQuantity && (
          <>
            <p className="text-sm text-gray-500">
              x{numericQuantity}
            </p>
            <p className="text-[17px] font-bold text-gray-900">
          {formatVnd(total, currencyLocale)}
            </p>
          </>
        )}
        
        {onRemove && (
          <button
            onClick={onRemove}
            className="p-1.5 text-red-600 text-xl hover:bg-red-50 rounded transition-colors duration-200"
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

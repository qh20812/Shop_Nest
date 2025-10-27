import React from 'react';

interface ProductCardProps {
  image: string;
  name: string;
  variant?: string;
  price: number;
  originalPrice?: number;
  quantity?: number;
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
  return (
    <div className="grid grid-cols-[80px_1fr_auto] gap-4 p-4 bg-white rounded-lg border border-gray-200 transition-all duration-300 hover:shadow-lg">
      {/* Product Image */}
      <img 
        src={image} 
        alt={name} 
        className="w-20 h-20 object-cover rounded-md border border-gray-100"
      />
      
      {/* Product Details */}
      <div className="flex flex-col gap-1.5">
        <h3 className="text-[15px] font-semibold text-gray-900 leading-tight">
          {name}
        </h3>
        
        {variant && (
          <p className="text-[13px] text-gray-500">
            {variant}
          </p>
        )}
        
        <div className="flex items-center gap-2 mt-1">
          <span className="text-base font-semibold text-red-600">
            {price.toLocaleString('vi-VN')}₫
          </span>
          {originalPrice && (
            <span className="text-sm text-gray-400 line-through">
              {originalPrice.toLocaleString('vi-VN')}₫
            </span>
          )}
        </div>
      </div>
      
      {/* Quantity & Actions */}
      <div className="flex flex-col items-end gap-2">
        {showQuantity && (
          <>
            <p className="text-sm text-gray-500">
              x{quantity}
            </p>
            <p className="text-[17px] font-bold text-gray-900">
              {(price * quantity).toLocaleString('vi-VN')}₫
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

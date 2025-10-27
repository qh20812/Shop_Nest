import React from 'react';
import QuantitySelector from './QuantitySelector';

interface CartProduct {
  id: number;
  name: string;
  image: string;
  variant: string;
  price: number;
  quantity: number;
  maxQuantity?: number;
}

interface CartProductItemProps {
  product: CartProduct;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}

export default function CartProductItem({ 
  product, 
  isSelected, 
  onSelect, 
  onQuantityChange, 
  onRemove 
}: CartProductItemProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const subtotal = product.price * product.quantity;

  return (
    <div className="grid grid-cols-[40px_2.5fr_1fr_1.2fr_1fr_1fr] gap-4 items-center p-5 border-b border-[var(--grey)] transition-colors duration-300 hover:bg-[var(--light)] last:border-b-0">
      <div className="flex items-center justify-center">
        <input 
          type="checkbox"
          id={`product-${product.id}`}
          className="w-[18px] h-[18px] accent-[var(--primary)] cursor-pointer"
          checked={isSelected}
          onChange={(e) => onSelect(e.target.checked)}
        />
      </div>
      
      <div className="flex gap-3 items-center">
        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-[var(--dark)] m-0 mb-2 font-['Poppins',sans-serif] leading-[1.4] line-clamp-2">
            {product.name}
          </h4>
          <div className="text-xs text-[var(--dark-grey)] bg-[var(--light)] px-2 py-1 rounded inline-block">
            <span>Phân loại hàng: {product.variant}</span>
          </div>
        </div>
      </div>

      <div className="text-center">
        <span className="font-semibold text-[var(--primary)] font-['Poppins',sans-serif]">
          {formatPrice(product.price)}
        </span>
      </div>

      <div className="flex justify-center">
        <QuantitySelector
          value={product.quantity}
          onChange={onQuantityChange}
          max={product.maxQuantity || 999}
        />
      </div>

      <div className="text-center">
        <span className="font-semibold text-[var(--primary)] font-['Poppins',sans-serif]">
          {formatPrice(subtotal)}
        </span>
      </div>

      <div className="flex justify-center">
        <button 
          className="bg-transparent border border-[var(--danger)] text-[var(--danger)] px-3 py-2 rounded cursor-pointer text-xs transition-all duration-300 flex items-center gap-1.5 font-['Poppins',sans-serif] hover:bg-[var(--danger)] hover:text-white"
          onClick={onRemove}
          type="button"
        >
          <i className="bi bi-trash"></i>
          Xóa
        </button>
      </div>
    </div>
  );
}
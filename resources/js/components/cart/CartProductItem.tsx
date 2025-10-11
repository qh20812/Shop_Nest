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
    <div className="cart-product-item">
      <div className="cart-product-checkbox">
        <input 
          type="checkbox"
          id={`product-${product.id}`}
          className="cart-checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(e.target.checked)}
        />
      </div>
      
      <div className="cart-product-info">
        <div className="cart-product-image">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="cart-product-details">
          <h4 className="cart-product-name">{product.name}</h4>
          <div className="cart-product-variant">
            <span>Phân loại hàng: {product.variant}</span>
          </div>
        </div>
      </div>

      <div className="cart-product-price">
        <span className="product-unit-price">{formatPrice(product.price)}</span>
      </div>

      <div className="cart-product-quantity">
        <QuantitySelector
          value={product.quantity}
          onChange={onQuantityChange}
          max={product.maxQuantity || 999}
        />
      </div>

      <div className="cart-product-subtotal">
        <span className="product-subtotal">{formatPrice(subtotal)}</span>
      </div>

      <div className="cart-product-actions">
        <button 
          className="cart-remove-btn"
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
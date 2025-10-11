import React from 'react';
import CartProductItem from './CartProductItem';

interface CartProduct {
  id: number;
  name: string;
  image: string;
  variant: string;
  price: number;
  quantity: number;
  maxQuantity?: number;
}

interface Shop {
  id: number;
  name: string;
  products: CartProduct[];
}

interface CartShopCardProps {
  shop: Shop;
  selectedProducts: number[];
  onSelectShop: (checked: boolean) => void;
  onSelectProduct: (productId: number, checked: boolean) => void;
  onQuantityChange: (productId: number, quantity: number) => void;
  onRemoveProduct: (productId: number) => void;
}

export default function CartShopCard({
  shop,
  selectedProducts,
  onSelectShop,
  onSelectProduct,
  onQuantityChange,
  onRemoveProduct
}: CartShopCardProps) {
  const isShopSelected = shop.products.every(product => 
    selectedProducts.includes(product.id)
  );

  const handleShopSelect = (checked: boolean) => {
    onSelectShop(checked);
  };

  return (
    <div className="cart-shop-card">
      <div className="cart-shop-header">
        <div className="cart-shop-info">
          <input 
            type="checkbox"
            id={`shop-${shop.id}`}
            className="cart-checkbox"
            checked={isShopSelected}
            onChange={(e) => handleShopSelect(e.target.checked)}
          />
          <i className="bi bi-shop cart-shop-icon"></i>
          <span className="cart-shop-name">{shop.name}</span>
        </div>
        <div className="cart-shop-actions">
          <button className="cart-chat-btn" type="button">
            <i className="bi bi-chat-dots"></i>
            Chat
          </button>
        </div>
      </div>
      
      <div className="cart-shop-products">
        {shop.products.map(product => (
          <CartProductItem
            key={product.id}
            product={product}
            isSelected={selectedProducts.includes(product.id)}
            onSelect={(checked) => onSelectProduct(product.id, checked)}
            onQuantityChange={(quantity) => onQuantityChange(product.id, quantity)}
            onRemove={() => onRemoveProduct(product.id)}
          />
        ))}
      </div>
    </div>
  );
}
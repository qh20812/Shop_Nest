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
    <div className="bg-[var(--light-2)] rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="p-4 border-b border-[var(--grey)] flex justify-between items-center bg-[var(--light)]">
        <div className="flex items-center gap-3">
          <input 
            type="checkbox"
            id={`shop-${shop.id}`}
            className="w-[18px] h-[18px] accent-[var(--primary)] cursor-pointer"
            checked={isShopSelected}
            onChange={(e) => handleShopSelect(e.target.checked)}
          />
          <i className="bi bi-shop text-[var(--primary)] text-base"></i>
          <span className="font-semibold text-[var(--dark)] font-['Poppins',sans-serif]">
            {shop.name}
          </span>
        </div>
        <div className="flex gap-2">
          <button 
            className="bg-transparent border border-[var(--primary)] text-[var(--primary)] px-3 py-1.5 rounded text-[13px] cursor-pointer transition-all duration-300 flex items-center gap-1.5 font-['Poppins',sans-serif] hover:bg-[var(--primary)] hover:text-white" 
            type="button"
          >
            <i className="bi bi-chat-dots"></i>
            Chat
          </button>
        </div>
      </div>
      
      <div className="flex flex-col">
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
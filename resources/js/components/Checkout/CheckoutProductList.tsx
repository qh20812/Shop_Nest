import React from 'react';
import ProductCard from '@/Components/Shared/ProductCard';
import { toNumericPrice, type PriceLike } from '@/utils/price';
import { type LocalizedValue } from '@/utils/localization';

interface ProductImage {
  id: number;
  image_path: string;
}

interface Product {
  id: number;
  name: LocalizedValue;
  slug: string;
  images: ProductImage[];
}

interface Variant {
  id: number;
  sku: string;
  size?: LocalizedValue;
  color?: LocalizedValue;
  price: PriceLike;
  discount_price?: PriceLike;
  product: Product;
}

interface CartItem {
  id: number;
  product_name: LocalizedValue;
  quantity: number;
  price: PriceLike;
  discount_price?: PriceLike;
  total_price: PriceLike;
  variant?: Variant;
  product?: Product;
}

interface OrderItem {
  id: number;
  variant_id: number;
  product_name: LocalizedValue;
  variant_name: LocalizedValue;
  quantity: number;
  unit_price: PriceLike;
  total_price: PriceLike;
  image?: string;
}

interface CheckoutProductListProps {
  items: (CartItem | OrderItem)[];
  getProductImage: (item: CartItem | OrderItem) => string;
  getVariantText: (item: CartItem | OrderItem) => string;
  getItemPrice: (item: CartItem | OrderItem) => PriceLike;
  getOriginalPrice: (item: CartItem | OrderItem) => PriceLike | null;
}

const CheckoutProductList: React.FC<CheckoutProductListProps> = ({
  items,
  getProductImage,
  getVariantText,
  getItemPrice,
  getOriginalPrice,
}) => {
  return (
    <div className="checkout-section checkout-product-list">
      <div className="checkout-section__header">
        <i className="checkout-section__icon fas fa-shopping-bag" aria-hidden="true"></i>
        <h3 className="checkout-section__title">
          Sản phẩm đặt hàng
        </h3>
      </div>
      
      <div className="checkout-product-list__items">
        {items.map((item, index) => {
          const image = getProductImage(item);
          const variant = getVariantText(item);
          const price = toNumericPrice(getItemPrice(item));
          const rawOriginalPrice = getOriginalPrice(item);
          const originalPrice = rawOriginalPrice !== null ? toNumericPrice(rawOriginalPrice) : null;

          return (
            <ProductCard
              key={index}
              image={image}
              name={item.product_name}
              variant={variant}
              price={price}
              originalPrice={originalPrice ?? undefined}
              quantity={item.quantity}
              showQuantity={true}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CheckoutProductList;

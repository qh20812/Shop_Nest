import React from 'react';
import ProductCard from '@/Components/Shared/ProductCard';

interface ProductImage {
  id: number;
  image_path: string;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  images: ProductImage[];
}

interface Variant {
  id: number;
  sku: string;
  size?: string;
  color?: string;
  price: number;
  sale_price?: number;
  product: Product;
}

interface CartItem {
  id: number;
  product_name: string;
  quantity: number;
  total_price: number;
  variant?: Variant;
  product?: Product;
}

interface OrderItem {
  id: number;
  variant_id: number;
  product_name: string;
  variant_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  image?: string;
}

interface CheckoutProductListProps {
  items: (CartItem | OrderItem)[];
  getProductImage: (item: CartItem | OrderItem) => string;
  getVariantText: (item: CartItem | OrderItem) => string;
  getItemPrice: (item: CartItem | OrderItem) => number;
  getOriginalPrice: (item: CartItem | OrderItem) => number | null;
}

const CheckoutProductList: React.FC<CheckoutProductListProps> = ({
  items,
  getProductImage,
  getVariantText,
  getItemPrice,
  getOriginalPrice,
}) => {
  return (
    <div className="bg-gray-50 rounded-lg p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <i className="fas fa-shopping-bag text-primary"></i>
        <h3 className="text-lg font-semibold text-gray-900">
          Sản phẩm đặt hàng
        </h3>
      </div>
      
      <div className="space-y-4">
        {items.map((item, index) => {
          const image = getProductImage(item);
          const variant = getVariantText(item);
          const price = getItemPrice(item);
          const originalPrice = getOriginalPrice(item);

          return (
            <ProductCard
              key={index}
              image={image}
              name={item.product_name}
              variant={variant}
              price={price}
              originalPrice={originalPrice || undefined}
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

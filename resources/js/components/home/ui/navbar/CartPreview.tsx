import React from 'react'
import { Link } from '@inertiajs/react'

interface CartItem {
  cart_item_id: number;
  variant_id: number;
  quantity: number;
  price: number;
  discount_price?: number;
  subtotal: number;
  variant: {
    variant_id: number;
    sku: string;
    price: number;
    discount_price?: number;
    stock_quantity: number;
    available_quantity: number;
    reserved_quantity: number;
    product: {
      product_id: number;
      name: string;
    } | null;
  };
}

interface CartPreviewProps {
  cartItems: CartItem[];
}

export default function CartPreview({ cartItems }: CartPreviewProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <div
      className="cart-preview"
      role="region"
      aria-label="Cart preview"
      aria-live="polite"
    >
      <div className="cart-preview-header">
        <h3>{cartItems.length > 0 ? `Sản phẩm mới thêm (${cartItems.length})` : 'Giỏ hàng'}</h3>
      </div>
      <div className="cart-preview-content">
        {cartItems.length === 0 ? (
          <div className="cart-empty" role="status" aria-live="polite">
            <i className="bi bi-cart-x" aria-hidden="true"></i>
            <span>Chưa có sản phẩm trong giỏ hàng</span>
          </div>
        ) : (
          <div className="cart-items" role="list" aria-label="Cart items">
            {cartItems.slice(0, 3).map((item, index) => (
              <div
                key={item.cart_item_id}
                className="cart-preview-item"
                role="listitem"
                aria-label={`Product ${index + 1}: ${item.variant.product?.name || 'Unknown Product'}`}
              >
                <img
                  src="/image/ShopnestLogo.png"
                  alt={item.variant.product?.name || 'Product image'}
                  className="cart-item-image"
                  loading="lazy"
                />
                <div className="cart-item-info">
                  <div className="cart-item-name" title={item.variant.product?.name}>
                    {item.variant.product?.name || 'Unknown Product'}
                  </div>
                  <div className="cart-item-variant" aria-label={`Variant: ${item.variant.sku}`}>
                    {item.variant.sku}
                  </div>
                  <div
                    className="cart-item-price"
                    aria-label={`Price: ${formatPrice(item.price)} for ${item.quantity} items`}
                  >
                    {formatPrice(item.price)} x {item.quantity}
                  </div>
                </div>
              </div>
            ))}
            {cartItems.length > 3 && (
              <div
                className="cart-more-items"
                role="status"
                aria-live="polite"
                aria-label={`And ${cartItems.length - 3} more items in cart`}
              >
                Và {cartItems.length - 3} sản phẩm khác...
              </div>
            )}
          </div>
        )}
      </div>
      <div className="cart-preview-footer">
        <Link
          href="/cart"
          className="view-cart-btn"
          aria-label={`View full cart with ${cartItems.length} items`}
        >
          Xem giỏ hàng
        </Link>
      </div>
    </div>
  );
}

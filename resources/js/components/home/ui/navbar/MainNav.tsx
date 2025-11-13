import React from 'react'
import { Link } from '@inertiajs/react'
import CartPreview from './CartPreview'

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

interface MainNavProps {
  cartItems: CartItem[];
}

export default function MainNav({ cartItems }: MainNavProps) {
  return (
    <div className="main-nav">
      <div className="nav-logo">
        <a href="/">
          <img src="/image/ShopnestLogo.png" alt="ShopNest" />
          <span>ShopNest</span>
        </a>
      </div>
      <div className="nav-search">
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Tìm kiếm sản phẩm, thương hiệu và nhiều hơn nữa..."
          />
        </div>
      </div>
      <div className="nav-cart">
        <Link href="/cart" className="cart-link">
          <i className="bi bi-cart3"></i>
          <span className="cart-count">{cartItems.length}</span>
        </Link>
        <CartPreview cartItems={cartItems} />
      </div>
    </div>
  );
}
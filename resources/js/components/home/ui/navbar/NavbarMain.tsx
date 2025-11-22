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

interface NavbarMainProps {
  cartItems: CartItem[];
  isLoggedIn: boolean;
}

export default function NavbarMain({ cartItems, isLoggedIn }: NavbarMainProps) {
  return (
    <nav className="navbar-main">
      <div className="navbar-container-fluid">
        {/* Logo (visible on all screens) */}
        <Link href="/" className="navbar-logo">
          <div className="navbar-logo-icon">
            
          </div>
          <h1 className="navbar-logo-text">ShopNest</h1>
        </Link>

        {/* Search Bar */}
        <div className="navbar-search-wrapper">
          <div className="navbar-search-container">
            <div className="navbar-search-input-wrapper">
              <input
                type="text"
                className="navbar-search-input"
                placeholder="Search products..."
              />
              <button className="navbar-search-button">
                <i className="bi bi-search"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Action Icons */}
        <div className="navbar-actions">
          <Link href="/cart" className="navbar-icon-button">
            <i className="bi bi-cart3"></i>
            {cartItems.length > 0 && (
              <span className="navbar-badge">{cartItems.length}</span>
            )}
          </Link>
          {isLoggedIn && (
            <Link href="/wishlist" className="navbar-icon-button">
              <i className="bi bi-heart"></i>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
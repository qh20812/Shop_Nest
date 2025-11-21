import React from 'react'
import { Link } from '@inertiajs/react'
import { useTranslation } from '@/lib/i18n'
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor'

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
  const { t } = useTranslation();
  
  // Performance monitoring
  usePerformanceMonitor('NavbarMain');

  return (
    <nav className="navbar-main">
      <div className="navbar-container-fluid">
        {/* Logo */}
        <Link href="/" className="navbar-logo">
          <div className="navbar-logo-icon">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M4 42.4379C4 42.4379 14.0962 36.0744 24 41.1692C35.0664 46.8624 44 42.2078 44 42.2078L44 7.01134C44 7.01134 35.068 11.6577 24.0031 5.96913C14.0971 0.876274 4 7.27094 4 7.27094L4 42.4379Z"
                fill="currentColor"
              />
            </svg>
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
                placeholder={t('Search products...')}
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
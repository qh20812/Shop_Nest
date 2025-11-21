import React, { useState } from 'react'
import { usePage, Link } from '@inertiajs/react'
import { useTranslation } from '@/lib/i18n'
import DropdownErrorBoundary from './navbar/DropdownErrorBoundary';
import '@/../css/navbar.css';

interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
}

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

interface PageProps {
  auth: {
    user: User | null;
  };
  locale: string;
  currency: string;
  cartItems?: CartItem[];
  [key: string]: unknown;
}

export default function Navbar() {
  const { auth, locale, cartItems = [] } = usePage<PageProps>().props;
  const { t } = useTranslation();
  const isLoggedIn = !!auth.user;
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);

  return (
    <header className="navbar-sticky">
      <DropdownErrorBoundary>
        {/* Top Navigation Bar */}
        <div className="navbar-top">
          <div className="navbar-container-fluid">
            <div className="navbar-top-left">
              <div className="navbar-dropdown-wrapper">
                <button 
                  className="navbar-link-hover navbar-flex-center"
                  onClick={() => setShowLangDropdown(!showLangDropdown)}
                >
                  <span>{locale.toUpperCase()}</span>
                  <i className="bi bi-chevron-down navbar-icon-sm"></i>
                </button>
                {showLangDropdown && (
                  <div className="navbar-dropdown">
                    <Link href="/language" method="post" data={{ locale: 'vi' }} className="navbar-dropdown-item">
                      Tiếng Việt
                    </Link>
                    <Link href="/language" method="post" data={{ locale: 'en' }} className="navbar-dropdown-item">
                      English
                    </Link>
                  </div>
                )}
              </div>
              <Link href={route('seller.register')} className="navbar-link-hover">
                {t('Become a Seller')}
              </Link>
            </div>
            <div className="navbar-top-right">
              {isLoggedIn ? (
                <div className="navbar-dropdown-wrapper">
                  <button 
                    className="navbar-link-hover navbar-flex-center"
                    onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                  >
                    <i className="bi bi-person navbar-icon-md"></i>
                    <span>{auth.user?.username}</span>
                    <i className="bi bi-chevron-down navbar-icon-sm"></i>
                  </button>
                  {showAccountDropdown && (
                    <div className="navbar-dropdown">
                      <Link href="/user/profile" className="navbar-dropdown-item">
                        <i className="bi bi-person"></i>
                        {t('My Profile')}
                      </Link>
                      <Link href="/user/orders" className="navbar-dropdown-item">
                        <i className="bi bi-box"></i>
                        {t('My Orders')}
                      </Link>
                      <Link href="/logout" method="post" className="navbar-dropdown-item">
                        <i className="bi bi-box-arrow-right"></i>
                        {t('Logout')}
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/login" className="navbar-link-hover">
                  {t('Login')}
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Main Navigation Bar */}
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
      </DropdownErrorBoundary>
    </header>
  );
}

import React, { useState } from 'react'
import { Link, router } from '@inertiajs/react'
import { usePage } from '@inertiajs/react'

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
  cartItems?: CartItem[];
  [key: string]: unknown;
}

export default function Navbar() {
  const { auth, locale, cartItems = [] } = usePage<PageProps>().props;
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  
  const isLoggedIn = !!auth.user;

  return (
    <nav className='home-navbar'>
      <div className="navbar-container">
        <div className="top-nav">
          <div className="top-nav-left">
            <a href="#" className="seller-link">
              <i className="bi bi-shop"></i>
              Kênh Người Bán
            </a>
          </div>
          <div className="top-nav-right">
            {isLoggedIn && (
              <Link href="/notifications" className="nav-item notification-item">
                <i className="bi bi-bell"></i>
                {locale === 'vi' ? 'Thông báo' : 'Notifications'}
              </Link>
            )}
            <a href="#" className="nav-item help-item">
              <i className="bi bi-question-circle"></i>
              Hỗ trợ
            </a>
            <div className="lang-dropdown">
              <span 
                className="lang-current"
                onClick={() => setShowLangMenu(!showLangMenu)}
              >
                <i className="bi bi-globe"></i>
                {locale === 'vi' ? 'Tiếng Việt' : 'English'}
                <i className="bi bi-chevron-down"></i>
              </span>
              {showLangMenu && (
                <div className="lang-menu">
                  <button 
                    onClick={() => {
                      router.post('/language', { locale: 'vi' });
                      setShowLangMenu(false);
                    }}
                    className={`lang-option ${locale === 'vi' ? 'active' : ''}`}
                  >
                    Tiếng Việt
                  </button>
                  <button 
                    onClick={() => {
                      router.post('/language', { locale: 'en' });
                      setShowLangMenu(false);
                    }}
                    className={`lang-option ${locale === 'en' ? 'active' : ''}`}
                  >
                    English
                  </button>
                </div>
              )}
            </div>
            {!isLoggedIn ? (
              <Link href="/login" className="nav-item login-btn">
                {locale === 'vi' ? 'Đăng nhập' : 'Login'}
              </Link>
            ) : (
              <div className="account-dropdown">
                <span 
                  className="account-current"
                  onClick={() => setShowAccountMenu(!showAccountMenu)}
                >
                  {auth.user?.avatar ? (
                    <img src={auth.user.avatar} alt="Avatar" className="avatar-img" />
                  ) : (
                    <i className="bi bi-person-circle"></i>
                  )}
                  {auth.user?.username || 'Tài khoản'}
                  <i className="bi bi-chevron-down"></i>
                </span>
                {showAccountMenu && (
                  <div className="account-menu">
                    <Link href="#" className="account-option">
                      <i className="bi bi-person"></i>
                      {locale === 'vi' ? 'Thông tin tài khoản' : 'Profile'}
                    </Link>
                    <Link href="#" className="account-option">
                      <i className="bi bi-clipboard-check"></i>
                      {locale === 'vi' ? 'Đơn mua' : 'My Orders'}
                    </Link>
                    <Link 
                      href="/logout" 
                      method="post"
                      as="button"
                      className="account-option"
                    >
                      <i className="bi bi-box-arrow-right"></i>
                      {locale === 'vi' ? 'Đăng xuất' : 'Logout'}
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

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
              <button className="search-button">
                <i className="bi bi-search"></i>
              </button>
            </div>
          </div>
          <div className="nav-cart">
            <Link href="/cart" className="cart-link">
              <i className="bi bi-cart3"></i>
              <span className="cart-count">{cartItems.length}</span>
            </Link>
            <div className="cart-preview">
              <div className="cart-preview-header">
                <span>Sản phẩm mới thêm</span>
              </div>
              <div className="cart-preview-content">
                {cartItems.length === 0 ? (
                  <div className="cart-empty">
                    <i className="bi bi-cart-x"></i>
                    <span>Chưa có sản phẩm</span>
                  </div>
                ) : (
                  <div className="cart-items">
                    {cartItems.slice(0, 3).map((item) => (
                      <div key={item.cart_item_id} className="cart-preview-item">
                        <img 
                          src="/image/ShopnestLogo.png" 
                          alt={item.variant.product?.name || 'Product'} 
                          className="cart-item-image" 
                        />
                        <div className="cart-item-info">
                          <div className="cart-item-name">
                            {item.variant.product?.name || 'Unknown Product'}
                          </div>
                          <div className="cart-item-variant">
                            {item.variant.sku}
                          </div>
                          <div className="cart-item-price">
                            {new Intl.NumberFormat('vi-VN', {
                              style: 'currency',
                              currency: 'VND'
                            }).format(item.price)} x {item.quantity}
                          </div>
                        </div>
                      </div>
                    ))}
                    {cartItems.length > 3 && (
                      <div className="cart-more-items">
                        Và {cartItems.length - 3} sản phẩm khác...
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="cart-preview-footer">
                <a href="/cart" className="view-cart-btn">Xem giỏ hàng</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

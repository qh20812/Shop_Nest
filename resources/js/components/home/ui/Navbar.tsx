import React from 'react'

export default function Navbar() {
  // Temporary state to simulate user login status
  const isLoggedIn = false; // Change to true to see logged in state

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
              <a href="#" className="nav-item notification-item">
                <i className="bi bi-bell"></i>
                Thông báo
              </a>
            )}
            <a href="#" className="nav-item help-item">
              <i className="bi bi-question-circle"></i>
              Hỗ trợ
            </a>
            <div className="lang-dropdown">
              <span className="lang-current">
                <i className="bi bi-globe"></i>
                Tiếng Việt
                <i className="bi bi-chevron-down"></i>
              </span>
              <div className="lang-menu">
                <a href="#" className="lang-option active">Tiếng Việt</a>
                <a href="#" className="lang-option">English</a>
              </div>
            </div>
            {!isLoggedIn ? (
              <a href="#" className="nav-item login-btn">
                Đăng nhập
              </a>
            ) : (
              <div className="account-dropdown">
                <span className="account-current">
                  <i className="bi bi-person-circle"></i>
                  Tài khoản
                  <i className="bi bi-chevron-down"></i>
                </span>
                <div className="account-menu">
                  <a href="#" className="account-option">
                    <i className="bi bi-person"></i>
                    Thông tin tài khoản
                  </a>
                  <a href="#" className="account-option">
                    <i className="bi bi-clipboard-check"></i>
                    Đơn mua
                  </a>
                  <a href="#" className="account-option">
                    <i className="bi bi-box-arrow-right"></i>
                    Đăng xuất
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="main-nav">
          <div className="nav-logo">
            <a href="#">
              <img src="/image/ShopnestLogoNoColor.png" alt="ShopNest" />
              <span>Shopnest</span>
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
            <a href="#" className="cart-link">
              <i className="bi bi-cart3"></i>
              <span className="cart-count">0</span>
            </a>
            <div className="cart-preview">
              <div className="cart-preview-header">
                <span>Sản phẩm mới thêm</span>
              </div>
              <div className="cart-preview-content">
                <div className="cart-empty">
                  <i className="bi bi-cart-x"></i>
                  <span>Chưa có sản phẩm</span>
                </div>
              </div>
              <div className="cart-preview-footer">
                <a href="#" className="view-cart-btn">Xem giỏ hàng</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

import React, { useState } from 'react'
import { Link } from '@inertiajs/react'
import { useTranslation } from '@/lib/i18n'

interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
}

interface NavbarTopProps {
  isLoggedIn: boolean;
  user: User | null;
  locale: string;
}

export default function NavbarTop({ isLoggedIn, user, locale }: NavbarTopProps) {
  const { t } = useTranslation();
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);

  return (
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
                <span>{user?.username}</span>
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
  );
}
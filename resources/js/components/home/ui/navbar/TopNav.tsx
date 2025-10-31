import React from 'react'
import { Link } from '@inertiajs/react'
import LanguageDropdown from './LanguageDropdown'
import CurrencyDropdown from './CurrencyDropdown'
import AccountDropdown from './AccountDropdown'

interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
}

interface TopNavProps {
  isLoggedIn: boolean;
  user: User | null;
  locale: string;
  currency: string;
}

export default function TopNav({ isLoggedIn, user, locale, currency }: TopNavProps) {
  return (
    <div className="top-nav">
      <div className="top-nav-left">
        <a href="#" className="seller-link">
          <i className="bi bi-shop"></i>
          Trở thành người bán
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
        <LanguageDropdown locale={locale} />
        <CurrencyDropdown currency={currency} />
        {isLoggedIn ? (
          <AccountDropdown user={user} locale={locale} />
        ) : (
          <Link href="/login" className="nav-item login-btn">
            {locale === 'vi' ? 'Đăng nhập' : 'Login'}
          </Link>
        )}
      </div>
    </div>
  );
}
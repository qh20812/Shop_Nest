import React from 'react'
import { Link } from '@inertiajs/react'
import LanguageDropdown from './LanguageDropdown'
import CurrencyDropdown from './CurrencyDropdown'
import AccountDropdown from './AccountDropdown'
import { useTranslation } from '@/lib//i18n';

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
  const {t} = useTranslation();
  return (
    <div className="top-nav">
      <div className="top-nav-left">
        <Link href={route('seller.register')} className="nav-item">
          <i className="bi bi-shop"></i>
          {t('Become a Seller')}
        </Link>
      </div>
      <div className="top-nav-right">
        {isLoggedIn && (
          <Link href="/notifications" className="nav-item notification-item">
            <i className="bi bi-bell"></i>
            {t('Notifications')}
          </Link>
        )}
        <a href="#" className="nav-item help-item">
          <i className="bi bi-question-circle"></i>
          {t('Help')}
        </a>
        <LanguageDropdown locale={locale} />
        <CurrencyDropdown currency={currency} />
        {isLoggedIn ? (
          <AccountDropdown user={user} locale={locale} />
        ) : (
          <Link href="/login" className="nav-item login-btn">
            {t('Login')}
          </Link>
        )}
      </div>
    </div>
  );
}
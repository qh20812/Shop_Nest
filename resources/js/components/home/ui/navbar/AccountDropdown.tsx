import React, { useState, useEffect, useRef } from 'react'
import { Link, router } from '@inertiajs/react'

interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  avatar_url?: string;
}

interface AccountDropdownProps {
  user: User | null;
  locale: string;
}

export default function AccountDropdown({ user, locale }: AccountDropdownProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showMenu]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setShowMenu(!showMenu);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await router.post('/logout');
      setShowMenu(false);
    } catch (error) {
      console.error('Logout failed:', error);
      setIsLoggingOut(false);
    }
  };

  if (!user) return null;

  return (
    <div className="account-dropdown" ref={dropdownRef}>
      <button
        className="account-current"
        onClick={() => setShowMenu(!showMenu)}
        onKeyDown={handleKeyDown}
        aria-expanded={showMenu}
        aria-haspopup="menu"
        aria-label={`${locale === 'vi' ? 'Menu tài khoản' : 'Account menu'}. ${locale === 'vi' ? 'Người dùng' : 'User'}: ${user.username}`}
        type="button"
        disabled={isLoggingOut}
      >
        {user.avatar_url ? (
          <img src={user.avatar_url} alt={locale === 'vi' ? 'Ảnh đại diện' : 'Avatar'} className="avatar-img" />
        ) : (
          <i className="bi bi-person-circle" aria-hidden="true"></i>
        )}
        <span className="account-name">{user.username || (locale === 'vi' ? 'Tài khoản' : 'Account')}</span>
        <i className={`bi bi-chevron-down chevron-icon ${showMenu ? 'rotated' : ''}`} aria-hidden="true"></i>
        {isLoggingOut && <i className="bi bi-arrow-clockwise loading-spinner" aria-hidden="true"></i>}
      </button>
      {showMenu && (
        <div
          className="account-menu"
          role="menu"
          aria-label={locale === 'vi' ? 'Menu tài khoản' : 'Account menu'}
        >
          <Link
            href="/user/profile"
            className="account-option"
            role="menuitem"
            onClick={() => setShowMenu(false)}
          >
            <i className="bi bi-person" aria-hidden="true"></i>
            <span>{locale === 'vi' ? 'Thông tin tài khoản' : 'Profile'}</span>
          </Link>
          <Link
            href="/user/orders"
            className="account-option"
            role="menuitem"
            onClick={() => setShowMenu(false)}
          >
            <i className="bi bi-clipboard-check" aria-hidden="true"></i>
            <span>{locale === 'vi' ? 'Đơn mua' : 'My Orders'}</span>
          </Link>
          <button
            onClick={handleLogout}
            className="account-option logout-btn"
            role="menuitem"
            disabled={isLoggingOut}
            type="button"
            aria-label={locale === 'vi' ? 'Đăng xuất tài khoản' : 'Logout account'}
          >
            <i className={`bi bi-box-arrow-right ${isLoggingOut ? 'loading' : ''}`} aria-hidden="true"></i>
            <span>{isLoggingOut ? (locale === 'vi' ? 'Đang đăng xuất...' : 'Logging out...') : (locale === 'vi' ? 'Đăng xuất' : 'Logout')}</span>
          </button>
        </div>
      )}
    </div>
  );
}

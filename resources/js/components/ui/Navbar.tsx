import React, { useState, useEffect, useRef } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import '@/../css/Page.css';
import Avatar from '@/components/ui/Avatar';
import { useTranslation } from '@/lib/i18n';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  avatar?: string;
  avatar_url?: string;
  roles: { name: string }[];
}

interface NavbarProps {
  onToggleSidebar: () => void;
}

export default function Navbar({ onToggleSidebar }: NavbarProps) {
  const [isSearchShow, setIsSearchShow] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { props } = usePage<{ auth: { user: User } }>();
  const profileRef = useRef<HTMLDivElement>(null);

  const handleSearchToggle = (e: React.FormEvent) => {
    if (window.innerWidth < 576) {
      e.preventDefault();
      setIsSearchShow(!isSearchShow);
    }
  };

  // Handle responsive search
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 576) {
        setIsSearchShow(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Handle click outside profile dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    router.post('/logout');
  };
  const { t } = useTranslation();

  return (
    <nav>
      <i className='bx bx-menu' onClick={onToggleSidebar} style={{ cursor: 'pointer' }}></i>

      <form action="#" className={isSearchShow ? 'show' : ''}>
        <div className="form-input">
          <input type="search" placeholder={t('Search...')} />
          <button
            className="search-btn"
            type="submit"
            onClick={handleSearchToggle}
          >
            <i className={`bx ${isSearchShow ? 'bx-x' : 'bx-search'}`}></i>
          </button>
        </div>
      </form>

      <a href="#" className="notif">
        <i className='bx bx-bell'></i>
        <span className="count">12</span>
      </a>

      {/* Profile Dropdown */}
      <div
        ref={profileRef}
        className="profile"
        style={{ position: 'relative', cursor: 'pointer' }}
        onClick={() => setIsProfileOpen(!isProfileOpen)}
      >
        {props.auth?.user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* User Name and Role Block */}
            <div style={{ textAlign: 'right' }}>
              <p style={{
                fontWeight: 600,
                fontSize: '14px',
                margin: 0,
                color: 'var(--dark)',
                lineHeight: '1.2'
              }}>
                {(() => {
                  const fullName = `${props.auth.user.first_name || ''} ${props.auth.user.last_name || ''}`.trim();
                  return fullName || props.auth.user.username || 'User';
                })()}
              </p>
              <small style={{
                fontSize: '12px',
                color: 'var(--dark-grey)',
                lineHeight: '1.2'
              }}>
                {props.auth.user.roles?.[0]?.name || 'Member'}
              </small>
            </div>
            {/* Avatar */}
            <Avatar user={props.auth.user} size={36} />
          </div>
        ) : (
          <img src="/logo.svg" alt="Profile" />
        )}

        {/* Dropdown Menu */}
        {isProfileOpen && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: '8px',
              background: 'var(--light)',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              padding: '8px 0',
              minWidth: '180px',
              zIndex: 1000,
            }}
          >
            <Link
              href="/settings/profile"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                color: 'var(--dark)',
                textDecoration: 'none',
                fontSize: '14px',
                transition: 'background 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--grey)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <i className='bx bx-user' style={{ fontSize: '18px' }}></i>
              {t('Profile')}
            </Link>
            <Link
              href="/settings/password"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                color: 'var(--dark)',
                textDecoration: 'none',
                fontSize: '14px',
                transition: 'background 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--grey)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <i className='bx bx-lock' style={{ fontSize: '18px' }}></i>
              {t('Change Password')}
            </Link>
            <div
              style={{
                height: '1px',
                background: 'var(--grey)',
                margin: '4px 16px',
              }}
            />

            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                background: 'transparent',
                border: 'none',
                color: 'var(--danger)',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'background 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--light-danger)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <i className='bx bx-log-out' style={{ fontSize: '18px' }}></i>
              {t('Logout')}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import '@/../css/Page.css';
import Avatar from '@/components/ui/Avatar';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
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

  return (
    <nav>
      <i className='bx bx-menu' onClick={onToggleSidebar} style={{ cursor: 'pointer' }}></i>
      
      <form action="#" className={isSearchShow ? 'show' : ''}>
        <div className="form-input">
          <input type="search" placeholder="Search..." />
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
          <Avatar user={props.auth.user} size={36} />
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
              Profile
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
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

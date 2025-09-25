import React, { useState, useEffect } from 'react';
import '@/../css/Page.css';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

interface NavbarProps {
  onToggleSidebar: () => void;
  onToggleDarkMode: () => void;
  isDarkMode: boolean;
}

export default function Navbar({ onToggleSidebar, onToggleDarkMode, isDarkMode }: NavbarProps) {
  const [isSearchShow, setIsSearchShow] = useState(false);

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
      
      <input 
        type="checkbox" 
        id="theme-toggle" 
        hidden 
        checked={isDarkMode}
        onChange={onToggleDarkMode}
      />
      <label htmlFor="theme-toggle" className="theme-toggle"></label>

      <LanguageSwitcher />
      
      <a href="#" className="notif">
        <i className='bx bx-bell'></i>
        <span className="count">12</span>
      </a>
      
      <a href="#" className="profile">
        <img src="/logo.svg" alt="Profile" />
      </a>
    </nav>
  );
}

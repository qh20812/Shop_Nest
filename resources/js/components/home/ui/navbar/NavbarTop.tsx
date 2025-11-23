import React, { useState, useRef } from 'react'
import { Link } from '@inertiajs/react'
import { useTranslation } from '@/lib/i18n'
import { useClickOutside } from '@/hooks/useClickOutside'
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor'
import { useDarkMode } from '@/hooks/useDarkMode'

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
    const { isDark, toggle: toggleDarkMode } = useDarkMode();
    
    // Performance monitoring
    usePerformanceMonitor('NavbarTop');
    
    // Refs for click outside detection
    const langDropdownRef = useRef<HTMLDivElement>(null);
    const accountDropdownRef = useRef<HTMLDivElement>(null);
    
    // Close dropdowns when clicking outside
    useClickOutside<HTMLDivElement>(langDropdownRef, () => setShowLangDropdown(false));
    useClickOutside<HTMLDivElement>(accountDropdownRef, () => setShowAccountDropdown(false));

    return (
        <div className="navbar-top">
            <div className="navbar-container-fluid">
                <div className="navbar-top-left">
                    <Link href={route('seller.register')} className="navbar-link-hover">
                        {t('Become a Seller')}
                    </Link>
                </div>
                <div className="navbar-top-right">
                    {/* Dark Mode Toggle */}
                    <button
                        className="navbar-link-hover navbar-flex-center"
                        onClick={toggleDarkMode}
                        aria-label="Toggle dark mode"
                    >
                        <i className={`bi ${isDark ? 'bi-sun' : 'bi-moon'} navbar-icon-md`}></i>
                    </button>

                    {/* Language Dropdown */}
                    <div className="navbar-dropdown-wrapper" ref={langDropdownRef}>
                        <button
                            className="navbar-link-hover navbar-flex-center"
                            onClick={() => setShowLangDropdown(!showLangDropdown)}
                            aria-expanded={showLangDropdown}
                            aria-haspopup="true"
                        >
                            <span>{locale.toUpperCase()}</span>
                            <i className="bi bi-chevron-down navbar-icon-sm"></i>
                        </button>
                        {showLangDropdown && (
                            <div className="navbar-dropdown">
                                <Link 
                                    href="/language" 
                                    method="post" 
                                    data={{ locale: 'vi' }} 
                                    className="navbar-dropdown-item"
                                    onClick={() => setShowLangDropdown(false)}
                                >
                                    Tiếng Việt
                                </Link>
                                <Link 
                                    href="/language" 
                                    method="post" 
                                    data={{ locale: 'en' }} 
                                    className="navbar-dropdown-item"
                                    onClick={() => setShowLangDropdown(false)}
                                >
                                    English
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Account Dropdown or Login */}
                    {isLoggedIn ? (
                        <div className="navbar-dropdown-wrapper" ref={accountDropdownRef}>
                            <button
                                className="navbar-link-hover navbar-flex-center"
                                onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                                aria-expanded={showAccountDropdown}
                                aria-haspopup="true"
                            >
                                <i className="bi bi-person navbar-icon-md"></i>
                                <span>{user?.username}</span>
                                <i className="bi bi-chevron-down navbar-icon-sm"></i>
                            </button>
                            {showAccountDropdown && (
                                <div className="navbar-dropdown">
                                    <Link 
                                        href="/user/profile" 
                                        className="navbar-dropdown-item"
                                        onClick={() => setShowAccountDropdown(false)}
                                    >
                                        <i className="bi bi-person"></i>
                                        {t('My Profile')}
                                    </Link>
                                    <Link 
                                        href="/user/orders" 
                                        className="navbar-dropdown-item"
                                        onClick={() => setShowAccountDropdown(false)}
                                    >
                                        <i className="bi bi-box"></i>
                                        {t('My Orders')}
                                    </Link>
                                    <Link 
                                        href="/logout" 
                                        method="post" 
                                        className="navbar-dropdown-item"
                                        onClick={() => setShowAccountDropdown(false)}
                                    >
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
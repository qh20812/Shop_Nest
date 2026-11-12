import React, { useState } from 'react'
import { Link } from '@inertiajs/react'
import { useTranslation } from '@/lib/i18n'
import { useClickOutside } from '@/hooks/useClickOutside'
import { useDarkMode } from '@/hooks/useDarkMode'

interface User {
    id: number;
    username: string;
    email: string;
    avatar?: string;
}

interface NavbarMobileMenuProps {
    isLoggedIn: boolean;
    user: User | null;
    locale: string;
}

export default function NavbarMobileMenu({ isLoggedIn, user, locale }: NavbarMobileMenuProps) {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const { isDark, toggle: toggleDarkMode } = useDarkMode();
    const drawerRef = React.useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useClickOutside<HTMLDivElement>(drawerRef, () => setIsOpen(false));

    const closeMenu = () => setIsOpen(false);

    return (
        <>
            {/* Hamburger Button */}
            <button
                className="navbar-hamburger"
                onClick={() => setIsOpen(true)}
                aria-label="Open menu"
            >
                <i className="bi bi-list"></i>
            </button>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="navbar-mobile-menu">
                    {/* Overlay */}
                    <div className="navbar-mobile-overlay" onClick={closeMenu}></div>

                    {/* Drawer */}
                    <div ref={drawerRef} className={`navbar-mobile-drawer ${isOpen ? 'open' : ''}`}>
                        {/* Header */}
                        <div className="navbar-mobile-header">
                            <div className="navbar-logo">
                                <div className="navbar-logo-icon">
                                    <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M4 42.4379C4 42.4379 14.0962 36.0744 24 41.1692C35.0664 46.8624 44 42.2078 44 42.2078L44 7.01134C44 7.01134 35.068 11.6577 24.0031 5.96913C14.0971 0.876274 4 7.27094 4 7.27094L4 42.4379Z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                </div>
                                <h1 className="navbar-logo-text">ShopNest</h1>
                            </div>
                            <button className="navbar-mobile-close" onClick={closeMenu} aria-label="Close menu">
                                <i className="bi bi-x-lg"></i>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="navbar-mobile-content">
                            {/* Account Section */}
                            {isLoggedIn ? (
                                <div className="navbar-mobile-section">
                                    <div className="navbar-mobile-section-title">{t('navbar.account')}</div>
                                    <Link href="/user/profile" className="navbar-mobile-link" onClick={closeMenu}>
                                        <i className="bi bi-person"></i>
                                        <span>{user?.username}</span>
                                    </Link>
                                    <Link href="/user/orders" className="navbar-mobile-link" onClick={closeMenu}>
                                        <i className="bi bi-box"></i>
                                        <span>{t('navbar.my_orders')}</span>
                                    </Link>
                                    <Link href="/wishlist" className="navbar-mobile-link" onClick={closeMenu}>
                                        <i className="bi bi-heart"></i>
                                        <span>{t('navbar.wishlist')}</span>
                                    </Link>
                                </div>
                            ) : (
                                <div className="navbar-mobile-section">
                                    <Link href="/login" className="navbar-mobile-link" onClick={closeMenu}>
                                        <i className="bi bi-box-arrow-in-right"></i>
                                        <span>{t('auth.login')}</span>
                                    </Link>
                                </div>
                            )}

                            <div className="navbar-mobile-divider"></div>

                            {/* Quick Links */}
                            <div className="navbar-mobile-section">
                                <div className="navbar-mobile-section-title">{t('navbar.quick_links') ?? t('Quick Links')}</div>
                                <Link href={route('seller.register')} className="navbar-mobile-link" onClick={closeMenu}>
                                    <i className="bi bi-shop"></i>
                                    <span>{t('navbar.become_seller')}</span>
                                </Link>
                                <Link href="/cart" className="navbar-mobile-link" onClick={closeMenu}>
                                    <i className="bi bi-cart3"></i>
                                    <span>{t('navbar.cart')}</span>
                                </Link>
                            </div>

                            <div className="navbar-mobile-divider"></div>

                            {/* Settings */}
                            <div className="navbar-mobile-section">
                                <div className="navbar-mobile-section-title">{t('navbar.settings') ?? t('Settings')}</div>
                                
                                {/* Language */}
                                <div className="navbar-mobile-link">
                                    <i className="bi bi-translate"></i>
                                    <span>{t('navbar.language')}: {locale.toUpperCase()}</span>
                                </div>
                                <div style={{ paddingLeft: '2.25rem', marginTop: '0.5rem' }}>
                                    <Link 
                                        href="/language" 
                                        method="post" 
                                        data={{ locale: 'vi' }} 
                                        className="navbar-mobile-link"
                                        onClick={closeMenu}
                                        style={{ padding: '0.5rem 0.75rem' }}
                                    >
                                        Tiếng Việt
                                    </Link>
                                    <Link 
                                        href="/language" 
                                        method="post" 
                                        data={{ locale: 'en' }} 
                                        className="navbar-mobile-link"
                                        onClick={closeMenu}
                                        style={{ padding: '0.5rem 0.75rem' }}
                                    >
                                        English
                                    </Link>
                                </div>

                                {/* Dark Mode */}
                                <button 
                                    className="navbar-mobile-link" 
                                    onClick={toggleDarkMode}
                                    style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left' }}
                                >
                                    <i className={`bi ${isDark ? 'bi-sun' : 'bi-moon'}`}></i>
                                    <span>{isDark ? t('Light Mode') : t('Dark Mode')}</span>
                                </button>
                            </div>

                            {isLoggedIn && (
                                <>
                                    <div className="navbar-mobile-divider"></div>
                                    <div className="navbar-mobile-section">
                                        <Link 
                                            href="/logout" 
                                            method="post" 
                                            className="navbar-mobile-link" 
                                            onClick={closeMenu}
                                            style={{ color: 'var(--danger)' }}
                                        >
                                            <i className="bi bi-box-arrow-right"></i>
                                            <span>{t('auth.logout')}</span>
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

import React from 'react'
import { Link, usePage } from '@inertiajs/react'
import { useTranslation } from '@/lib/i18n'

interface CartItem {
  cart_item_id: number;
  variant_id: number;
  quantity: number;
  price: number;
  discount_price?: number;
  subtotal: number;
  variant: {
    variant_id: number;
    sku: string;
    price: number;
    discount_price?: number;
    stock_quantity: number;
    available_quantity: number;
    reserved_quantity: number;
    product: {
      product_id: number;
      name: string;
    } | null;
  };
}

interface NavbarMainProps {
  cartItems: CartItem[];
  isLoggedIn: boolean;
}

export default function NavbarMain({ cartItems, isLoggedIn }: NavbarMainProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const { t } = useTranslation();
  const { props } = usePage();
  const pageProps = props as { name?: string };
  const brandName = pageProps.name ?? 'ShopNest';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <nav className="navbar-main">
      <div className="navbar-container-fluid">
        {/* Logo (visible on all screens) */}
        <Link href="/" className="navbar-logo">
          <div className="navbar-logo-icon">
            <img src="/image/ShopnestLogo.png" alt="ShopNest Logo" width={28} height={28}
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/image/ShopnestLogoColor.png'; }}
            />
          </div>
          <h1 className="navbar-logo-text">{brandName}</h1>
        </Link>

        {/* Search Bar */}
        <div className="navbar-search-wrapper">
          <div className="navbar-search-container">
            <form onSubmit={handleSearch} className="navbar-search-input-wrapper">
              <input
                type="text"
                className="navbar-search-input"
                placeholder={t('navbar.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="navbar-search-button">
                <i className="bi bi-search"></i>
              </button>
            </form>
          </div>
        </div>

        {/* Action Icons */}
        <div className="navbar-actions">
          <Link href={isLoggedIn ? '/cart' : '/login'} className="navbar-icon-button" title={!isLoggedIn ? t('auth.login_required') : undefined} aria-label={t('navbar.cart')}>
            <i className="bi bi-cart3"></i>
            {isLoggedIn && cartItems.length > 0 && (
              <span className="navbar-badge">{cartItems.length}</span>
            )}
          </Link>
          {isLoggedIn && (
            
            <Link href="/wishlist" className="navbar-icon-button" aria-label={t('navbar.wishlist') ?? 'Wishlist'}>
              <i className="bi bi-heart"></i>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
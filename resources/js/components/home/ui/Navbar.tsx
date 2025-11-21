import React from 'react'
import { usePage } from '@inertiajs/react'
import DropdownErrorBoundary from './navbar/DropdownErrorBoundary'
import NavbarTop from './navbar/NavbarTop'
import NavbarMain from './navbar/NavbarMain'
import NavbarMobileMenu from './navbar/NavbarMobileMenu'
import '@/../css/navbar.css'

interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
}

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

interface PageProps {
  auth: {
    user: User | null;
  };
  locale: string;
  currency: string;
  cartItems?: CartItem[];
  [key: string]: unknown;
}

export default function Navbar() {
  const { auth, locale, cartItems = [] } = usePage<PageProps>().props;
  const isLoggedIn = !!auth.user;

  return (
    <header className="navbar-sticky">
      <DropdownErrorBoundary>
        <NavbarTop
          isLoggedIn={isLoggedIn}
          user={auth.user}
          locale={locale}
        />
        <NavbarMain
          cartItems={cartItems}
          isLoggedIn={isLoggedIn}
        />
        <NavbarMobileMenu
          isLoggedIn={isLoggedIn}
          user={auth.user}
          locale={locale}
        />
      </DropdownErrorBoundary>
    </header>
  );
}

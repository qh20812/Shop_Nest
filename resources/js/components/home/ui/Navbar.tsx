import React from 'react'
import { usePage } from '@inertiajs/react'
import TopNav from './navbar/TopNav'
import MainNav from './navbar/MainNav'
import DropdownErrorBoundary from './navbar/DropdownErrorBoundary'

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
  const { auth, locale, currency, cartItems = [] } = usePage<PageProps>().props;
  const isLoggedIn = !!auth.user;

  return (
    <nav className='home-navbar'>
      <div className="navbar-container">
        <DropdownErrorBoundary>
          <TopNav isLoggedIn={isLoggedIn} user={auth.user} locale={locale} currency={currency} />
        </DropdownErrorBoundary>
        <MainNav cartItems={cartItems} />
      </div>
    </nav>
  );
}

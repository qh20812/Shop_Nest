import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from '@/Components/ui/Sidebar';
import Navbar from '@/Components/ui/Navbar';
import { useTranslation } from '../../lib/i18n';
import { usePage } from '@inertiajs/react';
import Chatbot from '@/Components/Chatbot';
// ToastProvider is provided globally in `app.tsx`


type RoleKey = 'admin' | 'seller' | 'shipper';

interface SidebarItem {
  icon: string;
  label: string;
  href: string;
}

interface AppLayoutProps {
  children: React.ReactNode;
}

interface UserRole {
  name?: Record<string, string> | string;
  display_name?: Record<string, string> | string;
  title?: Record<string, string> | string;
  slug?: string | null;
  key?: string | null;
}

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role_name?: string | null;
  roles: UserRole[];
}

interface PageProps extends Record<string, unknown> {
  auth: {
    user: User;
  };
}

const VALID_ROLES: RoleKey[] = ['admin', 'seller', 'shipper'];
const ROLE_FALLBACK: RoleKey = 'admin';

export default function AppLayout({ children }: AppLayoutProps) {
  const { t } = useTranslation();
  const { props } = usePage<PageProps>();
  const user = props.auth?.user;

  const sidebarItemsByRole = useMemo<Record<RoleKey, SidebarItem[]>>(() => ({
    admin: [
      { icon: 'bx bxs-dashboard', label: t('Dashboard'), href: '/admin/dashboard' },
      { icon: 'bx bx-user', label: t('Users'), href: '/admin/users' },
      // { icon: 'bi bi-truck', label: t('Shippers'), href: '/admin/shippers' },
      { icon: 'bx bx-package', label: t('Products'), href: '/admin/products' },
      { icon: 'bx bx-tag', label: t('Inventories'), href: '/admin/inventory' },
      { icon: 'bx bx-gift', label: t('Promotions'), href: '/admin/promotions' },
      { icon: 'bx bx-category', label: t('Categories'), href: '/admin/categories' },
      { icon: 'bx bx-store', label: t('Brands'), href: '/admin/brands' },
      { icon: 'bx bx-receipt', label: t('Orders'), href: '/admin/orders' },
      { icon: 'bx bx-analyse', label: t('Analytics'), href: '/admin/analytics' },
      { icon: 'bx bx-message-square-dots', label: t('Shops'), href: '/admin/shops' }
    ],
    seller: [
      { icon: 'bx bxs-dashboard', label: t('Seller Dashboard'), href: '/seller/dashboard' },
      { icon: 'bx bx-package', label: t('My Products'), href: '/seller/products' },
      // { icon: 'bx bx-cube', label: t('Inventory'), href: '/seller/inventory' },
      { icon: 'bx bx-receipt', label: t('Orders'), href: '/seller/orders' },
      // { icon: 'bx bx-dollar-circle', label: t('Revenue'), href: '/seller/revenue' },
      { icon: 'bx bx-store-alt', label: t('Shop Profile'), href: '/seller/shop' },
      // { icon: 'bx bx-star', label: t('Customer Reviews'), href: '/seller/reviews' },
      { icon: 'bx bx-gift', label: t('Promotions'), href: '/seller/promotions' },
      { icon: 'bx bx-cog', label: t('Settings'), href: '/settings' }
    ],
    shipper: [
      { icon: 'bx bxs-dashboard', label: t('Shipper Dashboard'), href: '/shipper/dashboard' },
      { icon: 'bx bx-package', label: t('Assigned Orders'), href: '/shipper/orders' },
      { icon: 'bx bx-history', label: t('Delivery History'), href: '/shipper/history' },
      { icon: 'bx bx-map', label: t('Route Planning'), href: '/shipper/routes' },
      { icon: 'bx bx-dollar', label: t('Earnings'), href: '/shipper/earnings' },
      { icon: 'bx bx-car', label: t('Vehicle Info'), href: '/shipper/vehicle' },
      { icon: 'bx bx-file', label: t('Delivery Reports'), href: '/shipper/reports' },
      { icon: 'bx bx-cog', label: t('Settings'), href: '/settings' }
    ]
  }), [t]);

  const resolveRoleKey = (): RoleKey => {
    const normalizeString = (value?: string | null): string | null => {
      if (!value) return null;
      return value.toLowerCase().trim();
    };

    const normalizeWithLocales = (input?: Record<string, string> | string | null): string | null => {
      if (!input) return null;
      if (typeof input === 'string') {
        return normalizeString(input);
      }

      const preferredLocales = ['en', 'vi'];
      for (const locale of preferredLocales) {
        const localized = input[locale];
        if (typeof localized === 'string') {
          const normalized = normalizeString(localized);
          if (normalized) {
            return normalized;
          }
        }
      }

      const fallbackValue = Object.values(input).find(
        (value) => typeof value === 'string' && value.trim().length > 0
      );

      return typeof fallbackValue === 'string' ? normalizeString(fallbackValue) : null;
    };

    const stripDiacritics = (value: string): string =>
      value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    const roleMatches: Array<string | null> = [];

    roleMatches.push(normalizeString(user?.role_name));

    if (Array.isArray(user?.roles)) {
      for (const role of user.roles) {
        if (!role) continue;

        roleMatches.push(normalizeWithLocales(role.name ?? null));
        roleMatches.push(normalizeWithLocales(role.display_name ?? null));
        roleMatches.push(normalizeWithLocales(role.title ?? null));
        roleMatches.push(normalizeString(role.slug ?? null));
        roleMatches.push(normalizeString(role.key ?? null));
      }
    }

    const ROLE_KEYWORDS: Record<RoleKey, string[]> = {
      admin: ['admin', 'administrator', 'nguoi quan tri', 'người quản trị', 'quan tri'],
      seller: ['seller', 'vendor', 'shop', 'nguoi ban', 'người bán', 'nha ban hang', 'nhà bán hàng', 'merchant'],
      shipper: ['shipper', 'delivery', 'nguoi giao hang', 'người giao hàng', 'giao hang', 'courier'],
    };

    for (const match of roleMatches) {
      if (!match) continue;
      const normalizedKey = match.replace(/\s+/g, '_');
      if (VALID_ROLES.includes(normalizedKey as RoleKey)) {
        return normalizedKey as RoleKey;
      }

      const normalizedStripped = stripDiacritics(match);

      for (const [roleKey, keywords] of Object.entries(ROLE_KEYWORDS) as Array<[RoleKey, string[]]>) {
        if (keywords.some((keyword) => match.includes(keyword))) {
          return roleKey;
        }
        if (keywords.some((keyword) => normalizedStripped.includes(keyword))) {
          return roleKey;
        }
      }
    }

    return ROLE_FALLBACK;
  };

  const currentRole = resolveRoleKey();
  const sidebarItems = sidebarItemsByRole[currentRole] ?? sidebarItemsByRole.admin;

  const [isSidebarClosed, setIsSidebarClosed] = useState(() => {
    // Initialize from localStorage immediately
    const savedState = localStorage.getItem('sidebarClosed');
    return savedState !== null ? JSON.parse(savedState) : false;
  });
  const toggleSidebar = () => {
    const newState = !isSidebarClosed;
    setIsSidebarClosed(newState);
    localStorage.setItem('sidebarClosed', JSON.stringify(newState));
  };
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarClosed(true);
      } else {
        const savedState = localStorage.getItem('sidebarClosed');
        if (savedState !== null) {
          setIsSidebarClosed(JSON.parse(savedState));
        } else {
          setIsSidebarClosed(false);
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <Sidebar
        items={sidebarItems}
        isClosed={isSidebarClosed}
      />
      <div className="content">
        <Navbar
          onToggleSidebar={toggleSidebar}
        />
        <main>
          {children}
        </main>
        <Chatbot user={user} />
      </div>
    </>
  );
}

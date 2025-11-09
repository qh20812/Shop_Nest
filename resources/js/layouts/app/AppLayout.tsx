import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from '@/Components/ui/Sidebar';
import Navbar from '@/Components/ui/Navbar';
import { useTranslation } from '../../lib/i18n';
import { usePage } from '@inertiajs/react';
import Chatbot from '@/Components/Chatbot';
import { ToastProvider } from '@/Contexts/ToastContext';


type RoleKey = 'admin' | 'seller' | 'shipper';

interface SidebarItem {
  icon: string;
  label: string;
  href: string;
}

interface AppLayoutProps {
    children: React.ReactNode;
}

interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  role_name?: string | null;
  roles: Array<{name: Record<string, string>}>;
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
      { icon: 'bi bi-truck', label: t('Shippers'), href: '/admin/shippers' },
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
      { icon: 'bx bx-plus-circle', label: t('Add Product'), href: '/seller/products/create' },
      { icon: 'bx bx-cube', label: t('Inventory'), href: '/seller/inventory' },
      { icon: 'bx bx-receipt', label: t('Orders'), href: '/seller/orders' },
      { icon: 'bx bx-dollar-circle', label: t('Revenue'), href: '/seller/revenue' },
      { icon: 'bx bx-store-alt', label: t('Shop Profile'), href: '/seller/profile' },
      { icon: 'bx bx-star', label: t('Customer Reviews'), href: '/seller/reviews' },
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
    const normalizedRoleName = user?.role_name?.toLowerCase();
    if (normalizedRoleName && VALID_ROLES.includes(normalizedRoleName as RoleKey)) {
      return normalizedRoleName as RoleKey;
    }

    if (!user?.roles?.length) {
      return ROLE_FALLBACK;
    }

    const preferredLocales = ['en', 'vi'];

    for (const role of user.roles) {
      const roleLabels = role?.name ?? {};

      for (const locale of preferredLocales) {
        const localizedName = roleLabels?.[locale];
        if (typeof localizedName === 'string') {
          const normalized = localizedName.toLowerCase();
          if (VALID_ROLES.includes(normalized as RoleKey)) {
            return normalized as RoleKey;
          }
        }
      }

      const fallback = Object.values(roleLabels).find(
        (value) => typeof value === 'string' && value.trim().length > 0
      );

      if (typeof fallback === 'string') {
        const normalizedFallback = fallback.toLowerCase();
        if (VALID_ROLES.includes(normalizedFallback as RoleKey)) {
          return normalizedFallback as RoleKey;
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
    <ToastProvider>
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
    </ToastProvider>
  );
}
import React, { useState, useEffect } from 'react';
import Sidebar from '@/Components/ui/Sidebar';
import Navbar from '@/Components/ui/Navbar';
import { useTranslation } from '../../lib/i18n';
import { usePage } from '@inertiajs/react';
import Chatbot from '@/Components/Chatbot';


interface AppLayoutProps {
    children: React.ReactNode;
}

interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    role: string[];
}

interface PageProps extends Record<string, unknown> {
    auth: {
        user: User;
    };
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { t } = useTranslation();
  const { props } = usePage<PageProps>();
  const user = props.auth?.user;

  // Admin sidebar items
  const adminSidebarItems = [
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
    { icon: 'bx bx-message-square-dots', label: t('Tickets'), href: '/admin/tickets' }
  ];

  // Seller sidebar items
  const sellerSidebarItems = [
    { icon: 'bx bxs-dashboard', label: t('Seller Dashboard'), href: '/seller/dashboard' },
    { icon: 'bx bx-package', label: t('My Products'), href: '/seller/products' },
    { icon: 'bx bx-plus-circle', label: t('Add Product'), href: '/seller/products/create' },
    // { icon: 'bx bx-cube', label: t('Inventory'), href: '/seller/inventory' },
    { icon: 'bx bx-receipt', label: t('Orders'), href: '/seller/orders' },
    // { icon: 'bx bx-dollar-circle', label: t('Revenue'), href: '/seller/revenue' },
    // { icon: 'bx bx-store-alt', label: t('Shop Profile'), href: '/seller/profile' },
    // { icon: 'bx bx-star', label: t('Customer Reviews'), href: '/seller/reviews' },
    { icon: 'bx bx-gift', label: t('Promotions'), href: '/seller/promotions' },
    { icon: 'bx bx-cog', label: t('Settings'), href: '/settings' },
  ];

  // Shipper sidebar items
  const shipperSidebarItems = [
    { icon: 'bx bxs-dashboard', label: t('Shipper Dashboard'), href: '/shipper/dashboard' },
    { icon: 'bx bx-package', label: t('Assigned Orders'), href: '/shipper/orders' },
    { icon: 'bx bx-history', label: t('Delivery History'), href: '/shipper/history' },
    { icon: 'bx bx-map', label: t('Route Planning'), href: '/shipper/routes' },
    { icon: 'bx bx-dollar', label: t('Earnings'), href: '/shipper/earnings' },
    { icon: 'bx bx-car', label: t('Vehicle Info'), href: '/shipper/vehicle' },
    { icon: 'bx bx-file', label: t('Delivery Reports'), href: '/shipper/reports' },
    { icon: 'bx bx-cog', label: t('Settings'), href: '/settings' },
  ];

  // Determine sidebar items based on user role
  const getSidebarItems = () => {
     if (!user) return adminSidebarItems; // fallback

    // Check if user has admin role
    if (user.role?.includes('Admin')) {
      return adminSidebarItems;
    }
    
    // Check if user has seller role
    if (user.role?.includes('Seller')) {
      return sellerSidebarItems;
    }
    
    // Check if user has shipper role
    if (user.role?.includes('Shipper')) {
      return shipperSidebarItems;
    }

    // Default to admin items
    return sellerSidebarItems;
  };

  
  const [isSidebarClosed, setIsSidebarClosed] = useState(() => {
    // Initialize from localStorage immediately
    const savedState = localStorage.getItem('sidebarClosed');
    return savedState !== null ? JSON.parse(savedState) : false;
  });

  // Toggle sidebar and save to localStorage
  const toggleSidebar = () => {
    const newState = !isSidebarClosed;
    setIsSidebarClosed(newState);
    localStorage.setItem('sidebarClosed', JSON.stringify(newState));
  };

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarClosed(true);
      } else {
        // Only restore from localStorage if we're not in mobile mode
        const savedState = localStorage.getItem('sidebarClosed');
        if (savedState !== null) {
          setIsSidebarClosed(JSON.parse(savedState));
        } else {
          setIsSidebarClosed(false);
        }
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <Sidebar 
        items={getSidebarItems()} 
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
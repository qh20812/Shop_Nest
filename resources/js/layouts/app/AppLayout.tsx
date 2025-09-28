import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/admin/Sidebar';
import Navbar from '@/components/admin/Navbar';
import { useTranslation } from '../../lib/i18n';

interface AppLayoutProps {
    children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { t } = useTranslation();

  // Admin sidebar items - tập trung tại đây
  const adminSidebarItems = [
    { icon: 'bx bxs-dashboard', label: t('Dashboard'), href: '/admin/dashboard' },
    { icon: 'bx bx-user', label: t('Users'), href: '/admin/users' },
    { icon: 'bi bi-truck', label: t('Shippers'), href: '/admin/shippers' },
    { icon: 'bx bx-package', label: t('Products'), href: '/admin/products' },
    { icon: 'bx bx-category', label: t('Categories'), href: '/admin/categories' },
    { icon: 'bx bx-store', label: t('Brands'), href: '/admin/brands' },
    { icon: 'bx bx-receipt', label: t('Orders'), href: '/admin/orders' },
    { icon: 'bx bx-analyse', label: t('Analytics'), href: '/admin/analytics' },
    { icon: 'bx bx-message-square-dots', label: t('Tickets'), href: '/admin/tickets' },
    { icon: 'bx bx-cog', label: t('Settings'), href: '/settings' },
  ];
  const [isSidebarClosed, setIsSidebarClosed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarClosed(!isSidebarClosed);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Apply dark mode to body
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarClosed(true);
      } else {
        setIsSidebarClosed(false);
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
        items={adminSidebarItems} 
        isClosed={isSidebarClosed}
      />
      <div className="content">
        <Navbar 
          onToggleSidebar={toggleSidebar}
          onToggleDarkMode={toggleDarkMode}
          isDarkMode={isDarkMode}
        />
        <main>
          {children}
        </main>
      </div>
    </>
  );
}
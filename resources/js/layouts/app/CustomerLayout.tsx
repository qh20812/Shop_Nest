import React, { PropsWithChildren, useCallback, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { Menu } from 'lucide-react';
import Navbar from '../../Components/home/ui/Navbar';
import Sidebar from '../../Components/customer/ui/Sidebar';
import '@/../css/Home.css';
import '@/../css/Customer.css';
import Footer from '@/Components/home/ui/Footer';

interface AuthUser {
  name: string;
  avatar?: string | null;
}

interface SharedPageProps {
  auth: {
    user: AuthUser | null;
  };
  [key: string]: unknown;
}

const CustomerLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const { auth } = usePage<SharedPageProps>().props;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleOpenSidebar = useCallback(() => setIsSidebarOpen(true), []);
  const handleCloseSidebar = useCallback(() => setIsSidebarOpen(false), []);

  return (
    <div className="customer-layout">
      <header className="customer-layout-header">
        <Navbar />
      </header>

      <div className="customer-layout-body">
        <button
          type="button"
          className="customer-sidebar-toggle"
          onClick={handleOpenSidebar}
          aria-label="Mở menu khách hàng"
        >
          <Menu aria-hidden="true" />
          <span>Tài khoản</span>
        </button>

        <Sidebar user={auth.user} isMobileOpen={isSidebarOpen} onClose={handleCloseSidebar} />

        <main className="customer-content" role="main">
          {children}
        </main>
      </div>

      {isSidebarOpen && (
        <button
          type="button"
          className="customer-sidebar-overlay"
          onClick={handleCloseSidebar}
          aria-label="Đóng menu khách hàng"
        />
      )}
      <Footer />
    </div>
  );
};

export default CustomerLayout;

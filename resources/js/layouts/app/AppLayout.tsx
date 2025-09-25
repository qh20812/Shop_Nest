import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/admin/Sidebar';
import Navbar from '@/components/admin/Navbar';

interface AppLayoutProps {
    children: React.ReactNode;
    sidebarItems: Array<{
      icon: string;
      label: string;
      href: string;
    }>;
}

export default function AppLayout({ children, sidebarItems }: AppLayoutProps) {
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
        items={sidebarItems} 
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
import React from 'react'
import Sidebar from '@/components/ui/Sidebar';
import Navbar from '@/components/ui/Navbar';
import Main from '@/components/Main';

interface AppLayoutProps {
    children: React.ReactNode;
    sidebarItems: Array<{
      icon: string;
      label: string;
      href: string;
    }>;
}

export default function AppLayout({ children, sidebarItems }: AppLayoutProps) {
  return (
    <>
        <Sidebar items={sidebarItems} />
        <div className='content'>
            <Navbar />
            <Main>
                {children}
            </Main>
        </div>
    </>
  )
}
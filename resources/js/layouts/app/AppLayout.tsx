import React from 'react'
import Sidebar from '@/components/ui/Sidebar';
import Navbar from '@/components/ui/Navbar';
import Main from '@/components/Main';

interface AppLayoutProps {
    children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <>
        <Sidebar />
        <div className='content'>
            <Navbar />
            <Main>
                {children}
            </Main>
        </div>
    </>
  )
}
import React from 'react';
import Navbar from '@/components/home/ui/Navbar';
import Footer from '@/components/home/ui/Footer';

interface AppLayoutProps {
    children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background text-foreground">
            <Navbar />

            <main className="flex-1">{children}</main>

            <Footer />
        </div>
    );
}

import ChatPopup from '@/components/Chat/ChatPopup';
import React from 'react';
import Footer from '../../components/home/ui/Footer';
import Header from '../../components/home/ui/Header';
import Navbar from '../../components/home/ui/Navbar';
// ToastProvider is provided globally in `app.tsx`
import '@/../css/Chat.css';
import '@/../css/Home.css';

interface HomeLayoutProps {
    children: React.ReactNode;
}

export default function HomeLayout({ children }: HomeLayoutProps) {
    const isHomePage = window.location.pathname === '/';

    return (
        <div className="home-layout">
            {/* Navbar */}
            <Navbar />

            {/* Header/Banner - only show on home page */}
            {isHomePage && <Header />}

            {/* Main Content */}
            <main className="home-main">{children}</main>

            {/* Footer */}
            <Footer />

            {/* Chat Popup */}
            <ChatPopup />
        </div>
    );
}

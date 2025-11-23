import React from 'react';
import Navbar from '../../Components/home/ui/Navbar';
import Header from '../../Components/home/ui/Header';
import Footer from '../../Components/home/ui/Footer';
import ChatPopup from '@/Components/Chat/ChatPopup';
// ToastProvider is provided globally in `app.tsx`
import '@/../css/Home.css';
import '@/../css/Chat.css';

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
                <main className="home-main">
                    {children}
                </main>
                
                {/* Footer */}
                <Footer />

                {/* Chat Popup */}
                <ChatPopup />
            </div>
    );
}

import React from 'react';
import Navbar from '../../Components/home/ui/Navbar';
import Header from '../../Components/home/ui/Header';
import Footer from '../../Components/home/ui/Footer';
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
            <main className="home-main">
                {children}
            </main>
            
            {/* Footer */}
            <Footer />
        </div>
    );
}

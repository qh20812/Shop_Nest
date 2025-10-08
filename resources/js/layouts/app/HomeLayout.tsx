import React from 'react';
import Navbar from '../../components/home/ui/Navbar';
import Header from '../../components/home/ui/Header';
import Footer from '../../components/home/ui/Footer';
import '@/../css/Home.css';

interface HomeLayoutProps {
    children: React.ReactNode;
}

export default function HomeLayout({ children }: HomeLayoutProps) {
    return (
        <div className="home-layout">
            {/* Navbar */}
            <Navbar />
            
            {/* Header/Banner */}
            <Header />
            
            {/* Main Content */}
            <main className="home-main">
                {children}
            </main>
            
            {/* Footer */}
            <Footer />
        </div>
    );
}

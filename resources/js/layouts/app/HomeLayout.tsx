import React from 'react';
import Navbar from '../../components/home/ui/Navbar';
import Header from '../../components/home/ui/Header';
import Footer from '../../components/home/ui/Footer';

interface HomeLayoutProps {
    children: React.ReactNode;
}

export default function HomeLayout({ children }: HomeLayoutProps) {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <Navbar />
            
            {/* Header/Banner */}
            <Header />
            
            {/* Main Content */}
            <main className="bg-gray-50">
                {children}
            </main>
            
            {/* Footer */}
            <Footer />
        </div>
    );
}

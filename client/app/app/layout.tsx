"use client"

// components/Layout.tsx
import React, { PropsWithChildren } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';

const Layout: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
            <Header />

            <div className="flex flex-1">
                <Sidebar />

                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>

            <Footer />
        </div>
    );
};

export default Layout;

import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface AppLayoutProps {
  children: React.ReactNode;
  maxWidthClass?: string;
  hideFooter?: boolean;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  maxWidthClass = 'max-w-6xl',
  hideFooter = false,
}) => {
  return (
    <div
      className="min-h-screen flex flex-col bg-blue-100 bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('/clouds-bg.jpg')" }}
    >
      {/* 1. Header & Navigation */}
      <Navbar />

      {/* 2. Main Page Content with smooth center positioning */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 py-8 sm:px-6 lg:px-8">
        <div className={`w-full ${maxWidthClass} mx-auto transition-all`}>
          {children}
        </div>
      </main>

      {/* 3. Global Footer */}
      {!hideFooter && <Footer />}
    </div>
  );
};

export default AppLayout;

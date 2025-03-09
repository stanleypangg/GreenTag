// components/Header.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import logo from '../../assets/logo.svg';

const Header: React.FC = () => {
  const pathname = usePathname();
  
  // Function to get the current page name based on the path
  const getPageName = () => {
    if (pathname.includes('/dashboard')) return 'Dashboard';
    if (pathname.includes('/returns')) return 'Returns';
    if (pathname.includes('/esg')) return 'ESG';
    if (pathname.includes('/routing')) return 'Routing';
    return '';
  };

  const pageName = getPageName();

  return (
    <header className="h-20 flex items-center justify-between px-6 bg-[#F8F9FA]">
      {/* Brand: logo + title */}
      <div className="flex items-center space-x-2">
        {/* Replace with your actual logo file or SVG */}
        <Image
          src={logo}
          alt="GreenTag"
          className="h-8 w-auto"
        />
        <span className="text-m font-semibold">GreenTag</span>
        
        {/* Page title - only show if we have a page name */}
        {pageName && (
          <>
            <span className="text-gray-400 mx-2">|</span>
            <h1 className="text-lg font-medium text-gray-800">{pageName}</h1>
          </>
        )}
      </div>

      {/* Right side: search & sign in */}
      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Search..."
          className="border border-gray-300 rounded-md px-3 py-1 text-sm"
        />
        <Link href="#">
          <span className="text-sm text-gray-600 hover:text-gray-900">
            Sign In
          </span>
        </Link>
      </div>
    </header>
  );
};

export default Header;
// components/Header.tsx
import React from 'react';
import Link from 'next/link';

const Header: React.FC = () => {
  return (
    <header className="h-20 flex items-center justify-between px-6 bg-[#F8F9FA]">
      {/* Brand: logo + title */}
      <div className="flex items-center space-x-2">
        {/* Replace with your actual logo file or SVG */}
        <img
          src="../../assets/logo.svg"
          alt="GreenTag"
          className="h-8 w-auto"
        />
        <span className="text-m font-semibold">GreenTag</span>
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

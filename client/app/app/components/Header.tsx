import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-gray-200">
      <h1 className="text-xl font-semibold">Tables</h1>
      <div className="flex items-center space-x-4">
        {/* Example search input */}
        <input
          type="text"
          placeholder="Search..."
          className="border border-gray-300 rounded-md px-3 py-1 text-sm"
        />
        {/* Placeholder user info or sign in link */}
        <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
          Sign In
        </a>
      </div>
    </header>
  );
};

export default Header;

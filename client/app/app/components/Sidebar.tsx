// components/Sidebar.tsx
import React from 'react';
import Link from 'next/link';
import {
  FiHome,
  FiBarChart2,
  FiCreditCard,
  FiRepeat,
  FiUser,
  FiLogIn,
} from 'react-icons/fi';

interface NavItem {
  name: string;
  icon: React.ReactNode;
  href: string;
  current?: boolean;
}

const Sidebar: React.FC = () => {
  // Example nav items, with "Tables" as the active page
  const navItems: NavItem[] = [
    { name: 'Dashboard', icon: <FiHome />, href: '/app/dashboard', current: false },
    { name: 'Tables', icon: <FiBarChart2 />, href: '/app/returns', current: true },
    { name: 'Billing', icon: <FiCreditCard />, href: '#', current: false },
    { name: 'RTL', icon: <FiRepeat />, href: '#', current: false },
  ];

  const accountItems: NavItem[] = [
    { name: 'Profile', icon: <FiUser />, href: '#' },
    { name: 'Sign In', icon: <FiLogIn />, href: '#' },
  ];

  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col text-gray-700">
      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`
                  flex items-center px-4 py-2 space-x-3 rounded-lg text-sm font-medium
                  ${
                    item.current
                      ? 'bg-white shadow text-gray-900'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                  }
                `}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Account Pages Section */}
        <div className="text-xs text-gray-400 uppercase mt-8 mb-2 tracking-wider">
          Account Pages
        </div>
        <ul className="space-y-2">
          {accountItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className="
                  flex items-center px-4 py-2 space-x-3 rounded-lg text-sm font-medium
                  text-gray-500 hover:text-gray-900 hover:bg-gray-100
                "
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Help Card */}
      <div className="m-4 p-4 rounded-lg bg-green-50 text-center">
        <p className="font-semibold text-sm mb-2">Need help?</p>
        <button className="bg-green-500 text-white text-sm px-4 py-2 rounded-md hover:bg-green-600">
          Documentation
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

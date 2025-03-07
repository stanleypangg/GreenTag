import React from 'react';
import { 
  // Use your own icons or any icon library
  // Example: Heroicons or React Icons
} from '@/public/logo.svg';

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Brand / Logo */}
      <div className="flex items-center h-16 px-4 border-b border-gray-200">
        {/* Replace with your own logo or brand image */}
        <div className="w-8 h-8 bg-green-500 rounded-md mr-2" />
        <span className="font-bold text-lg">GreenTag</span>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          <li>
            <a
              href="#"
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100"
            >
              {/* <FiHome className="mr-2" /> */}
              Dashboard
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100"
            >
              {/* <FiBarChart2 className="mr-2" /> */}
              Tables
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100"
            >
              {/* <FiCreditCard className="mr-2" /> */}
              Billing
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100"
            >
              {/* <FiRepeat className="mr-2" /> */}
              RTL
            </a>
          </li>
        </ul>

        <div className="text-xs text-gray-400 uppercase mt-8 mb-2 tracking-wider">
          Account Pages
        </div>
        <ul className="space-y-2">
          <li>
            <a
              href="#"
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100"
            >
              Profile
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100"
            >
              Sign In
            </a>
          </li>
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

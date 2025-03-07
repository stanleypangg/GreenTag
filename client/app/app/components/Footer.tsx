import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="h-16 flex items-center justify-between px-6 border-t border-gray-200 bg-white">
      <div className="text-sm text-gray-500">
        © 2023, Made with <span className="text-red-500">♥</span> by Creative Tim & Simmmple
      </div>
      <div className="text-sm text-gray-500">Tailwind & Next.js</div>
    </footer>
  );
};

export default Footer;

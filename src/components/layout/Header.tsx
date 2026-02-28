import React from 'react';
import { Settings } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center shadow-sm">
      <h1 className="text-xl font-bold text-blue-600">연신내 출석부</h1>
      <button className="p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="설정">
        <Settings size={24} className="text-gray-600" />
      </button>
    </header>
  );
};

export default Header;
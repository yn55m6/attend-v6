import React from 'react';
import Header from './Header';
import BottomNav from './BottomNav';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-20">
      <Header />
      <main className="flex-1 p-4 overflow-y-auto">
        {children}
      </main>
      <BottomNav />
    </div>
  );
};

export default LayoutWrapper;
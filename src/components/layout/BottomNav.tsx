import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, BarChart3 } from 'lucide-react';

const BottomNav: React.FC = () => {
  const navItems = [
    { to: '/', icon: <Home size={24} />, label: '출석' },
    { to: '/members', icon: <Users size={24} />, label: '회원' },
    { to: '/reports', icon: <BarChart3 size={24} />, label: '리포트' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center pb-safe shadow-[0_-1px_3px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-col items-center py-2 px-4 w-full transition-colors ${
              isActive ? 'text-blue-600 font-bold' : 'text-gray-500'
            }`
          }
        >
          {item.icon}
          <span className="text-[10px] mt-1">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;
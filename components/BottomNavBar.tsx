
import React from 'react';
import { HomeIcon, BookOpenIcon, ChartBarIcon, PencilIcon } from './icons/Icons';

type Tab = 'home' | 'courses' | 'progress' | 'notes';

interface BottomNavBarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

const NavItem: React.FC<{
    label: string;
    icon: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center justify-center w-full transition-colors duration-200 ${
                isActive ? 'text-blue-400' : 'text-gray-400 hover:text-white'
            }`}
        >
            {icon}
            <span className="text-xs mt-1">{label}</span>
        </button>
    );
};


const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: <HomeIcon /> },
    { id: 'courses', label: 'Courses', icon: <BookOpenIcon /> },
    { id: 'progress', label: 'Progress', icon: <ChartBarIcon /> },
    { id: 'notes', label: 'Notes', icon: <PencilIcon /> },
  ];

  return (
    <nav className="w-full bg-gray-900/80 backdrop-blur-sm border-t border-gray-700">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {navItems.map(item => (
            <NavItem 
                key={item.id}
                label={item.label}
                icon={item.icon}
                isActive={activeTab === item.id}
                onClick={() => setActiveTab(item.id as Tab)}
            />
        ))}
      </div>
    </nav>
  );
};

export default BottomNavBar;

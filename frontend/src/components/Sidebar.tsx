import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
// Fix: Changed alias imports to relative paths for clarity and to resolve build issues.
import { UserRole } from '../types';
import { DashboardIcon, FeedbackIcon, ProductsIcon, AlertsIcon, SettingsIcon, LogoIcon, ChevronLeftIcon, CheckCircleIcon } from './Icons';
import DarkModeToggle from './DarkModeToggle';

interface SidebarProps {
  userRole: UserRole;
}

const navLinks = [
  { to: '/', icon: DashboardIcon, label: 'Dashboard' },
  { to: '/feedback', icon: FeedbackIcon, label: 'Feedback Explorer' },
  { to: '/products', icon: ProductsIcon, label: 'Products' },
  { to: '/alerts', icon: AlertsIcon, label: 'Alerts' },
  { to: '/settings', icon: SettingsIcon, label: 'Settings' },
];


const NavItem: React.FC<{ to: string, icon: React.ElementType, label: string, isCollapsed: boolean }> = ({ to, icon: Icon, label, isCollapsed }) => {
    const baseClasses = "flex items-center h-12 text-gray-400 rounded-lg transition-all duration-300 group";
    const hoverClasses = "hover:bg-violet-800 hover:text-white";
    const activeClasses = "bg-violet-600 text-white font-semibold shadow-lg";
    const inactiveClasses = "text-gray-400";

    return (
        <NavLink
            to={to}
            end={to === '/'}
            className={({ isActive }) => `${baseClasses} ${hoverClasses} ${isActive ? activeClasses : inactiveClasses} ${isCollapsed ? 'w-12 justify-center' : 'px-4'}`}
        >
            <Icon className="w-6 h-6 flex-shrink-0" />
            <span className={`ml-4 text-sm font-medium transition-opacity duration-200 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>{label}</span>
        </NavLink>
    );
};

const Sidebar: React.FC<SidebarProps> = ({ userRole }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={`hidden md:flex flex-col bg-violet-900 text-white transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}>
        <div className={`flex items-center p-4 h-20 border-b border-violet-800/50 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
            <div className={`flex items-center overflow-hidden ${isCollapsed ? 'w-0' : 'w-auto'}`}>
                <LogoIcon className="w-8 h-8 flex-shrink-0" />
                <h1 className={`ml-3 text-lg font-bold whitespace-nowrap transition-opacity duration-200 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>Sentily</h1>
            </div>
            <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 rounded-full hover:bg-violet-800 focus:outline-none">
                <ChevronLeftIcon className={`w-6 h-6 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : 'rotate-0'}`} />
            </button>
        </div>
      
      <nav className="flex-1 p-3 space-y-2">
        {navLinks.map((link) => (
          <NavItem key={link.to} to={link.to} icon={link.icon} label={link.label} isCollapsed={isCollapsed}/>
        ))}
      </nav>

      <div className={`p-4 border-t border-violet-800/50`}>
        <div className={`flex items-center mb-4 transition-opacity duration-200 ${isCollapsed ? 'opacity-0 h-0' : 'opacity-100'}`}>
            <span className="text-sm">Dark Mode</span>
            <div className="ml-auto">
                <DarkModeToggle />
            </div>
        </div>
        <div className={`bg-green-500/10 text-green-300 rounded-lg p-3 transition-all duration-300 ${isCollapsed ? 'w-12 h-12 flex items-center justify-center' : 'flex items-center'}`}>
            <CheckCircleIcon className="w-5 h-5 flex-shrink-0" />
            <div className={`ml-2 overflow-hidden ${isCollapsed ? 'w-0' : 'w-auto'}`}>
                <p className="text-xs font-semibold">System Online</p>
                <p className="text-xs text-green-400/70">All services operational</p>
            </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

import React, { useState } from 'react';
// Fix: Changed alias imports to relative paths for clarity and to resolve build issues.
import { User } from '../types';
import { SearchIcon, ChevronDownIcon, SettingsIcon, AlertsIcon } from './Icons';

interface NavbarProps {
  user: User;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="flex-shrink-0 bg-violet-900/60 backdrop-blur-sm text-white border-b border-violet-800/50">
      <div className="flex items-center justify-between p-4 h-20">
        <div className="hidden md:block">
            <h2 className="text-xl font-bold">Sentily</h2>
            <p className="text-xs text-gray-400">Hybrid Sentiment Analysis Dashboard</p>
        </div>
        
        <div className="flex-1 flex justify-center px-4">
          <div className="relative w-full max-w-lg">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search feedback, products, or customers..."
              className="w-full pl-11 pr-4 py-3 bg-violet-800/50 border border-violet-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-gray-400"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-full hover:bg-violet-800 relative">
            <SettingsIcon className="w-6 h-6 text-gray-300"/>
          </button>
           <button className="p-2 rounded-full hover:bg-violet-800 relative">
            <AlertsIcon className="w-6 h-6 text-gray-300"/>
            <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-violet-900"></span>
          </button>
          
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 p-1 rounded-full hover:bg-violet-800/50 focus:outline-none"
            >
              <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full border-2 border-violet-700" />
              <div className="hidden lg:flex flex-col items-start text-left">
                  <span className="text-sm font-semibold text-gray-200">{user.name}</span>
                  <span className="text-xs text-gray-400 capitalize">{user.role}</span>
              </div>
            </button>
            {dropdownOpen && (
              <div
                onMouseLeave={() => setDropdownOpen(false)} 
                className="absolute right-0 mt-2 w-48 bg-violet-800 rounded-lg shadow-lg py-1 z-10 border border-violet-700">
                <a href="#/settings" className="block px-4 py-2 text-sm text-gray-300 hover:bg-violet-700">
                  Account Settings
                </a>
                <button
                  onClick={onLogout}
                  className="w-full text-left block px-4 py-2 text-sm text-red-400 hover:bg-violet-700"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

import React from 'react';
import { useDarkMode } from '@/hooks/useDarkMode';

const DarkModeToggle: React.FC = () => {
  const [theme, toggleTheme] = useDarkMode();

  return (
    <label htmlFor="dark-mode-toggle" className="relative inline-flex items-center cursor-pointer">
      <input 
        type="checkbox" 
        id="dark-mode-toggle" 
        className="sr-only peer"
        checked={theme === 'dark'}
        onChange={toggleTheme}
      />
      <div className="w-11 h-6 bg-violet-700 rounded-full peer peer-focus:ring-2 peer-focus:ring-violet-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
    </label>
  );
};

export default DarkModeToggle;

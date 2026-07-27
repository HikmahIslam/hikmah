import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-2xl transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950 min-h-[44px] min-w-[44px] flex items-center justify-center"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      id="theme-toggle"
    >
      <div className="relative w-5 h-5 overflow-hidden">
        <div
          className={`absolute inset-0 transition-transform duration-300 ease-out flex items-center justify-center ${
            isDark ? 'translate-y-0 rotate-0 opacity-100' : 'translate-y-6 rotate-45 opacity-0'
          }`}
        >
          <Sun className="w-5 h-5 text-brand-gold-400" />
        </div>
        <div
          className={`absolute inset-0 transition-transform duration-300 ease-out flex items-center justify-center ${
            isDark ? '-translate-y-6 -rotate-45 opacity-0' : 'translate-y-0 rotate-0 opacity-100'
          }`}
        >
          <Moon className="w-5 h-5 text-slate-700 dark:text-slate-300" />
        </div>
      </div>
    </button>
  );
};

export default ThemeToggle;

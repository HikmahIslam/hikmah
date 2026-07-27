import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-xl transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      id="theme-toggle"
    >
      <div className="relative w-6 h-6 overflow-hidden">
        <div
          className={`absolute inset-0 transition-transform duration-500 transform ${
            isDark ? 'translate-y-0 rotate-0' : 'translate-y-8 rotate-45'
          }`}
        >
          <Sun className="w-6 h-6 text-brand-gold-500" />
        </div>
        <div
          className={`absolute inset-0 transition-transform duration-500 transform ${
            isDark ? '-translate-y-8 -rotate-45' : 'translate-y-0 rotate-0'
          }`}
        >
          <Moon className="w-6 h-6 text-slate-700 dark:text-slate-300" />
        </div>
      </div>
    </button>
  );
};

export default ThemeToggle;

import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, BookOpen, Settings } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: "Qur'an", path: '/quran' },
    { name: 'Duas', path: '/duas' },
    { name: 'Dhikr', path: '/dhikr' },
    { name: 'Bookmarks', path: '/bookmarks' },
  ];

  const handleMobileClick = () => {
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-100 dark:border-slate-900 glass-panel shadow-sm" aria-label="Main Navigation">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8 lg:px-10">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Logo / Brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2 sm:gap-2.5 group" aria-label="Hikmah Qur'an App Home">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-brand-emerald-500 to-brand-emerald-700 flex items-center justify-center text-white shadow-md shadow-brand-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
                <BookOpen className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-brand-gold-100" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-base sm:text-lg leading-tight tracking-wider text-slate-800 dark:text-white group-hover:text-brand-emerald-600 dark:group-hover:text-brand-emerald-400 transition-colors">
                  HIKMAH
                </span>
                <span className="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500 font-medium tracking-widest uppercase">
                  Qur'an App
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `relative py-2 px-3 text-sm font-medium tracking-wide transition-colors duration-200 min-h-[44px] flex items-center ${
                    isActive
                      ? 'text-brand-emerald-600 dark:text-brand-emerald-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-brand-emerald-500 dark:hover:text-brand-emerald-400'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-brand-emerald-500 dark:bg-brand-emerald-400" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Right Action Icons (Theme, Settings) */}
          <div className="hidden md:flex items-center space-x-2">
            <ThemeToggle />
            
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `p-2.5 rounded-xl transition-all duration-300 min-h-[44px] min-w-[44px] flex items-center justify-center ${
                  isActive
                    ? 'bg-brand-emerald-50/50 dark:bg-brand-emerald-950/30 text-brand-emerald-600 dark:text-brand-emerald-400'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`
              }
              aria-label="Application Settings"
            >
              <Settings className="w-5 h-5" />
            </NavLink>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-1.5">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-emerald-500 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={isOpen ? "Close main menu" : "Open main menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-navigation-menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer/Dropdown Menu */}
      {isOpen && (
        <div
          id="mobile-navigation-menu"
          className="md:hidden border-t border-slate-100 dark:border-slate-900 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md px-3.5 pt-2 pb-4 space-y-1 shadow-lg transition-all duration-300 ease-in-out"
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={handleMobileClick}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-xl text-base font-medium transition-all min-h-[44px] ${
                  isActive
                    ? 'bg-brand-emerald-50 dark:bg-brand-emerald-950/30 text-brand-emerald-600 dark:text-brand-emerald-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
          
          <NavLink
            to="/settings"
            onClick={handleMobileClick}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-xl text-base font-medium transition-all min-h-[44px] ${
                isActive
                  ? 'bg-brand-emerald-50 dark:bg-brand-emerald-950/30 text-brand-emerald-600 dark:text-brand-emerald-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'
              }`
            }
          >
            <Settings className="w-5 h-5 mr-3 text-slate-400" />
            Settings
          </NavLink>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

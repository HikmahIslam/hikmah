import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, Settings } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import HikmahIcon from './HikmahIcon';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: "Qur'an", path: '/quran' },
    { name: 'Duas', path: '/duas' },
    { name: 'Dhikr', path: '/dhikr' },
    { name: 'Qibla', path: '/qibla' },
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
            <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group" aria-label="Hikmah Qur'an App Home">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-emerald-950/80 via-slate-900/90 to-emerald-900/90 dark:from-slate-950 dark:via-emerald-950 dark:to-slate-900 flex items-center justify-center border border-emerald-500/40 shadow-lg shadow-emerald-950/40 group-hover:scale-105 group-hover:border-amber-400/80 group-hover:shadow-emerald-500/30 backdrop-blur-md transition-all duration-300 p-1">
                <HikmahIcon className="w-full h-full text-amber-400 drop-shadow-sm" />
              </div>
              <div className="flex items-center">
                <span className="font-calligraphic font-bold text-xl sm:text-2xl tracking-[0.12em] bg-gradient-to-r from-emerald-700 via-emerald-600 to-amber-600 dark:from-emerald-300 dark:via-emerald-400 dark:to-amber-300 bg-clip-text text-transparent group-hover:from-amber-500 group-hover:to-emerald-500 dark:group-hover:from-amber-300 dark:group-hover:to-emerald-300 transition-all duration-300 drop-shadow-sm">
                  HIKMAH
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

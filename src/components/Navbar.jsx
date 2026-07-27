import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Menu, X, BookOpen, Settings, Bookmark, Heart, Flame } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

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
    <nav className="sticky top-0 z-50 w-full border-b border-slate-100 dark:border-slate-900 glass-panel shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-emerald-500 to-brand-emerald-700 flex items-center justify-center text-white shadow-md shadow-brand-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
                <BookOpen className="w-5 h-5 text-brand-gold-100" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-lg leading-tight tracking-wider text-slate-800 dark:text-white group-hover:text-brand-emerald-600 dark:group-hover:text-brand-emerald-400 transition-colors">
                  HIKMAH
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium tracking-widest uppercase">
                  Qur'an App
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `relative py-2 px-1 text-sm font-medium tracking-wide transition-colors duration-200 ${
                    isActive
                      ? 'text-brand-emerald-600 dark:text-brand-emerald-400'
                      : 'text-slate-600 dark:text-slate-300 hover:text-brand-emerald-500 dark:hover:text-brand-emerald-500'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-brand-emerald-500 dark:bg-brand-emerald-400" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Right Action Icons (Theme, Settings, etc.) */}
          <div className="hidden md:flex items-center space-x-3">
            <ThemeToggle />
            
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `p-2 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'bg-brand-emerald-50/50 dark:bg-brand-emerald-950/30 text-brand-emerald-600 dark:text-brand-emerald-400'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`
              }
              aria-label="Settings"
            >
              <Settings className="w-5 h-5" />
            </NavLink>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-emerald-500"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer/Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-100 dark:border-slate-900 bg-white dark:bg-slate-950 px-4 pt-2 pb-4 space-y-1 shadow-inner transition-all duration-300 ease-in-out">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={handleMobileClick}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-xl text-base font-medium transition-all ${
                  isActive
                    ? 'bg-brand-emerald-50 dark:bg-brand-emerald-950/30 text-brand-emerald-600 dark:text-brand-emerald-400'
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
              `flex items-center px-4 py-3 rounded-xl text-base font-medium transition-all ${
                isActive
                  ? 'bg-brand-emerald-50 dark:bg-brand-emerald-950/30 text-brand-emerald-600 dark:text-brand-emerald-400'
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

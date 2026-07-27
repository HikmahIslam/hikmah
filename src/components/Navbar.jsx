import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
<<<<<<< HEAD
import { Menu, X, Settings } from 'lucide-react';
=======
import { Menu, X, BookOpen, Home, Heart, Sparkles, Compass, Settings } from 'lucide-react';
>>>>>>> cf1a02c (feat: redesign and upgrade Hikmah Navbar with icons, scroll backdrop blur, active green pills, tooltips & tablet-optimized drawer)
import ThemeToggle from './ThemeToggle';
import HikmahIcon from './HikmahIcon';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Track window scroll for subtle backdrop shadow & border elevation
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: "Qur'an", path: '/quran', icon: BookOpen },
    { name: 'Duas', path: '/duas', icon: Heart },
    { name: 'Dhikr', path: '/dhikr', icon: Sparkles },
    { name: 'Qibla', path: '/qibla', icon: Compass },
  ];

  const handleMobileClick = () => {
    setIsOpen(false);
  };

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 shadow-md'
          : 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm border-b border-slate-100 dark:border-slate-900 shadow-sm'
      }`}
      aria-label="Main Navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 md:h-20">
          
          {/* LEFT: Hikmah Brand Logo */}
          <div className="flex-shrink-0 flex items-center">
<<<<<<< HEAD
            <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group" aria-label="Hikmah Qur'an App Home">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-emerald-950/80 via-slate-900/90 to-emerald-900/90 dark:from-slate-950 dark:via-emerald-950 dark:to-slate-900 flex items-center justify-center border border-emerald-500/40 shadow-lg shadow-emerald-950/40 group-hover:scale-105 group-hover:border-amber-400/80 group-hover:shadow-emerald-500/30 backdrop-blur-md transition-all duration-300 p-1">
                <HikmahIcon className="w-full h-full text-amber-400 drop-shadow-sm" />
              </div>
              <div className="flex items-center">
                <span className="font-calligraphic font-bold text-xl sm:text-2xl tracking-[0.12em] bg-gradient-to-r from-emerald-700 via-emerald-600 to-amber-600 dark:from-emerald-300 dark:via-emerald-400 dark:to-amber-300 bg-clip-text text-transparent group-hover:from-amber-500 group-hover:to-emerald-500 dark:group-hover:from-amber-300 dark:group-hover:to-emerald-300 transition-all duration-300 drop-shadow-sm">
                  HIKMAH
                </span>
=======
            <Link
              to="/"
              className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none focus:ring-2 focus:ring-brand-emerald-500 rounded-2xl p-1 -ml-1 transition-all"
              aria-label="Hikmah Qur'an App Home"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-brand-emerald-500 to-brand-emerald-700 flex items-center justify-center text-white shadow-md shadow-brand-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
                <BookOpen className="w-4.5 h-4.5 sm:w-5 sm:h-5 text-brand-gold-100" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-base sm:text-lg leading-tight tracking-wider text-slate-800 dark:text-white group-hover:text-brand-emerald-600 dark:group-hover:text-brand-emerald-400 transition-colors">
                  HIKMAH
                </span>
                <span className="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500 font-bold tracking-widest uppercase">
                  Qur'an App
                </span>
>>>>>>> cf1a02c (feat: redesign and upgrade Hikmah Navbar with icons, scroll backdrop blur, active green pills, tooltips & tablet-optimized drawer)
              </div>
            </Link>
          </div>

          {/* CENTER: Main Navigation (Desktop & Laptop >= 1024px) */}
          <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `relative px-3.5 py-2 rounded-2xl text-xs font-semibold tracking-wide transition-all duration-200 min-h-[44px] flex items-center gap-2 ${
                      isActive
                        ? 'bg-brand-emerald-50 dark:bg-brand-emerald-950/50 text-brand-emerald-600 dark:text-brand-emerald-400 font-bold ring-1 ring-brand-emerald-500/20 shadow-sm'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-850 hover:text-brand-emerald-600 dark:hover:text-brand-emerald-400'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-brand-emerald-500' : 'text-slate-400 group-hover:text-brand-emerald-500'}`} />
                      <span>{link.name}</span>
                      {isActive && (
                        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-brand-emerald-500 dark:bg-brand-emerald-400" />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* RIGHT: Action Controls (Theme Toggle & Settings) */}
          <div className="hidden lg:flex items-center space-x-2">
            <ThemeToggle />
            
            <NavLink
              to="/settings"
              title="Settings"
              aria-label="Application Settings"
              className={({ isActive }) =>
                `p-2.5 rounded-2xl transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center ${
                  isActive
                    ? 'bg-brand-emerald-50 dark:bg-brand-emerald-950/50 text-brand-emerald-600 dark:text-brand-emerald-400 ring-1 ring-brand-emerald-500/20 shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`
              }
            >
              <Settings className="w-5 h-5" />
            </NavLink>
          </div>

          {/* MOBILE / TABLET MENU CONTROLS (< 1024px) */}
          <div className="flex lg:hidden items-center gap-1.5">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-2xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-emerald-500 min-h-[44px] min-w-[44px] flex items-center justify-center transition-all"
              aria-label={isOpen ? "Close main menu" : "Open main menu"}
              aria-expanded={isOpen}
              aria-controls="mobile-navigation-menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* MOBILE & TABLET FULL-WIDTH DROPDOWN MENU */}
      {isOpen && (
        <div
          id="mobile-navigation-menu"
          className="lg:hidden border-t border-slate-100 dark:border-slate-900 bg-white/98 dark:bg-slate-950/98 backdrop-blur-md px-4 pt-3 pb-5 space-y-1.5 shadow-xl rounded-b-3xl transition-all duration-300 ease-in-out"
        >
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={handleMobileClick}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all min-h-[44px] ${
                    isActive
                      ? 'bg-brand-emerald-50 dark:bg-brand-emerald-950/50 text-brand-emerald-600 dark:text-brand-emerald-400 font-bold ring-1 ring-brand-emerald-500/20'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-brand-emerald-500' : 'text-slate-400'}`} />
                    <span>{link.name}</span>
                  </>
                )}
              </NavLink>
            );
          })}
          
          <div className="pt-2 border-t border-slate-100 dark:border-slate-900/80">
            <NavLink
              to="/settings"
              onClick={handleMobileClick}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all min-h-[44px] ${
                  isActive
                    ? 'bg-brand-emerald-50 dark:bg-brand-emerald-950/50 text-brand-emerald-600 dark:text-brand-emerald-400 font-bold ring-1 ring-brand-emerald-500/20'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'
                }`
              }
            >
              <Settings className="w-4.5 h-4.5 text-slate-400" />
              <span>Settings</span>
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import HikmahIcon from './HikmahIcon';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-950/40 text-slate-600 dark:text-slate-400">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 md:px-8 lg:px-10 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Brand/About */}
          <div className="flex flex-col space-y-3 sm:space-y-4">
            <Link to="/" className="flex items-center gap-2.5 w-fit group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-900 dark:from-emerald-800 dark:via-emerald-900 dark:to-slate-950 flex items-center justify-center border border-emerald-400/50 p-1 group-hover:border-amber-300 transition-all duration-300">
                <HikmahIcon className="w-full h-full text-amber-300" />
              </div>
              <span className="font-calligraphic font-bold text-xl tracking-[0.12em] bg-gradient-to-r from-emerald-600 via-emerald-500 to-amber-500 dark:from-emerald-300 dark:via-emerald-400 dark:to-amber-300 bg-clip-text text-transparent group-hover:from-amber-400 group-hover:to-emerald-400 transition-all duration-300">
                HIKMAH
              </span>
            </Link>
            <p className="text-xs sm:text-sm leading-relaxed max-w-xs">
              A peaceful, distraction-free digital companion for reading, listening, and studying the Holy Qur'an.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs sm:text-sm font-semibold tracking-wider text-slate-900 dark:text-slate-200 uppercase mb-3 sm:mb-4">
              Explore
            </h3>
            <ul className="space-y-2 sm:space-y-2.5 text-xs sm:text-sm">
              {[
                { label: "Qur'an Index", path: "/quran" },
                { label: "Duas Collection", path: "/duas" },
                { label: "Dhikr & Tasbeeh", path: "/dhikr" },
                { label: "Qibla Finder", path: "/qibla" },
              ].map(({ label, path }) => (
                <li key={path}>
                  <Link to={path} className="hover:text-brand-emerald-500 transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Spiritual Quote */}
          <div className="flex flex-col space-y-2 sm:space-y-3 sm:col-span-1 col-span-1 sm:col-auto">
            <h3 className="text-xs sm:text-sm font-semibold tracking-wider text-slate-900 dark:text-slate-200 uppercase">
              Reflections
            </h3>
            <blockquote className="border-l-2 border-brand-emerald-500 pl-3.5 sm:pl-4 py-1 italic text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              "Verily, in the remembrance of Allah do hearts find rest."
              <cite className="block not-italic font-medium text-slate-400 mt-1">— Surah Ar-Ra'd (13:28)</cite>
            </blockquote>
          </div>
        </div>

        <div className="mt-8 sm:mt-12 pt-5 sm:pt-6 border-t border-slate-100 dark:border-slate-900/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Hikmah. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 animate-pulse" /> for the Ummah.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

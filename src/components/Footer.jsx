import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-950/40 text-slate-600 dark:text-slate-400">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Brand/About */}
          <div className="flex flex-col space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-emerald-500 to-brand-emerald-700 flex items-center justify-center text-white">
                <BookOpen className="w-4 h-4 text-brand-gold-100" />
              </div>
              <span className="font-display font-bold text-base tracking-wider text-slate-800 dark:text-white">
                HIKMAH
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm">
              A peaceful, distraction-free digital companion for reading, listening, and studying the Holy Qur'an. Designed for premium spiritual reflection.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider text-slate-900 dark:text-slate-200 uppercase mb-4">
              Explore
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/quran" className="hover:text-brand-emerald-500 transition-colors">
                  Qur'an Index
                </Link>
              </li>
              <li>
                <Link to="/duas" className="hover:text-brand-emerald-500 transition-colors">
                  Duas Collection
                </Link>
              </li>
              <li>
                <Link to="/dhikr" className="hover:text-brand-emerald-500 transition-colors">
                  Dhikr & Tasbeeh
                </Link>
              </li>
              <li>
                <Link to="/bookmarks" className="hover:text-brand-emerald-500 transition-colors">
                  Bookmarks
                </Link>
              </li>
            </ul>
          </div>

          {/* Spiritual Quote */}
          <div className="flex flex-col space-y-3">
            <h3 className="text-sm font-semibold tracking-wider text-slate-900 dark:text-slate-200 uppercase mb-1">
              Reflections
            </h3>
            <blockquote className="border-l-2 border-brand-emerald-500 pl-4 py-1 italic text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              "Verily, in the remembrance of Allah do hearts find rest."
              <cite className="block not-italic font-medium text-slate-400 mt-1">— Surah Ar-Ra'd (13:28)</cite>
            </blockquote>
          </div>

        </div>

        <div className="mt-12 pt-6 border-t border-slate-100 dark:border-slate-900/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Hikmah. All rights reserved.</p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            Made with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 animate-pulse" /> for the Ummah.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

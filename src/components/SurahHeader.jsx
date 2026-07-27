import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export const SurahHeader = ({ surah }) => {
  if (!surah) return null;

  return (
    <div className="border-b border-slate-100 dark:border-slate-800/80 pb-4 sm:pb-5">
      <div className="flex items-center gap-3">
        {/* Back Button */}
        <Link
          to="/quran"
          className="p-2.5 rounded-2xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-850 hover:text-slate-800 dark:hover:text-slate-200 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center flex-shrink-0"
          aria-label="Back to Quran list"
          title="Back to Quran list"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </Link>

        {/* Surah Titles & Metadata */}
        <div className="min-w-0 flex-1">
          {/* Main Title Row: English Name & Arabic Name */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h1 className="font-display font-extrabold text-xl sm:text-2xl md:text-3xl text-slate-900 dark:text-white truncate">
              {surah.englishName}
            </h1>
            <span
              className="arabic-text text-xl sm:text-2xl md:text-3xl text-brand-emerald-600 dark:text-brand-emerald-400 font-semibold flex-shrink-0"
              style={{ lineHeight: 1 }}
              dir="rtl"
            >
              {surah.name}
            </span>
          </div>

          {/* Subtitle Metadata */}
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-1 truncate">
            Surah {surah.number} • {surah.numberOfAyahs} Verses • {surah.revelationType}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SurahHeader;

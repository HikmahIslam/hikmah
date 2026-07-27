import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export const SurahCard = ({ surah }) => {
  const { number, name, englishName, englishNameTranslation, numberOfAyahs, revelationType } = surah;

  return (
    <Link
      to={`/quran/${number}`}
      className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl sm:rounded-3xl p-4 sm:p-5 hover:shadow-md hover:border-brand-emerald-200/60 dark:hover:border-brand-emerald-950/60 transition-all duration-300 flex items-center justify-between gap-3 group min-h-[72px]"
    >
      <div className="flex items-center gap-3 min-w-0">
        {/* Surah Number Icon */}
        <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0">
          <div className="absolute inset-0 text-slate-100 dark:text-slate-800/60 group-hover:text-brand-emerald-50 dark:group-hover:text-brand-emerald-950/30 group-hover:scale-105 transition-all duration-300">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
              <path d="M12 0l3 5 5 1-2 5 4 4-5 1-1 5-5-3-5 3-1-5-5-1 4-4-2-5 5-1z" />
            </svg>
          </div>
          <span className="z-10 font-mono font-bold text-xs text-slate-700 dark:text-slate-350 group-hover:text-brand-emerald-600 dark:group-hover:text-brand-emerald-400">
            {number}
          </span>
        </div>

        {/* Names */}
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-sm sm:text-base text-slate-855 dark:text-white group-hover:text-brand-emerald-600 dark:group-hover:text-brand-emerald-400 transition-colors truncate">
            {englishName}
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500 truncate">
            {englishNameTranslation}
          </span>
        </div>
      </div>

      {/* Right Side: Arabic Name & Verses Count */}
      <div className="text-right flex flex-col items-end gap-1 flex-shrink-0">
        <span className="arabic-text font-semibold text-base sm:text-lg text-slate-900 dark:text-white leading-none">
          {name}
        </span>
        <div className="flex items-center gap-1.5 flex-wrap justify-end">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase whitespace-nowrap">
            {numberOfAyahs} Ayahs
          </span>
          <span
            className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full whitespace-nowrap ${
              revelationType === 'Meccan'
                ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400'
                : 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400'
            }`}
          >
            {revelationType}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default SurahCard;

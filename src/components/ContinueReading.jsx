import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, Play } from 'lucide-react';

export const ContinueReading = () => {
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('hikmah-continue-reading');
    if (saved) {
      try {
        setProgress(JSON.parse(saved));
      } catch (e) {
        setProgress(null);
      }
    }
  }, []);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 shadow-sm flex flex-col justify-between h-full">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-brand-emerald-500" />
          <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            Continue Reading
          </h2>
        </div>

        {/* Content */}
        {progress ? (
          <div className="space-y-2.5">
            <div className="flex justify-between items-baseline">
              <h3 className="font-bold text-slate-800 dark:text-white text-base md:text-lg">
                {progress.surahEnglishName}
              </h3>
              <span className="arabic-text text-sm font-semibold text-brand-emerald-600 dark:text-brand-emerald-400">
                {progress.surahArabicName}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Surah {progress.surahNumber} • {progress.totalAyahs} Verses
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <h3 className="font-bold text-slate-800 dark:text-white text-sm">
              Begin your journey
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Start reading the Holy Qur'an to keep track of your reading progress automatically.
            </p>
          </div>
        )}
      </div>

      {/* Button */}
      <div className="pt-5 border-t border-slate-100 dark:border-slate-800/60 mt-4">
        {progress ? (
          <Link
            to={`/quran/${progress.surahNumber}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-emerald-600 dark:text-brand-emerald-400 hover:text-brand-emerald-700 dark:hover:text-brand-emerald-300 transition-colors group"
          >
            Resume Reading
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        ) : (
          <Link
            to="/quran"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-emerald-600 dark:text-brand-emerald-400 hover:text-brand-emerald-700 dark:hover:text-brand-emerald-300 transition-colors group"
          >
            Start Reading
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        )}
      </div>
    </div>
  );
};

export default ContinueReading;

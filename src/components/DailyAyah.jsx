import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDailyAyah } from '../services/quranApi';
import { useBookmarks } from '../context/BookmarksContext';
import { useSettings } from '../context/SettingsContext';
import { Bookmark, Copy, Check, Sparkles, BookOpen } from 'lucide-react';

export const DailyAyah = () => {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { settings } = useSettings();

  const [ayah, setAyah] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchDaily = async () => {
      try {
        const data = await getDailyAyah();
        if (isMounted) {
          setAyah(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    fetchDaily();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-5 sm:p-7 shadow-sm animate-pulse space-y-4">
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
        <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3"></div>
      </div>
    );
  }

  if (!ayah) return null;

  const { number, numberInSurah, text, surah, enTranslation, mlTranslation } = ayah;
  const isSaved = isBookmarked(surah.number, numberInSurah);
  const translationText = settings.defaultLanguage === 'ml' && mlTranslation ? mlTranslation : enTranslation;

  const handleCopy = () => {
    const copyText = `📖 Verse of the Day\nSurah ${surah.englishName} (${surah.number}:${numberInSurah})\n\nArabic:\n${text}\n\nTranslation:\n${translationText}\n\nRead more on Hikmah App`;
    navigator.clipboard.writeText(copyText).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const handleBookmarkToggle = () => {
    toggleBookmark({
      id: `${surah.number}_${numberInSurah}`,
      surahNumber: surah.number,
      ayahNumber: numberInSurah,
      surahName: surah.name,
      surahEnglishName: surah.englishName,
      arabicText: text,
      translationText: translationText
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-4.5 sm:p-6 lg:p-8 shadow-sm space-y-4 sm:space-y-5 relative overflow-hidden">
      
      {/* Sparkles background effect */}
      <div className="absolute top-0 right-0 p-3 text-brand-gold-500/20 pointer-events-none">
        <Sparkles className="w-8 h-8 sm:w-12 sm:h-12" />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2 h-2 rounded-full bg-brand-gold-500 flex-shrink-0"></span>
          <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest truncate">
            Verse of the Day
          </h2>
        </div>
        <Link
          to={`/quran/${surah.number}?ayah=${numberInSurah}`}
          className="text-xs font-bold text-brand-emerald-600 dark:text-brand-emerald-400 hover:underline flex items-center gap-1 flex-shrink-0"
        >
          {surah.englishName} {surah.number}:{numberInSurah}
        </Link>
      </div>

      {/* Arabic Text */}
      <div className="text-right py-1.5 sm:py-2">
        <p className="arabic-text text-lg sm:text-xl md:text-2xl text-slate-900 dark:text-white leading-loose font-normal break-words">
          {text}
        </p>
      </div>

      {/* Translation */}
      <div className="text-xs sm:text-sm leading-relaxed text-slate-655 dark:text-slate-350 border-l-2 border-brand-emerald-500/30 pl-3.5 sm:pl-4 py-0.5 break-words">
        <p>{translationText}</p>
        {settings.defaultLanguage === 'both' && mlTranslation && (
          <p className="mt-2 text-slate-500 dark:text-slate-400 text-xs">{mlTranslation}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/60 text-xs">
        <Link
          to={`/quran/${surah.number}?ayah=${numberInSurah}`}
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded-xl transition-all border border-slate-100 dark:border-slate-900 min-h-[44px] text-xs font-semibold"
        >
          <BookOpen className="w-3.5 h-3.5" />
          Read in Context
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="p-2.5 rounded-xl text-slate-450 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            title="Copy verse text"
            aria-label="Copy verse text"
          >
            {isCopied ? <Check className="w-4 h-4 text-brand-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>
          
          {/* Bookmark Button */}
          <button
            onClick={handleBookmarkToggle}
            className={`p-2.5 rounded-xl transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
              isSaved ? 'text-brand-emerald-500 hover:bg-brand-emerald-50 dark:hover:bg-brand-emerald-950/20' : 'text-slate-450 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Bookmark verse"
            aria-label="Bookmark verse"
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

    </div>
  );
};

export default DailyAyah;

import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useBookmarks } from '../context/BookmarksContext';
import { Bookmark, Trash2, ArrowRight, BookOpen } from 'lucide-react';

export const Bookmarks = () => {
  const { bookmarks, removeBookmark } = useBookmarks();
  const navigate = useNavigate();

  const handleOpenAyah = (surahNumber, ayahNumber) => {
    navigate(`/quran/${surahNumber}?ayah=${ayahNumber}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-900 pb-5">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-brand-emerald-500/10 dark:bg-brand-emerald-500/5 flex items-center justify-center text-brand-emerald-600 dark:text-brand-emerald-400 flex-shrink-0">
          <Bookmark className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
        </div>
        <div className="min-w-0">
          <h1 className="font-display font-bold text-xl sm:text-2xl tracking-wide text-slate-800 dark:text-white">Bookmarks</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Your saved verses for quick reflection and reading</p>
        </div>
      </div>

      {/* Empty State */}
      {bookmarks.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto space-y-5 sm:space-y-6 shadow-sm">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 mx-auto">
            <Bookmark className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-white">No bookmarks saved yet</h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto">
              While reading the Qur'an, click the bookmark icon on any verse to save it here for quick access.
            </p>
          </div>
          <Link
            to="/quran"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-brand-emerald-500 text-white font-medium hover:bg-brand-emerald-600 transition-all hover:shadow-lg hover:shadow-brand-emerald-500/10 active:scale-[0.98] min-h-[44px] text-sm"
          >
            <BookOpen className="w-4 h-4" />
            Explore Qur'an
          </Link>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {bookmarks.map(b => (
            <div
              key={b.id}
              className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 hover:shadow-md hover:border-brand-emerald-200/60 dark:hover:border-brand-emerald-950/60 transition-all duration-300"
            >
              {/* Top Row: Surah & Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/60 pb-3 mb-4">
                <div className="flex flex-wrap items-center gap-2 min-w-0">
                  <div className="text-xs font-bold px-2.5 py-1 bg-brand-emerald-50 dark:bg-brand-emerald-950/20 text-brand-emerald-600 dark:text-brand-emerald-400 rounded-full whitespace-nowrap">
                    Surah {b.surahNumber}
                  </div>
                  <span className="font-bold text-slate-800 dark:text-white text-sm truncate">
                    {b.surahEnglishName}
                  </span>
                  <span className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">
                    • Ayah {b.ayahNumber}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleOpenAyah(b.surahNumber, b.ayahNumber)}
                    className="px-3 py-2 rounded-xl text-brand-emerald-600 hover:bg-brand-emerald-50 dark:hover:bg-brand-emerald-950/20 transition-colors flex items-center gap-1.5 text-xs font-semibold min-h-[40px]"
                    aria-label={`Open Ayah ${b.ayahNumber} of Surah ${b.surahEnglishName}`}
                  >
                    Open
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => removeBookmark(b.id)}
                    className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/15 transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
                    aria-label="Remove bookmark"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Arabic verse */}
              <div className="text-right mb-3 sm:mb-4">
                <p className="arabic-text text-lg sm:text-xl md:text-2xl text-slate-900 dark:text-white leading-loose font-normal break-words" dir="rtl">
                  {b.arabicText}
                </p>
              </div>

              {/* Translation */}
              <div className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed border-l-2 border-slate-200 dark:border-slate-800 pl-3.5 sm:pl-4 py-0.5 break-words">
                <p>{b.translationText}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;

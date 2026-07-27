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
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-900 pb-5">
        <div className="w-12 h-12 rounded-2xl bg-brand-emerald-500/10 dark:bg-brand-emerald-500/5 flex items-center justify-center text-brand-emerald-600 dark:text-brand-emerald-400">
          <Bookmark className="w-6 h-6 fill-current" />
        </div>
        <div>
          <h1 className="font-display font-bold text-2xl tracking-wide text-slate-800 dark:text-white">Bookmarks</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Your saved verses for quick reflection and reading</p>
        </div>
      </div>

      {/* Empty State */}
      {bookmarks.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-12 text-center max-w-xl mx-auto space-y-6 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 mx-auto">
            <Bookmark className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-white">No bookmarks saved yet</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto">
              While reading the Qur'an, click the bookmark icon on any verse to save it here for quick access.
            </p>
          </div>
          <Link
            to="/quran"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-brand-emerald-500 text-white font-medium hover:bg-brand-emerald-600 transition-all hover:shadow-lg hover:shadow-brand-emerald-500/10 active:scale-98"
          >
            <BookOpen className="w-4 h-4" />
            Explore Qur'an
          </Link>
        </div>
      ) : (
        /* Bookmarks List */
        <div className="space-y-6">
          {bookmarks.map((b) => (
            <div
              key={b.id}
              className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 hover:shadow-md hover:border-brand-emerald-200/60 dark:hover:border-brand-emerald-950/60 transition-all duration-300 group"
            >
              {/* Top Row: Surah & Action Buttons */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-3.5 mb-4.5">
                <div className="flex items-center gap-2.5">
                  <div className="text-xs font-bold px-3 py-1 bg-brand-emerald-50 dark:bg-brand-emerald-950/20 text-brand-emerald-600 dark:text-brand-emerald-400 rounded-full">
                    Surah {b.surahNumber}
                  </div>
                  <span className="font-bold text-slate-800 dark:text-white text-sm">
                    {b.surahEnglishName}
                  </span>
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    • Ayah {b.ayahNumber}
                  </span>
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenAyah(b.surahNumber, b.ayahNumber)}
                    className="p-2 rounded-xl text-brand-emerald-600 hover:bg-brand-emerald-50 dark:hover:bg-brand-emerald-950/20 transition-colors flex items-center gap-1.5 text-xs font-semibold"
                    title="Open Ayah"
                  >
                    Open Ayah
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => removeBookmark(b.id)}
                    className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/15 transition-colors"
                    title="Remove Bookmark"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Arabic verse */}
              <div className="text-right mb-4">
                <p className="arabic-text text-xl md:text-2xl text-slate-900 dark:text-white leading-loose font-normal">
                  {b.arabicText}
                </p>
              </div>

              {/* Translation text */}
              <div className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed border-l-2 border-slate-200 dark:border-slate-800 pl-4 py-0.5">
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

import React, { useState, useEffect } from 'react';
import { DUAS_DATA } from '../data/duas';
import { Heart, Copy, Check, Bookmark, BookmarkCheck } from 'lucide-react';

const CATEGORIES = [
  "All", "Morning Duas", "Evening Duas", "Protection",
  "Forgiveness", "Guidance", "Family", "Travel", "Rizq", "Saved"
];

export const Duas = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [bookmarkedDuas, setBookmarkedDuas] = useState(() => {
    const saved = localStorage.getItem('hikmah-bookmarked-duas');
    return saved ? JSON.parse(saved) : [];
  });
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    localStorage.setItem('hikmah-bookmarked-duas', JSON.stringify(bookmarkedDuas));
  }, [bookmarkedDuas]);

  const toggleBookmarkDua = (id) => {
    setBookmarkedDuas(prev => prev.includes(id) ? prev.filter(dId => dId !== id) : [...prev, id]);
  };

  const handleCopy = (dua) => {
    const copyText = `✨ ${dua.title}\n\nArabic:\n${dua.arabic}\n\nTransliteration:\n${dua.transliteration}\n\nTranslation:\n${dua.translation}\n\nShared via Hikmah App`;
    navigator.clipboard.writeText(copyText).then(() => {
      setCopiedId(dua.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const filteredDuas = DUAS_DATA.filter(dua => {
    if (activeCategory === "All") return true;
    if (activeCategory === "Saved") return bookmarkedDuas.includes(dua.id);
    return dua.category === activeCategory;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-900 pb-5">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-brand-emerald-500/10 dark:bg-brand-emerald-500/5 flex items-center justify-center text-brand-emerald-600 dark:text-brand-emerald-400 flex-shrink-0">
          <Heart className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
        </div>
        <div className="min-w-0">
          <h1 className="font-display font-bold text-xl sm:text-2xl tracking-wide text-slate-800 dark:text-white">Duas</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate">A collection of beautiful prayers and supplications from the Sunnah</p>
        </div>
      </div>

      {/* Categories Bar — horizontally scrollable on mobile */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-0.5 px-0.5 scroll-smooth snap-x">
        {CATEGORIES.map(cat => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap flex-shrink-0 px-3.5 sm:px-4.5 py-2 sm:py-2.5 rounded-2xl text-xs font-semibold tracking-wide transition-all snap-start min-h-[40px] ${
                isActive
                  ? 'bg-brand-emerald-500 text-white shadow-md shadow-brand-emerald-500/15'
                  : 'bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850'
              }`}
            >
              {cat}{cat === "Saved" && ` (${bookmarkedDuas.length})`}
            </button>
          );
        })}
      </div>

      {/* Empty State */}
      {activeCategory === "Saved" && filteredDuas.length === 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-10 sm:p-12 text-center max-w-md mx-auto space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 mx-auto">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-white">No saved Duas</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Browse through Duas categories and save prayers that you'd like to read regularly.
            </p>
          </div>
        </div>
      )}

      {/* Duas Grid */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        {filteredDuas.map(dua => {
          const isSaved = bookmarkedDuas.includes(dua.id);
          const isCopied = copiedId === dua.id;
          return (
            <div
              key={dua.id}
              className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl sm:rounded-3xl p-4.5 sm:p-6 hover:shadow-md transition-all duration-300 flex flex-col gap-4"
            >
              {/* Category & Title */}
              <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-100 dark:border-slate-800/60 pb-3">
                <span className="text-[10px] uppercase font-bold tracking-widest text-brand-emerald-600 dark:text-brand-emerald-400">
                  {dua.category}
                </span>
                <h3 className="text-sm font-bold text-slate-850 dark:text-slate-100 text-right flex-1 min-w-0">
                  {dua.title}
                </h3>
              </div>

              {/* Arabic */}
              <div className="text-right">
                <p className="arabic-text text-lg sm:text-xl md:text-2xl text-slate-900 dark:text-white leading-loose font-normal break-words" dir="rtl">
                  {dua.arabic}
                </p>
              </div>

              {/* Transliteration */}
              <div className="text-xs italic leading-relaxed text-slate-500 dark:text-slate-450 border-l-2 border-brand-gold-400/40 pl-3 break-words">
                <p>{dua.transliteration}</p>
              </div>

              {/* Translation */}
              <div className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl p-3.5 sm:p-4 border border-slate-100/50 dark:border-slate-900/40 break-words">
                <p>{dua.translation}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-end gap-2 mt-auto pt-2 border-t border-slate-100/60 dark:border-slate-800/40">
                <button
                  onClick={() => handleCopy(dua)}
                  className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 min-h-[40px] ${
                    isCopied
                      ? 'border-brand-emerald-500 bg-brand-emerald-50/30 text-brand-emerald-600 dark:bg-brand-emerald-950/25 dark:text-brand-emerald-400'
                      : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-950'
                  }`}
                  aria-label="Copy supplication"
                >
                  {isCopied ? <><Check className="w-4 h-4 text-brand-emerald-600" />Copied!</> : <><Copy className="w-4 h-4" />Copy</>}
                </button>
                <button
                  onClick={() => toggleBookmarkDua(dua.id)}
                  className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 min-h-[40px] ${
                    isSaved
                      ? 'border-brand-emerald-500 bg-brand-emerald-50/30 text-brand-emerald-600 dark:bg-brand-emerald-950/25 dark:text-brand-emerald-400'
                      : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-950'
                  }`}
                  aria-label="Save supplication"
                >
                  {isSaved ? <><BookmarkCheck className="w-4 h-4 fill-current text-brand-emerald-500" />Saved</> : <><Bookmark className="w-4 h-4" />Save</>}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Duas;

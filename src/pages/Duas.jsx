import React, { useState, useEffect } from 'react';
import { DUAS_DATA } from '../data/duas';
import { Heart, Copy, Check, Bookmark, BookmarkCheck } from 'lucide-react';

const CATEGORIES = [
  "All",
  "Morning Duas",
  "Evening Duas",
  "Protection",
  "Forgiveness",
  "Guidance",
  "Family",
  "Travel",
  "Rizq",
  "Saved"
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
    setBookmarkedDuas((prev) =>
      prev.includes(id) ? prev.filter((dId) => dId !== id) : [...prev, id]
    );
  };

  const handleCopy = (dua) => {
    const copyText = `✨ ${dua.title}\n\nArabic:\n${dua.arabic}\n\nTransliteration:\n${dua.transliteration}\n\nTranslation:\n${dua.translation}\n\nShared via Hikmah App`;
    navigator.clipboard.writeText(copyText).then(() => {
      setCopiedId(dua.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  // Filter Duas
  const filteredDuas = DUAS_DATA.filter((dua) => {
    if (activeCategory === "All") return true;
    if (activeCategory === "Saved") return bookmarkedDuas.includes(dua.id);
    return dua.category === activeCategory;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-900 pb-5">
        <div className="w-12 h-12 rounded-2xl bg-brand-emerald-500/10 dark:bg-brand-emerald-500/5 flex items-center justify-center text-brand-emerald-600 dark:text-brand-emerald-400">
          <Heart className="w-6 h-6 fill-current" />
        </div>
        <div>
          <h1 className="font-display font-bold text-2xl tracking-wide text-slate-800 dark:text-white">Duas</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">A collection of beautiful prayers and supplications from the Sunnah</p>
        </div>
      </div>

      {/* Categories Bar */}
      <div className="flex gap-2 overflow-x-auto pb-3.5 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-4.5 py-2.5 rounded-2xl text-xs font-semibold tracking-wide transition-all ${
                isActive
                  ? 'bg-brand-emerald-500 text-white shadow-md shadow-brand-emerald-500/15'
                  : 'bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 text-slate-600 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850'
              }`}
            >
              {cat} {cat === "Saved" && `(${bookmarkedDuas.length})`}
            </button>
          );
        })}
      </div>

      {/* Empty State for Saved Tab */}
      {activeCategory === "Saved" && filteredDuas.length === 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-12 text-center max-w-md mx-auto space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 mx-auto">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-white">No saved Duas</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Browse through Duas categories and save prayers that you'd like to read regularly here.
            </p>
          </div>
        </div>
      )}

      {/* Duas Grid */}
      <div className="grid grid-cols-1 gap-6">
        {filteredDuas.map((dua) => {
          const isSaved = bookmarkedDuas.includes(dua.id);
          const isCopied = copiedId === dua.id;
          
          return (
            <div
              key={dua.id}
              className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 hover:shadow-md transition-all duration-300 flex flex-col justify-between relative group"
            >
              {/* Category & Badge */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-3.5 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-brand-emerald-600 dark:text-brand-emerald-400">
                    {dua.category}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-850 dark:text-slate-100">
                  {dua.title}
                </h3>
              </div>

              {/* Arabic */}
              <div className="text-right mb-4">
                <p className="arabic-text text-xl md:text-2xl text-slate-900 dark:text-white leading-loose font-normal">
                  {dua.arabic}
                </p>
              </div>

              {/* Transliteration */}
              <div className="mb-3 text-xs italic leading-relaxed text-slate-500 dark:text-slate-450 border-l-2 border-brand-gold-400/40 pl-3">
                <p>{dua.transliteration}</p>
              </div>

              {/* Translation */}
              <div className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 mb-6 bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl p-4 border border-slate-100/50 dark:border-slate-900/40">
                <p>{dua.translation}</p>
              </div>

              {/* Actions row */}
              <div className="flex justify-end gap-2.5 mt-auto pt-2 border-t border-slate-100/60 dark:border-slate-800/40">
                {/* Copy */}
                <button
                  onClick={() => handleCopy(dua)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                    isCopied
                      ? 'border-brand-emerald-500 bg-brand-emerald-50/30 text-brand-emerald-600 dark:bg-brand-emerald-950/25 dark:text-brand-emerald-400'
                      : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-950'
                  }`}
                  aria-label="Copy supplication"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-4 h-4 text-brand-emerald-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </button>

                {/* Bookmark */}
                <button
                  onClick={() => toggleBookmarkDua(dua.id)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                    isSaved
                      ? 'border-brand-emerald-500 bg-brand-emerald-50/30 text-brand-emerald-600 dark:bg-brand-emerald-950/25 dark:text-brand-emerald-400'
                      : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-950'
                  }`}
                  aria-label="Save supplication"
                >
                  {isSaved ? (
                    <>
                      <BookmarkCheck className="w-4 h-4 fill-current text-brand-emerald-500" />
                      Saved
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-4 h-4" />
                      Save
                    </>
                  )}
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

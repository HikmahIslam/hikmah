import React, { useState, useEffect } from 'react';
import { DUAS_DATA } from '../data/duas';
import { Copy, Check, Bookmark, BookmarkCheck, Languages } from 'lucide-react';
import DuaHandsIcon from '../components/DuaHandsIcon';
import { useSettings } from '../context/SettingsContext';

export const Duas = () => {
  const { t } = useSettings();
  const [activeCategory, setActiveCategory] = useState("All");
  const [bookmarkedDuas, setBookmarkedDuas] = useState(() => {
    const saved = localStorage.getItem('hikmah-bookmarked-duas');
    return saved ? JSON.parse(saved) : [];
  });
  const [copiedId, setCopiedId] = useState(null);

  // Translation visibility states
  const [showTransliteration, setShowTransliteration] = useState(() => {
    const saved = localStorage.getItem('hikmah-dua-show-transliteration');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [showEnglish, setShowEnglish] = useState(() => {
    const saved = localStorage.getItem('hikmah-dua-show-english');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [showMalayalam, setShowMalayalam] = useState(() => {
    const saved = localStorage.getItem('hikmah-dua-show-malayalam');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const CATEGORIES = [
    { key: "All", label: t('all') },
    { key: "Morning Duas", label: t('morningDuas') },
    { key: "Evening Duas", label: t('eveningDuas') },
    { key: "Protection", label: t('protection') },
    { key: "Forgiveness", label: t('forgiveness') },
    { key: "Guidance", label: t('guidance') },
    { key: "Family", label: t('family') },
    { key: "Travel", label: t('travel') },
    { key: "Rizq", label: t('rizq') },
    { key: "Saved", label: t('saved') },
  ];

  useEffect(() => {
    localStorage.setItem('hikmah-bookmarked-duas', JSON.stringify(bookmarkedDuas));
  }, [bookmarkedDuas]);

  useEffect(() => {
    localStorage.setItem('hikmah-dua-show-transliteration', JSON.stringify(showTransliteration));
  }, [showTransliteration]);

  useEffect(() => {
    localStorage.setItem('hikmah-dua-show-english', JSON.stringify(showEnglish));
  }, [showEnglish]);

  useEffect(() => {
    localStorage.setItem('hikmah-dua-show-malayalam', JSON.stringify(showMalayalam));
  }, [showMalayalam]);

  const toggleBookmarkDua = (id) => {
    setBookmarkedDuas((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCopyDua = (dua) => {
    const textParts = [dua.arabic];
    if (showTransliteration) textParts.push(dua.transliteration);
    if (showEnglish) textParts.push(dua.translation);
    if (showMalayalam && dua.translationMl) textParts.push(dua.translationMl);

    const copyText = textParts.join('\n\n');
    navigator.clipboard.writeText(copyText);
    setCopiedId(dua.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredDuas = DUAS_DATA.filter((dua) => {
    if (activeCategory === "All") return true;
    if (activeCategory === "Saved") return bookmarkedDuas.includes(dua.id);
    return dua.category === activeCategory;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-900 pb-5">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-brand-emerald-500/10 dark:bg-brand-emerald-500/5 flex items-center justify-center text-brand-emerald-600 dark:text-brand-emerald-400 flex-shrink-0">
          <DuaHandsIcon className="w-6 h-6 sm:w-7 sm:h-7" color="currentColor" />
        </div>
        <div className="min-w-0">
          <h1 className="font-display font-bold text-xl sm:text-2xl tracking-wide text-slate-800 dark:text-white">{t('duasHeaderTitle')}</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate">{t('duasHeaderSub')}</p>
        </div>
      </div>

      {/* Translation & Text Display Options */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-xs">
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold text-xs sm:text-sm">
          <Languages className="w-4 h-4 text-brand-emerald-500" />
          <span>{t('displayOptions')}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Transliteration Toggle */}
          <button
            onClick={() => setShowTransliteration(!showTransliteration)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              showTransliteration
                ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900 shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200/60 dark:border-slate-700 hover:text-slate-600'
            }`}
          >
            {showTransliteration ? <Check className="w-3.5 h-3.5" /> : <div className="w-3.5 h-3.5 rounded-full border border-current" />}
            {t('transliteration')}
          </button>

          {/* English Toggle */}
          <button
            onClick={() => setShowEnglish(!showEnglish)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              showEnglish
                ? 'bg-brand-emerald-500 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200/60 dark:border-slate-700 hover:text-slate-600'
            }`}
          >
            {showEnglish ? <Check className="w-3.5 h-3.5" /> : <div className="w-3.5 h-3.5 rounded-full border border-current" />}
            {t('english')}
          </button>

          {/* Malayalam Toggle */}
          <button
            onClick={() => setShowMalayalam(!showMalayalam)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              showMalayalam
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200/60 dark:border-slate-700 hover:text-slate-600'
            }`}
          >
            {showMalayalam ? <Check className="w-3.5 h-3.5" /> : <div className="w-3.5 h-3.5 rounded-full border border-current" />}
            {t('malayalam')}
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'bg-brand-emerald-500 text-white shadow-md shadow-brand-emerald-500/20 font-semibold'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/50 dark:border-slate-800/80'
              }`}
            >
              {cat.label}
              {cat.key === "Saved" && bookmarkedDuas.length > 0 && (
                <span className="ml-1.5 rtl:mr-1.5 rtl:ml-0 bg-white/20 px-1.5 py-0.5 rounded-full text-[10px]">
                  {bookmarkedDuas.length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Duas List */}
      <div className="space-y-4 sm:space-y-5">
        {filteredDuas.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 p-6 space-y-3">
            <Bookmark className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-700 dark:text-slate-200">{t('noSavedDuas')}</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">{t('saveDuasHint')}</p>
          </div>
        ) : (
          filteredDuas.map((dua) => {
            const isBookmarked = bookmarkedDuas.includes(dua.id);
            const isCopied = copiedId === dua.id;

            return (
              <div
                key={dua.id}
                className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xs hover:shadow-md transition-all duration-300 space-y-4 sm:space-y-5"
              >
                {/* Card Top Row: Reference + Actions */}
                <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/60 pb-3">
                  <span className="text-xs font-semibold text-brand-emerald-600 dark:text-brand-emerald-400 bg-brand-emerald-50 dark:bg-brand-emerald-950/40 px-2.5 py-1 rounded-xl">
                    {dua.reference}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleCopyDua(dua)}
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title={t('copy')}
                    >
                      {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => toggleBookmarkDua(dua.id)}
                      className={`p-2 rounded-xl transition-colors ${
                        isBookmarked
                          ? 'text-brand-emerald-500 bg-brand-emerald-50 dark:bg-brand-emerald-950/40'
                          : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                      title={t('save')}
                    >
                      {isBookmarked ? <BookmarkCheck className="w-4 h-4 fill-current" /> : <Bookmark className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Arabic Text */}
                <div className="text-right rtl:text-left py-1">
                  <p className="arabic-text text-2xl sm:text-3xl md:text-4xl text-slate-900 dark:text-white leading-[1.8] sm:leading-[2.0] tracking-wide">
                    {dua.arabic}
                  </p>
                </div>

                {/* Transliteration */}
                {showTransliteration && (
                  <p className="text-xs sm:text-sm font-serif italic text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50/60 dark:bg-slate-950/40 p-3 rounded-2xl border border-slate-100/80 dark:border-slate-900/60">
                    {dua.transliteration}
                  </p>
                )}

                {/* English Translation */}
                {showEnglish && (
                  <div className="space-y-1 bg-slate-50/40 dark:bg-slate-950/20 p-3 rounded-2xl border border-slate-100/50 dark:border-slate-900/40">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">English</span>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                      {dua.translation}
                    </p>
                  </div>
                )}

                {/* Malayalam Translation */}
                {showMalayalam && dua.translationMl && (
                  <div className="space-y-1 bg-emerald-50/40 dark:bg-emerald-950/20 p-3 rounded-2xl border border-emerald-100/50 dark:border-emerald-900/30">
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block">മലയാളം</span>
                    <p className="text-xs sm:text-sm text-emerald-900 dark:text-emerald-200 font-medium leading-relaxed">
                      {dua.translationMl}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Duas;

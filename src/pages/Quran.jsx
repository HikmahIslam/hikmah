import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getSurahList } from '../services/quranApi';
import { JUZ_DATA } from '../data/juzData';
import SurahCard from '../components/SurahCard';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { BookOpen, Compass, AlertCircle, ChevronRight } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

// ─── JuzCard Component ────────────────────────────────────────────────────────
const JuzCard = ({ juz }) => {
  const navigate = useNavigate();
  const { t } = useSettings();
  return (
    <div
      onClick={() => navigate(`/quran/juz/${juz.id}`)}
      className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl sm:rounded-3xl p-4 sm:p-5 hover:shadow-md hover:border-brand-emerald-200/60 dark:hover:border-brand-emerald-950/60 transition-all duration-300 flex flex-col gap-3 group cursor-pointer"
    >
      {/* Top row: Juz number badge + Arabic name */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* Juz number icon */}
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0">
            <div className="absolute inset-0 text-slate-100 dark:text-slate-800/60 group-hover:text-brand-emerald-50 dark:group-hover:text-brand-emerald-950/30 group-hover:scale-105 transition-all duration-300">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M12 0l3 5 5 1-2 5 4 4-5 1-1 5-5-3-5 3-1-5-5-1 4-4-2-5 5-1z" />
              </svg>
            </div>
            <span className="z-10 font-mono font-bold text-xs text-slate-700 dark:text-slate-350 group-hover:text-brand-emerald-600 dark:group-hover:text-brand-emerald-400">
              {juz.id}
            </span>
          </div>
          {/* Juz title */}
          <div className="min-w-0">
            <div className="font-bold text-sm sm:text-base text-slate-855 dark:text-white group-hover:text-brand-emerald-600 dark:group-hover:text-brand-emerald-400 transition-colors truncate">
              {t('juz')} {juz.id}
            </div>
            <div className="text-xs text-slate-400 dark:text-slate-500 truncate">{juz.title}</div>
          </div>
        </div>

        {/* Arabic name */}
        <div className="text-right flex-shrink-0">
          <div className="arabic-text font-semibold text-base sm:text-lg text-slate-900 dark:text-white leading-none group-hover:text-brand-emerald-600 dark:group-hover:text-brand-emerald-400 transition-colors">
            {juz.arabicName}
          </div>
          <div className="arabic-text text-xs text-brand-emerald-600 dark:text-brand-emerald-400 font-medium mt-0.5">
            {juz.arabicTitle}
          </div>
        </div>
      </div>

      {/* Middle: Start / End */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-slate-50 dark:bg-slate-950/60 rounded-xl px-3 py-2 space-y-0.5">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Starts</div>
          <div className="font-semibold text-slate-700 dark:text-slate-300 truncate">
            {juz.startSurah}
          </div>
          <div className="font-mono text-brand-emerald-600 dark:text-brand-emerald-400">
            {juz.startSurahId}:{juz.startAyah}
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-950/60 rounded-xl px-3 py-2 space-y-0.5">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ends</div>
          <div className="font-semibold text-slate-700 dark:text-slate-300 truncate">
            {juz.endSurah}
          </div>
          <div className="font-mono text-brand-emerald-600 dark:text-brand-emerald-400">
            {juz.endSurahId}:{juz.endAyah}
          </div>
        </div>
      </div>

      {/* Read Juz link */}
      <div className="flex justify-end pt-1">
        <span className="inline-flex items-center gap-1 text-xs font-bold text-brand-emerald-600 dark:text-brand-emerald-400 group-hover:gap-2 transition-all">
          Read {t('juz')} <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
        </span>
      </div>
    </div>
  );
};

// ─── Main Quran Page ──────────────────────────────────────────────────────────
export const Quran = () => {
  const { t } = useSettings();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'juz' ? 'juz' : 'surahs';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [revelationFilter, setRevelationFilter] = useState('All');

  // Sync tab to URL
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchQuery('');
    if (tab === 'juz') {
      setSearchParams({ tab: 'juz' });
    } else {
      setSearchParams({});
    }
  };

  useEffect(() => {
    let isMounted = true;
    const fetchSurahs = async () => {
      try {
        setLoading(true);
        const data = await getSurahList();
        if (isMounted) { setSurahs(data); setError(null); }
      } catch (err) {
        if (isMounted) setError('Failed to load Surahs list. Please check your internet connection and try again.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchSurahs();
    return () => { isMounted = false; };
  }, []);

  // Filtered Surahs
  const filteredSurahs = surahs.filter((surah) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      surah.englishName.toLowerCase().includes(query) ||
      surah.englishNameTranslation.toLowerCase().includes(query) ||
      surah.number.toString() === query ||
      surah.name.includes(query);
    const matchesRevelation = revelationFilter === 'All' || surah.revelationType === revelationFilter;
    return matchesSearch && matchesRevelation;
  });

  // Filtered Juz
  const filteredJuz = JUZ_DATA.filter((juz) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      juz.id.toString() === query ||
      juz.title.toLowerCase().includes(query) ||
      juz.arabicName.includes(query) ||
      juz.startSurah.toLowerCase().includes(query) ||
      juz.endSurah.toLowerCase().includes(query)
    );
  });

  const searchPlaceholder = t('searchSurahPlaceholder');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex p-3 rounded-2xl bg-brand-emerald-500/10 dark:bg-brand-emerald-500/5 text-brand-emerald-600 dark:text-brand-emerald-400">
          <BookOpen className="w-6 h-6 animate-pulse-subtle" />
        </div>
        <h1 className="font-display font-black text-3xl md:text-4xl tracking-tight text-slate-900 dark:text-white">
          {t('quranHeaderTitle')}
        </h1>
        <p className="text-sm text-slate-505 dark:text-slate-400 max-w-lg mx-auto">
          {t('quranHeaderSub')}
        </p>
      </div>

      {/* Search + Filters */}
      <div className="space-y-4">
        {/* Dynamic search placeholder */}
        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder={searchPlaceholder} />

        {/* ── Surahs / Juz Toggle ── */}
        <div className="flex justify-center">
          <div className="inline-flex items-center bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-1 shadow-sm gap-1">
            <button
              id="tab-surahs"
              onClick={() => handleTabChange('surahs')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all duration-300 min-h-[44px] ${
                activeTab === 'surahs'
                  ? 'bg-brand-emerald-500 text-white shadow-sm shadow-brand-emerald-500/20'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-850'
              }`}
              aria-selected={activeTab === 'surahs'}
              role="tab"
            >
              {t('allSurahs')}
            </button>
            <button
              id="tab-juz"
              onClick={() => handleTabChange('juz')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all duration-300 min-h-[44px] ${
                activeTab === 'juz'
                  ? 'bg-brand-emerald-500 text-white shadow-sm shadow-brand-emerald-500/20'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-850'
              }`}
              aria-selected={activeTab === 'juz'}
              role="tab"
            >
              {t('juz')}
            </button>
          </div>
        </div>

        {/* Revelation filter — only visible in Surahs tab */}
        {activeTab === 'surahs' && (
          <div className="flex justify-center gap-2 transition-all">
            {[
              { key: 'All', label: t('all') },
              { key: 'Meccan', label: t('meccan') },
              { key: 'Medinan', label: t('medinan') },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setRevelationFilter(key)}
                className={`px-4.5 py-2 rounded-2xl text-xs font-semibold transition-all duration-300 ${
                  revelationFilter === key
                    ? 'bg-brand-emerald-500 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/85 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Surahs Tab ── */}
      {activeTab === 'surahs' && (
        <>
          {loading ? (
            <LoadingSpinner message="Retrieving the Surahs index..." />
          ) : error ? (
            <div className="bg-rose-50 dark:bg-rose-950/15 border border-rose-200/50 dark:border-rose-900/50 rounded-3xl p-6 text-center max-w-lg mx-auto space-y-4 shadow-sm">
              <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
              <h2 className="text-base font-bold text-rose-800 dark:text-rose-400">Connection Error</h2>
              <p className="text-xs text-rose-600 dark:text-rose-450 leading-relaxed">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4.5 py-2 bg-rose-500 text-white text-xs font-semibold rounded-xl hover:bg-rose-600 transition-colors"
              >
                Retry Connection
              </button>
            </div>
          ) : filteredSurahs.length === 0 ? (
            <div className="text-center p-12 text-slate-500 dark:text-slate-455">
              <Compass className="w-12 h-12 mx-auto mb-3 text-slate-400 opacity-60" />
              <p className="text-sm font-medium">No Surahs found matching "{searchQuery}"</p>
              <p className="text-xs text-slate-400 mt-1">Try searching by surah numbers, translation names, or Arabic spellings.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredSurahs.map((surah) => (
                <SurahCard key={surah.number} surah={surah} />
              ))}
            </div>
          )}
        </>
      )}

      {/* ── Juz Tab ── */}
      {activeTab === 'juz' && (
        <>
          {filteredJuz.length === 0 ? (
            <div className="text-center p-12 text-slate-500 dark:text-slate-450">
              <BookOpen className="w-12 h-12 mx-auto mb-3 text-slate-400 opacity-60" />
              <p className="text-sm font-medium">No Juz found matching "{searchQuery}"</p>
              <p className="text-xs text-slate-400 mt-1">Try searching by Juz number or Surah name.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredJuz.map((juz) => (
                <JuzCard key={juz.id} juz={juz} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Quran;

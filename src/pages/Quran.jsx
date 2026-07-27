import React, { useState, useEffect } from 'react';
import { getSurahList } from '../services/quranApi';
import SurahCard from '../components/SurahCard';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { BookOpen, Compass, Award, AlertCircle } from 'lucide-react';

export const Quran = () => {
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [revelationFilter, setRevelationFilter] = useState("All");

  useEffect(() => {
    let isMounted = true;
    const fetchSurahs = async () => {
      try {
        setLoading(true);
        const data = await getSurahList();
        if (isMounted) {
          setSurahs(data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError("Failed to load Surahs list. Please check your internet connection and try again.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchSurahs();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter Surahs list
  const filteredSurahs = surahs.filter((surah) => {
    const query = searchQuery.toLowerCase().trim();
    
    // Search filter
    const matchesSearch = 
      surah.englishName.toLowerCase().includes(query) ||
      surah.englishNameTranslation.toLowerCase().includes(query) ||
      surah.number.toString() === query ||
      surah.name.includes(query);

    // Revelation filter
    const matchesRevelation = 
      revelationFilter === "All" || 
      surah.revelationType === revelationFilter;

    return matchesSearch && matchesRevelation;
  });

  return (
    <div className="space-y-8">
      {/* Header and Introduction */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex p-3 rounded-2xl bg-brand-emerald-500/10 dark:bg-brand-emerald-500/5 text-brand-emerald-600 dark:text-brand-emerald-400">
          <BookOpen className="w-6 h-6 animate-pulse-subtle" />
        </div>
        <h1 className="font-display font-black text-3xl md:text-4xl tracking-tight text-slate-900 dark:text-white">
          The Noble Qur'an
        </h1>
        <p className="text-sm text-slate-505 dark:text-slate-400 max-w-lg mx-auto">
          Read, listen, and search all 114 Surahs of the Holy Qur'an with modern translations and audio recitations.
        </p>
      </div>

      {/* Search and Filters panel */}
      <div className="space-y-4">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        
        {/* Revelation Filters */}
        <div className="flex justify-center gap-2">
          {["All", "Meccan", "Medinan"].map((filter) => (
            <button
              key={filter}
              onClick={() => setRevelationFilter(filter)}
              className={`px-4.5 py-2 rounded-2xl text-xs font-semibold transition-all duration-300 ${
                revelationFilter === filter
                  ? 'bg-brand-emerald-500 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/85 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
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
        <div className="text-center p-12 text-slate-500 dark:text-slate-450">
          <Compass className="w-12 h-12 mx-auto mb-3 text-slate-400 opacity-60" />
          <p className="text-sm font-medium">No Surahs found matching "{searchQuery}"</p>
          <p className="text-xs text-slate-400 mt-1">Try searching by surah numbers, translation names, or Arabic spellings.</p>
        </div>
      ) : (
        /* Surah Cards Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSurahs.map((surah) => (
            <SurahCard key={surah.number} surah={surah} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Quran;

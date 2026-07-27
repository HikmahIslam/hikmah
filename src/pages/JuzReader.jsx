import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getJuzSurahs } from '../services/quranApi';
import { JUZ_DATA } from '../data/juzData';
import AyahCard from '../components/AyahCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAudio } from '../context/AudioContext';
import { useSettings } from '../context/SettingsContext';
import {
  ChevronLeft, ChevronRight, ArrowLeft, AlertCircle,
  BookOpen, AlignRight, LayoutList, Settings2,
} from 'lucide-react';

const toArabicDigits = (num) => {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().replace(/\d/g, (d) => arabicDigits[d]);
};

export const JuzReader = () => {
  const { juzNumber } = useParams();
  const navigate = useNavigate();
  const juzId = parseInt(juzNumber, 10);

  const { settings, updateSetting } = useSettings();
  const { playSingleAyah, isPlaying, currentSurah, currentAyah, audioLanguage } = useAudio();

  const [surahSegments, setSurahSegments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showQuickSettings, setShowQuickSettings] = useState(false);

  const juz = JUZ_DATA.find((j) => j.id === juzId);

  useEffect(() => {
    if (!juz) return;
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const segments = await getJuzSurahs(juz, settings.defaultReciter);
        if (isMounted) setSurahSegments(segments);
      } catch (err) {
        if (isMounted) setError('Failed to load Juz content. Please check your connection and try again.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, [juzId, settings.defaultReciter]);

  if (!juz) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-6">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <p className="text-rose-600 dark:text-rose-400 font-semibold">Juz not found.</p>
        <Link to="/quran" className="inline-flex items-center gap-2 text-brand-emerald-600 font-semibold text-sm hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Qur'an
        </Link>
      </div>
    );
  }

  const currentViewMode = settings.viewMode || 'continuous';
  const prevJuz = juzId > 1 ? JUZ_DATA[juzId - 2] : null;
  const nextJuz = juzId < 30 ? JUZ_DATA[juzId] : null;

  // Total ayahs count for this juz
  const totalAyahs = surahSegments.reduce((sum, s) => sum + s.ayahs.length, 0);

  return (
    <div className="max-w-4xl mx-auto space-y-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-slate-900 pb-6">
        <div className="flex items-center gap-3">
          <Link
            to="/quran?tab=juz"
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            aria-label="Back to Qur'an"
          >
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="font-display font-extrabold text-2xl md:text-3xl text-slate-900 dark:text-white">
                Juz {juzId}
              </h1>
              <span className="arabic-text text-2xl text-brand-emerald-600 dark:text-brand-emerald-400 font-semibold" style={{ lineHeight: 1 }}>
                {juz.arabicName}
              </span>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-1">
              {juz.startSurah} {juz.startSurahId}:{juz.startAyah} — {juz.endSurah} {juz.endSurahId}:{juz.endAyah}
              {!loading && totalAyahs > 0 && ` • ${totalAyahs} Ayahs`}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-2 w-full md:flex-row md:items-center md:w-auto md:gap-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl border border-slate-200/50 dark:border-slate-800">
              <button
                onClick={() => updateSetting('viewMode', 'continuous')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all min-h-[36px] ${
                  currentViewMode === 'continuous'
                    ? 'bg-white dark:bg-slate-800 text-brand-emerald-600 dark:text-brand-emerald-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="Full Text Mushaf View"
              >
                <AlignRight className="w-3.5 h-3.5" />
                <span className="hidden xs:inline sm:inline">Full Text</span>
              </button>
              <button
                onClick={() => updateSetting('viewMode', 'card')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all min-h-[36px] ${
                  currentViewMode === 'card'
                    ? 'bg-white dark:bg-slate-800 text-brand-emerald-600 dark:text-brand-emerald-400 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title="Verse Cards View"
              >
                <LayoutList className="w-3.5 h-3.5" />
                <span className="hidden xs:inline sm:inline">Cards</span>
              </button>
            </div>

            {/* Translation Language Selector */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl border border-slate-200/50 dark:border-slate-800">
              {['en', 'ml', 'both'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => updateSetting('defaultLanguage', lang)}
                  className={`px-2 py-1.5 rounded-xl text-xs font-semibold transition-all min-h-[36px] ${
                    settings.defaultLanguage === lang
                      ? 'bg-white dark:bg-slate-800 text-brand-emerald-600 dark:text-brand-emerald-400 shadow-sm font-bold'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {lang === 'en' ? 'EN' : lang === 'ml' ? 'ML' : 'Both'}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setShowQuickSettings(!showQuickSettings)}
            className={`p-2.5 rounded-2xl border transition-all flex-shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center ${
              showQuickSettings
                ? 'border-brand-emerald-500 bg-brand-emerald-50/20 text-brand-emerald-600 dark:bg-brand-emerald-950/20 dark:text-brand-emerald-400'
                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-550 dark:text-slate-450'
            }`}
            title="Reading Settings"
          >
            <Settings2 className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* Quick Settings Panel */}
      {showQuickSettings && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Reading Adjustments</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-655 dark:text-slate-350">
                <label>Arabic Text Size</label>
                <span className="font-mono text-brand-emerald-500">{settings.arabicFontSize}px</span>
              </div>
              <input
                type="range" min="24" max="48" step="2"
                value={settings.arabicFontSize}
                onChange={(e) => updateSetting('arabicFontSize', parseInt(e.target.value))}
                className="w-full h-1.5 rounded-lg accent-brand-emerald-500 bg-slate-100 dark:bg-slate-800 cursor-pointer"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-655 dark:text-slate-350">
                <label>Translation Size</label>
                <span className="font-mono text-brand-emerald-500">{settings.translationFontSize}px</span>
              </div>
              <input
                type="range" min="12" max="24" step="1"
                value={settings.translationFontSize}
                onChange={(e) => updateSetting('translationFontSize', parseInt(e.target.value))}
                className="w-full h-1.5 rounded-lg accent-brand-emerald-500 bg-slate-100 dark:bg-slate-800 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Juz title badge */}
      <div className="text-center">
        <div className="inline-flex flex-col items-center gap-1 px-6 py-3 bg-brand-emerald-50 dark:bg-brand-emerald-950/20 border border-brand-emerald-200/60 dark:border-brand-emerald-900/60 rounded-2xl">
          <span className="arabic-text text-xl text-brand-emerald-700 dark:text-brand-emerald-300 font-bold">{juz.arabicTitle}</span>
          <span className="text-xs font-semibold text-brand-emerald-600 dark:text-brand-emerald-400 uppercase tracking-widest">{juz.title}</span>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner message={`Loading Juz ${juzId} content...`} />
      ) : error ? (
        <div className="bg-rose-50 dark:bg-rose-950/15 border border-rose-200/50 dark:border-rose-900/50 rounded-3xl p-6 text-center max-w-lg mx-auto space-y-4 shadow-sm">
          <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
          <h2 className="text-base font-bold text-rose-800 dark:text-rose-400">Connection Error</h2>
          <p className="text-xs text-rose-600 dark:text-rose-450 leading-relaxed">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4.5 py-2 bg-rose-500 text-white text-xs font-semibold rounded-xl hover:bg-rose-600 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="space-y-10">
          {surahSegments.map((surah) => (
            <div key={surah.number} className="space-y-6">
              {/* Surah divider header */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800/80" />
                <div className="flex items-center gap-2.5 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-2xl shadow-sm">
                  <BookOpen className="w-3.5 h-3.5 text-brand-emerald-500 flex-shrink-0" />
                  <Link
                    to={`/quran/${surah.number}`}
                    className="font-bold text-sm text-slate-800 dark:text-white hover:text-brand-emerald-600 dark:hover:text-brand-emerald-400 transition-colors"
                  >
                    {surah.englishName}
                  </Link>
                  <span className="arabic-text text-base text-brand-emerald-600 dark:text-brand-emerald-400 font-semibold" style={{ lineHeight: 1 }}>
                    {surah.name}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">#{surah.number}</span>
                </div>
                <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800/80" />
              </div>

              {/* Bismillah for surahs that need it (not Fatiha, not Tawba) */}
              {surah.number !== 1 && surah.number !== 9 && surah.ayahs[0]?.numberInSurah === 1 && (
                <div className="text-center arabic-text text-2xl md:text-3xl py-6 text-slate-800 dark:text-slate-200 border-y border-slate-100 dark:border-slate-900/60 font-medium select-none">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </div>
              )}

              {/* Ayahs */}
              {currentViewMode === 'continuous' ? (
                <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 md:p-10 shadow-sm space-y-8">
                  {/* Continuous Arabic text */}
                  <div className="text-right leading-[2.6] text-slate-900 dark:text-white font-normal" dir="rtl">
                    {surah.ayahs.map((ayah) => {
                      let cleanText = ayah.text;
                      if (surah.number !== 1 && surah.number !== 9 && ayah.numberInSurah === 1) {
                        const bismillah = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ';
                        if (cleanText.startsWith(bismillah)) cleanText = cleanText.replace(bismillah, '').trim();
                      }
                      const isActive = isPlaying && currentSurah?.number === surah.number && currentAyah?.numberInSurah === ayah.numberInSurah;
                      return (
                        <span
                          key={`${surah.number}-${ayah.numberInSurah}`}
                          id={`ayah-${surah.number}-${ayah.numberInSurah}`}
                          onClick={() => {
                            const idx = surah.ayahs.findIndex((a) => a.numberInSurah === ayah.numberInSurah);
                            if (idx !== -1) playSingleAyah(surah, idx);
                          }}
                          className={`arabic-text inline cursor-pointer px-1 rounded-xl transition-all ${
                            isActive
                              ? 'bg-brand-emerald-500/20 text-brand-emerald-700 dark:text-brand-emerald-300 font-bold ring-2 ring-brand-emerald-500/40'
                              : 'hover:bg-brand-emerald-50/60 dark:hover:bg-brand-emerald-950/40'
                          }`}
                          style={{ fontSize: `${settings.arabicFontSize}px` }}
                          title={`Click to play verse ${ayah.numberInSurah}`}
                        >
                          {cleanText}{' '}
                          <span className="inline-block text-brand-emerald-600 dark:text-brand-emerald-400 font-bold text-lg select-none px-1">
                            ﴿{toArabicDigits(ayah.numberInSurah)}﴾
                          </span>{' '}
                        </span>
                      );
                    })}
                  </div>

                  {/* Translations */}
                  <div className="border-t border-slate-100 dark:border-slate-800/80 pt-6 space-y-4">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Translations</h3>
                    <div className="space-y-4">
                      {surah.ayahs.map((ayah) => {
                        const isEnActive = isPlaying && currentSurah?.number === surah.number && currentAyah?.numberInSurah === ayah.numberInSurah && audioLanguage === 'en';
                        const isMlActive = isPlaying && currentSurah?.number === surah.number && currentAyah?.numberInSurah === ayah.numberInSurah && audioLanguage === 'ml';
                        return (
                          <div
                            key={`tr-${surah.number}-${ayah.numberInSurah}`}
                            className={`pl-4 py-2 border-l-4 transition-all duration-300 rounded-r-2xl ${
                              isEnActive || isMlActive
                                ? 'border-brand-emerald-500 bg-brand-emerald-50/70 dark:bg-brand-emerald-950/50 shadow-sm ring-1 ring-brand-emerald-500/20'
                                : 'border-brand-emerald-500/20'
                            }`}
                          >
                            <span className="text-xs font-bold text-brand-emerald-600 dark:text-brand-emerald-400 font-mono flex items-center gap-2">
                              {surah.number}:{ayah.numberInSurah}
                              {(isEnActive || isMlActive) && (
                                <span className="text-[10px] bg-brand-emerald-500 text-white px-2 py-0.5 rounded-full animate-pulse">🔊 Reading</span>
                              )}
                            </span>
                            {(!settings.defaultLanguage || settings.defaultLanguage === 'en' || settings.defaultLanguage === 'both') && (
                              <p
                                className={`leading-relaxed font-sans mt-1 p-1.5 rounded-xl transition-all ${
                                  isEnActive
                                    ? 'text-brand-emerald-950 dark:text-brand-emerald-100 font-semibold bg-brand-emerald-100/50 dark:bg-brand-emerald-900/40'
                                    : 'text-slate-700 dark:text-slate-350'
                                }`}
                                style={{ fontSize: `${settings.translationFontSize}px` }}
                              >
                                {ayah.enTranslation}
                              </p>
                            )}
                            {(settings.defaultLanguage === 'ml' || settings.defaultLanguage === 'both') && ayah.mlTranslation && (
                              <p
                                className={`leading-relaxed font-sans mt-1 p-1.5 rounded-xl transition-all ${
                                  isMlActive
                                    ? 'text-brand-emerald-950 dark:text-brand-emerald-100 font-semibold bg-brand-emerald-100/50 dark:bg-brand-emerald-900/40'
                                    : 'text-slate-700 dark:text-slate-350'
                                }`}
                                style={{ fontSize: `${settings.translationFontSize}px` }}
                              >
                                {ayah.mlTranslation}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  {surah.ayahs.map((ayah) => (
                    <AyahCard key={`${surah.number}-${ayah.numberInSurah}`} ayah={ayah} surah={surah} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Juz Navigation Footer */}
      {!loading && !error && (
        <div className="flex items-center justify-between gap-4 pt-6 border-t border-slate-100 dark:border-slate-900/60 mt-10">
          {prevJuz ? (
            <button
              onClick={() => navigate(`/quran/juz/${prevJuz.id}`)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-850 transition-all min-h-[44px] shadow-sm"
            >
              <ChevronLeft className="w-4 h-4 flex-shrink-0" />
              <div className="text-left hidden sm:block">
                <div className="text-[10px] text-slate-400 uppercase tracking-wide">Previous</div>
                <div>Juz {prevJuz.id}</div>
              </div>
              <div className="sm:hidden">Prev Juz</div>
            </button>
          ) : (
            <div />
          )}

          {/* Juz selector */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-brand-emerald-50 dark:bg-brand-emerald-950/20 border border-brand-emerald-200/60 dark:border-brand-emerald-900/60 rounded-2xl min-h-[44px]">
            <BookOpen className="w-3.5 h-3.5 text-brand-emerald-500 flex-shrink-0" />
            <select
              value={juzId}
              onChange={(e) => navigate(`/quran/juz/${e.target.value}`)}
              className="bg-transparent text-xs font-bold text-brand-emerald-700 dark:text-brand-emerald-300 focus:outline-none cursor-pointer"
              aria-label="Select Juz"
            >
              {JUZ_DATA.map((j) => (
                <option key={j.id} value={j.id} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">
                  Juz {j.id} — {j.startSurah}
                </option>
              ))}
            </select>
          </div>

          {nextJuz ? (
            <button
              onClick={() => navigate(`/quran/juz/${nextJuz.id}`)}
              className="flex items-center gap-2 px-4 py-2.5 bg-brand-emerald-500 text-white rounded-2xl text-xs font-semibold hover:bg-brand-emerald-600 transition-all min-h-[44px] shadow-sm shadow-brand-emerald-500/15"
            >
              <div className="text-right hidden sm:block">
                <div className="text-[10px] text-brand-emerald-200 uppercase tracking-wide">Next</div>
                <div>Juz {nextJuz.id}</div>
              </div>
              <div className="sm:hidden">Next Juz</div>
              <ChevronRight className="w-4 h-4 flex-shrink-0" />
            </button>
          ) : (
            <div />
          )}
        </div>
      )}
    </div>
  );
};

export default JuzReader;

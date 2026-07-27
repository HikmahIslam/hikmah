import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { getSurahDetails } from '../services/quranApi';
import AyahCard from '../components/AyahCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAudio } from '../context/AudioContext';
import { useSettings } from '../context/SettingsContext';
import { ChevronLeft, Play, Pause, Settings2, LayoutList, AlignRight, ArrowLeft, ChevronDown, Check } from 'lucide-react';

const toArabicDigits = (num) => {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().replace(/\d/g, (d) => arabicDigits[d]);
};

export const SurahDetails = () => {
  const { surahId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const { settings, updateSetting } = useSettings();
  const { playSurah, playSingleAyah, pauseAudio, isPlaying, currentSurah, currentAyah, audioLanguage, setAudioLanguage } = useAudio();

  const [surah, setSurah] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showQuickSettings, setShowQuickSettings] = useState(false);
  const [showAudioLangDropdown, setShowAudioLangDropdown] = useState(false);

  const targetAyah = searchParams.get('ayah');

  useEffect(() => {
    let isMounted = true;
    const fetchDetails = async () => {
      try {
        setLoading(true);
        // Load details with the user's preferred reciter
        const data = await getSurahDetails(surahId, settings.defaultReciter);
        if (isMounted) {
          setSurah(data);
          setError(null);
          
          // Save continue reading progress
          const progress = {
            surahNumber: data.number,
            surahEnglishName: data.englishName,
            surahArabicName: data.name,
            totalAyahs: data.numberOfAyahs,
            timestamp: new Date().getTime(),
          };
          localStorage.setItem('hikmah-continue-reading', JSON.stringify(progress));
        }
      } catch (err) {
        if (isMounted) {
          setError("Failed to load Surah details. Please check your network connection.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDetails();
    return () => {
      isMounted = false;
    };
  }, [surahId, settings.defaultReciter]);

  // Scroll to target ayah on load
  useEffect(() => {
    if (targetAyah && !loading && surah) {
      const timer = setTimeout(() => {
        const el = document.getElementById(`ayah-${targetAyah}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Highlight effect
          el.classList.add('ring-2', 'ring-brand-emerald-500/30', 'bg-brand-emerald-50/10', 'dark:bg-brand-emerald-950/15');
          setTimeout(() => {
            el.classList.remove('ring-2', 'ring-brand-emerald-500/30', 'bg-brand-emerald-50/10', 'dark:bg-brand-emerald-950/15');
          }, 3000);
        }
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [targetAyah, loading, surah]);

  const handlePlaySurah = () => {
    if (surah) {
      if (isPlaying && currentSurah?.number === surah.number) {
        pauseAudio();
      } else {
        playSurah(surah, 0);
      }
    }
  };

  const isWholeSurahPlaying = isPlaying && currentSurah?.number === surah?.number;
  const currentViewMode = settings.viewMode || 'continuous';

  if (loading) return <LoadingSpinner message={`Loading Surah details...`} />;

  if (error || !surah) {
    return (
      <div className="max-w-md mx-auto text-center py-16 space-y-6">
        <div className="text-rose-500 text-sm font-semibold">{error || "Surah not found"}</div>
        <Link
          to="/quran"
          className="inline-flex items-center gap-2 text-brand-emerald-600 font-semibold text-sm hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Surah List
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back button and title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-slate-900 pb-6">
        <div className="flex items-center gap-3">
          <Link
            to="/quran"
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            aria-label="Back to Quran list"
          >
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="font-display font-extrabold text-2xl md:text-3xl text-slate-900 dark:text-white">
                {surah.englishName}
              </h1>
              <span className="arabic-text text-2xl text-brand-emerald-600 dark:text-brand-emerald-400 font-semibold" style={{ lineHeight: 1 }}>
                {surah.name}
              </span>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-1">
              Surah {surah.number} • {surah.numberOfAyahs} Verses • {surah.revelationType} Revelation
            </p>
          </div>
        </div>

        {/* Global Controls — mobile: two wrapping rows, desktop: single row */}
        <div className="flex flex-col gap-2 w-full md:flex-row md:items-center md:w-auto md:gap-2.5">

          {/* Row 1 on mobile: View Mode + Language toggle side by side */}
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
                aria-label="Switch to Full Text view"
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
                aria-label="Switch to Cards view"
              >
                <LayoutList className="w-3.5 h-3.5" />
                <span className="hidden xs:inline sm:inline">Cards</span>
              </button>
            </div>

            {/* Translation Language Selector */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl border border-slate-200/50 dark:border-slate-800">
              <button
                onClick={() => updateSetting('defaultLanguage', 'en')}
                className={`px-2 py-1.5 rounded-xl text-xs font-semibold transition-all min-h-[36px] ${
                  settings.defaultLanguage === 'en'
                    ? 'bg-white dark:bg-slate-800 text-brand-emerald-600 dark:text-brand-emerald-400 shadow-sm font-bold'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                aria-label="English translation"
              >
                EN
              </button>
              <button
                onClick={() => updateSetting('defaultLanguage', 'ml')}
                className={`px-2 py-1.5 rounded-xl text-xs font-semibold transition-all min-h-[36px] ${
                  settings.defaultLanguage === 'ml'
                    ? 'bg-white dark:bg-slate-800 text-brand-emerald-600 dark:text-brand-emerald-400 shadow-sm font-bold'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                aria-label="Malayalam translation"
              >
                ML
              </button>
              <button
                onClick={() => updateSetting('defaultLanguage', 'both')}
                className={`px-2 py-1.5 rounded-xl text-xs font-semibold transition-all min-h-[36px] ${
                  settings.defaultLanguage === 'both'
                    ? 'bg-white dark:bg-slate-800 text-brand-emerald-600 dark:text-brand-emerald-400 shadow-sm font-bold'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                aria-label="Both English and Malayalam"
              >
                Both
              </button>
            </div>
          </div>

          {/* Row 2 on mobile: Listen/Pause Split-Button + Settings icon */}
          <div className="flex items-center gap-2 w-full md:w-auto relative">
            {/* Audio Recitation Split Button */}
            <div className="relative inline-flex items-center flex-1 md:flex-none">
              <button
                onClick={handlePlaySurah}
                className={`flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-l-2xl text-xs font-semibold tracking-wide transition-all duration-300 min-h-[44px] ${
                  isWholeSurahPlaying
                    ? 'bg-brand-emerald-600 text-white shadow-md shadow-brand-emerald-500/15 hover:bg-brand-emerald-700'
                    : 'bg-brand-emerald-500 text-white shadow-md shadow-brand-emerald-500/15 hover:bg-brand-emerald-600'
                }`}
                aria-label={isWholeSurahPlaying ? "Pause Surah recitation" : "Listen to Surah recitation"}
              >
                {isWholeSurahPlaying ? (
                  <>
                    <Pause className="w-4 h-4 fill-current flex-shrink-0" />
                    Pause ({audioLanguage === 'ar' ? 'Arabic' : audioLanguage === 'en' ? 'English' : 'Malayalam'})
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current ml-0.5 flex-shrink-0" />
                    Listen ({audioLanguage === 'ar' ? 'Arabic' : audioLanguage === 'en' ? 'English' : 'Malayalam'})
                  </>
                )}
              </button>

              {/* Dropdown Chevron Trigger */}
              <button
                onClick={() => setShowAudioLangDropdown(!showAudioLangDropdown)}
                className={`px-2 py-2.5 rounded-r-2xl text-white border-l transition-colors min-h-[44px] flex items-center justify-center ${
                  isWholeSurahPlaying
                    ? 'bg-brand-emerald-700 border-brand-emerald-500 hover:bg-brand-emerald-800'
                    : 'bg-brand-emerald-600 border-brand-emerald-400/40 hover:bg-brand-emerald-700'
                }`}
                title="Select audio recitation language"
                aria-label="Select audio language (Arabic, English, Malayalam)"
              >
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showAudioLangDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {showAudioLangDropdown && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 p-1.5 space-y-1">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                    Select Audio Language
                  </div>
                  {[
                    { code: 'ar', label: 'Arabic Recitation', sub: 'Qur\'an Studio MP3', flag: '🇸🇦' },
                    { code: 'en', label: 'English Translation', sub: 'Audio / Voice', flag: '🇬🇧' },
                    { code: 'ml', label: 'Malayalam Translation', sub: 'Voice Reading', flag: '🇮🇳' },
                  ].map((opt) => (
                    <button
                      key={opt.code}
                      onClick={() => {
                        setAudioLanguage(opt.code);
                        setShowAudioLangDropdown(false);
                        if (surah) {
                          playSurah(surah, 0, opt.code);
                        }
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left transition-all ${
                        audioLanguage === opt.code
                          ? 'bg-brand-emerald-50 dark:bg-brand-emerald-950/40 text-brand-emerald-600 dark:text-brand-emerald-400 font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{opt.flag}</span>
                        <div>
                          <div className="font-semibold leading-tight">{opt.label}</div>
                          <div className="text-[10px] text-slate-400 font-normal">{opt.sub}</div>
                        </div>
                      </div>
                      {audioLanguage === opt.code && <Check className="w-4 h-4 text-brand-emerald-500 flex-shrink-0" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setShowQuickSettings(!showQuickSettings)}
              className={`p-2.5 rounded-2xl border transition-all flex-shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center ${
                showQuickSettings
                  ? 'border-brand-emerald-500 bg-brand-emerald-50/20 text-brand-emerald-600 dark:bg-brand-emerald-950/20 dark:text-brand-emerald-400'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-550 dark:text-slate-450'
              }`}
              title="Reading Settings"
              aria-label="Toggle Reading settings toolbar"
            >
              <Settings2 className="w-4.5 h-4.5" />
            </button>
          </div>

        </div>
      </div>

      {/* Quick settings toolbar */}
      {showQuickSettings && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-5 shadow-sm space-y-4 transition-all duration-300">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Reading Adjustments</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            {/* Arabic Font Size */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-655 dark:text-slate-350">
                <label>Arabic Text Size</label>
                <span className="font-mono text-brand-emerald-500">{settings.arabicFontSize}px</span>
              </div>
              <input
                type="range"
                min="24"
                max="48"
                step="2"
                value={settings.arabicFontSize}
                onChange={(e) => updateSetting('arabicFontSize', parseInt(e.target.value))}
                className="w-full h-1.5 rounded-lg accent-brand-emerald-500 bg-slate-100 dark:bg-slate-800 cursor-pointer"
              />
            </div>

            {/* Translation Font Size */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-655 dark:text-slate-350">
                <label>Translation Size</label>
                <span className="font-mono text-brand-emerald-500">{settings.translationFontSize}px</span>
              </div>
              <input
                type="range"
                min="12"
                max="24"
                step="1"
                value={settings.translationFontSize}
                onChange={(e) => updateSetting('translationFontSize', parseInt(e.target.value))}
                className="w-full h-1.5 rounded-lg accent-brand-emerald-500 bg-slate-100 dark:bg-slate-800 cursor-pointer"
              />
            </div>

            {/* Translation Language selector */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-655 dark:text-slate-350 mb-1">
                Translation View
              </div>
              <select
                value={settings.defaultLanguage}
                onChange={(e) => updateSetting('defaultLanguage', e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-brand-emerald-500"
              >
                <option value="en">English Only</option>
                <option value="ml">Malayalam Only</option>
                <option value="both">Both (En + Ml)</option>
              </select>
            </div>

          </div>
        </div>
      )}

      {/* Bismillah Header (if applicable) */}
      {surah.number !== 1 && surah.number !== 9 && (
        <div className="text-center arabic-text text-2xl md:text-3xl py-8 my-4 text-slate-800 dark:text-slate-200 border-y border-slate-100 dark:border-slate-900/60 font-medium select-none">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </div>
      )}

      {/* Full Continuous Text View Mode */}
      {currentViewMode === 'continuous' ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-6 md:p-10 shadow-sm space-y-10">
          {/* Continuous Arabic Paragraph */}
          <div className="text-right leading-[2.6] text-slate-900 dark:text-white font-normal" dir="rtl">
            {surah.ayahs.map((ayah) => {
              let cleanText = ayah.text;
              if (surah.number !== 1 && surah.number !== 9 && ayah.numberInSurah === 1) {
                const bismillahText = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";
                if (cleanText.startsWith(bismillahText)) {
                  cleanText = cleanText.replace(bismillahText, "").trim();
                }
              }

              const isCurrentlyPlaying = 
                isPlaying && 
                currentSurah?.number === surah.number && 
                currentAyah?.numberInSurah === ayah.numberInSurah;

              return (
                <span
                  key={ayah.numberInSurah}
                  id={`ayah-${ayah.numberInSurah}`}
                  onClick={() => {
                    const idx = surah.ayahs.findIndex(a => a.numberInSurah === ayah.numberInSurah);
                    if (idx !== -1) playSingleAyah(surah, idx);
                  }}
                  className={`arabic-text inline cursor-pointer px-1 rounded-xl transition-all ${
                    isCurrentlyPlaying
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

          {/* Full Translations Section */}
          <div className="border-t border-slate-100 dark:border-slate-800/80 pt-8 space-y-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Surah Verses & Translations
            </h3>
            <div className="space-y-4">
              {surah.ayahs.map((ayah) => {
                const isEnActive = isPlaying && currentSurah?.number === surah.number && currentAyah?.numberInSurah === ayah.numberInSurah && audioLanguage === 'en';
                const isMlActive = isPlaying && currentSurah?.number === surah.number && currentAyah?.numberInSurah === ayah.numberInSurah && audioLanguage === 'ml';

                return (
                  <div
                    key={ayah.numberInSurah}
                    className={`pl-4 py-2 border-l-4 transition-all duration-300 rounded-r-2xl ${
                      isEnActive || isMlActive
                        ? 'border-brand-emerald-500 bg-brand-emerald-50/70 dark:bg-brand-emerald-950/50 shadow-sm ring-1 ring-brand-emerald-500/20'
                        : 'border-brand-emerald-500/20'
                    }`}
                  >
                    <span className="text-xs font-bold text-brand-emerald-600 dark:text-brand-emerald-400 font-mono flex items-center gap-2">
                      {surah.number}:{ayah.numberInSurah}
                      {(isEnActive || isMlActive) && (
                        <span className="text-[10px] bg-brand-emerald-500 text-white px-2 py-0.5 rounded-full animate-pulse">
                          🔊 Reading Line
                        </span>
                      )}
                    </span>

                    {(!settings.defaultLanguage || settings.defaultLanguage === 'en' || settings.defaultLanguage === 'both') && (
                      <p
                        id={`translation-en-${ayah.numberInSurah}`}
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
                        id={`translation-ml-${ayah.numberInSurah}`}
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
        /* Verses Cards Stack View Mode */
        <div className="space-y-6">
          {surah.ayahs.map((ayah) => (
            <AyahCard key={ayah.numberInSurah} ayah={ayah} surah={surah} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SurahDetails;

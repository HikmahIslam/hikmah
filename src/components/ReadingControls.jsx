import React from 'react';
import { Play, Pause, Settings2, AlignRight, LayoutList } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useAudio } from '../context/AudioContext';

export const ReadingControls = ({ surah, onOpenSettings }) => {
  const { settings, updateSetting } = useSettings();
  const { playSurah, pauseAudio, isPlaying, currentSurah } = useAudio();

  const isWholeSurahPlaying = isPlaying && currentSurah?.number === surah?.number;
  const currentViewMode = settings.viewMode || 'continuous';

  const handlePlaySurah = () => {
    if (surah) {
      if (isWholeSurahPlaying) {
        pauseAudio();
      } else {
        playSurah(surah, 0);
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/40 p-3 sm:p-4 rounded-3xl border border-slate-100 dark:border-slate-800/80">
      
      {/* Row 1: Mode Switcher & Language Selector & Settings */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Reading Mode Switcher */}
        <div className="flex items-center bg-white dark:bg-slate-900 p-1 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-2xs">
          <button
            onClick={() => updateSetting('viewMode', 'continuous')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all min-h-[40px] ${
              currentViewMode === 'continuous'
                ? 'bg-brand-emerald-500 text-white shadow-sm font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
            title="Full Text Mushaf View"
            aria-label="Switch to Full Text mode"
          >
            <AlignRight className="w-4 h-4" />
            <span>Full Text</span>
          </button>
          
          <button
            onClick={() => updateSetting('viewMode', 'card')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all min-h-[40px] ${
              currentViewMode === 'card'
                ? 'bg-brand-emerald-500 text-white shadow-sm font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
            title="Verse Cards View"
            aria-label="Switch to Cards mode"
          >
            <LayoutList className="w-4 h-4" />
            <span>Cards</span>
          </button>
        </div>

        {/* Translation Language Selector */}
        <div className="flex items-center bg-white dark:bg-slate-900 p-1 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-2xs">
          {[
            { id: 'en', label: 'EN' },
            { id: 'ml', label: 'ML' },
            { id: 'both', label: 'Both' },
            { id: 'none', label: 'None' },
          ].map((lang) => (
            <button
              key={lang.id}
              onClick={() => updateSetting('defaultLanguage', lang.id)}
              className={`px-2.5 py-2 rounded-xl text-xs font-semibold transition-all min-h-[40px] ${
                settings.defaultLanguage === lang.id
                  ? 'bg-brand-emerald-500 text-white shadow-sm font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
              aria-label={`Select ${lang.label} translation`}
            >
              {lang.label}
            </button>
          ))}
        </div>

        {/* Reading Settings Trigger Button */}
        <button
          onClick={onOpenSettings}
          className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center shadow-2xs"
          title="Open Reading Settings"
          aria-label="Open Reading Settings drawer"
        >
          <Settings2 className="w-5 h-5" />
        </button>
      </div>

      {/* Row 2 / Prominent "Listen Surah" CTA Button — Full width on mobile */}
      <div className="w-full md:w-auto">
        <button
          onClick={handlePlaySurah}
          className={`w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold tracking-wide transition-all duration-300 min-h-[48px] cursor-pointer ${
            isWholeSurahPlaying
              ? 'bg-brand-emerald-600 text-white shadow-lg shadow-brand-emerald-600/25 hover:bg-brand-emerald-700 active:scale-[0.98]'
              : 'bg-brand-emerald-500 text-white shadow-lg shadow-brand-emerald-500/20 hover:bg-brand-emerald-600 active:scale-[0.98]'
          }`}
          aria-label={isWholeSurahPlaying ? 'Pause Surah recitation' : 'Listen to full Surah recitation'}
        >
          {isWholeSurahPlaying ? (
            <>
              <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-current flex-shrink-0" />
              <span>Pause Surah</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current ml-0.5 flex-shrink-0" />
              <span>Listen Surah</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
};

export default ReadingControls;

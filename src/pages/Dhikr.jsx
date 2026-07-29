import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { RotateCcw, Minus } from 'lucide-react';
import DhikrTasbeehIcon from '../components/DhikrTasbeehIcon';
import { useSettings } from '../context/SettingsContext';

const PRESET_DHIKR = [
  { arabic: "سُبْحَانَ ٱللَّٰهِ", transliteration: "Subhanallah", translation: "Glory be to Allah" },
  { arabic: "ٱلْحَمْدُ لِلَّٰهِ", transliteration: "Alhamdulillah", translation: "All praise is due to Allah" },
  { arabic: "ٱللَّٰهُ أَكْبَرُ", transliteration: "Allahu Akbar", translation: "Allah is the Greatest" },
  { arabic: "لَا إِلَٰهَ إِلَّا ٱللَّٰهُ", transliteration: "La ilaha illallah", translation: "There is no deity worthy of worship except Allah" },
  { arabic: "أَسْتَغْفِرُ ٱللَّٰهَ", transliteration: "Astaghfirullah", translation: "I seek forgiveness from Allah" },
];

export const Dhikr = () => {
  const { theme } = useTheme();
  const { t } = useSettings();
  const [selectedDhikr, setSelectedDhikr] = useState(PRESET_DHIKR[0]);
  const [count, setCount] = useState(() => {
    const saved = localStorage.getItem('hikmah-dhikr-count');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [target, setTarget] = useState(33);
  const [rounds, setRounds] = useState(() => {
    const saved = localStorage.getItem('hikmah-dhikr-rounds');
    return saved ? parseInt(saved, 10) : 0;
  });

  useEffect(() => { localStorage.setItem('hikmah-dhikr-count', count.toString()); }, [count]);
  useEffect(() => { localStorage.setItem('hikmah-dhikr-rounds', rounds.toString()); }, [rounds]);

  const handleIncrement = () => {
    setCount(prev => {
      const next = prev + 1;
      if (next >= target) {
        setRounds(r => r + 1);
        if ('vibrate' in navigator) navigator.vibrate([100, 50, 100]);
        return 0;
      }
      if ('vibrate' in navigator) navigator.vibrate(30);
      return next;
    });
  };

  const handleDecrement = () => setCount(prev => (prev > 0 ? prev - 1 : 0));

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset current count and rounds?")) {
      setCount(0);
      setRounds(0);
    }
  };

  const handlePresetSelect = (dhikr) => {
    setSelectedDhikr(dhikr);
    setCount(0);
  };

  const radius = 110;
  const strokeWidth = 10;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (count / target) * circumference;
  const svgSize = radius * 2;

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-900 pb-5">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-brand-emerald-500/10 dark:bg-brand-emerald-500/5 flex items-center justify-center text-brand-emerald-600 dark:text-brand-emerald-400 flex-shrink-0">
          <DhikrTasbeehIcon className="w-6 h-6 sm:w-7 sm:h-7 animate-pulse-subtle" color="currentColor" />
        </div>
        <div>
          <h1 className="font-display font-bold text-xl sm:text-2xl tracking-wide text-slate-800 dark:text-white">{t('dhikrHeaderTitle')}</h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">{t('dhikrHeaderSub')}</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-8">
        
        {/* Preset Selection */}
        <div className="md:col-span-1 space-y-3 sm:space-y-4">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1 rtl:pr-1 rtl:pl-0">{t('dhikr')}</h2>
          <div className="flex flex-col gap-2 sm:gap-2.5">
            {PRESET_DHIKR.map((dhikr, idx) => {
              const isSelected = selectedDhikr.transliteration === dhikr.transliteration;
              return (
                <button
                  key={idx}
                  onClick={() => handlePresetSelect(dhikr)}
                  className={`p-3.5 sm:p-4 rounded-2xl border text-left rtl:text-right transition-all duration-200 ${
                    isSelected
                      ? 'bg-brand-emerald-500 text-white border-brand-emerald-500 shadow-md shadow-brand-emerald-500/20'
                      : 'bg-white dark:bg-slate-900 border-slate-200/60 dark:border-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <p className="font-semibold text-xs sm:text-sm">{dhikr.transliteration}</p>
                  <p className={`arabic-text text-sm sm:text-base mt-1 ${isSelected ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                    {dhikr.arabic}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Target Selector */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('target')}</label>
            <div className="flex gap-2">
              {[33, 100, 1000].map(tVal => (
                <button
                  key={tVal}
                  onClick={() => setTarget(tVal)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    target === tVal
                      ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {tVal}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Counter Display */}
        <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 p-6 sm:p-10 flex flex-col items-center justify-center text-center space-y-6 sm:space-y-8 relative overflow-hidden shadow-xs">
          
          <div className="space-y-2 max-w-md">
            <h2 className="arabic-text text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight">
              {selectedDhikr.arabic}
            </h2>
            <p className="text-sm font-semibold text-brand-emerald-600 dark:text-brand-emerald-400">
              {selectedDhikr.transliteration}
            </p>
            <p className="text-xs text-slate-400">
              {selectedDhikr.translation}
            </p>
          </div>

          {/* Interactive Circle Tap Counter */}
          <div 
            onClick={handleIncrement}
            className="relative cursor-pointer group flex items-center justify-center select-none"
            role="button"
            tabIndex={0}
            aria-label="Increment Dhikr count"
          >
            <svg
              height={svgSize}
              width={svgSize}
              className="transform -rotate-90 transition-all duration-300 group-hover:scale-105"
            >
              <circle
                stroke={theme === 'dark' ? '#1e293b' : '#f1f5f9'}
                fill="transparent"
                strokeWidth={strokeWidth}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
              <circle
                stroke="#10b981"
                fill="transparent"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference + ' ' + circumference}
                style={{ strokeDashoffset }}
                strokeLinecap="round"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                className="transition-all duration-300 ease-out"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-mono font-extrabold text-4xl sm:text-5xl text-slate-800 dark:text-white tracking-tighter">
                {count}
              </span>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                / {target}
              </span>
            </div>
          </div>

          {/* Bottom Stats & Controls */}
          <div className="flex items-center justify-between w-full max-w-sm pt-2 border-t border-slate-100 dark:border-slate-800/60">
            <div className="text-left rtl:text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">{t('totalCount')}</span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{rounds} {t('target')}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDecrement}
                className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                title="Decrement count"
                aria-label="Decrement count"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                onClick={handleReset}
                className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-rose-600 transition-colors"
                title={t('reset')}
                aria-label={t('reset')}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Dhikr;

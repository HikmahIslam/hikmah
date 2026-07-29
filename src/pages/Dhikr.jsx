import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Flame, RotateCcw, Minus } from 'lucide-react';
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

  // SVG Progress Ring calculations
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
          <Flame className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse-subtle" />
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
                  className={`w-full text-left rtl:text-right p-3.5 sm:p-4.5 rounded-2xl border transition-all duration-300 min-h-[60px] ${
                    isSelected
                      ? 'border-brand-emerald-500 bg-brand-emerald-50/20 dark:bg-brand-emerald-950/20 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850'
                  }`}
                >
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-xs font-bold text-brand-emerald-600 dark:text-brand-emerald-400 min-w-0 truncate">
                      {dhikr.transliteration}
                    </span>
                    <span className="arabic-text text-sm font-semibold flex-shrink-0" style={{ lineHeight: 1 }}>
                      {dhikr.arabic}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 truncate">{dhikr.translation}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Counter Column */}
        <div className="md:col-span-2 flex flex-col items-center justify-center bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-5 sm:p-8 shadow-sm gap-5 sm:gap-6">
          
          {/* Target Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-900">
            {[33, 99, 100].map(t => (
              <button
                key={t}
                onClick={() => { setTarget(t); setCount(0); }}
                className={`px-4 sm:px-5 py-2 rounded-xl text-xs font-semibold transition-all min-h-[36px] min-w-[44px] ${
                  target === t ? 'bg-brand-emerald-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-350'
                }`}
                aria-label={`Set target to ${t}`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Active Dhikr Text */}
          <div className="text-center space-y-1">
            <h3 className="arabic-text text-2xl sm:text-3xl text-brand-emerald-600 dark:text-brand-emerald-400">
              {selectedDhikr.arabic}
            </h3>
            <p className="text-sm font-bold text-slate-800 dark:text-white">{selectedDhikr.transliteration}</p>
            <p className="text-xs text-slate-400 italic">{selectedDhikr.translation}</p>
          </div>

          {/* Tap Counter Circle */}
          <button
            onClick={handleIncrement}
            className="relative flex items-center justify-center rounded-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 shadow-inner hover:scale-[1.02] active:scale-[0.97] transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-brand-emerald-500/30 cursor-pointer"
            style={{ width: `${Math.min(svgSize, 240)}px`, height: `${Math.min(svgSize, 240)}px` }}
            aria-label={`Increment count. Current count: ${count} of ${target}`}
          >
            {/* SVG Progress Ring */}
            <svg
              className="absolute transform -rotate-90"
              width={Math.min(svgSize, 240)}
              height={Math.min(svgSize, 240)}
              viewBox={`0 0 ${svgSize} ${svgSize}`}
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
                strokeDasharray={`${circumference} ${circumference}`}
                style={{ strokeDashoffset }}
                strokeLinecap="round"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                className="transition-all duration-150"
              />
            </svg>
            <div className="flex flex-col items-center justify-center z-10 select-none">
              <span className="font-display font-extrabold text-5xl sm:text-6xl text-slate-800 dark:text-white">
                {count}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500 mt-1">
                / {target}
              </span>
            </div>
          </button>

          {/* Lower Controls */}
          <div className="flex items-center justify-between w-full max-w-sm border-t border-slate-100 dark:border-slate-800/80 pt-5">
            <div className="flex flex-col">
              <span className="text-xs text-slate-450 dark:text-slate-500 font-medium">{t('totalCount')}</span>
              <span className="font-mono text-xl font-extrabold text-brand-emerald-600 dark:text-brand-emerald-400">
                {rounds}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDecrement}
                disabled={count === 0}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors disabled:opacity-20 disabled:hover:bg-transparent min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Subtract 1 from count"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                onClick={handleReset}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/15 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Reset counter and rounds"
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

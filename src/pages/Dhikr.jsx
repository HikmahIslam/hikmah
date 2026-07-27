import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Flame, RotateCcw, ChevronRight, Plus, Minus } from 'lucide-react';

const PRESET_DHIKR = [
  { arabic: "سُبْحَانَ ٱللَّٰهِ", transliteration: "Subhanallah", translation: "Glory be to Allah" },
  { arabic: "ٱلْحَمْدُ لِلَّٰهِ", transliteration: "Alhamdulillah", translation: "All praise is due to Allah" },
  { arabic: "ٱللَّٰهُ أَكْبَرُ", transliteration: "Allahu Akbar", translation: "Allah is the Greatest" },
  { arabic: "لَا إِلَٰهَ إِلَّا ٱللَّٰهُ", transliteration: "La ilaha illallah", translation: "There is no deity worthy of worship except Allah" },
  { arabic: "أَسْتَغْفِرُ ٱللَّٰهَ", transliteration: "Astaghfirullah", translation: "I seek forgiveness from Allah" },
];

export const Dhikr = () => {
  const { theme } = useTheme();
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

  useEffect(() => {
    localStorage.setItem('hikmah-dhikr-count', count.toString());
  }, [count]);

  useEffect(() => {
    localStorage.setItem('hikmah-dhikr-rounds', rounds.toString());
  }, [rounds]);

  const handleIncrement = () => {
    setCount((prev) => {
      const next = prev + 1;
      if (next >= target) {
        // Complete a round
        setRounds((r) => r + 1);
        // Play soft success sound or vibration if API exists (e.g. navigator.vibrate)
        if ('vibrate' in navigator) {
          navigator.vibrate([100, 50, 100]);
        }
        return 0; // Reset counter for next round
      }
      if ('vibrate' in navigator) {
        navigator.vibrate(30); // Soft click vibration
      }
      return next;
    });
  };

  const handleDecrement = () => {
    setCount((prev) => (prev > 0 ? prev - 1 : 0));
  };

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
  const radius = 100;
  const strokeWidth = 8;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (count / target) * circumference;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-900 pb-5">
        <div className="w-12 h-12 rounded-2xl bg-brand-emerald-500/10 dark:bg-brand-emerald-500/5 flex items-center justify-center text-brand-emerald-600 dark:text-brand-emerald-400">
          <Flame className="w-6 h-6 animate-pulse-subtle" />
        </div>
        <div>
          <h1 className="font-display font-bold text-2xl tracking-wide text-slate-800 dark:text-white">Tasbeeh</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Keep track of your daily Dhikr recitations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Preset Selection */}
        <div className="md:col-span-1 space-y-4">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest pl-1">Select Supplication</h2>
          <div className="flex flex-col gap-2.5">
            {PRESET_DHIKR.map((dhikr, idx) => {
              const isSelected = selectedDhikr.transliteration === dhikr.transliteration;
              return (
                <button
                  key={idx}
                  onClick={() => handlePresetSelect(dhikr)}
                  className={`w-full text-left p-4.5 rounded-2xl border transition-all duration-300 ${
                    isSelected
                      ? 'border-brand-emerald-500 bg-brand-emerald-50/20 dark:bg-brand-emerald-950/20 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-brand-emerald-600 dark:text-brand-emerald-400">
                      {dhikr.transliteration}
                    </span>
                    <span className="arabic-text text-sm font-semibold" style={{ lineHeight: 1 }}>
                      {dhikr.arabic}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 truncate">
                    {dhikr.translation}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Center/Right Column: Tasbeeh Counter Circle */}
        <div className="md:col-span-2 flex flex-col items-center justify-center bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-8 shadow-sm">
          
          {/* Target Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-900 mb-6">
            {[33, 99, 100].map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTarget(t);
                  setCount(0);
                }}
                className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  target === t
                    ? 'bg-brand-emerald-500 text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-350'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Active Dhikr Display */}
          <div className="text-center mb-6">
            <h3 className="arabic-text text-2xl md:text-3xl text-brand-emerald-600 dark:text-brand-emerald-400 mb-2">
              {selectedDhikr.arabic}
            </h3>
            <p className="text-sm font-bold text-slate-800 dark:text-white">
              {selectedDhikr.transliteration}
            </p>
            <p className="text-xs text-slate-400 mt-1 italic">
              {selectedDhikr.translation}
            </p>
          </div>

          {/* Circle Clicker */}
          <button
            onClick={handleIncrement}
            className="relative flex items-center justify-center w-56 h-56 rounded-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 shadow-inner group hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 focus:outline-none mb-6 cursor-pointer"
            aria-label="Increment count"
          >
            {/* SVG Progress Ring */}
            <svg className="absolute transform -rotate-90 w-full h-full p-2">
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
                className="transition-all duration-150"
              />
            </svg>

            {/* Inner Content */}
            <div className="flex flex-col items-center justify-center z-10">
              <span className="font-display font-extrabold text-5xl text-slate-800 dark:text-white">
                {count}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500 mt-1">
                Target: {target}
              </span>
            </div>
          </button>

          {/* Lower controls (Rounds, reset, decrement) */}
          <div className="flex items-center justify-between w-full max-w-sm border-t border-slate-100 dark:border-slate-800/80 pt-6">
            <div className="flex flex-col">
              <span className="text-xs text-slate-450 dark:text-slate-500 font-medium">Completed Rounds</span>
              <span className="font-mono text-base font-extrabold text-brand-emerald-600 dark:text-brand-emerald-400">
                {rounds}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Decrement */}
              <button
                onClick={handleDecrement}
                disabled={count === 0}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors disabled:opacity-20 disabled:hover:bg-transparent"
                title="Subtract 1"
              >
                <Minus className="w-4 h-4" />
              </button>

              {/* Reset */}
              <button
                onClick={handleReset}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/15 transition-colors"
                title="Reset counter"
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

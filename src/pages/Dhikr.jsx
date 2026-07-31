import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { RotateCcw, Minus, Plus, Trash2 } from 'lucide-react';
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
  const [customDhikrs, setCustomDhikrs] = useState(() => {
    const saved = localStorage.getItem('hikmah-dhikr-custom-list');
    return saved ? JSON.parse(saved) : [];
  });

  const allDhikrs = [...PRESET_DHIKR, ...customDhikrs];

  const [selectedDhikr, setSelectedDhikr] = useState(() => {
    const saved = localStorage.getItem('hikmah-dhikr-selected');
    if (saved) {
      const found = allDhikrs.find(d => d.transliteration === saved);
      if (found) return found;
    }
    return PRESET_DHIKR[0];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDhikrName, setNewDhikrName] = useState('');
  const [newDhikrArabic, setNewDhikrArabic] = useState('');
  const [newDhikrTranslation, setNewDhikrTranslation] = useState('');
  const [newDhikrTarget, setNewDhikrTarget] = useState(33);

  const [dhikrProgress, setDhikrProgress] = useState(() => {
    const saved = localStorage.getItem('hikmah-dhikr-progress');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    // Backward compatibility: load previous single count & rounds & target
    const oldCount = localStorage.getItem('hikmah-dhikr-count');
    const oldRounds = localStorage.getItem('hikmah-dhikr-rounds');
    const oldTarget = localStorage.getItem('hikmah-dhikr-target');
    const oldSelected = localStorage.getItem('hikmah-dhikr-selected') || PRESET_DHIKR[0].transliteration;
    
    const initialProgress = {};
    if (oldCount !== null || oldRounds !== null || oldTarget !== null) {
      initialProgress[oldSelected] = {
        count: oldCount ? parseInt(oldCount, 10) : 0,
        rounds: oldRounds ? parseInt(oldRounds, 10) : 0,
        target: oldTarget ? parseInt(oldTarget, 10) : 33
      };
    }
    return initialProgress;
  });

  useEffect(() => {
    localStorage.setItem('hikmah-dhikr-selected', selectedDhikr.transliteration);
  }, [selectedDhikr]);

  useEffect(() => {
    localStorage.setItem('hikmah-dhikr-progress', JSON.stringify(dhikrProgress));
  }, [dhikrProgress]);

  const currentKey = selectedDhikr.transliteration;
  const currentData = dhikrProgress[currentKey] || { count: 0, rounds: 0, target: 33 };
  const { count, rounds, target } = currentData;

  const handleIncrement = () => {
    setDhikrProgress(prev => {
      const current = prev[currentKey] || { count: 0, rounds: 0, target: 33 };
      const nextCount = current.count + 1;
      let nextRounds = current.rounds;
      let finalCount = nextCount;

      if (nextCount >= current.target) {
        nextRounds += 1;
        finalCount = 0;
        if ('vibrate' in navigator) navigator.vibrate([100, 50, 100]);
      } else {
        if ('vibrate' in navigator) navigator.vibrate(30);
      }

      return {
        ...prev,
        [currentKey]: {
          ...current,
          count: finalCount,
          rounds: nextRounds
        }
      };
    });
  };

  const handleDecrement = () => {
    setDhikrProgress(prev => {
      const current = prev[currentKey] || { count: 0, rounds: 0, target: 33 };
      return {
        ...prev,
        [currentKey]: {
          ...current,
          count: current.count > 0 ? current.count - 1 : 0
        }
      };
    });
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset current count and rounds?")) {
      setDhikrProgress(prev => {
        const current = prev[currentKey] || { count: 0, rounds: 0, target: 33 };
        return {
          ...prev,
          [currentKey]: {
            ...current,
            count: 0,
            rounds: 0
          }
        };
      });
    }
  };

  const handleTargetChange = (tVal) => {
    setDhikrProgress(prev => {
      const current = prev[currentKey] || { count: 0, rounds: 0, target: 33 };
      return {
        ...prev,
        [currentKey]: {
          ...current,
          target: tVal
        }
      };
    });
  };

  const handlePresetSelect = (dhikr) => {
    setSelectedDhikr(dhikr);
  };

  const handleCreateCustomDhikr = (e) => {
    e.preventDefault();
    if (!newDhikrName.trim()) return;

    const newDhikr = {
      arabic: newDhikrArabic.trim() || "Arabic text not provided",
      transliteration: newDhikrName.trim(),
      translation: newDhikrTranslation.trim() || "Translation not provided",
      isCustom: true
    };

    setCustomDhikrs(prev => {
      const updated = [...prev, newDhikr];
      localStorage.setItem('hikmah-dhikr-custom-list', JSON.stringify(updated));
      return updated;
    });

    setSelectedDhikr(newDhikr);

    setDhikrProgress(prev => {
      return {
        ...prev,
        [newDhikr.transliteration]: {
          count: 0,
          rounds: 0,
          target: parseInt(newDhikrTarget, 10) || 33
        }
      };
    });

    setNewDhikrName('');
    setNewDhikrArabic('');
    setNewDhikrTranslation('');
    setNewDhikrTarget(33);
    setIsModalOpen(false);
  };

  const handleDeleteCustomDhikr = (e, dhikrToDelete) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${dhikrToDelete.transliteration}"?`)) {
      setCustomDhikrs(prev => {
        const updated = prev.filter(d => d.transliteration !== dhikrToDelete.transliteration);
        localStorage.setItem('hikmah-dhikr-custom-list', JSON.stringify(updated));
        return updated;
      });

      if (selectedDhikr.transliteration === dhikrToDelete.transliteration) {
        setSelectedDhikr(PRESET_DHIKR[0]);
      }

      setDhikrProgress(prev => {
        const updated = { ...prev };
        delete updated[dhikrToDelete.transliteration];
        return updated;
      });
    }
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
            {allDhikrs.map((dhikr, idx) => {
              const isSelected = selectedDhikr.transliteration === dhikr.transliteration;
              return (
                <div key={idx} className="relative group/dhikr w-full">
                  <button
                    onClick={() => handlePresetSelect(dhikr)}
                    className={`w-full p-3.5 sm:p-4 rounded-2xl border text-left rtl:text-right transition-all duration-200 pr-10 ${
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
                  {dhikr.isCustom && (
                    <button
                      onClick={(e) => handleDeleteCustomDhikr(e, dhikr)}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors opacity-0 group-hover/dhikr:opacity-100 focus:opacity-100 cursor-pointer ${
                        isSelected 
                          ? 'text-white/80 hover:text-white hover:bg-white/10' 
                          : 'text-slate-400 hover:text-rose-500 dark:hover:text-rose-450 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                      title="Delete custom dhikr"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}

            {/* Create Custom Dhikr Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full py-3 px-4 mt-2 border border-dashed border-slate-300 dark:border-slate-700 hover:border-brand-emerald-500 dark:hover:border-brand-emerald-500 rounded-2xl text-xs font-bold text-slate-500 hover:text-brand-emerald-600 dark:text-slate-400 dark:hover:text-brand-emerald-400 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-brand-emerald-50/10 dark:hover:bg-brand-emerald-950/10 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Create Custom Dhikr
            </button>
          </div>

          {/* Target Selector */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t('target')}</label>
            <div className="flex gap-2 flex-wrap">
              {[33, 100, 1000].map(tVal => (
                <button
                  key={tVal}
                  onClick={() => handleTargetChange(tVal)}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    target === tVal
                      ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {tVal}
                </button>
              ))}
              <button
                onClick={() => {
                  const val = prompt("Enter a custom target count:", target);
                  if (val !== null) {
                    const num = parseInt(val, 10);
                    if (num > 0) {
                      handleTargetChange(num);
                    } else {
                      alert("Please enter a valid number greater than 0.");
                    }
                  }
                }}
                className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all min-h-[30px] ${
                  ![33, 100, 1000].includes(target)
                    ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {![33, 100, 1000].includes(target) ? `Custom: ${target}` : 'Custom'}
              </button>
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

      {/* Custom Dhikr Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl w-full max-w-md p-6 overflow-hidden relative transform transition-all duration-300">
            <h3 className="font-display font-bold text-lg sm:text-xl text-slate-800 dark:text-white mb-4">Create Custom Dhikr</h3>
            
            <form onSubmit={handleCreateCustomDhikr} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Supplication Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Astaghfirullah"
                  value={newDhikrName}
                  onChange={e => setNewDhikrName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald-500/50 focus:border-brand-emerald-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Arabic Text (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. أَسْتَغْفِرُ ٱللَّٰهَ"
                  value={newDhikrArabic}
                  onChange={e => setNewDhikrArabic(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald-500/50 focus:border-brand-emerald-500 transition-all text-right arabic-text"
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Translation (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. I seek forgiveness from Allah"
                  value={newDhikrTranslation}
                  onChange={e => setNewDhikrTranslation(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald-500/50 focus:border-brand-emerald-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">Fixed Counting (Target Count) *</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    required
                    value={newDhikrTarget}
                    onChange={e => setNewDhikrTarget(parseInt(e.target.value, 10) || '')}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-emerald-500/50 focus:border-brand-emerald-500 transition-all animate-none"
                  />
                  <div className="flex gap-1 items-center">
                    {[33, 99, 100].map(val => (
                      <button
                        type="button"
                        key={val}
                        onClick={() => setNewDhikrTarget(val)}
                        className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                          newDhikrTarget === val
                            ? 'bg-brand-emerald-500 text-white border-brand-emerald-500 shadow-sm animate-none'
                            : 'border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-450 hover:bg-slate-50 dark:hover:bg-slate-850'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-350 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-brand-emerald-500 text-white text-sm font-semibold hover:bg-brand-emerald-600 shadow-md shadow-brand-emerald-500/20 transition-all cursor-pointer"
                >
                  Save Supplication
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dhikr;

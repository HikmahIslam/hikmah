import React, { useState, useEffect, useRef } from 'react';
import { ASMAUL_HUSNA_DATA } from '../data/asmaulHusnaData';
import SearchBar from '../components/SearchBar';
import { Play, Pause, Volume2, Sparkles, Gauge } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export const AsmaulHusna = () => {
  const { t } = useSettings();
  const [searchQuery, setSearchQuery] = useState('');
  const [translationMode, setTranslationMode] = useState('both'); // 'both', 'en', 'ml', 'ar'
  const [playbackSpeed, setPlaybackSpeed] = useState(1.25); // 1.0, 1.25, 1.5, 2.0
  const [playingIndex, setPlayingIndex] = useState(null);
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  
  const audioRef = useRef(null);
  const nextAudioRef = useRef(null);
  const isPlayingAllRef = useRef(false);
  const itemRefs = useRef({});

  useEffect(() => {
    return () => {
      isPlayingAllRef.current = false;
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (nextAudioRef.current) {
        nextAudioRef.current = null;
      }
    };
  }, []);

  const preloadNextAudio = (currentIndex, speed) => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < ASMAUL_HUSNA_DATA.length) {
      const nextItem = ASMAUL_HUSNA_DATA[nextIndex];
      const audio = new Audio(nextItem.audioUrl);
      audio.preload = 'auto';
      audio.playbackRate = speed;
      nextAudioRef.current = audio;
    } else {
      nextAudioRef.current = null;
    }
  };

  const playNameAtIndex = (index, playlistMode = false) => {
    if (index < 0 || index >= ASMAUL_HUSNA_DATA.length) {
      setPlayingIndex(null);
      setIsPlayingAll(false);
      isPlayingAllRef.current = false;
      return;
    }

    setPlayingIndex(index);
    const targetItem = ASMAUL_HUSNA_DATA[index];

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    let audio;
    if (nextAudioRef.current && nextAudioRef.current.src.endsWith(targetItem.audioUrl.split('/').pop())) {
      audio = nextAudioRef.current;
    } else {
      audio = new Audio(targetItem.audioUrl);
    }

    audio.playbackRate = playbackSpeed;
    audioRef.current = audio;

    // Preload the next audio clip instantly for seamless transition
    preloadNextAudio(index, playbackSpeed);

    // Scroll active item smoothly into view during playlist playback
    const cardEl = itemRefs.current[targetItem.number];
    if (cardEl && playlistMode) {
      cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    audio.play().catch(err => console.error("Audio play error:", err));

    audio.onended = () => {
      if (isPlayingAllRef.current && index + 1 < ASMAUL_HUSNA_DATA.length) {
        playNameAtIndex(index + 1, true);
      } else {
        setPlayingIndex(null);
        setIsPlayingAll(false);
        isPlayingAllRef.current = false;
      }
    };
  };

  const handleTogglePlayAll = () => {
    if (isPlayingAll) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setIsPlayingAll(false);
      isPlayingAllRef.current = false;
      setPlayingIndex(null);
    } else {
      setIsPlayingAll(true);
      isPlayingAllRef.current = true;
      playNameAtIndex(0, true);
    }
  };

  const handleSingleItemPlay = (index) => {
    if (playingIndex === index && !isPlayingAll) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setPlayingIndex(null);
      isPlayingAllRef.current = false;
      setIsPlayingAll(false);
    } else {
      setIsPlayingAll(false);
      isPlayingAllRef.current = false;
      playNameAtIndex(index, false);
    }
  };

  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  };

  const filteredNames = ASMAUL_HUSNA_DATA.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      item.number.toString() === q ||
      item.transliteration.toLowerCase().includes(q) ||
      item.meaningEn.toLowerCase().includes(q) ||
      item.meaningMl.includes(q) ||
      item.name.includes(q)
    );
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 animate-fade-in pb-10">
      
      {/* Header Banner */}
      <div className="relative bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-950 text-white rounded-3xl p-6 sm:p-10 overflow-hidden shadow-xl border border-emerald-500/30">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left rtl:md:text-right max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-400/20 border border-amber-400/40 rounded-full text-xs font-bold text-amber-300 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>99 Names of Allah</span>
            </div>
            <h1 className="font-calligraphic font-bold text-3xl sm:text-4xl text-white">
              {t('asmaulHusna')}
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
              {t('asmaulHusnaSub')}
            </p>
          </div>

          {/* Master Play All Button */}
          <div className="flex-shrink-0">
            <button
              onClick={handleTogglePlayAll}
              className={`px-6 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 flex items-center gap-2.5 shadow-lg min-h-[48px] ${
                isPlayingAll
                  ? 'bg-amber-400 text-slate-950 hover:bg-amber-300 shadow-amber-400/30 scale-105'
                  : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white shadow-emerald-600/30'
              }`}
            >
              {isPlayingAll ? (
                <>
                  <Pause className="w-5 h-5 fill-current" />
                  <span>{t('pause')}</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  <span>{t('playAll99')}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Controls & Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        <div className="md:col-span-6">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder={t('searchAsmaulHusnaPlaceholder')}
          />
        </div>

        {/* Speed & Translation Mode Selectors */}
        <div className="md:col-span-6 flex flex-wrap items-center justify-end gap-2">
          {/* Speed Selector */}
          <div className="inline-flex items-center bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-1 shadow-xs gap-1">
            <div className="px-2 text-slate-400 dark:text-slate-500">
              <Gauge className="w-3.5 h-3.5" />
            </div>
            {[1.0, 1.25, 1.5, 2.0].map(speed => (
              <button
                key={speed}
                onClick={() => handleSpeedChange(speed)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  playbackSpeed === speed
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>

          {/* Translation Mode */}
          <div className="inline-flex items-center bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-1 shadow-xs gap-1">
            {[
              { id: 'both', label: t('bothTranslations') },
              { id: 'en', label: 'English' },
              { id: 'ml', label: 'മലയാളം' },
              { id: 'ar', label: 'العربية' },
            ].map(mode => (
              <button
                key={mode.id}
                onClick={() => setTranslationMode(mode.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all min-h-[34px] ${
                  translationMode === mode.id
                    ? 'bg-brand-emerald-500 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of 99 Names */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filteredNames.map((item) => {
          const index = item.number - 1;
          const isItemPlaying = playingIndex === index;

          return (
            <div
              key={item.number}
              ref={(el) => (itemRefs.current[item.number] = el)}
              onClick={() => handleSingleItemPlay(index)}
              className={`relative bg-white dark:bg-slate-900 border rounded-2xl sm:rounded-3xl p-5 hover:shadow-md transition-all duration-300 flex flex-col justify-between gap-4 cursor-pointer group ${
                isItemPlaying
                  ? 'border-brand-emerald-500 ring-2 ring-brand-emerald-500/20 bg-brand-emerald-50/20 dark:bg-brand-emerald-950/30'
                  : 'border-slate-200/60 dark:border-slate-800/80 hover:border-brand-emerald-300/60'
              }`}
            >
              {/* Header: Number Badge + Play Button */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-3">
                <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-mono font-bold text-xs text-brand-emerald-600 dark:text-brand-emerald-400">
                  {item.number}
                </div>
                <div className={`p-2 rounded-xl transition-all ${
                  isItemPlaying
                    ? 'bg-brand-emerald-500 text-white shadow-xs'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:text-brand-emerald-500'
                }`}>
                  {isItemPlaying ? (
                    <Volume2 className="w-4 h-4 animate-bounce" />
                  ) : (
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  )}
                </div>
              </div>

              {/* Central Arabic Calligraphy */}
              <div className="text-center py-1">
                <h2 className="arabic-text text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
                  {item.name}
                </h2>
                <p className="text-xs font-bold text-brand-emerald-600 dark:text-brand-emerald-400 tracking-wide mt-1">
                  {item.transliteration}
                </p>
              </div>

              {/* Meanings according to selected mode */}
              {(translationMode === 'both' || translationMode === 'en') && (
                <div className="text-center text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50/60 dark:bg-slate-950/40 p-2.5 rounded-xl border border-slate-100/60 dark:border-slate-900/60">
                  <p>{item.meaningEn}</p>
                </div>
              )}

              {(translationMode === 'both' || translationMode === 'ml') && (
                <div className="text-center text-xs text-emerald-800 dark:text-emerald-300 font-medium leading-relaxed bg-emerald-50/40 dark:bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-100/50 dark:border-emerald-900/30">
                  <p>{item.meaningMl}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AsmaulHusna;

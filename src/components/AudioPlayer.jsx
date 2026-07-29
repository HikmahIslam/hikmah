import React from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, ChevronUp, ChevronDown, X, Loader2, AlertCircle, Radio, Sparkles } from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import { useSettings } from '../context/SettingsContext';

const RECITERS = [
  { id: 'ar.alafasy', name: 'Mishary Rashid Alafasy' },
  { id: 'ar.abdurrahmaansudais', name: 'Abdurrahmaan As-Sudais' },
  { id: 'ar.hudhaify', name: 'Ali Al-Hudhaify' },
  { id: 'ar.shaatree', name: 'Abu Bakr Al-Shatri' },
  { id: 'ar.gghamidi', name: 'Saad Al-Ghamdi' }
];

export const AudioPlayer = () => {
  const {
    audioType,
    activeRadio,
    activeTrack,
    isPlaying,
    isTTSLoading,
    ttsLoadingMessage,
    ttsError,
    currentSurah,
    currentAyahIndex,
    currentAyah,
    currentTime,
    duration,
    volume,
    setVolume,
    isMinimized,
    setIsMinimized,
    audioLanguage,
    pauseAudio,
    resumeAudio,
    seek,
    nextAyah,
    prevAyah,
    stopAudio,
  } = useAudio();

  const { settings, updateSetting, t } = useSettings();

  // If no audio is active, return null
  if (!audioType) return null;

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleReciterChange = (e) => {
    updateSetting('defaultReciter', e.target.value);
  };

  const toggleMute = () => {
    setVolume(volume > 0 ? 0 : 0.8);
  };

  const handleProgressChange = (e) => {
    seek(parseFloat(e.target.value));
  };

  // ─── 1. Live Radio Player Layout ───────────────────────────────────────────
  if (audioType === 'radio' && activeRadio) {
    return (
      <div className="fixed bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 md:left-8 md:right-8 z-40 bg-white/95 dark:bg-slate-900/95 border border-slate-200/80 dark:border-slate-800/80 shadow-2xl rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 transition-all duration-300">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Live Radio Badge Icon */}
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center justify-center flex-shrink-0">
              <Radio className={`w-5 h-5 ${isPlaying ? 'animate-pulse' : ''}`} />
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                  {activeRadio.name}
                </span>
                <span className="bg-rose-500 text-white font-extrabold px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  LIVE
                </span>
              </div>
              <span className="text-[11px] font-semibold text-brand-emerald-600 dark:text-brand-emerald-400 truncate">
                {isTTSLoading ? t('connecting') : isPlaying ? t('nowReciting') : t('tapToPlay')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {isPlaying ? (
              <button
                onClick={pauseAudio}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-brand-emerald-500 text-white shadow-md shadow-brand-emerald-500/20 hover:bg-brand-emerald-600 flex items-center justify-center transition-all"
                title="Pause Live Radio"
              >
                <Pause className="w-5 h-5 fill-current" />
              </button>
            ) : (
              <button
                onClick={resumeAudio}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-brand-emerald-500 text-white shadow-md shadow-brand-emerald-500/20 hover:bg-brand-emerald-600 flex items-center justify-center transition-all"
                title="Play Live Radio"
              >
                <Play className="w-5 h-5 fill-current ml-0.5" />
              </button>
            )}

            <button
              onClick={stopAudio}
              className="p-2.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="Close radio player"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── 2. Track / Asmaul Husna Player Layout ────────────────────────────────
  if (audioType === 'track' && activeTrack) {
    return (
      <div className="fixed bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 md:left-8 md:right-8 z-40 bg-white/95 dark:bg-slate-900/95 border border-slate-200/80 dark:border-slate-800/80 shadow-2xl rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 transition-all duration-300">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-400/20 text-amber-500 border border-amber-400/40 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>

            <div className="flex flex-col min-w-0">
              <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                {activeTrack.title}
              </span>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate">
                {activeTrack.subtitle}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {isPlaying ? (
              <button
                onClick={pauseAudio}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-brand-emerald-500 text-white shadow-md shadow-brand-emerald-500/20 hover:bg-brand-emerald-600 flex items-center justify-center transition-all"
                title="Pause track"
              >
                <Pause className="w-5 h-5 fill-current" />
              </button>
            ) : (
              <button
                onClick={resumeAudio}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-brand-emerald-500 text-white shadow-md shadow-brand-emerald-500/20 hover:bg-brand-emerald-600 flex items-center justify-center transition-all"
                title="Play track"
              >
                <Play className="w-5 h-5 fill-current ml-0.5" />
              </button>
            )}

            <button
              onClick={stopAudio}
              className="p-2.5 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="Close player"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── 3. Quran Surah / Ayah Player Layout ──────────────────────────────────
  if (audioType === 'quran' && currentSurah && currentAyahIndex !== -1) {
    if (isMinimized) {
      return (
        <div className="fixed bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 md:left-8 md:right-8 z-40 bg-white/95 dark:bg-slate-900/95 border border-slate-200/80 dark:border-slate-800/80 shadow-xl rounded-2xl p-2.5 sm:p-3 flex items-center justify-between transition-all duration-300">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={() => setIsMinimized(false)}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="Expand audio player"
              aria-label="Expand audio player"
            >
              <ChevronUp className="w-5 h-5" />
            </button>
            <div className="flex flex-col min-w-0">
              <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-white truncate">
                {currentSurah.englishName} ({currentSurah.name})
              </span>
              <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
                Ayah {currentAyah?.numberInSurah || currentAyahIndex + 1} of {currentSurah.numberOfAyahs}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <button
              onClick={prevAyah}
              disabled={currentAyahIndex === 0}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Previous Ayah"
            >
              <SkipBack className="w-4 h-4" />
            </button>
            
            {isPlaying ? (
              <button
                onClick={pauseAudio}
                className="p-2.5 rounded-xl bg-brand-emerald-500 text-white shadow-md shadow-brand-emerald-500/10 hover:bg-brand-emerald-600 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Pause recitation"
              >
                <Pause className="w-4 h-4 fill-current" />
              </button>
            ) : (
              <button
                onClick={resumeAudio}
                className="p-2.5 rounded-xl bg-brand-emerald-500 text-white shadow-md shadow-brand-emerald-500/10 hover:bg-brand-emerald-600 transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Play recitation"
              >
                <Play className="w-4 h-4 fill-current ml-0.5" />
              </button>
            )}

            <button
              onClick={nextAyah}
              disabled={currentAyahIndex === currentSurah.ayahs.length - 1}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Next Ayah"
            >
              <SkipForward className="w-4 h-4" />
            </button>
            
            <button
              onClick={stopAudio}
              className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="Stop recitation"
              aria-label="Stop recitation"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="fixed bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 md:left-8 md:right-8 z-40 bg-white/95 dark:bg-slate-900/95 border border-slate-200/80 dark:border-slate-800/80 shadow-2xl rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 md:p-5 transition-all duration-300">
        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-3.5 sm:gap-4">
          
          {/* Metadata */}
          <div className="flex items-center justify-between md:justify-start gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-brand-emerald-500/10 to-brand-emerald-700/20 flex items-center justify-center text-brand-emerald-600 dark:text-brand-emerald-400 flex-shrink-0">
                <span className="font-display font-bold text-xs sm:text-sm">{currentSurah.number}</span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                    {currentSurah.englishName}
                  </span>
                  <span className="text-xs text-brand-emerald-600 dark:text-brand-emerald-400 arabic-text flex-shrink-0" style={{ lineHeight: 1 }}>
                    {currentSurah.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
                  <span>Ayah {currentAyah?.numberInSurah || currentAyahIndex + 1} / {currentSurah.numberOfAyahs}</span>
                  <span className="bg-brand-emerald-50 dark:bg-brand-emerald-950/40 text-brand-emerald-600 dark:text-brand-emerald-400 font-bold px-1.5 py-0.5 rounded-md text-[9px] uppercase">
                    {audioLanguage === 'ar' ? '🇸🇦 AR' : audioLanguage === 'en' ? '🇬🇧 EN' : '🇮🇳 ML'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex md:hidden items-center gap-1">
              <button
                onClick={() => setIsMinimized(true)}
                className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Minimize player"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
              <button
                onClick={stopAudio}
                className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Stop recitation"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Controls & Seek Slider */}
          <div className="flex flex-col items-center w-full max-w-md mx-auto">
            <div className="flex items-center gap-3 sm:gap-4 mb-1.5 sm:mb-2">
              <button
                onClick={prevAyah}
                disabled={currentAyahIndex === 0 || isTTSLoading}
                className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
                title="Previous Ayah"
                aria-label="Previous Ayah"
              >
                <SkipBack className="w-5 h-5 fill-current" />
              </button>
              
              {isTTSLoading ? (
                <div className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-2xl bg-brand-emerald-500/20 text-brand-emerald-600 dark:text-brand-emerald-400 min-h-[44px] min-w-[44px]">
                  <Loader2 className="w-6 h-6 animate-spin text-brand-emerald-600 dark:text-brand-emerald-400" />
                </div>
              ) : isPlaying ? (
                <button
                  onClick={pauseAudio}
                  className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-2xl bg-brand-emerald-500 text-white shadow-lg shadow-brand-emerald-500/20 hover:bg-brand-emerald-600 hover:scale-105 active:scale-95 transition-all min-h-[44px] min-w-[44px]"
                  title="Pause recitation"
                  aria-label="Pause recitation"
                >
                  <Pause className="w-5 h-5 fill-current" />
                </button>
              ) : (
                <button
                  onClick={resumeAudio}
                  className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center rounded-2xl bg-brand-emerald-500 text-white shadow-lg shadow-brand-emerald-500/20 hover:bg-brand-emerald-600 hover:scale-105 active:scale-95 transition-all min-h-[44px] min-w-[44px]"
                  title="Play recitation"
                  aria-label="Play recitation"
                >
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </button>
              )}

              <button
                onClick={nextAyah}
                disabled={currentAyahIndex === currentSurah.ayahs.length - 1 || isTTSLoading}
                className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
                title="Next Ayah"
                aria-label="Next Ayah"
              >
                <SkipForward className="w-5 h-5 fill-current" />
              </button>
            </div>

            {isTTSLoading && ttsLoadingMessage && (
              <div className="flex items-center gap-1.5 text-[11px] text-brand-emerald-600 dark:text-brand-emerald-400 font-medium mb-1 animate-pulse">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>{ttsLoadingMessage}</span>
              </div>
            )}

            {ttsError && (
              <div className="flex items-center gap-1.5 text-[11px] text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2 py-1 rounded-md font-medium mb-1">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{ttsError}</span>
              </div>
            )}

            <div className="flex items-center gap-2.5 w-full text-[11px] font-mono text-slate-400">
              <span>{formatTime(currentTime)}</span>
              <input
                type="range"
                min="0"
                max={duration || 0}
                value={currentTime}
                onChange={handleProgressChange}
                className="flex-1 h-1.5 rounded-full accent-brand-emerald-500 bg-slate-200 dark:bg-slate-800 cursor-pointer"
                aria-label="Seek track time"
              />
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right Reciter & Volume Options */}
          <div className="hidden md:flex items-center justify-end gap-3.5 w-auto">
            <select
              value={settings.defaultReciter}
              onChange={handleReciterChange}
              className="text-xs bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-2 text-slate-700 dark:text-slate-300 focus:ring-1 focus:ring-brand-emerald-500 focus:outline-none min-h-[40px]"
              aria-label="Select reciter"
            >
              {RECITERS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors p-1.5 rounded-lg"
                title={volume === 0 ? "Unmute" : "Mute"}
                aria-label={volume === 0 ? "Unmute audio" : "Mute audio"}
              >
                {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-16 h-1 rounded-full accent-brand-emerald-500 bg-slate-200 dark:bg-slate-800 cursor-pointer"
                aria-label="Audio volume"
              />
            </div>

            <div className="flex items-center gap-1 border-l border-slate-200 dark:border-slate-800 pl-3">
              <button
                onClick={() => setIsMinimized(true)}
                className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                title="Minimize player"
                aria-label="Minimize player"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
              <button
                onClick={stopAudio}
                className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                title="Stop recitation"
                aria-label="Stop recitation"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>
      </div>
    );
  }

  return null;
};

export default AudioPlayer;

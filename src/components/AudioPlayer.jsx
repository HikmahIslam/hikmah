import React from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Maximize2, Minimize2, X, ChevronUp, ChevronDown } from 'lucide-react';
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
    isPlaying,
    currentSurah,
    currentAyahIndex,
    currentAyah,
    currentTime,
    duration,
    volume,
    setVolume,
    isMinimized,
    setIsMinimized,
    pauseAudio,
    resumeAudio,
    seek,
    nextAyah,
    prevAyah,
    stopAudio,
  } = useAudio();

  const { settings, updateSetting } = useSettings();

  // If nothing is playing and no surah is selected, hide the player
  if (!currentSurah || currentAyahIndex === -1) return null;

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleReciterChange = (e) => {
    updateSetting('defaultReciter', e.target.value);
    // Note: To apply reciter change immediately for the playing audio, 
    // the user will need to re-click play, or we reload. We let the next Ayah pick up the new reciter naturally.
  };

  const toggleMute = () => {
    setVolume(volume > 0 ? 0 : 0.8);
  };

  const handleProgressChange = (e) => {
    seek(parseFloat(e.target.value));
  };

  // Minimized visual style
  if (isMinimized) {
    return (
      <div className="fixed bottom-4 left-4 right-4 md:left-8 md:right-8 z-40 bg-white/95 dark:bg-slate-900/95 border border-slate-200/60 dark:border-slate-800/60 shadow-lg rounded-2xl p-3 flex items-center justify-between transition-all duration-300 animate-float">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMinimized(false)}
            className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Expand player"
          >
            <ChevronUp className="w-5 h-5" />
          </button>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-800 dark:text-white">
              Playing Surah {currentSurah.englishName} ({currentSurah.name})
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400">
              Ayah {currentAyah?.numberInSurah || currentAyahIndex + 1} of {currentSurah.numberOfAyahs}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={prevAyah}
            disabled={currentAyahIndex === 0}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          
          {isPlaying ? (
            <button
              onClick={pauseAudio}
              className="p-2 rounded-xl bg-brand-emerald-500 text-white shadow-md shadow-brand-emerald-500/10 hover:bg-brand-emerald-600 transition-all"
            >
              <Pause className="w-4 h-4 fill-current" />
            </button>
          ) : (
            <button
              onClick={resumeAudio}
              className="p-2 rounded-xl bg-brand-emerald-500 text-white shadow-md shadow-brand-emerald-500/10 hover:bg-brand-emerald-600 transition-all"
            >
              <Play className="w-4 h-4 fill-current ml-0.5" />
            </button>
          )}

          <button
            onClick={nextAyah}
            disabled={currentAyahIndex === currentSurah.ayahs.length - 1}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <SkipForward className="w-4 h-4" />
          </button>
          
          <button
            onClick={stopAudio}
            className="p-1.5 ml-2 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
            title="Stop recitation"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Full Expanded Player
  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-8 md:right-8 z-40 bg-white/95 dark:bg-slate-900/95 border border-slate-200/80 dark:border-slate-800/80 shadow-2xl rounded-3xl p-4 md:p-5 transition-all duration-300">
      <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4">
        
        {/* Left Side: Metadata */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-emerald-500/10 to-brand-emerald-700/20 flex items-center justify-center text-brand-emerald-600 dark:text-brand-emerald-400">
            <span className="font-display font-bold text-sm">{currentSurah.number}</span>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                {currentSurah.englishName}
              </span>
              <span className="text-xs text-brand-emerald-600 dark:text-brand-emerald-400 arabic-text" style={{ lineHeight: 1 }}>
                {currentSurah.name}
              </span>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Ayah {currentAyah?.numberInSurah || currentAyahIndex + 1} / {currentSurah.numberOfAyahs}
            </span>
          </div>
        </div>

        {/* Center: Controls & Seek */}
        <div className="flex flex-col items-center w-full max-w-md mx-auto">
          {/* Audio Playback Buttons */}
          <div className="flex items-center gap-4 mb-2">
            <button
              onClick={prevAyah}
              disabled={currentAyahIndex === 0}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
              title="Previous Ayah"
            >
              <SkipBack className="w-5 h-5 fill-current" />
            </button>
            
            {isPlaying ? (
              <button
                onClick={pauseAudio}
                className="w-11 h-11 flex items-center justify-center rounded-2xl bg-brand-emerald-500 text-white shadow-lg shadow-brand-emerald-500/20 hover:bg-brand-emerald-600 hover:scale-105 active:scale-95 transition-all"
                title="Pause"
              >
                <Pause className="w-5 h-5 fill-current" />
              </button>
            ) : (
              <button
                onClick={resumeAudio}
                className="w-11 h-11 flex items-center justify-center rounded-2xl bg-brand-emerald-500 text-white shadow-lg shadow-brand-emerald-500/20 hover:bg-brand-emerald-600 hover:scale-105 active:scale-95 transition-all"
                title="Play"
              >
                <Play className="w-5 h-5 fill-current ml-1" />
              </button>
            )}

            <button
              onClick={nextAyah}
              disabled={currentAyahIndex === currentSurah.ayahs.length - 1}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
              title="Next Ayah"
            >
              <SkipForward className="w-5 h-5 fill-current" />
            </button>
          </div>

          {/* Seek Slider */}
          <div className="flex items-center gap-3 w-full text-xs font-mono text-slate-400">
            <span>{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleProgressChange}
              className="flex-1 h-1.5 rounded-full accent-brand-emerald-500 bg-slate-200 dark:bg-slate-800 cursor-pointer"
            />
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right Side: Options & Vol */}
        <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
          {/* Reciter Selector */}
          <select
            value={settings.defaultReciter}
            onChange={handleReciterChange}
            className="text-xs bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1.5 text-slate-700 dark:text-slate-300 focus:ring-1 focus:ring-brand-emerald-500"
          >
            {RECITERS.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>

          {/* Volume Control */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
              title={volume === 0 ? "Unmute" : "Mute"}
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
            />
          </div>

          <div className="flex items-center gap-1.5 border-l border-slate-200 dark:border-slate-800 pl-3.5">
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Minimize player"
            >
              <ChevronDown className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={stopAudio}
              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
              title="Stop recitation"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AudioPlayer;

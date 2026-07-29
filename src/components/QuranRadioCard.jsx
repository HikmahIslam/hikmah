import React, { useState, useEffect } from 'react';
import { Radio, Play, Pause, SlidersHorizontal, X, Check, Loader2 } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useAudio } from '../context/AudioContext';

const DEFAULT_STATIONS = [
  { name: 'Radio Ahmad Al-Ajmy', url: 'https://backup.qurango.net/radio/ahmad_alajmy' },
  { name: 'Radio Mishary Al-Afasy', url: 'https://backup.qurango.net/radio/alafasi' },
  { name: 'Radio Abu Bakr Al Shatri', url: 'https://backup.qurango.net/radio/shaik_abu_bakr_al_shatri' },
  { name: 'Radio Abdulbasit Abdulsamad', url: 'https://backup.qurango.net/radio/abdulbasit_abdulsamad_mojawwad' },
  { name: 'Radio Ibrahim Al-Akdar', url: 'https://backup.qurango.net/radio/ibrahim_alakdar' },
  { name: 'Radio Idrees Abkr', url: 'https://backup.qurango.net/radio/idrees_abkr' },
];

export const QuranRadioCard = () => {
  const { t } = useSettings();
  const {
    audioType,
    activeRadio,
    isPlaying,
    isTTSLoading,
    playRadio,
    pauseAudio,
    resumeAudio,
  } = useAudio();

  const [stations, setStations] = useState(DEFAULT_STATIONS);
  const [selectedStation, setSelectedStation] = useState(DEFAULT_STATIONS[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    fetch('https://mp3quran.net/api/v3/radios?language=en')
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data && data.radios && Array.isArray(data.radios) && data.radios.length > 0) {
          const fetched = data.radios.map((item) => ({
            name: item.name,
            url: item.url,
          }));
          setStations(fetched);
          setSelectedStation(fetched[0]);
        }
      })
      .catch(() => {
        // Retain default stations fallback
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const isCurrentRadioPlaying = audioType === 'radio' && isPlaying;
  const isCurrentRadioLoading = audioType === 'radio' && isTTSLoading;
  const activeStation = (audioType === 'radio' && activeRadio) ? activeRadio : selectedStation;

  const togglePlayPause = () => {
    if (isCurrentRadioPlaying) {
      pauseAudio();
    } else if (audioType === 'radio' && activeRadio?.url === selectedStation.url) {
      resumeAudio();
    } else {
      playRadio(selectedStation);
    }
  };

  const changeStation = (station) => {
    setSelectedStation(station);
    playRadio(station);
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-5 sm:p-6 shadow-md transition-all duration-300 relative overflow-hidden">
      
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/60 pb-3">
        {/* Animated LIVE Badge */}
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold tracking-wider border transition-colors ${
          isCurrentRadioPlaying
            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30'
            : 'bg-emerald-500/10 text-brand-emerald-600 dark:text-brand-emerald-400 border-emerald-500/30'
        }`}>
          <span className={`w-2 h-2 rounded-full ${
            isCurrentRadioPlaying ? 'bg-rose-500 animate-ping' : 'bg-brand-emerald-500'
          }`} />
          <span>{isCurrentRadioPlaying ? t('liveStream') : t('quranRadio')}</span>
        </div>

        {/* Station Picker Trigger */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all min-h-[36px]"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>{t('stations')}</span>
        </button>
      </div>

      {/* Main Station Content & Controls */}
      <div className="flex items-center justify-between gap-4 pt-4">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-brand-emerald-500/10 dark:bg-brand-emerald-500/5 border border-brand-emerald-500/20 flex items-center justify-center text-brand-emerald-600 dark:text-brand-emerald-400 flex-shrink-0">
            <Radio className={`w-6 h-6 ${isCurrentRadioPlaying ? 'animate-pulse' : ''}`} />
          </div>

          <div className="min-w-0 space-y-0.5">
            <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white truncate">
              {activeStation.name}
            </h3>
            <p className="text-xs font-semibold tracking-wide text-brand-emerald-600 dark:text-brand-emerald-400 truncate">
              {isCurrentRadioLoading ? t('connecting') : isCurrentRadioPlaying ? t('nowReciting') : t('tapToPlay')}
            </p>
          </div>
        </div>

        <button
          onClick={togglePlayPause}
          disabled={isCurrentRadioLoading}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 hover:scale-105 active:scale-95 transition-all duration-200 flex-shrink-0"
          aria-label="Toggle Live Quran Radio stream"
        >
          {isCurrentRadioLoading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : isCurrentRadioPlaying ? (
            <Pause className="w-6 h-6 fill-current" />
          ) : (
            <Play className="w-6 h-6 fill-current ml-0.5" />
          )}
        </button>
      </div>

      {/* Station Picker Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-5 sm:p-6 w-full max-w-lg shadow-2xl space-y-4 max-h-[80vh] flex flex-col">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                {t('selectLiveStation')}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-1.5 flex-1 pr-1 custom-scrollbar">
              {stations.map((st, idx) => {
                const isSelected = st.url === activeStation.url;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      changeStation(st);
                      setIsModalOpen(false);
                    }}
                    className={`w-full p-3 rounded-2xl border text-left rtl:text-right transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'border-brand-emerald-500 bg-brand-emerald-50/30 dark:bg-brand-emerald-950/30 text-brand-emerald-600 dark:text-brand-emerald-400 font-bold shadow-xs'
                        : 'border-slate-100 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Radio className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-brand-emerald-500' : 'text-slate-400'}`} />
                      <span className="text-xs sm:text-sm truncate">{st.name}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-brand-emerald-500 flex-shrink-0" />}
                  </button>
                );
              })}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default QuranRadioCard;

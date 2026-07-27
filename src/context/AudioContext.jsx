import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useSettings } from './SettingsContext';

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const { settings } = useSettings();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSurah, setCurrentSurah] = useState(null); // { number, name, englishName, ayahs }
  const [currentAyahIndex, setCurrentAyahIndex] = useState(-1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMinimized, setIsMinimized] = useState(false);

  const audioRef = useRef(null);

  // Initialize Audio object
  useEffect(() => {
    const audio = new Audio();
    audio.volume = volume;
    audioRef.current = audio;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const onLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const onEnded = () => {
      setIsPlaying(false);
      handleAudioEnded();
    };

    const onError = () => {
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, []);

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Audio completion behavior
  const handleAudioEnded = () => {
    // We need to use state ref or function style to get the latest index and surah
    setCurrentAyahIndex((prevIndex) => {
      if (prevIndex === -1 || !currentSurah) return -1;
      
      const nextIndex = prevIndex + 1;
      if (nextIndex < currentSurah.ayahs.length) {
        // Continuous playback
        setTimeout(() => {
          playAyahByIndex(currentSurah, nextIndex);
        }, 800); // Small peaceful pause between Ayahs
        return nextIndex;
      }
      
      // Finished Surah
      return -1;
    });
  };

  const playAyahByIndex = (surah, index) => {
    if (!audioRef.current || !surah || index < 0 || index >= surah.ayahs.length) return;

    const ayah = surah.ayahs[index];
    
    // Alquran.cloud audio source can be inside the ayah object
    // Depending on the api request, it will have a URL or we construct it.
    // E.g., if there's ayah.audio, use it. Otherwise construct default Alafasy url.
    let audioUrl = ayah.audio;
    if (!audioUrl) {
      // Fallback url
      // The overall ayah number in the Quran is ayah.number
      audioUrl = `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayah.number}.mp3`;
    }

    try {
      audioRef.current.src = audioUrl;
      audioRef.current.load();
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((e) => {
          console.error("Audio playback error:", e);
          setIsPlaying(false);
        });
    } catch (error) {
      console.error(error);
    }
  };

  const playSurah = (surah, startAyahIndex = 0) => {
    setCurrentSurah(surah);
    setCurrentAyahIndex(startAyahIndex);
    playAyahByIndex(surah, startAyahIndex);
  };

  const playSingleAyah = (surah, index) => {
    // Stop continuous by setting surah but with limited array, or just playing it
    // If user plays single, we set currentSurah and currentAyahIndex, but when it ends it might trigger continuous if they have it.
    setCurrentSurah(surah);
    setCurrentAyahIndex(index);
    playAyahByIndex(surah, index);
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const resumeAudio = () => {
    if (audioRef.current && currentSurah && currentAyahIndex !== -1) {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const seek = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const nextAyah = () => {
    if (!currentSurah || currentAyahIndex === -1) return;
    const nextIndex = currentAyahIndex + 1;
    if (nextIndex < currentSurah.ayahs.length) {
      setCurrentAyahIndex(nextIndex);
      playAyahByIndex(currentSurah, nextIndex);
    }
  };

  const prevAyah = () => {
    if (!currentSurah || currentAyahIndex === -1) return;
    const prevIndex = currentAyahIndex - 1;
    if (prevIndex >= 0) {
      setCurrentAyahIndex(prevIndex);
      playAyahByIndex(currentSurah, prevIndex);
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentSurah(null);
    setCurrentAyahIndex(-1);
    setCurrentTime(0);
  };

  const currentAyah = currentSurah && currentAyahIndex !== -1 ? currentSurah.ayahs[currentAyahIndex] : null;

  return (
    <AudioContext.Provider
      value={{
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
        playSurah,
        playSingleAyah,
        pauseAudio,
        resumeAudio,
        seek,
        nextAyah,
        prevAyah,
        stopAudio,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};

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
  const [audioLanguage, setAudioLanguage] = useState('ar'); // 'ar' | 'en' | 'ml'

  const audioRef = useRef(null);
  
  // Refs for tracking state inside audio event listeners without closure staleness
  const currentSurahRef = useRef(currentSurah);
  const currentAyahIndexRef = useRef(currentAyahIndex);
  const audioLanguageRef = useRef(audioLanguage);

  useEffect(() => {
    currentSurahRef.current = currentSurah;
  }, [currentSurah]);

  useEffect(() => {
    currentAyahIndexRef.current = currentAyahIndex;
  }, [currentAyahIndex]);

  useEffect(() => {
    audioLanguageRef.current = audioLanguage;
  }, [audioLanguage]);

  // Stop any active Web Speech synthesis
  const stopSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

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
      handleAudioEnded();
    };

    const onError = (e) => {
      console.error("Audio playback error event:", e);
      // If error occurs for English audio MP3, fallback to SpeechSynthesis
      if (audioLanguageRef.current === 'en' && currentSurahRef.current && currentAyahIndexRef.current !== -1) {
        speakTranslationFallback(currentSurahRef.current.ayahs[currentAyahIndexRef.current], 'en-US');
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      stopSpeech();
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

  // Speech synthesis fallback helper
  const speakTranslationFallback = (ayah, langCode) => {
    stopSpeech();
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsPlaying(false);
      return;
    }

    const textToSpeak = langCode.startsWith('ml')
      ? (ayah.mlTranslation || ayah.enTranslation)
      : (ayah.enTranslation || ayah.text);

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = langCode;
    utterance.rate = 0.9;

    utterance.onend = () => {
      handleAudioEnded();
    };

    utterance.onerror = (err) => {
      console.error("SpeechSynthesis error:", err);
      handleAudioEnded();
    };

    try {
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    } catch (err) {
      console.error("SpeechSynthesis exception:", err);
      setIsPlaying(false);
    }
  };

  // Continuous playback when audio or speech ends
  const handleAudioEnded = () => {
    const surah = currentSurahRef.current;
    const currentIndex = currentAyahIndexRef.current;

    if (!surah || currentIndex === -1) {
      setIsPlaying(false);
      return;
    }

    const nextIndex = currentIndex + 1;
    if (nextIndex < surah.ayahs.length) {
      setCurrentAyahIndex(nextIndex);
      currentAyahIndexRef.current = nextIndex;
      
      setTimeout(() => {
        playAyahByIndex(surah, nextIndex, audioLanguageRef.current);
      }, 300);
    } else {
      setIsPlaying(false);
      setCurrentAyahIndex(-1);
      currentAyahIndexRef.current = -1;
    }
  };

  const playAyahByIndex = (surah, index, lang = audioLanguageRef.current) => {
    if (!surah || index < 0 || index >= surah.ayahs.length) return;

    // Stop current speech or mp3
    stopSpeech();
    if (audioRef.current) {
      audioRef.current.pause();
    }

    const ayah = surah.ayahs[index];
    currentSurahRef.current = surah;
    currentAyahIndexRef.current = index;

    // Scroll active Ayah into view if visible on screen
    const el = document.getElementById(`ayah-${ayah.numberInSurah}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    if (lang === 'ml') {
      // Malayalam Translation Audio via Web Speech API
      speakTranslationFallback(ayah, 'ml-IN');
      return;
    }

    if (lang === 'en') {
      // English Audio (Try Islamic Network English Recitation first, or Web Speech)
      const audioUrl = `https://cdn.islamic.network/quran/audio/128/en.walk/${ayah.number}.mp3`;
      if (audioRef.current) {
        try {
          audioRef.current.src = audioUrl;
          audioRef.current.load();
          audioRef.current.play()
            .then(() => setIsPlaying(true))
            .catch(() => speakTranslationFallback(ayah, 'en-US'));
        } catch (e) {
          speakTranslationFallback(ayah, 'en-US');
        }
      } else {
        speakTranslationFallback(ayah, 'en-US');
      }
      return;
    }

    // Default: Arabic Recitation
    const reciter = settings.defaultReciter || 'ar.alafasy';
    const audioUrl = ayah.audio || `https://cdn.islamic.network/quran/audio/128/${reciter}/${ayah.number}.mp3`;

    if (audioRef.current) {
      try {
        audioRef.current.src = audioUrl;
        audioRef.current.load();
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch((e) => {
            console.error("Audio playback error:", e);
            setIsPlaying(false);
          });
      } catch (error) {
        console.error(error);
        setIsPlaying(false);
      }
    }
  };

  const playSurah = (surah, startAyahIndex = 0, lang = audioLanguage) => {
    setAudioLanguage(lang);
    audioLanguageRef.current = lang;
    setCurrentSurah(surah);
    setCurrentAyahIndex(startAyahIndex);
    currentSurahRef.current = surah;
    currentAyahIndexRef.current = startAyahIndex;
    playAyahByIndex(surah, startAyahIndex, lang);
  };

  const playSingleAyah = (surah, index, lang = audioLanguage) => {
    setAudioLanguage(lang);
    audioLanguageRef.current = lang;
    setCurrentSurah(surah);
    setCurrentAyahIndex(index);
    currentSurahRef.current = surah;
    currentAyahIndexRef.current = index;
    playAyahByIndex(surah, index, lang);
  };

  const pauseAudio = () => {
    stopSpeech();
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const resumeAudio = () => {
    if (currentSurah && currentAyahIndex !== -1) {
      playAyahByIndex(currentSurah, currentAyahIndex, audioLanguage);
    }
  };

  const seek = (time) => {
    if (audioRef.current && audioLanguage === 'ar') {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const nextAyah = () => {
    if (!currentSurah || currentAyahIndex === -1) return;
    const nextIndex = currentAyahIndex + 1;
    if (nextIndex < currentSurah.ayahs.length) {
      setCurrentAyahIndex(nextIndex);
      currentAyahIndexRef.current = nextIndex;
      playAyahByIndex(currentSurah, nextIndex, audioLanguage);
    }
  };

  const prevAyah = () => {
    if (!currentSurah || currentAyahIndex === -1) return;
    const prevIndex = currentAyahIndex - 1;
    if (prevIndex >= 0) {
      setCurrentAyahIndex(prevIndex);
      currentAyahIndexRef.current = prevIndex;
      playAyahByIndex(currentSurah, prevIndex, audioLanguage);
    }
  };

  const stopAudio = () => {
    stopSpeech();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentSurah(null);
    setCurrentAyahIndex(-1);
    currentSurahRef.current = null;
    currentAyahIndexRef.current = -1;
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
        audioLanguage,
        setAudioLanguage,
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

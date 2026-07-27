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
  const speechTrackerRef = useRef({ cancelled: false, currentUtterance: null });
  
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

  // Pre-fetch system voices for SpeechSynthesis fallback
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      const handleVoicesChanged = () => {
        window.speechSynthesis.getVoices();
      };
      window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
      return () => {
        if (window.speechSynthesis.onvoiceschanged === handleVoicesChanged) {
          window.speechSynthesis.onvoiceschanged = null;
        }
      };
    }
  }, []);

  // Stop any active Web Speech synthesis safely
  const stopSpeech = () => {
    speechTrackerRef.current.cancelled = true;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  // Initialize Audio object for Arabic & Malayalam studio recitations
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
      // Audio MP3 ended (Arabic or Malayalam studio audio)
      if (audioLanguageRef.current === 'ar' || audioLanguageRef.current === 'ml') {
        handleAudioEnded();
      }
    };

    const onError = (e) => {
      console.error("Audio element error event:", e);
      setIsPlaying(false);
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

  // Speech synthesis reader (used for English & Malayalam fallback)
  const speakTranslation = (ayah, langCode) => {
    stopSpeech();
    
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsPlaying(false);
      return;
    }

    speechTrackerRef.current.cancelled = false;
    
    let rawText = langCode.startsWith('ml')
      ? (ayah.mlTranslation || ayah.enTranslation)
      : (ayah.enTranslation || ayah.text);

    if (!rawText) {
      handleAudioEnded();
      return;
    }

    // Clean brackets/footnotes e.g. [1], (1) for clean speech
    const cleanedText = rawText
      .replace(/\[\d+\]/g, '')
      .replace(/\(\d+\)/g, '')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanedText);
    speechTrackerRef.current.currentUtterance = utterance;

    const voices = window.speechSynthesis.getVoices();

    if (langCode.startsWith('ml')) {
      utterance.lang = 'ml-IN';
      const mlMaleVoice = voices.find(v => 
        (v.lang.startsWith('ml') || v.name.toLowerCase().includes('malayalam')) &&
        (v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('valluvar') || v.name.toLowerCase().includes('man'))
      ) || voices.find(v => v.lang.startsWith('ml') || v.name.toLowerCase().includes('malayalam'));

      if (mlMaleVoice) {
        utterance.voice = mlMaleVoice;
      }
      utterance.pitch = 0.82;
      utterance.rate = 0.80;
    } else {
      utterance.lang = 'en-US';
      const enMaleVoice = voices.find(v => 
        v.lang.startsWith('en') &&
        (v.name.toLowerCase().includes('male') || v.name.toLowerCase().includes('david') || v.name.toLowerCase().includes('guy') || v.name.toLowerCase().includes('george'))
      ) || voices.find(v => v.lang.startsWith('en'));

      if (enMaleVoice) {
        utterance.voice = enMaleVoice;
      }
      utterance.pitch = 0.92;
      utterance.rate = 0.82;
    }

    utterance.onend = () => {
      if (!speechTrackerRef.current.cancelled) {
        handleAudioEnded();
      }
    };

    utterance.onerror = (err) => {
      console.error("SpeechSynthesis error:", err);
      if (!speechTrackerRef.current.cancelled) {
        handleAudioEnded();
      }
    };

    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
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
      }, 350);
    } else {
      setIsPlaying(false);
      setCurrentAyahIndex(-1);
      currentAyahIndexRef.current = -1;
    }
  };

  const playAyahByIndex = (surah, index, lang = audioLanguageRef.current) => {
    if (!surah || index < 0 || index >= surah.ayahs.length) return;

    // Stop previous audio and speech completely before starting new one
    stopSpeech();
    if (audioRef.current) {
      audioRef.current.pause();
    }

    const ayah = surah.ayahs[index];
    currentSurahRef.current = surah;
    currentAyahIndexRef.current = index;

    // Smoothly scroll active Ayah into view
    const el = document.getElementById(`ayah-${ayah.numberInSurah}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    if (lang === 'ml') {
      // Authentic Human Male Studio Audio Recitation (Cheriamundam Abdul Hameed & Parappoor Kunhi Mohammed)
      // High-speed CDN hosted on Internet Archive (full CORS support)
      const surahPad = String(surah.number).padStart(3, '0');
      const primaryUrl = `https://archive.org/download/malayalam-quran_202012/${surahPad}.mp3`;
      const fallbackUrl = `https://archive.org/download/malayalam-meal/${surahPad}.mp3`;

      if (audioRef.current) {
        try {
          audioRef.current.src = primaryUrl;
          audioRef.current.load();
          audioRef.current.play()
            .then(() => setIsPlaying(true))
            .catch(() => {
              audioRef.current.src = fallbackUrl;
              audioRef.current.load();
              audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(() => setIsPlaying(false));
            });
        } catch (e) {
          setIsPlaying(false);
        }
      } else {
        setIsPlaying(false);
      }
      return;
    }

    if (lang === 'en') {
      speakTranslation(ayah, 'en-US');
      return;
    }

    // Default: Arabic Studio Recitation
    const reciter = settings.defaultReciter || 'ar.alafasy';
    const audioUrl = ayah.audio || `https://cdn.islamic.network/quran/audio/128/${reciter}/${ayah.number}.mp3`;

    if (audioRef.current) {
      try {
        audioRef.current.src = audioUrl;
        audioRef.current.load();
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch((e) => {
            console.error("Arabic Audio play error:", e);
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
    }
    setIsPlaying(false);
  };

  const resumeAudio = () => {
    if (currentSurah && currentAyahIndex !== -1) {
      playAyahByIndex(currentSurah, currentAyahIndex, audioLanguage);
    }
  };

  const seek = (time) => {
    if (audioRef.current && (audioLanguage === 'ar' || audioLanguage === 'ml')) {
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

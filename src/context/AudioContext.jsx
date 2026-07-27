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

  // Stop any active speech (Web Speech API + ResponsiveVoice)
  const stopSpeech = () => {
    speechTrackerRef.current.cancelled = true;
    if (typeof window !== 'undefined') {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      if (window.responsiveVoice && window.responsiveVoice.isPlaying()) {
        window.responsiveVoice.cancel();
      }
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

  // Speech synthesis reader for English & Malayalam translations
  const speakTranslation = (ayah, langCode) => {
    stopSpeech();

    speechTrackerRef.current.cancelled = false;

    let rawText = langCode.startsWith('ml')
      ? (ayah.mlTranslation || ayah.enTranslation)
      : (ayah.enTranslation || ayah.text);

    if (!rawText) {
      handleAudioEnded();
      return;
    }

    // Clean footnotes, brackets and extra whitespace for smooth speech
    const cleanedText = rawText
      .replace(/\[\d+\]/g, '')
      .replace(/\(\d+\)/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (langCode.startsWith('ml')) {
      // ── Malayalam: Use ResponsiveVoice "Malayalam Male" (different engine from Google) ──
      if (typeof window !== 'undefined' && window.responsiveVoice) {
        window.responsiveVoice.speak(cleanedText, 'Malayalam Male', {
          rate: 0.85,
          pitch: 0.9,
          volume: 1.0,
          onstart: () => setIsPlaying(true),
          onend: () => {
            if (!speechTrackerRef.current.cancelled) handleAudioEnded();
          },
          onerror: () => {
            if (!speechTrackerRef.current.cancelled) handleAudioEnded();
          },
        });
        setIsPlaying(true);
      } else {
        // Fallback: Web Speech API with any available ml voice
        speakWithWebSpeech(cleanedText, 'ml-IN', 0.85, 0.78);
      }
      return;
    }

    // ── English: Web Speech API ──
    speakWithWebSpeech(cleanedText, 'en-US', 0.92, 0.82);
  };

  // Internal helper: Web Speech API utterance
  const speakWithWebSpeech = (text, lang, pitch, rate) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsPlaying(false);
      return;
    }

    const voices = window.speechSynthesis.getVoices();
    let selectedVoice = null;

    if (lang === 'ml-IN') {
      selectedVoice =
        voices.find(v => v.name.includes('Midhun')) ||
        voices.find(v => v.name.includes('Microsoft') && v.lang === 'ml-IN') ||
        voices.find(v => v.lang === 'ml-IN' && !v.name.includes('Google')) ||
        voices.find(v => v.lang === 'ml-IN') ||
        voices.find(v => v.lang.startsWith('ml'));
    } else {
      selectedVoice =
        voices.find(v => v.name.toLowerCase().includes('david')) ||
        voices.find(v => v.name.toLowerCase().includes('guy')) ||
        voices.find(v => v.name === 'Google US English') ||
        voices.find(v => v.lang === 'en-US') ||
        voices.find(v => v.lang.startsWith('en'));
    }

    const utterance = new SpeechSynthesisUtterance(text);
    speechTrackerRef.current.currentUtterance = utterance;
    utterance.lang = lang;
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.pitch = pitch;
    utterance.rate = rate;
    utterance.volume = 1.0;

    utterance.onend = () => {
      if (!speechTrackerRef.current.cancelled) handleAudioEnded();
    };
    utterance.onerror = (err) => {
      if (err.error === 'interrupted' || err.error === 'canceled') return;
      if (!speechTrackerRef.current.cancelled) handleAudioEnded();
    };

    try {
      window.speechSynthesis.cancel();
      if (window.speechSynthesis.paused) window.speechSynthesis.resume();
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);

      // Chrome keep-alive workaround
      const keepAlive = setInterval(() => {
        if (speechTrackerRef.current.cancelled || !window.speechSynthesis.speaking) {
          clearInterval(keepAlive);
        } else {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      }, 10000);
    } catch (err) {
      console.error('SpeechSynthesis exception:', err);
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
      // Use Google Malayalam neural TTS — clear Kerala accent, male-pitched voice
      speakTranslation(ayah, 'ml-IN');
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

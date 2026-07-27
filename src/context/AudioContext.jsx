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
  const [audioPhase, setAudioPhase] = useState('arabic'); // 'arabic' or 'translation'
  const [speakingTranslationAyah, setSpeakingTranslationAyah] = useState(null); // verse identifier if single translation speech active

  const audioRef = useRef(null);
  
  // Refs for tracking state inside event listeners without closure staleness
  const currentSurahRef = useRef(currentSurah);
  const currentAyahIndexRef = useRef(currentAyahIndex);
  const audioPhaseRef = useRef(audioPhase);
  const settingsRef = useRef(settings);

  useEffect(() => {
    currentSurahRef.current = currentSurah;
  }, [currentSurah]);

  useEffect(() => {
    currentAyahIndexRef.current = currentAyahIndex;
  }, [currentAyahIndex]);

  useEffect(() => {
    audioPhaseRef.current = audioPhase;
  }, [audioPhase]);

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  // Cancel Web Speech on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Initialize Audio element
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

  // Stop any active SpeechSynthesis utterance
  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSpeakingTranslationAyah(null);
  };

  // Speak translation text using Web Speech API
  const speakText = (text, lang = 'en', onComplete = null) => {
    if (!('speechSynthesis' in window) || !text) {
      if (onComplete) onComplete();
      return;
    }

    stopSpeech();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'ml' ? 'ml-IN' : 'en-US';
    utterance.rate = 0.92;
    utterance.volume = volume;

    utterance.onend = () => {
      setIsPlaying(false);
      setSpeakingTranslationAyah(null);
      if (onComplete) onComplete();
    };

    utterance.onerror = (err) => {
      console.warn("Speech synthesis notice/error:", err);
      setIsPlaying(false);
      setSpeakingTranslationAyah(null);
      if (onComplete) onComplete();
    };

    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  // Handle end of an audio track (Arabic audio or Translation audio)
  const handleAudioEnded = () => {
    const surah = currentSurahRef.current;
    const currentIndex = currentAyahIndexRef.current;
    const phase = audioPhaseRef.current;
    const currentAudioMode = settingsRef.current.audioMode || 'arabic';

    if (!surah || currentIndex === -1) {
      setIsPlaying(false);
      return;
    }

    // If audioMode is 'both' and we just finished Arabic phase, play translation phase for same verse
    if (currentAudioMode === 'both' && phase === 'arabic') {
      setAudioPhase('translation');
      audioPhaseRef.current = 'translation';
      playTranslationForIndex(surah, currentIndex, () => {
        // After translation ends, move to next verse
        advanceToNextAyah(surah, currentIndex);
      });
      return;
    }

    // Otherwise, advance to next verse
    advanceToNextAyah(surah, currentIndex);
  };

  const advanceToNextAyah = (surah, currentIndex) => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < surah.ayahs.length) {
      setCurrentAyahIndex(nextIndex);
      currentAyahIndexRef.current = nextIndex;
      
      setTimeout(() => {
        playAyahByIndex(surah, nextIndex);
      }, 300);
    } else {
      // Reached end of Surah
      setIsPlaying(false);
      setCurrentAyahIndex(-1);
      currentAyahIndexRef.current = -1;
      setAudioPhase('arabic');
    }
  };

  // Play Translation for a specific verse
  const playTranslationForIndex = (surah, index, onEndedCallback = null) => {
    const ayah = surah.ayahs[index];
    if (!ayah) {
      if (onEndedCallback) onEndedCallback();
      return;
    }

    const preferredLang = settingsRef.current.defaultLanguage || 'en';
    
    // Check if English audio recitation (Ibrahim Walk) CDN MP3 can be used
    if (preferredLang === 'en') {
      const enAudioUrl = `https://cdn.islamic.network/quran/audio/128/en.walk/${ayah.number}.mp3`;
      if (audioRef.current) {
        audioRef.current.src = enAudioUrl;
        audioRef.current.load();
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Fallback to Web Speech synthesis if CDN audio fails
            const textToSpeak = ayah.enTranslation;
            speakText(textToSpeak, 'en', onEndedCallback);
          });
        return;
      }
    }

    // For Malayalam or fallback, use Web Speech API
    const textToSpeak = preferredLang === 'ml' && ayah.mlTranslation ? ayah.mlTranslation : ayah.enTranslation;
    speakText(textToSpeak, preferredLang, onEndedCallback);
  };

  // Play single verse or start continuous playback based on audioMode
  const playAyahByIndex = (surah, index) => {
    if (!audioRef.current || !surah || index < 0 || index >= surah.ayahs.length) return;

    stopSpeech();
    const ayah = surah.ayahs[index];

    currentSurahRef.current = surah;
    currentAyahIndexRef.current = index;

    // Scroll active Ayah into view if visible on screen
    const el = document.getElementById(`ayah-${ayah.numberInSurah}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    const currentAudioMode = settingsRef.current.audioMode || 'arabic';

    if (currentAudioMode === 'translation') {
      setAudioPhase('translation');
      audioPhaseRef.current = 'translation';
      playTranslationForIndex(surah, index, () => {
        handleAudioEnded();
      });
      return;
    }

    // Default or 'both': start with Arabic audio
    setAudioPhase('arabic');
    audioPhaseRef.current = 'arabic';

    const selectedReciter = settingsRef.current.defaultReciter || 'ar.alafasy';
    let audioUrl = ayah.audio || `https://cdn.islamic.network/quran/audio/128/${selectedReciter}/${ayah.number}.mp3`;

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
      setIsPlaying(false);
    }
  };

  const playSurah = (surah, startAyahIndex = 0) => {
    setCurrentSurah(surah);
    setCurrentAyahIndex(startAyahIndex);
    currentSurahRef.current = surah;
    currentAyahIndexRef.current = startAyahIndex;
    playAyahByIndex(surah, startAyahIndex);
  };

  const playSingleAyah = (surah, index) => {
    setCurrentSurah(surah);
    setCurrentAyahIndex(index);
    currentSurahRef.current = surah;
    currentAyahIndexRef.current = index;
    playAyahByIndex(surah, index);
  };

  // Dedicated function to speak standalone translation of any verse (clicked directly from card/text)
  const speakSingleTranslation = (text, lang, key) => {
    if (speakingTranslationAyah === key && isPlaying) {
      stopSpeech();
      setIsPlaying(false);
      return;
    }

    // Pause any background audio
    if (audioRef.current) {
      audioRef.current.pause();
    }

    setSpeakingTranslationAyah(key);
    speakText(text, lang, () => {
      setSpeakingTranslationAyah(null);
    });
  };

  const pauseAudio = () => {
    stopSpeech();
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
      currentAyahIndexRef.current = nextIndex;
      playAyahByIndex(currentSurah, nextIndex);
    }
  };

  const prevAyah = () => {
    if (!currentSurah || currentAyahIndex === -1) return;
    const prevIndex = currentAyahIndex - 1;
    if (prevIndex >= 0) {
      setCurrentAyahIndex(prevIndex);
      currentAyahIndexRef.current = prevIndex;
      playAyahByIndex(currentSurah, prevIndex);
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
    setAudioPhase('arabic');
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
        audioPhase,
        speakingTranslationAyah,
        playSurah,
        playSingleAyah,
        speakSingleTranslation,
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

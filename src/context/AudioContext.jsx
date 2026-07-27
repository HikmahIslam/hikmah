import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useSettings } from './SettingsContext';

const AudioContext = createContext();

// ─── Google Translate TTS helpers (server-side synthesis, different from browser TTS) ───
const ML_TTS_CHUNK_MAX = 185;

const buildTranslateTTSUrl = (text, lang = 'ml') =>
  `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lang}&client=tw-ob&q=${encodeURIComponent(text)}&ttsspeed=0.75`;

const splitAtWordBoundary = (text, maxLen) => {
  if (text.length <= maxLen) return [text];
  const chunks = [];
  let remaining = text.trim();
  while (remaining.length > maxLen) {
    let cut = remaining.lastIndexOf(' ', maxLen);
    if (cut <= 0) cut = maxLen;
    chunks.push(remaining.slice(0, cut).trim());
    remaining = remaining.slice(cut).trim();
  }
  if (remaining) chunks.push(remaining);
  return chunks;
};

// ─────────────────────────────────────────────────────────────────────────────

export const AudioProvider = ({ children }) => {
  const { settings } = useSettings();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSurah, setCurrentSurah] = useState(null);
  const [currentAyahIndex, setCurrentAyahIndex] = useState(-1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMinimized, setIsMinimized] = useState(false);
  const [audioLanguage, setAudioLanguage] = useState('ar'); // 'ar' | 'en' | 'ml'

  const audioRef = useRef(null);
  const speechTrackerRef = useRef({ cancelled: false });
  const mlChunkQueueRef = useRef([]); // remaining chunks for current ayah (Malayalam)

  // Refs for closure-safe access inside event listeners
  const currentSurahRef = useRef(null);
  const currentAyahIndexRef = useRef(-1);
  const audioLanguageRef = useRef('ar');

  useEffect(() => { currentSurahRef.current = currentSurah; }, [currentSurah]);
  useEffect(() => { currentAyahIndexRef.current = currentAyahIndex; }, [currentAyahIndex]);
  useEffect(() => { audioLanguageRef.current = audioLanguage; }, [audioLanguage]);

  // Pre-fetch Web Speech voices (used for English fallback)
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      const onChanged = () => window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = onChanged;
      return () => { window.speechSynthesis.onvoiceschanged = null; };
    }
  }, []);

  // Stop Web Speech API
  const stopSpeech = () => {
    speechTrackerRef.current.cancelled = true;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  // ─── Audio element setup ───
  useEffect(() => {
    const audio = new Audio();
    audio.volume = volume;
    audioRef.current = audio;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);

    const onEnded = () => {
      const lang = audioLanguageRef.current;

      if (lang === 'ml') {
        // If more chunks remain for this ayah, play next chunk
        if (mlChunkQueueRef.current.length > 0) {
          const nextChunk = mlChunkQueueRef.current.shift();
          const url = buildTranslateTTSUrl(nextChunk, 'ml');
          audio.src = url;
          audio.load();
          audio.play().catch(() => handleAudioEnded());
          return;
        }
      }

      if (lang === 'ar' || lang === 'ml') {
        handleAudioEnded();
      }
    };

    const onError = () => setIsPlaying(false);

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

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // ─── Advance to next ayah (shared handler) ───
  const handleAudioEnded = () => {
    const surah = currentSurahRef.current;
    const idx = currentAyahIndexRef.current;

    if (!surah || idx === -1) { setIsPlaying(false); return; }

    const nextIdx = idx + 1;
    if (nextIdx < surah.ayahs.length) {
      setCurrentAyahIndex(nextIdx);
      currentAyahIndexRef.current = nextIdx;
      setTimeout(() => playAyahByIndex(surah, nextIdx, audioLanguageRef.current), 400);
    } else {
      setIsPlaying(false);
      setCurrentAyahIndex(-1);
      currentAyahIndexRef.current = -1;
    }
  };

  // ─── English Web Speech (server TTS not needed for English) ───
  const speakEnglish = (ayah) => {
    stopSpeech();
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsPlaying(false);
      return;
    }

    speechTrackerRef.current.cancelled = false;

    const rawText = ayah.enTranslation || ayah.text || '';
    const cleanedText = rawText.replace(/\[\d+\]/g, '').replace(/\(\d+\)/g, '').replace(/\s+/g, ' ').trim();
    if (!cleanedText) { handleAudioEnded(); return; }

    const voices = window.speechSynthesis.getVoices();
    const selectedVoice =
      voices.find(v => v.name.toLowerCase().includes('david')) ||
      voices.find(v => v.name.toLowerCase().includes('guy')) ||
      voices.find(v => v.name === 'Google US English') ||
      voices.find(v => v.lang === 'en-US') ||
      voices.find(v => v.lang.startsWith('en'));

    const utterance = new SpeechSynthesisUtterance(cleanedText);
    speechTrackerRef.current.currentUtterance = utterance;
    utterance.lang = 'en-US';
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.pitch = 0.92;
    utterance.rate = 0.82;
    utterance.volume = 1.0;

    utterance.onend = () => { if (!speechTrackerRef.current.cancelled) handleAudioEnded(); };
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
    } catch {
      setIsPlaying(false);
    }
  };

  // ─── Malayalam via Google Translate TTS (server-side, genuinely different voice) ───
  const speakMalayalam = (ayah) => {
    if (!audioRef.current) { setIsPlaying(false); return; }

    const rawText = ayah.mlTranslation || ayah.enTranslation || '';
    const cleanedText = rawText.replace(/\[\d+\]/g, '').replace(/\(\d+\)/g, '').replace(/\s+/g, ' ').trim();
    if (!cleanedText) { handleAudioEnded(); return; }

    // Split into chunks if text is long
    const chunks = splitAtWordBoundary(cleanedText, ML_TTS_CHUNK_MAX);
    mlChunkQueueRef.current = chunks.slice(1); // queue remaining chunks after first

    const firstUrl = buildTranslateTTSUrl(chunks[0], 'ml');
    audioRef.current.src = firstUrl;
    audioRef.current.load();
    audioRef.current.play()
      .then(() => setIsPlaying(true))
      .catch(() => {
        // Google Translate TTS blocked (CORS / network) — fallback to Web Speech
        mlChunkQueueRef.current = [];
        speakMalayalamFallback(cleanedText);
      });
  };

  // Fallback: Web Speech with best available ml voice
  const speakMalayalamFallback = (text) => {
    stopSpeech();
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsPlaying(false);
      return;
    }
    speechTrackerRef.current.cancelled = false;

    const voices = window.speechSynthesis.getVoices();
    const selectedVoice =
      voices.find(v => v.name.includes('Midhun')) ||
      voices.find(v => v.name.includes('Microsoft') && v.lang === 'ml-IN') ||
      voices.find(v => v.lang === 'ml-IN') ||
      voices.find(v => v.lang.startsWith('ml'));

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ml-IN';
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.pitch = 0.85;
    utterance.rate = 0.78;
    utterance.volume = 1.0;
    utterance.onend = () => { if (!speechTrackerRef.current.cancelled) handleAudioEnded(); };
    utterance.onerror = (err) => {
      if (err.error === 'interrupted' || err.error === 'canceled') return;
      if (!speechTrackerRef.current.cancelled) handleAudioEnded();
    };

    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  };

  // ─── Core play function ───
  const playAyahByIndex = (surah, index, lang = audioLanguageRef.current) => {
    if (!surah || index < 0 || index >= surah.ayahs.length) return;

    // Stop everything
    stopSpeech();
    mlChunkQueueRef.current = [];
    if (audioRef.current) audioRef.current.pause();

    const ayah = surah.ayahs[index];
    currentSurahRef.current = surah;
    currentAyahIndexRef.current = index;

    // Scroll active Ayah into view
    const el = document.getElementById(`ayah-${ayah.numberInSurah}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });

    if (lang === 'ml') {
      speakMalayalam(ayah);
      return;
    }

    if (lang === 'en') {
      speakEnglish(ayah);
      return;
    }

    // Arabic — studio MP3
    const reciter = settings.defaultReciter || 'ar.alafasy';
    const audioUrl = ayah.audio || `https://cdn.islamic.network/quran/audio/128/${reciter}/${ayah.number}.mp3`;

    if (audioRef.current) {
      try {
        audioRef.current.src = audioUrl;
        audioRef.current.load();
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      } catch {
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
    mlChunkQueueRef.current = [];
    if (audioRef.current) audioRef.current.pause();
    setIsPlaying(false);
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
    const nextIdx = currentAyahIndex + 1;
    if (nextIdx < currentSurah.ayahs.length) {
      setCurrentAyahIndex(nextIdx);
      currentAyahIndexRef.current = nextIdx;
      playAyahByIndex(currentSurah, nextIdx, audioLanguage);
    }
  };

  const prevAyah = () => {
    if (!currentSurah || currentAyahIndex === -1) return;
    const prevIdx = currentAyahIndex - 1;
    if (prevIdx >= 0) {
      setCurrentAyahIndex(prevIdx);
      currentAyahIndexRef.current = prevIdx;
      playAyahByIndex(currentSurah, prevIdx, audioLanguage);
    }
  };

  const stopAudio = () => {
    stopSpeech();
    mlChunkQueueRef.current = [];
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

  const currentAyah = currentSurah && currentAyahIndex !== -1
    ? currentSurah.ayahs[currentAyahIndex]
    : null;

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
  if (!context) throw new Error('useAudio must be used within an AudioProvider');
  return context;
};

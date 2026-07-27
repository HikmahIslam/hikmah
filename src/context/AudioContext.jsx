import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useSettings } from './SettingsContext';

const AudioContext = createContext();

// ─── Microsoft Edge Neural TTS helpers ────────────────────────────────────────
// Calls /api/speak (Vercel serverless → msedge-tts → Microsoft neural voices)
// Voices:  ml-IN-MidhunNeural (natural male Kerala Malayalam)
//          en-US-GuyNeural    (natural male US English)

const CHUNK_MAX = 280; // safe URL-encoded limit for query param

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

const buildTTSUrl = (text, lang) =>
  `/api/speak?lang=${lang}&text=${encodeURIComponent(text)}`;

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
  const chunkQueueRef = useRef([]); // remaining TTS chunks for current ayah
  const speechTrackerRef = useRef({ cancelled: false });

  // Closure-safe refs for event listeners
  const currentSurahRef = useRef(null);
  const currentAyahIndexRef = useRef(-1);
  const audioLanguageRef = useRef('ar');

  useEffect(() => { currentSurahRef.current = currentSurah; }, [currentSurah]);
  useEffect(() => { currentAyahIndexRef.current = currentAyahIndex; }, [currentAyahIndex]);
  useEffect(() => { audioLanguageRef.current = audioLanguage; }, [audioLanguage]);

  // Stop any active Web Speech synthesis
  const stopSpeech = () => {
    speechTrackerRef.current.cancelled = true;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  // ─── Audio element setup ───────────────────────────────────────────────────
  useEffect(() => {
    const audio = new Audio();
    audio.volume = volume;
    audioRef.current = audio;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);

    const onEnded = () => {
      const lang = audioLanguageRef.current;

      // If more TTS chunks remain for this ayah, play next chunk
      if ((lang === 'ml' || lang === 'en') && chunkQueueRef.current.length > 0) {
        const nextChunk = chunkQueueRef.current.shift();
        const url = buildTTSUrl(nextChunk, lang);
        audio.src = url;
        audio.load();
        audio.play().catch(() => handleAudioEnded());
        return;
      }

      handleAudioEnded();
    };

    const onError = () => {
      // TTS API unavailable — do NOT cascade error into auto-play loop
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      stopSpeech();
      chunkQueueRef.current = [];
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

  // ─── Advance to next ayah ──────────────────────────────────────────────────
  const handleAudioEnded = () => {
    const surah = currentSurahRef.current;
    const idx = currentAyahIndexRef.current;

    if (!surah || idx === -1) { setIsPlaying(false); return; }

    const nextIdx = idx + 1;
    if (nextIdx < surah.ayahs.length) {
      setCurrentAyahIndex(nextIdx);
      currentAyahIndexRef.current = nextIdx;
      setTimeout(() => playAyahByIndex(surah, nextIdx, audioLanguageRef.current), 350);
    } else {
      setIsPlaying(false);
      setCurrentAyahIndex(-1);
      currentAyahIndexRef.current = -1;
    }
  };

  // ─── Play translation via Microsoft Edge Neural TTS (/api/speak) ───────────
  const speakViaEdgeTTS = (ayah, lang) => {
    if (!audioRef.current) { setIsPlaying(false); return; }

    const rawText = lang === 'ml'
      ? (ayah.mlTranslation || ayah.enTranslation || '')
      : (ayah.enTranslation || '');

    const cleanedText = rawText
      .replace(/\[\d+\]/g, '')
      .replace(/\(\d+\)/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanedText) { handleAudioEnded(); return; }

    const chunks = splitAtWordBoundary(cleanedText, CHUNK_MAX);
    chunkQueueRef.current = chunks.slice(1); // queue chunks after the first

    const firstUrl = buildTTSUrl(chunks[0], lang);
    audioRef.current.src = firstUrl;
    audioRef.current.load();
    audioRef.current.play()
      .then(() => setIsPlaying(true))
      .catch(() => {
        // /api/speak not available in local dev without vite-plugin-api or vercel dev
        // Fall back to best available Web Speech voice
        chunkQueueRef.current = [];
        speakWithWebSpeech(cleanedText, lang);
      });
  };

  // ─── Web Speech API fallback (dev environment / offline) ──────────────────
  const speakWithWebSpeech = (text, lang) => {
    stopSpeech();
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsPlaying(false);
      return;
    }
    speechTrackerRef.current.cancelled = false;

    const voices = window.speechSynthesis.getVoices();
    let selectedVoice;

    if (lang === 'ml') {
      selectedVoice =
        voices.find(v => v.name.includes('Midhun')) ||
        voices.find(v => v.name.includes('Microsoft') && v.lang === 'ml-IN') ||
        voices.find(v => v.lang === 'ml-IN') ||
        voices.find(v => v.lang.startsWith('ml'));
    } else {
      selectedVoice =
        voices.find(v => v.name.toLowerCase().includes('david')) ||
        voices.find(v => v.name.toLowerCase().includes('guy')) ||
        voices.find(v => v.lang === 'en-US') ||
        voices.find(v => v.lang.startsWith('en'));
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'ml' ? 'ml-IN' : 'en-US';
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.pitch = lang === 'ml' ? 0.85 : 0.92;
    utterance.rate = lang === 'ml' ? 0.78 : 0.82;
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

  // ─── Core play function ────────────────────────────────────────────────────
  const playAyahByIndex = (surah, index, lang = audioLanguageRef.current) => {
    if (!surah || index < 0 || index >= surah.ayahs.length) return;

    stopSpeech();
    chunkQueueRef.current = [];
    if (audioRef.current) audioRef.current.pause();

    const ayah = surah.ayahs[index];
    currentSurahRef.current = surah;
    currentAyahIndexRef.current = index;

    const el = document.getElementById(`ayah-${ayah.numberInSurah}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Malayalam & English → Microsoft Edge Neural TTS (/api/speak)
    if (lang === 'ml' || lang === 'en') {
      speakViaEdgeTTS(ayah, lang);
      return;
    }

    // Arabic → studio MP3
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
    chunkQueueRef.current = [];
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
    chunkQueueRef.current = [];
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

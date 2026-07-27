import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useSettings } from './SettingsContext';

const AudioContext = createContext();

// ─── Hugging Face MMS-TTS (Meta's Massively Multilingual Speech) ─────────────
// Direct browser call — no server needed, CORS supported, free, no API key
// ml: facebook/mms-tts-mal  → natural Malayalam neural TTS (different from Google)
// en: facebook/mms-tts-eng  → natural English neural TTS
const HF_BASE = 'https://api-inference.huggingface.co/models';
const TTS_MODELS = {
  ml: `${HF_BASE}/facebook/mms-tts-mal`,
  en: `${HF_BASE}/facebook/mms-tts-eng`,
};
// ─────────────────────────────────────────────────────────────────────────────

export const AudioProvider = ({ children }) => {
  const { settings } = useSettings();
  const [isPlaying, setIsPlaying]               = useState(false);
  const [currentSurah, setCurrentSurah]         = useState(null);
  const [currentAyahIndex, setCurrentAyahIndex] = useState(-1);
  const [currentTime, setCurrentTime]           = useState(0);
  const [duration, setDuration]                 = useState(0);
  const [volume, setVolume]                     = useState(0.8);
  const [isMinimized, setIsMinimized]           = useState(false);
  const [audioLanguage, setAudioLanguage]       = useState('ar');
  const [isTTSLoading, setIsTTSLoading]         = useState(false); // HF model warm-up

  const audioRef          = useRef(null);
  const blobUrlRef        = useRef(null); // track blob URLs for cleanup
  const speechTrackerRef  = useRef({ cancelled: false });
  const abortControllerRef= useRef(null); // for cancelling in-flight HF requests

  // Closure-safe refs
  const currentSurahRef     = useRef(null);
  const currentAyahIndexRef = useRef(-1);
  const audioLanguageRef    = useRef('ar');

  useEffect(() => { currentSurahRef.current     = currentSurah; },     [currentSurah]);
  useEffect(() => { currentAyahIndexRef.current = currentAyahIndex; }, [currentAyahIndex]);
  useEffect(() => { audioLanguageRef.current    = audioLanguage; },    [audioLanguage]);

  // Pre-load Web Speech voices (fallback)
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }
  }, []);

  const revokeBlobUrl = () => {
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
  };

  const cancelHFRequest = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  const stopSpeech = () => {
    speechTrackerRef.current.cancelled = true;
    cancelHFRequest();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsTTSLoading(false);
  };

  // ─── Audio element ──────────────────────────────────────────────────────────
  useEffect(() => {
    const audio = new Audio();
    audio.volume = volume;
    audioRef.current = audio;

    const onTimeUpdate    = () => setCurrentTime(audio.currentTime);
    const onLoadedMeta    = () => setDuration(audio.duration);
    const onEnded         = () => { revokeBlobUrl(); handleAudioEnded(); };
    const onError         = () => { revokeBlobUrl(); setIsPlaying(false); setIsTTSLoading(false); };

    audio.addEventListener('timeupdate',    onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMeta);
    audio.addEventListener('ended',         onEnded);
    audio.addEventListener('error',         onError);

    return () => {
      stopSpeech();
      revokeBlobUrl();
      audio.pause();
      audio.removeEventListener('timeupdate',     onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMeta);
      audio.removeEventListener('ended',          onEnded);
      audio.removeEventListener('error',          onError);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // ─── Advance to next ayah ───────────────────────────────────────────────────
  const handleAudioEnded = () => {
    const surah = currentSurahRef.current;
    const idx   = currentAyahIndexRef.current;
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

  // ─── HuggingFace MMS-TTS (primary: natural neural voice) ────────────────────
  const speakViaMMS = async (ayah, lang) => {
    if (!audioRef.current) { setIsPlaying(false); return; }

    const rawText = lang === 'ml'
      ? (ayah.mlTranslation || ayah.enTranslation || '')
      : (ayah.enTranslation || '');

    const cleanedText = rawText
      .replace(/\[\d+\]/g, '')
      .replace(/\(\d+\)/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 300); // HF free-tier safe limit

    if (!cleanedText) { handleAudioEnded(); return; }

    const modelUrl = TTS_MODELS[lang] || TTS_MODELS.en;

    setIsTTSLoading(true);
    cancelHFRequest();
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(modelUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputs: cleanedText }),
        signal: abortControllerRef.current.signal,
      });

      if (speechTrackerRef.current.cancelled) return;
      setIsTTSLoading(false);

      if (response.status === 503) {
        // Model is loading (cold start) — fall back immediately, don't wait
        console.info('[MMS-TTS] Model loading (503), using Web Speech fallback');
        speakWithWebSpeech(cleanedText, lang);
        return;
      }

      if (!response.ok) throw new Error(`HF error ${response.status}`);

      const blob    = await response.blob();
      if (speechTrackerRef.current.cancelled) return;

      revokeBlobUrl(); // clean up any previous blob
      const blobUrl = URL.createObjectURL(blob);
      blobUrlRef.current = blobUrl;

      audioRef.current.src = blobUrl;
      audioRef.current.load();
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          revokeBlobUrl();
          speakWithWebSpeech(cleanedText, lang);
        });

    } catch (err) {
      if (err.name === 'AbortError') return; // intentional cancel
      setIsTTSLoading(false);
      console.warn('[MMS-TTS] Failed:', err.message);
      if (!speechTrackerRef.current.cancelled) {
        speakWithWebSpeech(cleanedText, lang);
      }
    }
  };

  // ─── Web Speech API (fallback when HF is unavailable / offline) ────────────
  const speakWithWebSpeech = (text, lang) => {
    stopSpeech();
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsPlaying(false);
      return;
    }
    speechTrackerRef.current.cancelled = false;

    const voices = window.speechSynthesis.getVoices();
    let voice;

    if (lang === 'ml') {
      voice =
        voices.find(v => v.name.includes('Midhun')) ||
        voices.find(v => v.name.includes('Microsoft') && v.lang === 'ml-IN') ||
        voices.find(v => v.lang === 'ml-IN') ||
        voices.find(v => v.lang.startsWith('ml'));
    } else {
      voice =
        voices.find(v => v.name.toLowerCase().includes('david')) ||
        voices.find(v => v.name.toLowerCase().includes('guy')) ||
        voices.find(v => v.lang === 'en-US') ||
        voices.find(v => v.lang.startsWith('en'));
    }

    const utt = new SpeechSynthesisUtterance(text);
    utt.lang   = lang === 'ml' ? 'ml-IN' : 'en-US';
    if (voice) utt.voice = voice;
    utt.pitch  = lang === 'ml' ? 0.85 : 0.92;
    utt.rate   = lang === 'ml' ? 0.78 : 0.82;
    utt.volume = 1.0;

    utt.onend  = () => { if (!speechTrackerRef.current.cancelled) handleAudioEnded(); };
    utt.onerror= (e) => {
      if (e.error === 'interrupted' || e.error === 'canceled') return;
      if (!speechTrackerRef.current.cancelled) handleAudioEnded();
    };

    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utt);
      setIsPlaying(true);

      // Chrome keep-alive
      const ka = setInterval(() => {
        if (speechTrackerRef.current.cancelled || !window.speechSynthesis.speaking) {
          clearInterval(ka);
        } else {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      }, 10000);
    } catch { setIsPlaying(false); }
  };

  // ─── Core play function ─────────────────────────────────────────────────────
  const playAyahByIndex = (surah, index, lang = audioLanguageRef.current) => {
    if (!surah || index < 0 || index >= surah.ayahs.length) return;

    stopSpeech();
    revokeBlobUrl();
    if (audioRef.current) audioRef.current.pause();

    const ayah = surah.ayahs[index];
    currentSurahRef.current     = surah;
    currentAyahIndexRef.current = index;
    speechTrackerRef.current    = { cancelled: false };

    const el = document.getElementById(`ayah-${ayah.numberInSurah}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // ML & EN → HuggingFace MMS-TTS neural voice
    if (lang === 'ml' || lang === 'en') {
      speakViaMMS(ayah, lang);
      return;
    }

    // Arabic → studio MP3
    const reciter  = settings.defaultReciter || 'ar.alafasy';
    const audioUrl = ayah.audio ||
      `https://cdn.islamic.network/quran/audio/128/${reciter}/${ayah.number}.mp3`;

    if (audioRef.current) {
      try {
        audioRef.current.src = audioUrl;
        audioRef.current.load();
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      } catch { setIsPlaying(false); }
    }
  };

  const playSurah = (surah, startIndex = 0, lang = audioLanguage) => {
    setAudioLanguage(lang);
    audioLanguageRef.current = lang;
    setCurrentSurah(surah);
    setCurrentAyahIndex(startIndex);
    currentSurahRef.current     = surah;
    currentAyahIndexRef.current = startIndex;
    playAyahByIndex(surah, startIndex, lang);
  };

  const playSingleAyah = (surah, index, lang = audioLanguage) => {
    setAudioLanguage(lang);
    audioLanguageRef.current = lang;
    setCurrentSurah(surah);
    setCurrentAyahIndex(index);
    currentSurahRef.current     = surah;
    currentAyahIndexRef.current = index;
    playAyahByIndex(surah, index, lang);
  };

  const pauseAudio = () => {
    stopSpeech();
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
    const n = currentAyahIndex + 1;
    if (n < currentSurah.ayahs.length) {
      setCurrentAyahIndex(n);
      currentAyahIndexRef.current = n;
      playAyahByIndex(currentSurah, n, audioLanguage);
    }
  };

  const prevAyah = () => {
    if (!currentSurah || currentAyahIndex === -1) return;
    const p = currentAyahIndex - 1;
    if (p >= 0) {
      setCurrentAyahIndex(p);
      currentAyahIndexRef.current = p;
      playAyahByIndex(currentSurah, p, audioLanguage);
    }
  };

  const stopAudio = () => {
    stopSpeech();
    revokeBlobUrl();
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentSurah(null);
    setCurrentAyahIndex(-1);
    currentSurahRef.current     = null;
    currentAyahIndexRef.current = -1;
    setCurrentTime(0);
  };

  const currentAyah = currentSurah && currentAyahIndex !== -1
    ? currentSurah.ayahs[currentAyahIndex]
    : null;

  return (
    <AudioContext.Provider value={{
      isPlaying,
      isTTSLoading,
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
    }}>
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) throw new Error('useAudio must be used within an AudioProvider');
  return context;
};

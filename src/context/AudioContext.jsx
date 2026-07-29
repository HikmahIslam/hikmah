import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useSettings } from './SettingsContext';

const AudioContext = createContext();

const ttsAudioCache = new Map();

const simpleHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
};

const CHUNK_MAX = 280;

const splitAtWordBoundary = (text, maxLen = CHUNK_MAX) => {
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

export const AudioProvider = ({ children }) => {
  const { settings } = useSettings();
  const [audioType, setAudioType]               = useState(null); // 'quran', 'radio', 'track'
  const [activeRadio, setActiveRadio]           = useState(null); // { name, url }
  const [activeTrack, setActiveTrack]           = useState(null); // { title, subtitle, audioUrl }
  const [isPlaying, setIsPlaying]               = useState(false);
  const [currentSurah, setCurrentSurah]         = useState(null);
  const [currentAyahIndex, setCurrentAyahIndex] = useState(-1);
  const [currentTime, setCurrentTime]           = useState(0);
  const [duration, setDuration]                 = useState(0);
  const [volume, setVolume]                     = useState(0.8);
  const [isMinimized, setIsMinimized]           = useState(false);
  const [audioLanguage, setAudioLanguage]       = useState('ar');
  const [isTTSLoading, setIsTTSLoading]         = useState(false);
  const [ttsLoadingMessage, setTTSLoadingMessage]= useState('');
  const [ttsError, setTTSError]                 = useState(null);

  const audioRef           = useRef(null);
  const activeBlobUrlsRef  = useRef(new Set());
  const chunkQueueRef      = useRef([]);
  const abortControllerRef = useRef(null);
  const onTrackEndedRef    = useRef(null);

  // Closure-safe refs for event listeners
  const audioTypeRef        = useRef(null);
  const currentSurahRef     = useRef(null);
  const currentAyahIndexRef = useRef(-1);
  const audioLanguageRef    = useRef('ar');

  useEffect(() => { audioTypeRef.current        = audioType; },        [audioType]);
  useEffect(() => { currentSurahRef.current     = currentSurah; },     [currentSurah]);
  useEffect(() => { currentAyahIndexRef.current = currentAyahIndex; }, [currentAyahIndex]);
  useEffect(() => { audioLanguageRef.current    = audioLanguage; },    [audioLanguage]);

  const cleanupActiveBlobUrls = () => {
    activeBlobUrlsRef.current.forEach((url) => {
      try { URL.revokeObjectURL(url); } catch {}
    });
    activeBlobUrlsRef.current.clear();
  };

  const cancelInFlightRequests = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  const stopAllAudio = () => {
    cancelInFlightRequests();
    chunkQueueRef.current = [];
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    setIsTTSLoading(false);
    setTTSLoadingMessage('');
  };

  // ─── Audio HTML element setup ──────────────────────────────────────────────
  useEffect(() => {
    const audio = new Audio();
    audio.volume = volume;
    audioRef.current = audio;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMeta = () => setDuration(audio.duration);
    const onWaiting    = () => setIsTTSLoading(true);
    const onPlaying    = () => {
      setIsTTSLoading(false);
      setIsPlaying(true);
    };

    const onEnded = () => {
      const type = audioTypeRef.current;

      if (type === 'track') {
        if (onTrackEndedRef.current) {
          onTrackEndedRef.current();
        } else {
          setIsPlaying(false);
        }
        return;
      }

      if (type === 'radio') {
        setIsPlaying(false);
        return;
      }

      // Quran mode
      const lang = audioLanguageRef.current;
      if ((lang === 'ml' || lang === 'en') && chunkQueueRef.current.length > 0) {
        const nextUrl = chunkQueueRef.current.shift();
        audio.src = nextUrl;
        audio.load();
        audio.play().catch(() => handleAudioEnded());
        return;
      }

      handleAudioEnded();
    };

    const onError = () => {
      setIsPlaying(false);
      setIsTTSLoading(false);
    };

    audio.addEventListener('timeupdate',    onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMeta);
    audio.addEventListener('waiting',       onWaiting);
    audio.addEventListener('playing',       onPlaying);
    audio.addEventListener('ended',         onEnded);
    audio.addEventListener('error',         onError);

    return () => {
      stopAllAudio();
      cleanupActiveBlobUrls();
      audio.removeEventListener('timeupdate',    onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMeta);
      audio.removeEventListener('waiting',       onWaiting);
      audio.removeEventListener('playing',       onPlaying);
      audio.removeEventListener('ended',         onEnded);
      audio.removeEventListener('error',         onError);
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

  // ─── Fetch Neural Audio Chunk via /api/tts ──────────────────────────────────
  const fetchNeuralAudioChunk = async (chunkText, lang, attempt = 1) => {
    const endpoint = `/api/tts?lang=${lang}&text=${encodeURIComponent(chunkText)}`;

    const res = await fetch(endpoint, {
      signal: abortControllerRef.current?.signal,
    });

    if (res.status === 503 && attempt <= 5) {
      const data = await res.json().catch(() => ({}));
      const estTime = data.estimated_time || 15;
      const langLabel = lang === 'ml' ? 'Malayalam' : 'English';
      
      setTTSLoadingMessage(
        `Preparing ${langLabel} neural audio... Model is warming up (${Math.round(estTime)}s). Retrying (attempt ${attempt}/5)...`
      );

      await new Promise((r) => setTimeout(r, 5000));
      return fetchNeuralAudioChunk(chunkText, lang, attempt + 1);
    }

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Neural audio HTTP status ${res.status}`);
    }

    const contentType = res.headers.get('content-type') || 'audio/mpeg';
    const engineHeader= res.headers.get('x-tts-engine') || 'Neural TTS API';
    const arrayBuffer = await res.arrayBuffer();
    const blob        = new Blob([arrayBuffer], { type: contentType });
    const objectUrl   = URL.createObjectURL(blob);
    activeBlobUrlsRef.current.add(objectUrl);

    return { objectUrl, contentType, engineHeader, blob };
  };

  // ─── Play Neural Audio for Malayalam / English ──────────────────────────────
  const speakNeuralTranslation = async (surah, ayah, lang) => {
    if (!audioRef.current) return;

    setTTSError(null);
    cancelInFlightRequests();
    stopAllAudio();

    const rawText = lang === 'ml'
      ? (ayah.mlTranslation || ayah.enTranslation || '')
      : (ayah.enTranslation || '');

    const cleanedText = rawText
      .replace(/\[\d+\]/g, '')
      .replace(/\(\d+\)/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanedText) { handleAudioEnded(); return; }

    const textHash = simpleHash(cleanedText);
    const cacheKey = `tts-v2-${lang}-${surah.number}-${ayah.numberInSurah}-${textHash}`;

    const langLabel  = lang === 'ml' ? 'Malayalam' : 'English';
    const modelLabel = lang === 'ml' ? 'facebook/mms-tts-mal' : 'facebook/mms-tts-eng';

    if (ttsAudioCache.has(cacheKey)) {
      const cached = ttsAudioCache.get(cacheKey);
      audioRef.current.src = cached.objectUrl;
      audioRef.current.load();
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
      return;
    }

    setIsTTSLoading(true);
    setTTSLoadingMessage(`Preparing ${langLabel} neural audio...`);
    abortControllerRef.current = new AbortController();

    try {
      const chunks = splitAtWordBoundary(cleanedText, CHUNK_MAX);
      const audioUrls = [];

      for (let i = 0; i < chunks.length; i++) {
        setTTSLoadingMessage(
          chunks.length > 1
            ? `Generating ${langLabel} neural audio (part ${i + 1}/${chunks.length})...`
            : `Generating ${langLabel} neural audio...`
        );

        const { objectUrl, contentType } = await fetchNeuralAudioChunk(chunks[i], lang);
        audioUrls.push(objectUrl);
      }

      setIsTTSLoading(false);
      setTTSLoadingMessage('');

      ttsAudioCache.set(cacheKey, {
        objectUrl: audioUrls[0],
        mimeType: 'audio/mpeg',
      });

      chunkQueueRef.current = audioUrls.slice(1);

      audioRef.current.src = audioUrls[0];
      audioRef.current.load();
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));

    } catch (err) {
      if (err.name === 'AbortError') return;

      setIsTTSLoading(false);
      setTTSLoadingMessage('');
      setIsPlaying(false);

      const errorMessage = `${langLabel} neural audio is currently unavailable. Please try again.`;
      setTTSError(errorMessage);
    }
  };

  // ─── Play Quran Surah / Ayah ─────────────────────────────────────────────────
  const playAyahByIndex = (surah, index, lang = audioLanguageRef.current) => {
    if (!surah || index < 0 || index >= surah.ayahs.length) return;

    stopAllAudio();
    setAudioType('quran');

    const ayah = surah.ayahs[index];
    currentSurahRef.current     = surah;
    currentAyahIndexRef.current = index;

    setTimeout(() => {
      let targetEl = null;
      if (lang === 'en' || lang === 'ml') {
        targetEl = document.getElementById(`translation-${lang}-${ayah.numberInSurah}`);
      }
      if (!targetEl) {
        targetEl = document.getElementById(`ayah-${ayah.numberInSurah}`);
      }
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 60);

    if (lang === 'ml' || lang === 'en') {
      speakNeuralTranslation(surah, ayah, lang);
      return;
    }

    setTTSError(null);
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

  // ─── Play Live 24/7 Radio Stream ───────────────────────────────────────────
  const playRadio = (station) => {
    stopAllAudio();
    setAudioType('radio');
    setActiveRadio(station);
    setActiveTrack(null);
    setCurrentSurah(null);
    setCurrentAyahIndex(-1);
    setIsTTSLoading(true);
    setTTSLoadingMessage('Connecting to Live Stream...');

    if (audioRef.current) {
      audioRef.current.src = station.url;
      audioRef.current.load();
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setIsTTSLoading(false);
        })
        .catch(() => {
          setIsPlaying(false);
          setIsTTSLoading(false);
        });
    }
  };

  // ─── Play Single Track / Asmaul Husna ──────────────────────────────────────
  const playTrack = (trackData, onEndedCallback) => {
    stopAllAudio();
    setAudioType('track');
    setActiveTrack(trackData);
    setActiveRadio(null);
    setCurrentSurah(null);
    setCurrentAyahIndex(-1);
    setIsTTSLoading(false);

    if (audioRef.current) {
      audioRef.current.src = trackData.audioUrl;
      audioRef.current.playbackRate = trackData.playbackSpeed || 1.0;
      audioRef.current.load();
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
    onTrackEndedRef.current = onEndedCallback;
  };

  const pauseAudio = () => {
    if (audioRef.current) audioRef.current.pause();
    setIsPlaying(false);
  };

  const resumeAudio = () => {
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  const seek = (time) => {
    if (audioRef.current && audioType === 'quran' && audioLanguage === 'ar') {
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
    stopAllAudio();
    cleanupActiveBlobUrls();
    setIsPlaying(false);
    setAudioType(null);
    setActiveRadio(null);
    setActiveTrack(null);
    setCurrentSurah(null);
    setCurrentAyahIndex(-1);
    currentSurahRef.current     = null;
    currentAyahIndexRef.current = -1;
    setCurrentTime(0);
    setTTSError(null);
  };

  const currentAyah = currentSurah && currentAyahIndex !== -1
    ? currentSurah.ayahs[currentAyahIndex]
    : null;

  return (
    <AudioContext.Provider value={{
      audioType,
      activeRadio,
      activeTrack,
      isPlaying,
      isTTSLoading,
      ttsLoadingMessage,
      ttsError,
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
      playRadio,
      playTrack,
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

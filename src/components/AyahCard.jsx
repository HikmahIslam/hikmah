import React, { useState } from 'react';
import { Play, Pause, Bookmark, Copy, Check, Share2 } from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import { useBookmarks } from '../context/BookmarksContext';
import { useSettings } from '../context/SettingsContext';

export const AyahCard = ({ ayah, surah }) => {
  const { playSingleAyah, pauseAudio, isPlaying, currentSurah, currentAyah, audioLanguage } = useAudio();
  const { toggleBookmark, isBookmarked } = useBookmarks();
  const { settings } = useSettings();
  const [isCopied, setIsCopied] = useState(false);

  const { number, numberInSurah, text, enTranslation, mlTranslation } = ayah;
  
  const isCurrentlyPlaying = 
    isPlaying && 
    currentSurah?.number === surah.number && 
    currentAyah?.numberInSurah === numberInSurah;

  const isArabicActive = isCurrentlyPlaying && audioLanguage === 'ar';
  const isEnglishActive = isCurrentlyPlaying && audioLanguage === 'en';
  const isMalayalamActive = isCurrentlyPlaying && audioLanguage === 'ml';

  const isSaved = isBookmarked(surah.number, numberInSurah);

  const handlePlayToggle = () => {
    if (isCurrentlyPlaying) {
      pauseAudio();
    } else {
      const idx = surah.ayahs.findIndex(a => a.numberInSurah === numberInSurah);
      if (idx !== -1) playSingleAyah(surah, idx);
    }
  };

  const handleCopy = () => {
    const copyText = `📖 Qur'an ${surah.englishName} (${surah.number}:${numberInSurah})\n\nArabic:\n${text}\n\nEnglish:\n${enTranslation}\n${mlTranslation ? `\nMalayalam:\n${mlTranslation}\n` : ''}\nShared via Hikmah App`;
    navigator.clipboard.writeText(copyText).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/quran/${surah.number}?ayah=${numberInSurah}`;
    const shareData = {
      title: `Surah ${surah.englishName} - Verse ${numberInSurah}`,
      text: `Read verse ${numberInSurah} of Surah ${surah.englishName} on Hikmah App.`,
      url: shareUrl,
    };
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      navigator.share(shareData).catch(err => console.log(err));
    } else {
      navigator.clipboard.writeText(shareUrl).then(() => alert("Verse link copied to clipboard!"));
    }
  };

  const handleBookmarkToggle = () => {
    toggleBookmark({
      id: `${surah.number}_${numberInSurah}`,
      surahNumber: surah.number,
      ayahNumber: numberInSurah,
      surahName: surah.name,
      surahEnglishName: surah.englishName,
      arabicText: text,
      translationText: settings.defaultLanguage === 'ml' && mlTranslation ? mlTranslation : enTranslation
    });
  };

  let cleanArabicText = text;
  if (surah.number !== 1 && surah.number !== 9 && numberInSurah === 1) {
    const bismillahText = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";
    if (text.startsWith(bismillahText)) {
      cleanArabicText = text.replace(bismillahText, "").trim();
    }
  }

  return (
    <div
      id={`ayah-${numberInSurah}`}
      className={`bg-white dark:bg-slate-900 border rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 transition-all duration-300 ${
        isCurrentlyPlaying
          ? 'border-brand-emerald-400 dark:border-brand-emerald-600 bg-brand-emerald-50/10 dark:bg-brand-emerald-950/10 ring-2 ring-brand-emerald-500/20 shadow-md'
          : 'border-slate-200/50 dark:border-slate-800/80 hover:border-slate-350 dark:hover:border-slate-700'
      }`}
    >
      {/* Top action row */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-3 mb-4 gap-2">
        <div className="flex items-center gap-2">
          <span className="font-bold text-xs text-slate-500 dark:text-slate-450 bg-slate-50 dark:bg-slate-950 px-2.5 py-1 rounded-full font-mono flex-shrink-0">
            {surah.number}:{numberInSurah}
          </span>
          {isCurrentlyPlaying && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-emerald-500 text-white animate-pulse flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
              {audioLanguage === 'ar' ? 'Playing Recitation' : audioLanguage === 'en' ? 'Playing English' : 'Playing Malayalam'}
            </span>
          )}
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center gap-1 flex-wrap justify-end">
          <button
            onClick={handlePlayToggle}
            className={`p-2.5 rounded-xl transition-all duration-200 min-h-[40px] min-w-[40px] flex items-center justify-center ${
              isCurrentlyPlaying
                ? 'bg-brand-emerald-500 text-white shadow-md shadow-brand-emerald-500/20'
                : 'text-slate-550 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            aria-label={isCurrentlyPlaying ? "Pause verse audio" : "Play verse audio"}
          >
            {isCurrentlyPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>

          <button
            onClick={handleBookmarkToggle}
            className={`p-2.5 rounded-xl transition-all duration-200 min-h-[40px] min-w-[40px] flex items-center justify-center ${
              isSaved
                ? 'text-brand-emerald-500 hover:bg-brand-emerald-50 dark:hover:bg-brand-emerald-950/20'
                : 'text-slate-550 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            aria-label={isSaved ? "Remove bookmark" : "Bookmark verse"}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={handleCopy}
            className="p-2.5 rounded-xl text-slate-550 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 min-h-[40px] min-w-[40px] flex items-center justify-center"
            aria-label="Copy verse text"
          >
            {isCopied ? <Check className="w-4 h-4 text-brand-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={handleShare}
            className="p-2.5 rounded-xl text-slate-550 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 min-h-[40px] min-w-[40px] flex items-center justify-center"
            aria-label="Share verse link"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Arabic text */}
      <div className={`text-right mb-4 sm:mb-5 p-2 rounded-2xl transition-all duration-300 ${isArabicActive ? 'bg-brand-emerald-500/15 ring-2 ring-brand-emerald-500/40 font-bold' : ''}`}>
        <p
          className="arabic-text text-slate-900 dark:text-white leading-loose font-normal antialiased break-words"
          style={{ fontSize: `${settings.arabicFontSize}px` }}
          dir="rtl"
        >
          {cleanArabicText}
        </p>
      </div>

      {/* Translations */}
      <div className="space-y-3 border-l-2 border-brand-emerald-500/25 pl-3.5 sm:pl-4 py-1">
        {(!settings.defaultLanguage || settings.defaultLanguage === 'en' || settings.defaultLanguage === 'both') && (
          <div
            id={`translation-en-${numberInSurah}`}
            className={`space-y-1 p-2.5 rounded-2xl transition-all duration-300 ${
              isEnglishActive
                ? 'bg-brand-emerald-50 dark:bg-brand-emerald-950/60 text-brand-emerald-900 dark:text-brand-emerald-200 border-l-4 border-brand-emerald-500 ring-2 ring-brand-emerald-500/30 shadow-sm font-medium'
                : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-[9px] font-bold tracking-wider uppercase block ${isEnglishActive ? 'text-brand-emerald-600 dark:text-brand-emerald-400' : 'text-slate-400'}`}>
                English {isEnglishActive && '• Reading Line 🔊'}
              </span>
            </div>
            <p
              className={`leading-relaxed font-sans break-words ${isEnglishActive ? 'text-brand-emerald-950 dark:text-brand-emerald-100 font-semibold' : 'text-slate-700 dark:text-slate-350'}`}
              style={{ fontSize: `${settings.translationFontSize}px` }}
            >
              {enTranslation}
            </p>
          </div>
        )}

        {(settings.defaultLanguage === 'ml' || settings.defaultLanguage === 'both') && mlTranslation && (
          <div
            id={`translation-ml-${numberInSurah}`}
            className={`space-y-1 p-2.5 rounded-2xl transition-all duration-300 ${
              isMalayalamActive
                ? 'bg-brand-emerald-50 dark:bg-brand-emerald-950/60 text-brand-emerald-900 dark:text-brand-emerald-200 border-l-4 border-brand-emerald-500 ring-2 ring-brand-emerald-500/30 shadow-sm font-medium'
                : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-[9px] font-bold tracking-wider uppercase block ${isMalayalamActive ? 'text-brand-emerald-600 dark:text-brand-emerald-400' : 'text-slate-400'}`}>
                Malayalam {isMalayalamActive && '• Reading Line 🔊'}
              </span>
            </div>
            <p
              className={`leading-relaxed font-sans break-words ${isMalayalamActive ? 'text-brand-emerald-950 dark:text-brand-emerald-100 font-semibold' : 'text-slate-700 dark:text-slate-350'}`}
              style={{ fontSize: `${settings.translationFontSize}px` }}
            >
              {mlTranslation}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AyahCard;

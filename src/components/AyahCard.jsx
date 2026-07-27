import React, { useState } from 'react';
import { Play, Pause, Bookmark, Copy, Check, Share2 } from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import { useBookmarks } from '../context/BookmarksContext';
import { useSettings } from '../context/SettingsContext';

export const AyahCard = ({ ayah, surah }) => {
  const { playSingleAyah, pauseAudio, isPlaying, currentSurah, currentAyah } = useAudio();
  const { toggleBookmark, isBookmarked } = useBookmarks();
  const { settings } = useSettings();
  const [isCopied, setIsCopied] = useState(false);

  const { number, numberInSurah, text, enTranslation, mlTranslation } = ayah;
  
  const isCurrentlyPlaying = 
    isPlaying && 
    currentSurah?.number === surah.number && 
    currentAyah?.numberInSurah === numberInSurah;

  const isSaved = isBookmarked(surah.number, numberInSurah);

  const handlePlayToggle = () => {
    if (isCurrentlyPlaying) {
      pauseAudio();
    } else {
      // Find the index of this ayah in the surah
      const idx = surah.ayahs.findIndex(a => a.numberInSurah === numberInSurah);
      if (idx !== -1) {
        playSingleAyah(surah, idx);
      }
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
      navigator.clipboard.writeText(shareUrl).then(() => {
        alert("Verses link copied to clipboard!");
      });
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

  // Strip Bismillah if it's the first verse and not Al-Fatiha or Al-Tawbah,
  // since we render a separate centered Bismillah header on the details page.
  let cleanArabicText = text;
  if (surah.number !== 1 && surah.number !== 9 && numberInSurah === 1) {
    const bismillahText = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";
    if (text.startsWith(bismillahText)) {
      cleanArabicText = text.replace(bismillahText, "").trim();
    }
  }

  return (
    <div
      id={`ayah-${numberInSurah}`}
      className={`bg-white dark:bg-slate-900 border rounded-3xl p-5 md:p-6 transition-all duration-300 ${
        isCurrentlyPlaying
          ? 'border-brand-emerald-400 dark:border-brand-emerald-600 bg-brand-emerald-50/10 dark:bg-brand-emerald-950/10 ring-2 ring-brand-emerald-500/10'
          : 'border-slate-200/50 dark:border-slate-800/80 hover:border-slate-350 dark:hover:border-slate-700'
      }`}
    >
      {/* Top action row */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-3 mb-4 text-xs font-mono text-slate-400">
        <span className="font-bold text-slate-500 dark:text-slate-450 bg-slate-50 dark:bg-slate-950 px-3 py-1 rounded-full">
          {surah.number}:{numberInSurah}
        </span>
        
        {/* Buttons */}
        <div className="flex items-center gap-1.5">
          {/* Play/Pause */}
          <button
            onClick={handlePlayToggle}
            className={`p-2.5 rounded-xl transition-all duration-200 ${
              isCurrentlyPlaying
                ? 'bg-brand-emerald-500 text-white shadow-md shadow-brand-emerald-500/20'
                : 'text-slate-550 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
            aria-label={isCurrentlyPlaying ? "Pause verse audio" : "Play verse audio"}
          >
            {isCurrentlyPlaying ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </button>

          {/* Bookmark */}
          <button
            onClick={handleBookmarkToggle}
            className={`p-2.5 rounded-xl transition-all duration-200 ${
              isSaved
                ? 'text-brand-emerald-500 hover:bg-brand-emerald-50 dark:hover:bg-brand-emerald-950/20'
                : 'text-slate-550 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            aria-label="Bookmark verse"
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>

          {/* Copy */}
          <button
            onClick={handleCopy}
            className="p-2.5 rounded-xl text-slate-550 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
            aria-label="Copy verse"
          >
            {isCopied ? <Check className="w-4 h-4 text-brand-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="p-2.5 rounded-xl text-slate-550 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
            aria-label="Share verse link"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Arabic text */}
      <div className="text-right mb-5">
        <p
          className="arabic-text text-slate-900 dark:text-white leading-loose font-normal antialiased"
          style={{ fontSize: `${settings.arabicFontSize}px` }}
        >
          {cleanArabicText}
        </p>
      </div>

      {/* Translations */}
      <div className="space-y-3.5 border-l-2 border-brand-emerald-500/25 pl-4.5 py-1">
        {/* English */}
        {(!settings.defaultLanguage || settings.defaultLanguage === 'en' || settings.defaultLanguage === 'both') && (
          <div className="space-y-1">
            <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase block">English</span>
            <p
              className="text-slate-700 dark:text-slate-350 leading-relaxed font-sans"
              style={{ fontSize: `${settings.translationFontSize}px` }}
            >
              {enTranslation}
            </p>
          </div>
        )}

        {/* Malayalam */}
        {(settings.defaultLanguage === 'ml' || settings.defaultLanguage === 'both') && mlTranslation && (
          <div className="space-y-1">
            <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase block">Malayalam</span>
            <p
              className="text-slate-700 dark:text-slate-350 leading-relaxed font-sans"
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

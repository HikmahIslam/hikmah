import React, { useState } from 'react';
import { Play, Pause, Bookmark, Copy, Check, Share2 } from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import { useBookmarks } from '../context/BookmarksContext';
import { useSettings } from '../context/SettingsContext';

const toArabicDigits = (num) => {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().replace(/\d/g, (d) => arabicDigits[d]);
};

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
      const idx = surah.ayahs.findIndex((a) => a.numberInSurah === numberInSurah);
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
      navigator.share(shareData).catch((err) => console.log(err));
    } else {
      navigator.clipboard.writeText(shareUrl).then(() => alert('Verse link copied to clipboard!'));
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
      translationText: settings.defaultLanguage === 'ml' && mlTranslation ? mlTranslation : enTranslation,
    });
  };

  let cleanArabicText = text;
  if (surah.number !== 1 && surah.number !== 9 && numberInSurah === 1) {
    const bismillahText = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";
    if (text.startsWith(bismillahText)) {
      cleanArabicText = text.replace(bismillahText, '').trim();
    }
  }

  // Calculate line height factor
  const getLineHeight = () => {
    if (settings.lineHeight === 'compact') return 2.0;
    if (settings.lineHeight === 'spacious') return 2.8;
    return 2.4; // comfortable (default)
  };

  const showEnglish = !settings.defaultLanguage || settings.defaultLanguage === 'en' || settings.defaultLanguage === 'both';
  const showMalayalam = (settings.defaultLanguage === 'ml' || settings.defaultLanguage === 'both') && mlTranslation;
  const hideTranslations = settings.defaultLanguage === 'none';

  return (
    <div
      id={`ayah-${numberInSurah}`}
      className={`bg-white dark:bg-slate-900 border rounded-2xl sm:rounded-3xl p-4.5 sm:p-6 transition-all duration-300 ${
        isCurrentlyPlaying
          ? 'border-brand-emerald-400 dark:border-brand-emerald-600 bg-brand-emerald-50/15 dark:bg-brand-emerald-950/15 ring-2 ring-brand-emerald-500/20 shadow-md'
          : 'border-slate-200/60 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs'
      }`}
    >
      {/* Top Header: Islamic Ayah Ornament Number & Verse Badge */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-3 mb-4.5 gap-2">
        <div className="flex items-center gap-2">
          {/* Islamic Ornament Star Verse Number */}
          <div className="w-8 h-8 rounded-full bg-brand-emerald-50 dark:bg-brand-emerald-950/40 text-brand-emerald-600 dark:text-brand-emerald-400 font-extrabold text-xs flex items-center justify-center font-mono border border-brand-emerald-200/50 dark:border-brand-emerald-900/50 flex-shrink-0">
            {numberInSurah}
          </div>
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 font-mono">
            {surah.number}:{numberInSurah}
          </span>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex items-center gap-1">
          {/* Play / Pause */}
          <button
            onClick={handlePlayToggle}
            className={`p-2.5 rounded-xl transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center ${
              isCurrentlyPlaying
                ? 'bg-brand-emerald-500 text-white shadow-md shadow-brand-emerald-500/20'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
            aria-label={isCurrentlyPlaying ? 'Pause verse audio' : 'Play verse audio'}
            title={isCurrentlyPlaying ? 'Pause Verse' : 'Play Verse'}
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
            className={`p-2.5 rounded-xl transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center ${
              isSaved
                ? 'text-brand-emerald-500 bg-brand-emerald-50/50 dark:bg-brand-emerald-950/30'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            aria-label={isSaved ? 'Remove bookmark' : 'Bookmark verse'}
            title={isSaved ? 'Remove Bookmark' : 'Bookmark Verse'}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>

          {/* Copy */}
          <button
            onClick={handleCopy}
            className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Copy verse text"
            title="Copy Verse"
          >
            {isCopied ? <Check className="w-4 h-4 text-brand-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Share verse link"
            title="Share Verse"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Arabic Text (Visual Priority) */}
      <div className="text-right mb-4 sm:mb-5">
        <p
          className="arabic-text text-slate-900 dark:text-white font-normal antialiased break-words"
          style={{
            fontSize: `${settings.arabicFontSize}px`,
            lineHeight: getLineHeight(),
          }}
          dir="rtl"
        >
          {cleanArabicText}
          <span className="inline-block text-brand-emerald-600 dark:text-brand-emerald-400 font-bold text-lg select-none px-1">
            ﴿{toArabicDigits(numberInSurah)}﴾
          </span>
        </p>
      </div>

      {/* Translations (Hidden if 'none' is selected) */}
      {!hideTranslations && (showEnglish || showMalayalam) && (
        <div className="space-y-3 border-l-2 border-brand-emerald-500/25 pl-3.5 sm:pl-4 py-1 mt-3">
          {/* English Translation */}
          {showEnglish && (
            <div className="space-y-1" dir="ltr">
              <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase block">
                English
              </span>
              <p
                className="text-slate-700 dark:text-slate-300 leading-relaxed font-sans break-words"
                style={{ fontSize: `${settings.translationFontSize}px` }}
              >
                {enTranslation}
              </p>
            </div>
          )}

          {/* Malayalam Translation */}
          {showMalayalam && (
            <div className="space-y-1" dir="ltr">
              <span className="text-[9px] font-bold text-slate-400 tracking-wider uppercase block">
                Malayalam
              </span>
              <p
                className="text-slate-700 dark:text-slate-350 leading-relaxed font-sans break-words"
                style={{ fontSize: `${settings.translationFontSize}px` }}
              >
                {mlTranslation}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AyahCard;

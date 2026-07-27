import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { useAudio } from '../context/AudioContext';

const toArabicDigits = (num) => {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().replace(/\d/g, (d) => arabicDigits[d]);
};

export const ContinuousMushafView = ({ surah }) => {
  const { settings } = useSettings();
  const { playSingleAyah, isPlaying, currentSurah, currentAyah } = useAudio();

  const getLineHeight = () => {
    if (settings.lineHeight === 'compact') return 2.2;
    if (settings.lineHeight === 'spacious') return 3.0;
    return 2.6; // comfortable
  };

  const showEnglish = !settings.defaultLanguage || settings.defaultLanguage === 'en' || settings.defaultLanguage === 'both';
  const showMalayalam = (settings.defaultLanguage === 'ml' || settings.defaultLanguage === 'both');
  const hideTranslations = settings.defaultLanguage === 'none';

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 rounded-3xl p-5 sm:p-8 md:p-10 shadow-2xs space-y-8 sm:space-y-10">
      
      {/* Continuous Arabic Paragraph */}
      <div
        className="text-right text-slate-900 dark:text-white font-normal antialiased leading-loose"
        dir="rtl"
      >
        {surah.ayahs.map((ayah) => {
          let cleanText = ayah.text;
          if (surah.number !== 1 && surah.number !== 9 && ayah.numberInSurah === 1) {
            const bismillahText = "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";
            if (cleanText.startsWith(bismillahText)) {
              cleanText = cleanText.replace(bismillahText, '').trim();
            }
          }

          const isCurrentlyPlaying =
            isPlaying &&
            currentSurah?.number === surah.number &&
            currentAyah?.numberInSurah === ayah.numberInSurah;

          return (
            <span
              key={ayah.numberInSurah}
              id={`ayah-${ayah.numberInSurah}`}
              onClick={() => {
                const idx = surah.ayahs.findIndex((a) => a.numberInSurah === ayah.numberInSurah);
                if (idx !== -1) playSingleAyah(surah, idx);
              }}
              className={`arabic-text inline cursor-pointer px-1 rounded-xl transition-all ${
                isCurrentlyPlaying
                  ? 'bg-brand-emerald-500/20 text-brand-emerald-700 dark:text-brand-emerald-300 font-bold ring-2 ring-brand-emerald-500/40'
                  : 'hover:bg-brand-emerald-50/60 dark:hover:bg-brand-emerald-950/40'
              }`}
              style={{
                fontSize: `${settings.arabicFontSize}px`,
                lineHeight: getLineHeight(),
              }}
              title={`Click to play verse ${ayah.numberInSurah}`}
            >
              {cleanText}{' '}
              <span className="inline-block text-brand-emerald-600 dark:text-brand-emerald-400 font-bold text-base sm:text-lg select-none px-1">
                ﴿{toArabicDigits(ayah.numberInSurah)}﴾
              </span>{' '}
            </span>
          );
        })}
      </div>

      {/* Full Translations Section (Hidden if 'none' is selected) */}
      {!hideTranslations && (showEnglish || showMalayalam) && (
        <div className="border-t border-slate-100 dark:border-slate-800/80 pt-6 sm:pt-8 space-y-6">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Surah Verses & Translations
          </h3>
          <div className="space-y-4">
            {surah.ayahs.map((ayah) => (
              <div
                key={ayah.numberInSurah}
                className="border-l-2 border-brand-emerald-500/30 pl-3.5 sm:pl-4 py-1 space-y-1"
                dir="ltr"
              >
                <span className="text-xs font-bold text-brand-emerald-600 dark:text-brand-emerald-400 font-mono">
                  {surah.number}:{ayah.numberInSurah}
                </span>
                {showEnglish && (
                  <p
                    className="text-slate-700 dark:text-slate-300 leading-relaxed font-sans break-words"
                    style={{ fontSize: `${settings.translationFontSize}px` }}
                  >
                    {ayah.enTranslation}
                  </p>
                )}
                {showMalayalam && ayah.mlTranslation && (
                  <p
                    className="text-slate-700 dark:text-slate-350 leading-relaxed font-sans break-words"
                    style={{ fontSize: `${settings.translationFontSize}px` }}
                  >
                    {ayah.mlTranslation}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContinuousMushafView;

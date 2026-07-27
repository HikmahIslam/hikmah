import React from 'react';

export const Bismillah = ({ surahNumber }) => {
  // Bismillah is not shown for Surah Al-Fatiha (1) (where it's verse 1) or Surah At-Tawbah (9)
  if (surahNumber === 1 || surahNumber === 9) return null;

  return (
    <div className="py-6 sm:py-8 my-2 sm:my-4 border-y border-slate-100 dark:border-slate-800/60 text-center select-none">
      <p
        className="arabic-text text-xl sm:text-2xl md:text-3xl text-slate-800 dark:text-slate-200 font-normal leading-relaxed tracking-wide antialiased"
        dir="rtl"
        aria-label="In the name of Allah, the Most Gracious, the Most Merciful"
      >
        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
      </p>
    </div>
  );
};

export default Bismillah;

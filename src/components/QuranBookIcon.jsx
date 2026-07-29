import React from 'react';

export const QuranBookIcon = ({ className = "w-6 h-6", color }) => {
  return (
    <div
      className={`inline-block flex-shrink-0 bg-current ${className}`}
      style={{
        color: color,
        maskImage: 'url(/assets/quran.png)',
        maskSize: 'contain',
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskImage: 'url(/assets/quran.png)',
        WebkitMaskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
      }}
      aria-label="Quran Icon"
    />
  );
};

export default QuranBookIcon;

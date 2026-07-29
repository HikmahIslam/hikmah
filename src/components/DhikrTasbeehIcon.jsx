import React from 'react';

export const DhikrTasbeehIcon = ({ className = "w-6 h-6", color }) => {
  return (
    <div
      className={`inline-block flex-shrink-0 bg-current ${className}`}
      style={{
        color: color,
        maskImage: 'url(/assets/dhikr.png)',
        maskSize: 'contain',
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskImage: 'url(/assets/dhikr.png)',
        WebkitMaskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
      }}
      aria-label="Dhikr Icon"
    />
  );
};

export default DhikrTasbeehIcon;

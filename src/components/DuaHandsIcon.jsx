import React from 'react';

export const DuaHandsIcon = ({ className = "w-6 h-6", color }) => {
  return (
    <div
      className={`inline-block flex-shrink-0 bg-current ${className}`}
      style={{
        color: color,
        maskImage: 'url(/assets/prayer.png)',
        maskSize: 'contain',
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskImage: 'url(/assets/prayer.png)',
        WebkitMaskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
      }}
      aria-label="Duas Icon"
    />
  );
};

export default DuaHandsIcon;

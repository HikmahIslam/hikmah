import React from 'react';

export const KaabaIcon = ({ className = "w-6 h-6", size, beltColor = "#F59E0B" }) => {
  const customStyle = size ? { width: `${size}px`, height: `${size}px` } : undefined;

  return (
    <div
      className={`relative rounded-lg bg-[#0F172A] border border-amber-400/60 shadow-xs overflow-hidden flex-shrink-0 inline-flex items-center justify-center ${className}`}
      style={customStyle}
    >
      {/* Gold Belt (Hizam Al-Kaaba) */}
      <div
        className="absolute top-[20%] left-0 right-0 h-[20%] bg-amber-400 shadow-xs"
        style={{ backgroundColor: beltColor }}
      />
      {/* Golden Door (Bab Al-Kaaba) */}
      <div
        className="absolute bottom-[10%] right-[16%] w-[22%] h-[38%] bg-amber-400 rounded-t-xs"
        style={{ backgroundColor: beltColor }}
      />
    </div>
  );
};

export default KaabaIcon;

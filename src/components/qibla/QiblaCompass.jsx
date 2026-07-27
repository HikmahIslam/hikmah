import React from 'react';
import { Compass, Navigation } from 'lucide-react';

export const QiblaCompass = ({ qiblaBearing, deviceHeading, isAligned }) => {
  // If device heading is available, rotate dial by -deviceHeading
  // Qibla arrow angle relative to dial is qiblaBearing
  const dialRotation = deviceHeading !== null ? -deviceHeading : 0;
  const qiblaArrowRotation = qiblaBearing || 0;

  const cardinalPoints = [
    { label: 'N', angle: 0, isMain: true },
    { label: 'NE', angle: 45, isMain: false },
    { label: 'E', angle: 90, isMain: true },
    { label: 'SE', angle: 135, isMain: false },
    { label: 'S', angle: 180, isMain: true },
    { label: 'SW', angle: 225, isMain: false },
    { label: 'W', angle: 270, isMain: true },
    { label: 'NW', angle: 315, isMain: false },
  ];

  return (
    <div className="relative w-full max-w-[260px] xs:max-w-[290px] sm:max-w-[320px] aspect-square mx-auto flex items-center justify-center p-2">
      {/* Outer Glowing Border Ring */}
      <div
        className={`absolute inset-0 rounded-full border-2 transition-colors duration-500 ${
          isAligned
            ? 'border-brand-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)] ring-4 ring-brand-emerald-500/20'
            : 'border-slate-200 dark:border-slate-800'
        }`}
      />

      {/* Main Rotating Dial */}
      <div
        className="relative w-full h-full rounded-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-inner flex items-center justify-center transition-transform duration-300 ease-out"
        style={{ transform: `rotate(${dialRotation}deg)` }}
      >
        {/* Ticks and Cardinal points */}
        {cardinalPoints.map(({ label, angle, isMain }) => (
          <div
            key={label}
            className="absolute inset-0 flex items-start justify-center pt-2 select-none"
            style={{ transform: `rotate(${angle}deg)` }}
          >
            <div className="flex flex-col items-center">
              <span
                className={`font-mono text-[10px] sm:text-xs font-bold ${
                  label === 'N'
                    ? 'text-rose-500 font-extrabold'
                    : isMain
                    ? 'text-slate-700 dark:text-slate-300'
                    : 'text-slate-400 dark:text-slate-600'
                }`}
                style={{ transform: `rotate(-${angle}deg)` }}
              >
                {label}
              </span>
              <div
                className={`w-0.5 mt-0.5 rounded-full ${
                  isMain ? 'h-2 bg-slate-400 dark:bg-slate-600' : 'h-1 bg-slate-300 dark:bg-slate-700'
                }`}
              />
            </div>
          </div>
        ))}

        {/* Inner Decorative Circle */}
        <div className="w-3/4 h-3/4 rounded-full border border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center">
          <div className="w-1/2 h-1/2 rounded-full border border-slate-100 dark:border-slate-800/60" />
        </div>

        {/* Qibla Direction Indicator Arrow */}
        {qiblaBearing !== null && (
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none transition-transform duration-300 ease-out"
            style={{ transform: `rotate(${qiblaArrowRotation}deg)` }}
          >
            {/* Pointer Line & Arrow */}
            <div className="relative w-full h-full flex flex-col items-center justify-start pt-3">
              {/* Kaaba Badge at Qibla Point */}
              <div
                className={`relative z-20 flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-brand-emerald-500 to-brand-emerald-700 text-white shadow-lg shadow-brand-emerald-500/30 transition-transform duration-300 ${
                  isAligned ? 'scale-110 ring-4 ring-brand-emerald-400/30' : ''
                }`}
                style={{ transform: `rotate(-${qiblaArrowRotation + dialRotation}deg)` }}
                title="Kaaba Direction (Qibla)"
              >
                <span className="text-base sm:text-lg select-none">🕋</span>
              </div>

              {/* Green Pointer Arrow Stem */}
              <div className="w-1.5 flex-1 bg-gradient-to-b from-brand-emerald-500/80 to-transparent rounded-full -mt-2" />
            </div>
          </div>
        )}

        {/* Center Point Badge */}
        <div className="absolute z-30 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-2 border-brand-emerald-500 shadow-md flex items-center justify-center">
          <Navigation
            className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 ${
              isAligned ? 'text-brand-emerald-400 dark:text-brand-emerald-600 animate-pulse' : 'text-brand-emerald-400'
            }`}
            style={{ transform: deviceHeading !== null ? `rotate(${deviceHeading}deg)` : 'none' }}
          />
        </div>
      </div>

      {/* Aligned Badge overlay */}
      {isAligned && (
        <div className="absolute -bottom-3 z-40 bg-brand-emerald-500 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5 animate-bounce">
          <span>✓ Facing Kaaba (Qibla)</span>
        </div>
      )}
    </div>
  );
};

export default QiblaCompass;

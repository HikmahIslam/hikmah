import React from 'react';

export const LoadingSpinner = ({ message = "Loading spiritual guidance..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-6 text-center animate-pulse-subtle">
      {/* Decorative Islamic Star Spinner */}
      <div className="relative flex items-center justify-center w-20 h-20">
        {/* Outer Ring */}
        <div className="absolute inset-0 border-4 border-brand-emerald-100 dark:border-brand-emerald-950 rounded-full"></div>
        {/* Rotating Segment */}
        <div className="absolute inset-0 border-4 border-transparent border-t-brand-emerald-600 dark:border-t-brand-emerald-500 rounded-full animate-spin"></div>
        {/* Center Glow */}
        <div className="w-8 h-8 rounded-full bg-brand-gold-500/20 dark:bg-brand-gold-500/10 flex items-center justify-center animate-ping">
          <div className="w-3 h-3 rounded-full bg-brand-gold-500"></div>
        </div>
      </div>
      
      <p className="mt-6 text-sm font-medium tracking-wide text-slate-500 dark:text-slate-400">
        {message}
      </p>
    </div>
  );
};

export default LoadingSpinner;

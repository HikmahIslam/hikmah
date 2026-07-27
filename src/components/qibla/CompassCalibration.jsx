import React from 'react';
import { RotateCw, Sparkles } from 'lucide-react';

export const CompassCalibration = () => {
  return (
    <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/60 rounded-2xl p-4 flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
      <div className="w-9 h-9 rounded-xl bg-brand-emerald-500/10 text-brand-emerald-600 dark:text-brand-emerald-400 flex items-center justify-center flex-shrink-0 animate-spin-slow">
        <RotateCw className="w-4 h-4" />
      </div>
      <div className="space-y-0.5">
        <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
          <span>Calibrate Compass Accuracy</span>
          <Sparkles className="w-3 h-3 text-amber-500" />
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
          Move your phone in a figure-eight (8) motion away from magnetic interference (laptops, metal) for peak accuracy.
        </p>
      </div>
    </div>
  );
};

export default CompassCalibration;

import React from 'react';
import { ShieldCheck, ShieldAlert } from 'lucide-react';

export const CompassAccuracy = ({ accuracy, isSupported, deviceHeading }) => {
  if (!isSupported) {
    return (
      <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200/40 dark:border-slate-800/40 rounded-xl px-3 py-2 flex items-center justify-between text-[11px] text-slate-500">
        <span>Sensor Orientation:</span>
        <span className="font-medium text-slate-600 dark:text-slate-400">Not supported (Using GPS bearing)</span>
      </div>
    );
  }

  let levelLabel = 'High';
  let levelColor = 'text-brand-emerald-600 dark:text-brand-emerald-400 bg-brand-emerald-50 dark:bg-brand-emerald-950/40 border-brand-emerald-200 dark:border-brand-emerald-800';

  if (accuracy !== null) {
    if (accuracy > 15) {
      levelLabel = 'Low';
      levelColor = 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800';
    } else if (accuracy > 5) {
      levelLabel = 'Medium';
      levelColor = 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800';
    }
  }

  return (
    <div className="flex items-center justify-between text-xs py-1">
      <span className="text-slate-500 dark:text-slate-400">Compass Accuracy:</span>
      <div className={`flex items-center gap-1 font-bold text-[10px] uppercase px-2 py-0.5 rounded-full border ${levelColor}`}>
        {accuracy !== null && accuracy > 15 ? (
          <ShieldAlert className="w-3 h-3" />
        ) : (
          <ShieldCheck className="w-3 h-3" />
        )}
        <span>{deviceHeading !== null ? `${levelLabel} Accuracy` : 'GPS Mode'}</span>
      </div>
    </div>
  );
};

export default CompassAccuracy;

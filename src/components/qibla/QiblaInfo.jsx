import React from 'react';
import { Compass, MapPin, Navigation, Globe2 } from 'lucide-react';

export const QiblaInfo = ({ qiblaData, deviceHeading, location, isAligned }) => {
  if (!qiblaData) return null;

  const { bearing, distanceKm, cardinal } = qiblaData;

  return (
    <div className="space-y-4">
      {/* Primary Direction Card */}
      <div className={`bg-white dark:bg-slate-900 border rounded-3xl p-5 sm:p-6 transition-all shadow-sm ${
        isAligned ? 'border-brand-emerald-500 ring-2 ring-brand-emerald-500/20 bg-brand-emerald-50/20 dark:bg-brand-emerald-950/20' : 'border-slate-200/60 dark:border-slate-800'
      }`}>
        <div className="grid grid-cols-2 gap-4">
          
          {/* Qibla Angle */}
          <div className="flex flex-col space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <Compass className="w-4 h-4 text-brand-emerald-500" />
              <span>Qibla Direction</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 dark:text-white">
                {bearing}°
              </span>
              <span className="text-xs font-bold text-brand-emerald-600 dark:text-brand-emerald-400 uppercase bg-brand-emerald-50 dark:bg-brand-emerald-950/50 px-2 py-0.5 rounded-lg border border-brand-emerald-200 dark:border-brand-emerald-800">
                {cardinal}
              </span>
            </div>
            <span className="text-[11px] text-slate-400">Relative to True North</span>
          </div>

          {/* Distance to Kaaba */}
          <div className="flex flex-col space-y-1 border-l border-slate-100 dark:border-slate-800/80 pl-4">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <Globe2 className="w-4 h-4 text-brand-emerald-500" />
              <span>Distance to Kaaba</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900 dark:text-white">
              {distanceKm ? distanceKm.toLocaleString() : '---'}
              <span className="text-xs font-normal text-slate-400 ml-1">km</span>
            </div>
            <span className="text-[11px] text-slate-400">Mecca, Saudi Arabia 🕋</span>
          </div>

        </div>

        {/* Live Device Heading Status */}
        {deviceHeading !== null && (
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <Navigation className="w-3.5 h-3.5 text-slate-400" />
              <span>Current Heading: <strong className="font-mono text-slate-800 dark:text-slate-200">{deviceHeading}°</strong></span>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              isAligned
                ? 'bg-brand-emerald-500 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
            }`}>
              {isAligned ? 'Aligned' : `Rotate ${Math.abs(bearing - deviceHeading)}°`}
            </span>
          </div>
        )}
      </div>

      {/* Location Badge */}
      {location && (
        <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/60 rounded-2xl px-4 py-3 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-brand-emerald-500 flex-shrink-0" />
            <span>GPS Location Detected</span>
          </div>
          <span className="font-mono text-[10px] text-slate-400 bg-white dark:bg-slate-850 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-800">
            {location.latitude.toFixed(2)}°, {location.longitude.toFixed(2)}°
          </span>
        </div>
      )}
    </div>
  );
};

export default QiblaInfo;

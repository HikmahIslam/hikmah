import React from 'react';
import { MapPin, Navigation, AlertTriangle, Loader2 } from 'lucide-react';

export const LocationPermission = ({
  permissionStatus,
  loading,
  error,
  onRequestLocation,
}) => {
  if (permissionStatus === 'granted' && !error) return null;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4 text-center">
      <div className="w-12 h-12 rounded-2xl bg-brand-emerald-50 dark:bg-brand-emerald-950/40 text-brand-emerald-600 dark:text-brand-emerald-400 flex items-center justify-center mx-auto">
        <MapPin className="w-6 h-6" />
      </div>

      <div className="space-y-1 max-w-sm mx-auto">
        <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
          {permissionStatus === 'denied'
            ? 'Location Access Disabled'
            : 'Enable Location to Find Qibla'}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          {permissionStatus === 'denied'
            ? 'Location access was denied in your browser. Please enable location permissions in browser settings to calculate exact Qibla direction.'
            : 'Allow location access so Hikmah can calculate the precise bearing to the Kaaba from your current position.'}
        </p>
      </div>

      {error && (
        <div className="flex items-center justify-center gap-2 text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/40 px-3 py-2 rounded-xl max-w-sm mx-auto">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {permissionStatus !== 'denied' && (
        <button
          onClick={onRequestLocation}
          disabled={loading}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-brand-emerald-500 hover:bg-brand-emerald-600 text-white font-semibold text-xs transition-all shadow-md shadow-brand-emerald-500/20 disabled:opacity-50 min-h-[44px]"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Detecting Location...</span>
            </>
          ) : (
            <>
              <Navigation className="w-4 h-4 fill-current" />
              <span>Enable Location Access</span>
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default LocationPermission;

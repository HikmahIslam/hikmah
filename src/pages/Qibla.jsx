import React, { useMemo } from 'react';
import { Compass, Navigation, MapPin, RefreshCw, AlertCircle, ShieldCheck, Smartphone } from 'lucide-react';
import { useGeolocation } from '../hooks/useGeolocation';
import { useDeviceOrientation } from '../hooks/useDeviceOrientation';
import { calculateQiblaDirection } from '../utils/qiblaCalculator';
import QiblaCompass from '../components/qibla/QiblaCompass';
import QiblaInfo from '../components/qibla/QiblaInfo';
import LocationPermission from '../components/qibla/LocationPermission';
import CompassCalibration from '../components/qibla/CompassCalibration';
import CompassAccuracy from '../components/qibla/CompassAccuracy';
import { useSettings } from '../context/SettingsContext';

export const Qibla = () => {
  const { t } = useSettings();
  const { location, error: geoError, loading: geoLoading, permissionStatus, requestLocation } = useGeolocation();
  const { heading, isSupported: sensorSupported, needIOSPermission, permissionGranted: sensorPermissionGranted, accuracy, requestIOSPermission } = useDeviceOrientation();

  // Calculate Qibla data when location is available
  const qiblaData = useMemo(() => {
    if (!location) return null;
    return calculateQiblaDirection(location.latitude, location.longitude);
  }, [location]);

  // Check if device compass is aligned within ±5 degrees of Qibla bearing
  const isAligned = useMemo(() => {
    if (!qiblaData || heading === null) return false;
    const diff = Math.abs(qiblaData.bearing - heading) % 360;
    return diff <= 5 || diff >= 355;
  }, [qiblaData, heading]);

  return (
    <div className="min-h-[85vh] py-6 sm:py-8 px-3 sm:px-6 max-w-6xl mx-auto space-y-6 sm:space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="text-center space-y-2 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-emerald-50 dark:bg-brand-emerald-950/40 text-brand-emerald-600 dark:text-brand-emerald-400 text-xs font-bold uppercase tracking-wider border border-brand-emerald-200 dark:border-brand-emerald-800/60">
          <Compass className="w-4 h-4" />
          <span>{t('qiblaFinder')}</span>
        </div>
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl md:text-4xl text-slate-900 dark:text-white tracking-tight">
          {t('qiblaHeaderTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
          {t('qiblaHeaderSub')}
        </p>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Compass & Central Display */}
        <div className="md:col-span-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-5 sm:p-7 shadow-sm space-y-6 text-center">
          
          {/* Compass Title */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              {t('qiblaDirection')}
            </span>
            <CompassAccuracy accuracy={accuracy} isSupported={sensorSupported} deviceHeading={heading} />
          </div>

          {/* Compass Widget */}
          <QiblaCompass
            qiblaBearing={qiblaData ? qiblaData.bearing : 285}
            deviceHeading={heading}
            isAligned={isAligned}
          />

          {/* iOS Compass Permission Request Button */}
          {needIOSPermission && !sensorPermissionGranted && (
            <div className="pt-2">
              <button
                onClick={requestIOSPermission}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-brand-emerald-500 hover:bg-brand-emerald-600 text-white font-semibold text-xs transition-all shadow-md shadow-brand-emerald-500/20"
              >
                <Smartphone className="w-4 h-4" />
                <span>Enable Compass Sensor (iOS)</span>
              </button>
            </div>
          )}

          {/* Fallback Notice when device orientation sensors are unavailable */}
          {!sensorSupported && (
            <div className="text-[11px] text-slate-500 bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-200/40 dark:border-slate-800/40 text-left rtl:text-right space-y-1">
              <div className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                <span>Static Compass Mode</span>
              </div>
              <p>Your device or browser doesn't provide live orientation data. Use the calculated Qibla angle of <strong>{qiblaData ? `${qiblaData.bearing}° ${qiblaData.cardinal}` : '285°'}</strong> relative to true North.</p>
            </div>
          )}

        </div>

        {/* Right Column: Location & Qibla Data */}
        <div className="md:col-span-6 space-y-6">
          
          {/* Location Request or Permission Card */}
          <LocationPermission
            permissionStatus={permissionStatus}
            loading={geoLoading}
            error={geoError}
            onRequestLocation={requestLocation}
          />

          {/* Qibla Details Card */}
          {location && (
            <QiblaInfo
              qiblaData={qiblaData}
              deviceHeading={heading}
              location={location}
              isAligned={isAligned}
            />
          )}

          {/* Calibration Instructions */}
          {heading !== null && <CompassCalibration />}

          {/* Guidance Info Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-emerald-500" />
              <span>How to Use the Qibla Compass</span>
            </h3>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-2 list-disc list-inside leading-relaxed">
              <li>Hold your mobile device flat in the palm of your hand.</li>
              <li>Keep away from magnetic sources such as computer screens or metal objects.</li>
              <li>Rotate your body slowly until the 🕋 Kaaba indicator turns bright green.</li>
              <li>When the indicator flashes green, you are directly facing the Qibla.</li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Qibla;

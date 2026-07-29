import React, { useMemo } from 'react';
import KaabaIcon from '../components/KaabaIcon';
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
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-emerald-50 dark:bg-brand-emerald-950/40 text-brand-emerald-600 dark:text-brand-emerald-400 text-xs font-bold uppercase tracking-wider border border-brand-emerald-200 dark:border-brand-emerald-800/60">
          <KaabaIcon className="w-5 h-5" />
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
        
        {/* Compass Column */}
        <div className="md:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200/60 dark:border-slate-800/80 shadow-md space-y-6 flex flex-col items-center">
          
          <LocationPermission
            location={location}
            loading={geoLoading}
            error={geoError}
            permissionStatus={permissionStatus}
            onRequestLocation={requestLocation}
          />

          <CompassCalibration
            needIOSPermission={needIOSPermission}
            sensorPermissionGranted={sensorPermissionGranted}
            onRequestIOSPermission={requestIOSPermission}
          />

          <QiblaCompass
            heading={heading}
            qiblaBearing={qiblaData?.bearing ?? null}
            isAligned={isAligned}
          />

          <CompassAccuracy
            sensorSupported={sensorSupported}
            accuracy={accuracy}
          />
        </div>

        {/* Info Column */}
        <div className="md:col-span-5 space-y-6">
          <QiblaInfo
            location={location}
            qiblaData={qiblaData}
            heading={heading}
            isAligned={isAligned}
          />
        </div>

      </div>

    </div>
  );
};

export default Qibla;

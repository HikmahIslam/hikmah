import { useState, useEffect, useCallback } from 'react';

export const useDeviceOrientation = () => {
  const [heading, setHeading] = useState(null);
  const [isSupported, setIsSupported] = useState(false);
  const [needIOSPermission, setNeedIOSPermission] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [accuracy, setAccuracy] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const supported = 'DeviceOrientationEvent' in window;
    setIsSupported(supported);

    if (
      supported &&
      typeof DeviceOrientationEvent.requestPermission === 'function'
    ) {
      setNeedIOSPermission(true);
    } else if (supported) {
      setPermissionGranted(true);
    }
  }, []);

  const handleOrientation = useCallback((event) => {
    let compassHeading = null;

    // iOS WebKit compass heading
    if (event.webkitCompassHeading !== undefined && event.webkitCompassHeading !== null) {
      compassHeading = event.webkitCompassHeading;
      if (event.webkitCompassAccuracy !== undefined) {
        setAccuracy(event.webkitCompassAccuracy);
      }
    }
    // Android / Standard deviceorientationabsolute or alpha
    else if (event.alpha !== undefined && event.alpha !== null) {
      if (event.absolute) {
        compassHeading = (360 - event.alpha) % 360;
      } else {
        compassHeading = (360 - event.alpha) % 360;
      }
    }

    if (compassHeading !== null) {
      setHeading(Math.round(compassHeading));
    }
  }, []);

  const requestIOSPermission = useCallback(async () => {
    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function'
    ) {
      try {
        const response = await DeviceOrientationEvent.requestPermission();
        if (response === 'granted') {
          setPermissionGranted(true);
          setNeedIOSPermission(false);
          window.addEventListener('deviceorientation', handleOrientation, true);
          return true;
        } else {
          setPermissionGranted(false);
          return false;
        }
      } catch (err) {
        console.error('iOS Orientation permission error:', err);
        return false;
      }
    }
    return false;
  }, [handleOrientation]);

  useEffect(() => {
    if (!permissionGranted || typeof window === 'undefined') return;

    // Prefer deviceorientationabsolute if available (Android true north)
    if ('ondeviceorientationabsolute' in window) {
      window.addEventListener('deviceorientationabsolute', handleOrientation, true);
    } else if ('ondeviceorientation' in window) {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }

    return () => {
      if ('ondeviceorientationabsolute' in window) {
        window.removeEventListener('deviceorientationabsolute', handleOrientation, true);
      }
      if ('ondeviceorientation' in window) {
        window.removeEventListener('deviceorientation', handleOrientation, true);
      }
    };
  }, [permissionGranted, handleOrientation]);

  return {
    heading,
    isSupported,
    needIOSPermission,
    permissionGranted,
    accuracy,
    requestIOSPermission,
  };
};

export default useDeviceOrientation;

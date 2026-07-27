import { useState, useEffect, useCallback } from 'react';

export const useGeolocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState('prompt'); // 'prompt' | 'granted' | 'denied' | 'unsupported'

  const checkPermissions = useCallback(async () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setPermissionStatus('unsupported');
      return;
    }

    if (navigator.permissions && navigator.permissions.query) {
      try {
        const result = await navigator.permissions.query({ name: 'geolocation' });
        setPermissionStatus(result.state);
        result.onchange = () => setPermissionStatus(result.state);
      } catch {
        // navigator.permissions query not supported on all browsers
      }
    }
  }, []);

  useEffect(() => {
    checkPermissions();
  }, [checkPermissions]);

  const requestLocation = useCallback(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setPermissionStatus('unsupported');
      return;
    }

    setLoading(true);
    setError(null);

    const options = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 60000,
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
        setLoading(false);
        setPermissionStatus('granted');
        setError(null);
      },
      (err) => {
        setLoading(false);
        let userMsg = 'Unable to retrieve location.';
        if (err.code === err.PERMISSION_DENIED) {
          userMsg = 'Location permission was denied. Please allow location access in browser settings.';
          setPermissionStatus('denied');
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          userMsg = 'Location information is currently unavailable.';
        } else if (err.code === err.TIMEOUT) {
          userMsg = 'Location request timed out. Please try again.';
        }
        setError(userMsg);
      },
      options
    );
  }, []);

  // Request on mount if permitted
  useEffect(() => {
    if (navigator.geolocation && permissionStatus === 'granted') {
      requestLocation();
    }
  }, [permissionStatus, requestLocation]);

  return {
    location,
    error,
    loading,
    permissionStatus,
    requestLocation,
  };
};

export default useGeolocation;

// src/utils/qiblaCalculator.js
// Kaaba exact coordinates in Mecca
export const KAABA_COORDS = {
  latitude: 21.422487,
  longitude: 39.826206,
};

const toRadians = (degrees) => (degrees * Math.PI) / 180;
const toDegrees = (radians) => (radians * 180) / Math.PI;

/**
 * Calculates initial Qibla bearing from user location to Kaaba using Great-Circle bearing formula.
 * @param {number} userLat - User latitude in decimal degrees
 * @param {number} userLng - User longitude in decimal degrees
 * @returns {number} Bearing in degrees (0 - 360) relative to True North
 */
export const calculateQiblaBearing = (userLat, userLng) => {
  const phi1 = toRadians(userLat);
  const phi2 = toRadians(KAABA_COORDS.latitude);
  const deltaLambda = toRadians(KAABA_COORDS.longitude - userLng);

  const y = Math.sin(deltaLambda) * Math.cos(phi2);
  const x =
    Math.cos(phi1) * Math.sin(phi2) -
    Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);

  let bearing = toDegrees(Math.atan2(y, x));
  return (bearing + 360) % 360;
};

/**
 * Calculates distance from user location to Kaaba in kilometers using Haversine formula.
 * @param {number} userLat - User latitude in decimal degrees
 * @param {number} userLng - User longitude in decimal degrees
 * @returns {number} Distance in kilometers
 */
export const calculateKaabaDistance = (userLat, userLng) => {
  const R = 6371; // Earth radius in km
  const phi1 = toRadians(userLat);
  const phi2 = toRadians(KAABA_COORDS.latitude);
  const deltaPhi = toRadians(KAABA_COORDS.latitude - userLat);
  const deltaLambda = toRadians(KAABA_COORDS.longitude - userLng);

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
};

/**
 * Converts degree bearing into 16-point cardinal compass direction string.
 * @param {number} bearing - Bearing in degrees (0 - 360)
 * @returns {string} Cardinal direction (e.g., 'N', 'NE', 'WNW')
 */
export const getCardinalDirection = (bearing) => {
  const normalized = (bearing + 360) % 360;
  const directions = [
    'N', 'NNE', 'NE', 'ENE',
    'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW',
    'W', 'WNW', 'NW', 'NNW'
  ];
  const index = Math.round(normalized / 22.5) % 16;
  return directions[index];
};

/**
 * Main helper returning formatted Qibla direction data.
 * @param {number} latitude 
 * @param {number} longitude 
 */
export const calculateQiblaDirection = (latitude, longitude) => {
  const bearing = calculateQiblaBearing(latitude, longitude);
  const distance = calculateKaabaDistance(latitude, longitude);
  const cardinal = getCardinalDirection(bearing);

  return {
    bearing: Math.round(bearing),
    distanceKm: distance,
    cardinal,
  };
};

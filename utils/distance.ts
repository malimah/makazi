import { Property } from '../types';

// Calculate distance between two points using the Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export function sortPropertiesByDistance(
  properties: Property[],
  userLat: number,
  userLon: number
): (Property & { distance: number })[] {
  return properties
    .map(property => ({
      ...property,
      distance: calculateDistance(
        userLat,
        userLon,
        property.coordinates?.latitude || 0,
        property.coordinates?.longitude || 0
      ),
    }))
    .sort((a, b) => a.distance - b.distance);
} 
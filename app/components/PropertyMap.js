import { Property } from '../../types';

// Export the types that both implementations need
export interface PropertyMapProps {
  properties: Property[];
  onMarkerPress?: (property: Property) => void;
}

// Fallback for platforms where PropertyMap is not implemented
export default function PropertyMap() {
  return null;
}

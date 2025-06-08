import { Property } from '../../types';

// Export the types that both implementations need
export interface PropertyMapProps {
  properties: Property[];
  onMarkerPress?: (property: Property) => void;
}

// Use platform-specific implementation
export { default } from './PropertyMap.web'; 
import React from 'react';
import { Platform } from 'react-native';
import { Property } from '../../types';

interface PropertyMapProps {
  properties: Property[];
  onMarkerPress: (property: Property) => void;
}

// Dynamic import based on platform
let PropertyMap;

if (Platform.OS === 'web') {
  PropertyMap = require('./PropertyMap.web').default;
} else {
  PropertyMap = require('./PropertyMap.native').default;
}

const PropertyMapComponent: React.FC<PropertyMapProps> = ({ properties, onMarkerPress }) => {
  // Your existing PropertyMap implementation here
  return null; // Replace with your actual implementation
};

export default PropertyMapComponent; 
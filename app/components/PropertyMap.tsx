import React from 'react';
import { Platform } from 'react-native';
import { Property } from '../../types';

interface PropertyMapProps {
  properties: Property[];
  onMarkerPress: (property: Property) => void;
}

// Dynamic import based on platform
<<<<<<< HEAD
let PropertyMap;

if (Platform.OS === 'web') {
  PropertyMap = require('./PropertyMap.web').default;
} else {
  PropertyMap = require('./PropertyMap.native').default;
}

const PropertyMapComponent: React.FC<PropertyMapProps> = ({ properties, onMarkerPress }) => {
  // Your existing PropertyMap implementation here
  return null; // Replace with your actual implementation
=======
const PropertyMapComponent: React.FC<PropertyMapProps> = ({ properties, onMarkerPress }) => {
  if (Platform.OS === 'web') {
    const WebPropertyMap = require('./WebPropertyMap').default;
    return <WebPropertyMap properties={properties} onMarkerPress={onMarkerPress} />;
  } else {
    const NativePropertyMap = require('./PropertyMap.native').default;
    return <NativePropertyMap properties={properties} onMarkerPress={onMarkerPress} />;
  }
>>>>>>> 7d4c60d015541a4f25748aad69741d4a011bf74c
};

export default PropertyMapComponent; 
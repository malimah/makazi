import React from 'react';
import { Platform } from 'react-native';
import { Property } from '../../types';

interface PropertyMapProps {
  properties: Property[];
  onMarkerPress: (property: Property) => void;
}

// Dynamic import based on platform
const PropertyMapComponent: React.FC<PropertyMapProps> = ({ properties, onMarkerPress }) => {
  if (Platform.OS === 'web') {
    const WebPropertyMap = require('./WebPropertyMap').default;
    return <WebPropertyMap properties={properties} onMarkerPress={onMarkerPress} />;
  } else {
    const NativePropertyMap = require('./PropertyMap.native').default;
    return <NativePropertyMap properties={properties} onMarkerPress={onMarkerPress} />;
  }
};

export default PropertyMapComponent; 
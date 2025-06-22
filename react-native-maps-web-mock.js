import React from 'react';
import { View, Text } from 'react-native';

// Mock MapView component
const MapView = ({ children, style, ...props }) => {
  return (
    <View style={[{ backgroundColor: '#e0e0e0', justifyContent: 'center', alignItems: 'center' }, style]}>
      <Text style={{ color: '#666', fontSize: 16 }}>Map View (Web Mock)</Text>
      {children}
    </View>
  );
};

// Mock Marker component
const Marker = ({ coordinate, title, description, onPress, ...props }) => {
  return (
    <View style={{ position: 'absolute', backgroundColor: 'red', borderRadius: 10, padding: 5 }}>
      <Text style={{ color: 'white', fontSize: 12 }}>{title || 'Marker'}</Text>
    </View>
  );
};

// Mock PROVIDER_GOOGLE constant
const PROVIDER_GOOGLE = 'google';

// Export the mock components
export default MapView;
export { Marker, PROVIDER_GOOGLE }; 
<<<<<<< HEAD
import { Property } from '../../types';

// Export the types that both implementations need
export interface PropertyMapProps {
=======
import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Property } from '../../types';

// Export the types that both implementations need
interface PropertyMapProps {
>>>>>>> 7d4c60d015541a4f25748aad69741d4a011bf74c
  properties: Property[];
  onMarkerPress?: (property: Property) => void;
}

<<<<<<< HEAD
// Use platform-specific implementation
export { default } from './PropertyMap.web'; 
=======
const PropertyMap: React.FC<PropertyMapProps> = ({ properties, onMarkerPress }) => {
  if (!properties || properties.length === 0) {
    return null;
  }

  const initialRegion = {
    latitude: properties[0]?.coordinates?.latitude || -6.776012,
    longitude: properties[0]?.coordinates?.longitude || 39.178326,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialRegion}
      >
        {properties.map((property) => (
          <Marker
            key={property.$id}
            coordinate={{
              latitude: property.coordinates.latitude,
              longitude: property.coordinates.longitude,
            }}
            title={property.title}
            description={property.description}
            onPress={() => onMarkerPress?.(property)}
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 300,
    marginVertical: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default PropertyMap; 
>>>>>>> 7d4c60d015541a4f25748aad69741d4a011bf74c

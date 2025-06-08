import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Property } from '../../types';
import { PropertyMapProps } from './PropertyMap';

// Tanzania bounds for map restriction
const TANZANIA_BOUNDS = {
  north: -1.0,  // Northernmost point
  south: -11.7, // Southernmost point
  west: 29.3,   // Westernmost point
  east: 40.4    // Easternmost point
};

// Center of Tanzania (approximate)
const TANZANIA_CENTER = {
  lat: -6.776012,
  lng: 39.178326
};

export default function PropertyMap({ properties, onMarkerPress }: PropertyMapProps) {
  const openDirections = (property: Property) => {
    const { latitude, longitude } = property.coordinates;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    window.open(url, '_blank');
  };

  // Calculate the center based on the first property or default to Tanzania center
  const center = properties.length > 0
    ? {
        lat: properties[0].coordinates.latitude,
        lng: properties[0].coordinates.longitude,
      }
    : TANZANIA_CENTER;

  const mapContainerStyle = {
    width: '100%',
    height: '100%',
  };

  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Google Maps API key is not configured</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={13}
          options={{
            restriction: {
              latLngBounds: TANZANIA_BOUNDS,
              strictBounds: true,
            },
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: true,
            mapTypeId: 'hybrid',
            styles: [
              {
                featureType: 'administrative.country',
                elementType: 'geometry',
                stylers: [{ visibility: 'on' }],
              },
              {
                featureType: 'administrative.province',
                elementType: 'geometry',
                stylers: [{ visibility: 'on' }],
              },
              {
                featureType: 'administrative.locality',
                elementType: 'labels',
                stylers: [{ visibility: 'on' }],
              },
            ],
          }}
        >
          {properties.map((property) => (
            <Marker
              key={property.$id}
              position={{
                lat: property.coordinates.latitude,
                lng: property.coordinates.longitude,
              }}
              title={property.title}
              onClick={() => {
                if (onMarkerPress) {
                  onMarkerPress(property);
                } else {
                  openDirections(property);
                }
              }}
            />
          ))}
        </GoogleMap>
      </LoadScript>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 300,
    width: '100%',
    marginVertical: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  errorText: {
    color: '#dc3545',
    textAlign: 'center',
    fontSize: 16,
  },
}); 
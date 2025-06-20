import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { Property } from '../../types';
import { sortPropertiesByDistance } from '../../utils/distance';
import { platformStyles, platformSelect } from '../../utils/platform';

export function PropertyList({
  properties,
  onDelete,
  getImageUri,
}: {
  properties: Property[];
  onDelete?: (id: string, imageId: string) => void;
  getImageUri: (imageId: string) => string | undefined;
}) {
  const [sortedProperties, setSortedProperties] = useState<(Property & { distance?: number })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sortByDistance = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setSortedProperties(properties);
          setLoading(false);
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const sorted = sortPropertiesByDistance(
          properties,
          location.coords.latitude,
          location.coords.longitude
        );
        setSortedProperties(sorted);
      } catch (error) {
        console.error('Error getting location:', error);
        setSortedProperties(properties);
      } finally {
        setLoading(false);
      }
    };

    sortByDistance();
  }, [properties]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1da1f2" />
        <Text style={styles.loadingText}>Finding nearest properties...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={sortedProperties}
      keyExtractor={item => item.$id}
      renderItem={({ item }) => (
        <View style={[styles.propertyCard]}>
          <Image
            source={{ uri: getImageUri(item.image) }}
            style={styles.propertyImage}
          />
          <View style={styles.propertyInfo}>
            <Text style={styles.propertyTitle}>{item.title}</Text>
            <Text style={styles.propertyLocation}>{item.location}</Text>
            <Text style={styles.propertyPrice}>Tsh {item.price}</Text>
            <Text style={styles.propertyDescription}>{item.description}</Text>
            {item.distance !== undefined && (
              <Text style={styles.distanceText}>
                {item.distance < 1 
                  ? `${Math.round(item.distance * 1000)}m away`
                  : `${item.distance.toFixed(1)}km away`}
              </Text>
            )}
          </View>
          {onDelete && (
            <View style={styles.propertyActions}>
              <Button title="Delete" onPress={() => onDelete(item.$id, item.image)} />
            </View>
          )}
        </View>
      )}
      ListEmptyComponent={
        <Text style={styles.emptyText}>No properties found in your area.</Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  propertyCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    flexDirection: 'row',
    ...platformStyles.shadow,
  },
  propertyImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginRight: 15,
  },
  propertyInfo: {
    flex: 1,
  },
  propertyTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 4,
    color: '#1a1a1a',
    fontFamily: platformStyles.fontFamily.bold,
  },
  propertyLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    fontFamily: platformStyles.fontFamily.regular,
  },
  propertyPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1da1f2',
    marginBottom: 4,
    fontFamily: platformStyles.fontFamily.bold,
  },
  propertyDescription: {
    fontSize: 14,
    color: '#444',
    marginBottom: 4,
    fontFamily: platformStyles.fontFamily.regular,
  },
  distanceText: {
    fontSize: 14,
    color: '#28a745',
    fontWeight: '500',
    fontFamily: platformStyles.fontFamily.medium,
  },
  propertyActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
    fontFamily: platformStyles.fontFamily.regular,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
    fontSize: 16,
    fontFamily: platformStyles.fontFamily.regular,
  },
});

export default PropertyList;
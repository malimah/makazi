import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { databases, storage } from '../../../utils/appwrite'; // Adjust path as needed

const DATABASE_ID = '67f17c880005ce23b265';
const COLLECTION_ID = '67f17cdf003bfcb842f5';
const BUCKET_ID = '67f17d6600155e4507e8';

export default function PropertyDetails() {
  const { id } = useLocalSearchParams(); // Get the property ID from the query parameters
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const response = await databases.getDocument(DATABASE_ID, COLLECTION_ID, id as string);
        setProperty(response);
      } catch (error) {
        console.error('Error fetching property details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPropertyDetails();
    }
  }, [id]);

  const getImageUrl = (imageId: string) =>
    storage.getFilePreview(BUCKET_ID, imageId).href;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={{ marginTop: 10 }}>Loading property details...</Text>
      </View>
    );
  }

  if (!property) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Property not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {property.imageId && (
        <Image source={{ uri: getImageUrl(property.imageId) }} style={styles.image} />
      )}
      <Text style={styles.title}>{property.propertyName}</Text>
      <Text style={styles.location}>{property.location}</Text>
      <Text style={styles.price}>${property.price}/month</Text>
      <Text style={styles.description}>{property.description}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#777',
    marginTop: 100,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  location: {
    fontSize: 18,
    color: '#777',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
  },
});
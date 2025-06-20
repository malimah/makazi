import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { databases, storage } from '../../utils/appwrite'; // Adjust the path
import { useRouter } from 'expo-router';

const DATABASE_ID = '67f17c880005ce23b265';
const COLLECTION_ID = '67f17cdf003bfcb842f5';
const BUCKET_ID = '67f17d6600155e4507e8';

export default function ViewProperties() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID);
        setProperties(response.documents);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const getImageUrl = (imageId: string) =>
    storage.getFilePreview(BUCKET_ID, imageId).href;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={{ marginTop: 10 }}>Loading properties...</Text>
      </View>
    );
  }

  if (properties.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>No properties found. Add some!</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Your Properties</Text>
      {properties.map((property, index) => (
        <TouchableOpacity
          key={index}
          style={styles.card}
          onPress={() => router.push({ pathname: '/view-properties', params: { id: property.$id } })}
        >
          {property.imageId && (
            <Image
              source={{ uri: getImageUrl(property.imageId) }}
              style={styles.image}
            />
          )}
          <View style={styles.cardContent}>
            <Text style={styles.title}>{property.propertyName}</Text>
            <Text style={styles.subTitle}>{property.location}</Text>
            <Text style={styles.price}>${property.price}/month</Text>
            <Text style={styles.engagement}>👥 3 tenants interested</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 180,
  },
  cardContent: {
    padding: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subTitle: {
    color: '#777',
    marginTop: 4,
  },
  price: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
  engagement: {
    marginTop: 6,
    fontStyle: 'italic',
    color: '#666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#777',
    marginTop: 100,
  },
});

import React, { useEffect, useState } from 'react';
import {
  View, Text, Image, ScrollView, StyleSheet, TouchableOpacity,
  ActivityIndicator, Alert, Platform, useWindowDimensions
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { databases, storage, account } from '../../utils/appwrite';
import WebPropertyMap from '../components/WebPropertyMap';
import RoomViewer3D from '../components/RoomViewer3D';
import FurnitureCatalog from '../components/FurnitureCatalog';

const DATABASE_ID = '68286dbc002bee374429';
const COLLECTION_ID = '68286efe002e00dbe24d';
const BUCKET_ID = '682b32c2003a04448deb';

export default function PropertyDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const { width } = useWindowDimensions();
  const isNarrow = Platform.OS === 'web' && width < 768;

  useEffect(() => {
    // Fetch user session
    account.get().then(setUser).catch(() => setUser(null));

    // Fetch property details
    const fetchProperty = async () => {
      try {
        const response = await databases.getDocument(
          DATABASE_ID,
          COLLECTION_ID,
          id as string
        );
        setProperty(response);
      } catch (error) {
        console.error('Error fetching property:', error);
        Alert.alert('Error', 'Failed to load property details');
        router.back();
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  const getImageUri = (imageId: string) => {
    if (!imageId) return undefined;
    return storage.getFileView(BUCKET_ID, imageId).toString();
  };

  const handleContactLandlord = () => {
    if (!user) {
      Alert.alert(
        'Sign Up Required',
        'You need to sign up as a tenant to contact the landlord.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign Up', onPress: () => router.push('/sign-up?userType=tenant') }
        ]
      );
      return;
    }
    router.push(`/contact-landlord/${id}`);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1da1f2" />
      </View>
    );
  }

  if (!property) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Property not found</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.content, isNarrow && styles.narrowContent]}>
        {/* Property Images */}
        <Image
          source={{ uri: getImageUri(property.imageUrl) }}
          style={styles.mainImage}
        />

        {/* 3D Room Viewer */}
        <View style={styles.roomViewerSection}>
          <Text style={styles.sectionTitle}>3D Room Preview</Text>
          <View style={styles.roomViewerContainer}>
            <RoomViewer3D
              dimensions={{
                width: property.dimensions?.width || 4, // Default dimensions if not provided
                length: property.dimensions?.length || 5,
                height: property.dimensions?.height || 2.8,
              }}
              furniture={property.furniture || []}
            />
          </View>
          <FurnitureCatalog
            onSelectFurniture={(furniture) => {
              // Handle furniture selection
              // This would update the furniture array in the room viewer
              console.log('Selected furniture:', furniture);
            }}
          />
        </View>

        {/* Property Title and Location */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>{property.title}</Text>
          <View style={styles.locationContainer}>
            <MaterialIcons name="location-on" size={20} color="#657786" />
            <Text style={styles.location}>{property.location}</Text>
          </View>
        </View>

        {/* Price and Status */}
        <View style={styles.priceSection}>
          <Text style={styles.price}>
            TSh {property.price.toLocaleString()}
            <Text style={styles.priceSubtext}> / month</Text>
          </Text>
          <View style={[
            styles.statusBadge,
            { backgroundColor: property.status === 'Available' ? '#e8f5fe' : '#ffe8e8' }
          ]}>
            <Text style={[
              styles.statusText,
              { color: property.status === 'Available' ? '#1da1f2' : '#ff4444' }
            ]}>
              {property.status}
            </Text>
          </View>
        </View>

        {/* Property Features */}
        <View style={styles.featuresSection}>
          <View style={styles.featureRow}>
            <View style={styles.feature}>
              <FontAwesome5 name="home" size={20} color="#1da1f2" />
              <Text style={styles.featureLabel}>{property.type}</Text>
            </View>
            {property.beds && (
              <View style={styles.feature}>
                <FontAwesome5 name="bed" size={20} color="#1da1f2" />
                <Text style={styles.featureLabel}>{property.beds} Beds</Text>
              </View>
            )}
            {property.baths && (
              <View style={styles.feature}>
                <FontAwesome5 name="bath" size={20} color="#1da1f2" />
                <Text style={styles.featureLabel}>{property.baths} Baths</Text>
              </View>
            )}
            {property.guests && (
              <View style={styles.feature}>
                <FontAwesome5 name="users" size={20} color="#1da1f2" />
                <Text style={styles.featureLabel}>Up to {property.guests} guests</Text>
              </View>
            )}
          </View>
        </View>

        {/* Description */}
        <View style={styles.descriptionSection}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{property.description}</Text>
        </View>

        {/* Map */}
        <View style={styles.mapSection}>
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.mapContainer}>
            <WebPropertyMap
              properties={[property]}
              initialRegion={{
                latitude: property.coordinates.latitude,
                longitude: property.coordinates.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              interactive={false}
            />
          </View>
        </View>

        {/* Contact Button */}
        {property.status === 'Available' && (
          <TouchableOpacity
            style={styles.contactButton}
            onPress={handleContactLandlord}
          >
            <Text style={styles.contactButtonText}>Contact Landlord</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f8fa',
  },
  content: {
    maxWidth: 1200,
    marginHorizontal: 'auto',
    width: '100%',
    padding: 20,
  },
  narrowContent: {
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#657786',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#1da1f2',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  mainImage: {
    width: '100%',
    height: 400,
    borderRadius: 12,
    marginBottom: 20,
  },
  headerSection: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#14171a',
    marginBottom: 10,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 16,
    color: '#657786',
    marginLeft: 5,
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1da1f2',
  },
  priceSubtext: {
    fontSize: 16,
    fontWeight: 'normal',
    color: '#657786',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  featuresSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      },
      default: {
        elevation: 2,
      },
    }),
  },
  featureRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -10,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    marginVertical: 5,
    minWidth: 120,
  },
  featureLabel: {
    marginLeft: 10,
    fontSize: 16,
    color: '#14171a',
  },
  descriptionSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      },
      default: {
        elevation: 2,
      },
    }),
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#14171a',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#657786',
  },
  mapSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      },
      default: {
        elevation: 2,
      },
    }),
  },
  mapContainer: {
    height: 300,
    borderRadius: 12,
    overflow: 'hidden',
  },
  contactButton: {
    backgroundColor: '#1da1f2',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  roomViewerSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      },
      default: {
        elevation: 2,
      },
    }),
  },
  roomViewerContainer: {
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f5f8fa',
  },
}); 
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { databases, storage, Query } from '../../utils/appwrite';
import { Property } from '../../types';
import WebPropertyMap from '../components/WebPropertyMap';

const BUCKET_ID = '682b32c2003a04448deb';
const DATABASE_ID = '68286dbc002bee374429';
const COLLECTION_ID = '68286efe002e00dbe24d';

type SortOption = 'price_asc' | 'price_desc' | 'newest' | 'oldest';

export default function TenantDashboard() {
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showMap, setShowMap] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const router = useRouter();
  const { width } = useWindowDimensions();
  const isNarrow = Platform.OS === 'web' && width < 768;

  const propertyTypes = ['All', 'Apartment', 'House', 'Villa', 'Office'];

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [Query.equal('status', 'Available')]
      );
      const availableProperties = (response.documents as unknown) as Property[];
      setProperties(availableProperties);
      setFilteredProperties(availableProperties);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const getImageUri = (imageId: string) => {
    if (!imageId) return undefined;
    return storage.getFileView(BUCKET_ID, imageId).toString();
  };

  useEffect(() => {
    filterAndSortProperties();
  }, [searchQuery, selectedType, sortBy, properties]);

  const filterAndSortProperties = () => {
    let filtered = [...properties];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply type filter
    if (selectedType !== 'All') {
      filtered = filtered.filter(property => property.type === selectedType);
    }

    // Apply sorting
    switch (sortBy) {
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
    }

    setFilteredProperties(filtered);
  };

  const toggleFavorite = (propertyId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(propertyId)) {
        newFavorites.delete(propertyId);
      } else {
        newFavorites.add(propertyId);
      }
      return newFavorites;
    });
  };

  const handlePropertyPress = (property: Property) => {
    setSelectedProperty(property);
    router.push(`/property-details/${property.$id}`);
  };

  const handleContactLandlord = (property: Property) => {
    // TODO: Implement contact landlord functionality
    router.push(`/contact-landlord/${property.$id}`);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1da1f2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Find Your Perfect Home</Text>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by location, title, or description..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity
            style={styles.mapToggle}
            onPress={() => setShowMap(!showMap)}
          >
            <Ionicons
              name={showMap ? "list" : "map"}
              size={24}
              color="#1da1f2"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.typeFilters}
        >
          {propertyTypes.map(type => (
            <TouchableOpacity
              key={type}
              style={[
                styles.typeFilter,
                selectedType === type && styles.typeFilterActive
              ]}
              onPress={() => setSelectedType(type)}
            >
              <Text style={[
                styles.typeFilterText,
                selectedType === type && styles.typeFilterTextActive
              ]}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.sortContainer}>
          <Text style={styles.sortLabel}>Sort by:</Text>
          <TouchableOpacity
            style={styles.sortButton}
            onPress={() => {
              const options: SortOption[] = ['newest', 'oldest', 'price_asc', 'price_desc'];
              const currentIndex = options.indexOf(sortBy);
              const nextIndex = (currentIndex + 1) % options.length;
              setSortBy(options[nextIndex]);
            }}
          >
            <Text style={styles.sortButtonText}>
              {sortBy === 'newest' ? 'Newest First' :
               sortBy === 'oldest' ? 'Oldest First' :
               sortBy === 'price_asc' ? 'Price: Low to High' :
               'Price: High to Low'}
            </Text>
            <MaterialIcons name="sort" size={20} color="#1da1f2" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      {showMap ? (
        <View style={styles.mapContainer}>
          <WebPropertyMap
            properties={filteredProperties}
            onMarkerPress={handlePropertyPress}
          />
        </View>
      ) : (
        <ScrollView style={styles.propertiesList}>
          <View style={styles.propertiesGrid}>
            {filteredProperties.map(property => (
              <TouchableOpacity
                key={property.$id}
                style={styles.propertyCard}
                onPress={() => handlePropertyPress(property)}
              >
                <Image
                  source={{ uri: getImageUri(property.imageUrl) }}
                  style={styles.propertyImage}
                />
                <TouchableOpacity
                  style={styles.favoriteButton}
                  onPress={() => toggleFavorite(property.$id)}
                >
                  <FontAwesome5
                    name={favorites.has(property.$id) ? "heart" : "heart"}
                    size={20}
                    color={favorites.has(property.$id) ? "#ff4444" : "#ffffff"}
                    solid={favorites.has(property.$id)}
                  />
                </TouchableOpacity>
                <View style={styles.propertyInfo}>
                  <Text style={styles.propertyTitle}>{property.title}</Text>
                  <Text style={styles.propertyLocation}>{property.location}</Text>
                  <Text style={styles.propertyPrice}>
                    TSh {property.price.toLocaleString()}
                  </Text>
                  <View style={styles.propertyDetails}>
                    <Text style={styles.propertyType}>{property.type}</Text>
                    {property.beds && (
                      <Text style={styles.propertyFeature}>
                        <FontAwesome5 name="bed" size={12} /> {property.beds}
                      </Text>
                    )}
                    {property.baths && (
                      <Text style={styles.propertyFeature}>
                        <FontAwesome5 name="bath" size={12} /> {property.baths}
                      </Text>
                    )}
                  </View>
                  <TouchableOpacity
                    style={styles.contactButton}
                    onPress={() => handleContactLandlord(property)}
                  >
                    <Text style={styles.contactButtonText}>Contact Landlord</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f8fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#f5f8fa',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  mapToggle: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f5f8fa',
  },
  filtersContainer: {
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  typeFilters: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  typeFilter: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f8fa',
    marginRight: 10,
  },
  typeFilterActive: {
    backgroundColor: '#1da1f2',
  },
  typeFilterText: {
    color: '#657786',
  },
  typeFilterTextActive: {
    color: '#fff',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortLabel: {
    color: '#657786',
    marginRight: 10,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f8fa',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  sortButtonText: {
    color: '#1da1f2',
    marginRight: 5,
  },
  mapContainer: {
    flex: 1,
    height: '100%',
  },
  propertiesList: {
    flex: 1,
  },
  propertiesGrid: {
    padding: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  propertyCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
    ...Platform.select({
      web: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      },
      default: {
        elevation: 2,
      },
    }),
  },
  propertyImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 8,
    borderRadius: 20,
  },
  propertyInfo: {
    padding: 15,
  },
  propertyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 5,
  },
  propertyLocation: {
    fontSize: 14,
    color: '#657786',
    marginBottom: 5,
  },
  propertyPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1da1f2',
    marginBottom: 10,
  },
  propertyDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  propertyType: {
    backgroundColor: '#e8f5fe',
    color: '#1da1f2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 10,
    fontSize: 12,
  },
  propertyFeature: {
    color: '#657786',
    marginRight: 10,
    fontSize: 12,
  },
  contactButton: {
    backgroundColor: '#1da1f2',
    paddingVertical: 8,
    borderRadius: 5,
    alignItems: 'center',
  },
  contactButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
}); 
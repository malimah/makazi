import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator, 
  Modal, ScrollView, Alert, TextInput, Platform, useWindowDimensions
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { databases, storage, account } from '../../utils/appwrite';
import { useRouter } from 'expo-router';
import WebPropertyMap from '../components/WebPropertyMap';
import { Query } from 'appwrite';

const DATABASE_ID = '68286dbc002bee374429';
const COLLECTION_ID = '68286efe002e00dbe24d';
const BUCKET_ID = '682b32c2003a04448deb';
const PAGE_LIMIT = 10;

type SortOption = 'price_asc' | 'price_desc' | 'newest' | 'oldest';

export default function ExploreScreen() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<any | null>(null);
  const [user, setUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showMap, setShowMap] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const router = useRouter();
  const { width } = useWindowDimensions();
  const isNarrow = Platform.OS === 'web' && width < 768;

  const propertyTypes = ['All', 'Apartment', 'House', 'Villa', 'Office'];

  // Fetch user session
  useEffect(() => {
    account.get().then(setUser).catch(() => setUser(null));
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async (offset = 0) => {
    if (offset === 0) setLoading(true);
    else setLoadingMore(true);
    try {
      const res = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [
          Query.equal('status', 'Available'),
          Query.limit(PAGE_LIMIT),
          Query.offset(offset)
        ]
      );
      
      let newProperties = res.documents;
      
      // Apply search filter
      if (searchQuery) {
        newProperties = newProperties.filter((property: any) =>
          property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          property.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          property.location.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Apply type filter
      if (selectedType !== 'All') {
        newProperties = newProperties.filter((property: any) => 
          property.type === selectedType
        );
      }

      // Apply sorting
      newProperties.sort((a: any, b: any) => {
        switch (sortBy) {
          case 'price_asc':
            return a.price - b.price;
          case 'price_desc':
            return b.price - a.price;
          case 'newest':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          case 'oldest':
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          default:
            return 0;
        }
      });

      if (offset === 0) {
        setProperties(newProperties);
      } else {
        setProperties(prev => [...prev, ...newProperties]);
      }
      setHasMore(newProperties.length === PAGE_LIMIT);
    } catch (error) {
      console.log('Error fetching properties:', error);
      Alert.alert('Error', 'Failed to fetch properties. Please try again.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleEndReached = () => {
    if (!loadingMore && hasMore) {
      fetchProperties(properties.length);
    }
  };

  const getImageUri = (imageId: string) => {
    if (!imageId) return undefined;
    return storage.getFileView(BUCKET_ID, imageId).toString();
  };

  const handleRequestToRent = (property: any) => {
    if (!user) {
      Alert.alert(
        'Sign Up Required',
        'You need to sign up as a tenant to request this property.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign Up', onPress: () => router.push('/sign-up?userType=tenant') }
        ]
      );
      return;
    }
    router.push(`/contact-landlord/${property.$id}`);
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

  if (loading && properties.length === 0) {
    return (
      <View style={styles.centered}>
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
            onChangeText={(text) => {
              setSearchQuery(text);
              fetchProperties();
            }}
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
              onPress={() => {
                setSelectedType(type);
                fetchProperties();
              }}
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
              fetchProperties();
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
            properties={properties}
            onMarkerPress={(property) => setSelectedProperty(property)}
          />
        </View>
      ) : (
        <FlatList
          data={properties}
          keyExtractor={item => item.$id}
          numColumns={isNarrow ? 1 : 2}
          columnWrapperStyle={!isNarrow && styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[styles.propertyCard, isNarrow && styles.propertyCardFullWidth]} 
              onPress={() => setSelectedProperty(item)}
            >
              <Image source={{ uri: getImageUri(item.imageUrl) }} style={styles.propertyImage} />
              <TouchableOpacity
                style={styles.favoriteButton}
                onPress={() => toggleFavorite(item.$id)}
              >
                <FontAwesome5
                  name="heart"
                  size={20}
                  color={favorites.has(item.$id) ? "#ff4444" : "#ffffff"}
                  solid={favorites.has(item.$id)}
                />
              </TouchableOpacity>
              <View style={styles.propertyInfo}>
                <Text style={styles.propertyTitle}>{item.title}</Text>
                <Text style={styles.propertyLocation}>{item.location}</Text>
                <Text style={styles.propertyPrice}>
                  TSh {item.price.toLocaleString()}
                </Text>
                <View style={styles.propertyDetails}>
                  <Text style={styles.propertyType}>{item.type}</Text>
                  {item.beds && (
                    <Text style={styles.propertyFeature}>
                      <FontAwesome5 name="bed" size={12} /> {item.beds}
                    </Text>
                  )}
                  {item.baths && (
                    <Text style={styles.propertyFeature}>
                      <FontAwesome5 name="bath" size={12} /> {item.baths}
                    </Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          )}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No properties found.</Text>
          }
          ListFooterComponent={
            loadingMore ? <ActivityIndicator size="small" color="#1da1f2" /> : null
          }
        />
      )}

      {/* Property Details Modal */}
      <Modal visible={!!selectedProperty} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Image 
                source={{ uri: getImageUri(selectedProperty?.imageUrl) }} 
                style={styles.modalImage} 
              />
              <TouchableOpacity
                style={styles.modalFavoriteButton}
                onPress={() => selectedProperty && toggleFavorite(selectedProperty.$id)}
              >
                <FontAwesome5
                  name="heart"
                  size={24}
                  color={selectedProperty && favorites.has(selectedProperty.$id) ? "#ff4444" : "#ffffff"}
                  solid={selectedProperty && favorites.has(selectedProperty.$id)}
                />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>{selectedProperty?.title}</Text>
              <Text style={styles.modalLocation}>{selectedProperty?.location}</Text>
              <Text style={styles.modalPrice}>
                TSh {selectedProperty?.price.toLocaleString()}
              </Text>
              <View style={styles.modalFeatures}>
                <Text style={styles.modalType}>{selectedProperty?.type}</Text>
                {selectedProperty?.beds && (
                  <Text style={styles.modalFeature}>
                    <FontAwesome5 name="bed" size={14} /> {selectedProperty.beds} Beds
                  </Text>
                )}
                {selectedProperty?.baths && (
                  <Text style={styles.modalFeature}>
                    <FontAwesome5 name="bath" size={14} /> {selectedProperty.baths} Baths
                  </Text>
                )}
              </View>
              <Text style={styles.modalDescription}>{selectedProperty?.description}</Text>
              
              <TouchableOpacity
                style={styles.contactButton}
                onPress={() => selectedProperty && handleRequestToRent(selectedProperty)}
              >
                <Text style={styles.contactButtonText}>Contact Landlord</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.closeButton]}
                onPress={() => setSelectedProperty(null)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f8fa',
  },
  centered: {
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
  listContent: {
    padding: 10,
  },
  columnWrapper: {
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
  propertyCardFullWidth: {
    width: '100%',
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
    flexWrap: 'wrap',
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
  emptyText: {
    textAlign: 'center',
    color: '#657786',
    marginTop: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '90%',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      },
      default: {
        elevation: 5,
      },
    }),
  },
  modalImage: {
    width: '100%',
    height: 250,
    borderRadius: 8,
    marginBottom: 15,
  },
  modalFavoriteButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 10,
    borderRadius: 25,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  modalLocation: {
    fontSize: 16,
    color: '#657786',
    marginBottom: 8,
  },
  modalPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1da1f2',
    marginBottom: 15,
  },
  modalFeatures: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  modalType: {
    backgroundColor: '#e8f5fe',
    color: '#1da1f2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 12,
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalFeature: {
    color: '#657786',
    marginRight: 12,
    fontSize: 14,
  },
  modalDescription: {
    fontSize: 16,
    color: '#14171a',
    lineHeight: 24,
    marginBottom: 20,
  },
  contactButton: {
    backgroundColor: '#1da1f2',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#f5f8fa',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#657786',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
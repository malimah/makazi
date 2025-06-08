import React, { useState, useEffect } from 'react';
import { View, Text, Image, FlatList, TouchableOpacity, StyleSheet, Platform, Alert, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5, Feather, AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { account, databases, storage, ID } from '../../utils/appwrite';
import { Property } from '../../types';

const BUCKET_ID = '682b32c2003a04448deb';
const DATABASE_ID = '68286dbc002bee374429';
const COLLECTION_ID = '68286efe002e00dbe24d';

// Replace local image with network placeholder
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/800x600.png?text=Property+Image';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f8fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e4e8',
  },
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 5,
    color: '#1da1f2',
  },
  notificationContainer: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    right: -2,
    top: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22c55e',
  },
  titleContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e4e8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#f0f0f0',
  },
  filterButtonActive: {
    backgroundColor: '#1da1f2',
  },
  filterText: {
    color: '#666',
  },
  filterTextActive: {
    color: '#fff',
  },
  propertyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e1e4e8',
  },
  imageContainer: {
    position: 'relative',
  },
  propertyImage: {
    width: '100%',
    height: 200,
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusAvailable: {
    backgroundColor: 'rgba(34, 197, 94, 0.9)',
  },
  statusOccupied: {
    backgroundColor: 'rgba(234, 88, 12, 0.9)',
  },
  priceBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(29, 161, 242, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  propertyDetails: {
    padding: 16,
  },
  propertyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  propertyLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  amenitiesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#e1e4e8',
    paddingTop: 12,
    marginTop: 12,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amenityText: {
    marginLeft: 6,
    color: '#666',
    fontSize: 14,
  },
  addButton: {
    position: 'absolute',
    right: 30,
    bottom: 30,
    backgroundColor: '#1da1f2',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
      },
    }),
  },
});

export default function MyPropertyScreen() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [properties, setProperties] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const filters = ['All', 'Available', 'Occupied', 'Under Maintenance'];

  // Fetch user and properties
  useEffect(() => {
    const fetchUserAndProperties = async () => {
      try {
        // Get current user
        const currentUser = await account.get();
        setUser(currentUser);

        // Fetch properties
        const response = await databases.listDocuments(
          DATABASE_ID,
          COLLECTION_ID,
          [
            // Add query to filter by landlordId if needed
            // Query.equal('landlordId', currentUser.$id)
          ]
        );
        
        setProperties(response.documents);
      } catch (error) {
        console.error('Error fetching data:', error);
        Alert.alert('Error', 'Failed to load properties');
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndProperties();
  }, []);

  // Filter properties based on status
  const filteredProperties = properties.filter(property => {
    if (activeFilter === 'All') return true;
    return property.status === activeFilter;
  });

  // Get image URL from storage
  const getImageUri = (imageId) => {
    if (!imageId) return undefined;
    return storage.getFileView(BUCKET_ID, imageId).toString();
  };

  // Handle property deletion
  const handleDeleteProperty = async (id, imageId) => {
    Alert.alert(
      'Delete Property',
      'Are you sure you want to delete this property?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
              if (imageId) {
                await storage.deleteFile(BUCKET_ID, imageId);
              }
              setProperties(properties.filter(p => p.$id !== id));
              Alert.alert('Success', 'Property deleted successfully');
            } catch (error) {
              console.error('Error deleting property:', error);
              Alert.alert('Error', 'Failed to delete property');
            }
          }
        }
      ]
    );
  };

  // Handle property status update
  const handleUpdateStatus = async (property, newStatus) => {
    try {
      const updatedProperty = await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        property.$id,
        {
          ...property,
          status: newStatus
        }
      );

      setProperties(properties.map(p => 
        p.$id === property.$id ? updatedProperty : p
      ));

      Alert.alert('Success', 'Property status updated successfully');
    } catch (error) {
      console.error('Error updating property status:', error);
      Alert.alert('Error', 'Failed to update property status');
    }
  };

  const renderPropertyCard = ({ item }) => (
    <View style={styles.propertyCard}>
      <View style={styles.imageContainer}>
        <Image
          source={getImageUri(item.imageUrl) ? { uri: getImageUri(item.imageUrl) } : { uri: PLACEHOLDER_IMAGE }}
          style={styles.propertyImage}
          resizeMode="cover"
        />
        <View style={[
          styles.statusBadge,
          item.status === 'Available' ? styles.statusAvailable : styles.statusOccupied
        ]}>
          <Text style={styles.badgeText}>{item.status || 'Available'}</Text>
        </View>
        <View style={styles.priceBadge}>
          <Text style={styles.badgeText}>${item.price}/Month</Text>
        </View>
      </View>
      <View style={styles.propertyDetails}>
        <Text style={styles.propertyName}>{item.title}</Text>
        <Text style={styles.propertyLocation}>
          <Ionicons name="location-outline" size={14} color="#666" /> {item.location}
        </Text>
        <View style={styles.amenitiesRow}>
          <View style={styles.amenityItem}>
            <MaterialCommunityIcons name="bed" size={20} color="#1da1f2" />
            <Text style={styles.amenityText}>{item.beds || 0} Beds</Text>
          </View>
          <View style={styles.amenityItem}>
            <MaterialCommunityIcons name="shower" size={20} color="#1da1f2" />
            <Text style={styles.amenityText}>{item.baths || 0} Baths</Text>
          </View>
          <View style={styles.amenityItem}>
            <FontAwesome5 name="user-friends" size={16} color="#1da1f2" />
            <Text style={styles.amenityText}>{item.guests || 0} Guests</Text>
          </View>
        </View>
        
        {/* Property Actions */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 12,
          paddingTop: 12,
          borderTopWidth: 1,
          borderTopColor: '#e1e4e8'
        }}>
          <TouchableOpacity
            onPress={() => router.push(`/landlord-dashboard/property/${item.$id}`)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 8,
              backgroundColor: '#1da1f2',
              borderRadius: 6,
            }}
          >
            <Feather name="edit" size={16} color="#fff" />
            <Text style={{ color: '#fff', marginLeft: 4, fontWeight: '500' }}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              const newStatus = item.status === 'Available' ? 'Occupied' : 'Available';
              handleUpdateStatus(item, newStatus);
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 8,
              backgroundColor: '#22c55e',
              borderRadius: 6,
            }}
          >
            <MaterialCommunityIcons 
              name={item.status === 'Available' ? 'home-lock' : 'home-unlock'} 
              size={16} 
              color="#fff" 
            />
            <Text style={{ color: '#fff', marginLeft: 4, fontWeight: '500' }}>
              {item.status === 'Available' ? 'Mark Occupied' : 'Mark Available'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleDeleteProperty(item.$id, item.imageUrl)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 8,
              backgroundColor: '#ef4444',
              borderRadius: 6,
            }}
          >
            <Feather name="trash-2" size={16} color="#fff" />
            <Text style={{ color: '#fff', marginLeft: 4, fontWeight: '500' }}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // Loading state
  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Loading properties...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1da1f2" />
        </TouchableOpacity>
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={20} color="#1da1f2" />
          <Text style={styles.locationText}>Ontario, Canada</Text>
        </View>
        <View style={styles.notificationContainer}>
          <Ionicons name="notifications-outline" size={24} color="#1da1f2" />
          <View style={styles.notificationBadge} />
        </View>
      </View>

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>My Properties</Text>
      </View>

      {/* Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              activeFilter === filter && styles.filterButtonActive,
            ]}
            onPress={() => setActiveFilter(filter)}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === filter && styles.filterTextActive,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Property List */}
      <FlatList
        data={filteredProperties}
        renderItem={renderPropertyCard}
        keyExtractor={item => item.$id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ color: '#666', fontSize: 16 }}>
              No properties found. Add your first property!
            </Text>
          </View>
        }
      />

      {/* Add Button */}
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => router.push('/landlord-dashboard/new-property')}
      >
        <AntDesign name="plus" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
} 
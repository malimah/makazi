import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { tenantsAPI, storage, databases } from '../../utils/appwrite';
import { Tenant, Property } from '../../types';

const BUCKET_ID = '682b32c2003a04448deb';
const DATABASE_ID = '68286dbc002bee374429';
const COLLECTION_ID = '68286efe002e00dbe24d';

export default function TenantDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchTenantDetails();
  }, [id]);

  const fetchTenantDetails = async () => {
    try {
      setLoading(true);
      // Fetch tenant details
      const tenantResponse = await tenantsAPI.get(id as string);
      const tenantData = tenantResponse as unknown as Tenant;
      setTenant(tenantData);

      // If tenant has a property, fetch property details
      if (tenantData.propertyId) {
        const propertyResponse = await databases.getDocument(
          DATABASE_ID,
          COLLECTION_ID,
          tenantData.propertyId
        );
        setProperty(propertyResponse as unknown as Property);
      }
    } catch (error) {
      console.error('Error fetching tenant details:', error);
      Alert.alert('Error', 'Failed to load tenant details');
    } finally {
      setLoading(false);
    }
  };

  const getProfileImage = (imageId: string | undefined) => {
    if (!imageId) return undefined;
    return storage.getFileView(BUCKET_ID, imageId).toString();
  };

  const handleEditTenant = () => {
    router.push(`/tenants/edit/${id}`);
  };

  const handleDeleteTenant = async () => {
    Alert.alert(
      'Delete Tenant',
      'Are you sure you want to delete this tenant? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await tenantsAPI.delete(id as string);
              router.replace('/tenants');
            } catch (error) {
              console.error('Error deleting tenant:', error);
              Alert.alert('Error', 'Failed to delete tenant');
            }
          },
        },
      ]
    );
  };

  const handleUnassignProperty = async () => {
    Alert.alert(
      'Unassign Property',
      'Are you sure you want to unassign this tenant from their property?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unassign',
          style: 'destructive',
          onPress: async () => {
            try {
              await tenantsAPI.update(id as string, {
                propertyId: null,
                status: 'Former',
              });
              fetchTenantDetails(); // Refresh the data
            } catch (error) {
              console.error('Error unassigning property:', error);
              Alert.alert('Error', 'Failed to unassign property');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1da1f2" />
      </View>
    );
  }

  if (!tenant) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Tenant not found</Text>
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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#1da1f2" />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={handleEditTenant}
          >
            <Ionicons name="create-outline" size={24} color="#1da1f2" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDeleteTenant}
          >
            <Ionicons name="trash-outline" size={24} color="#dc3545" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          {tenant.profileImage ? (
            <Image
              source={{ uri: getProfileImage(tenant.profileImage) }}
              style={styles.avatar}
            />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarText}>
                {tenant.name[0].toUpperCase()}
              </Text>
            </View>
          )}
          <View
            style={[
              styles.statusDot,
              tenant.status === 'Active'
                ? styles.statusActive
                : styles.statusInactive,
            ]}
          />
        </View>
        <Text style={styles.tenantName}>{tenant.name}</Text>
        <Text style={[
          styles.statusBadge,
          tenant.status === 'Active'
            ? styles.statusBadgeActive
            : styles.statusBadgeInactive,
        ]}>
          {tenant.status}
        </Text>
      </View>

      {/* Contact Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <MaterialIcons name="email" size={20} color="#666" />
            <Text style={styles.infoText}>{tenant.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialIcons name="phone" size={20} color="#666" />
            <Text style={styles.infoText}>{tenant.phone}</Text>
          </View>
          {tenant.emergencyContact && (
            <View style={styles.infoRow}>
              <MaterialIcons name="emergency" size={20} color="#666" />
              <Text style={styles.infoText}>
                Emergency: {tenant.emergencyContact}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Lease Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Lease Information</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <FontAwesome5 name="calendar-alt" size={20} color="#666" />
            <Text style={styles.infoText}>
              Move In: {new Date(tenant.moveInDate).toLocaleDateString()}
            </Text>
          </View>
          {tenant.leaseEndDate && (
            <View style={styles.infoRow}>
              <FontAwesome5 name="calendar-check" size={20} color="#666" />
              <Text style={styles.infoText}>
                Lease End: {new Date(tenant.leaseEndDate).toLocaleDateString()}
              </Text>
            </View>
          )}
          {tenant.rentAmount && (
            <View style={styles.infoRow}>
              <FontAwesome5 name="money-bill-wave" size={20} color="#666" />
              <Text style={styles.infoText}>
                Rent: Tsh {tenant.rentAmount.toLocaleString()}/month
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Property Information */}
      {property && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Assigned Property</Text>
          <View style={styles.propertyCard}>
            <Image
              source={{ uri: getProfileImage(property.imageUrl) }}
              style={styles.propertyImage}
            />
            <View style={styles.propertyInfo}>
              <Text style={styles.propertyTitle}>{property.title}</Text>
              <Text style={styles.propertyLocation}>{property.location}</Text>
              <TouchableOpacity
                style={styles.unassignButton}
                onPress={handleUnassignProperty}
              >
                <Text style={styles.unassignButtonText}>Unassign Property</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#dc3545',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 15,
  },
  backButton: {
    padding: 10,
  },
  editButton: {
    padding: 10,
  },
  deleteButton: {
    padding: 10,
  },
  profileSection: {
    alignItems: 'center',
    padding: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    backgroundColor: '#e8f5fe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1da1f2',
  },
  statusDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 4,
    borderColor: '#fff',
  },
  statusActive: {
    backgroundColor: '#28a745',
  },
  statusInactive: {
    backgroundColor: '#dc3545',
  },
  tenantName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 10,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    fontSize: 14,
    fontWeight: '600',
  },
  statusBadgeActive: {
    backgroundColor: '#e8f5fe',
    color: '#1da1f2',
  },
  statusBadgeInactive: {
    backgroundColor: '#ffebee',
    color: '#dc3545',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 15,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      },
      default: {
        elevation: 2,
      },
    }),
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#444',
  },
  propertyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
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
  },
  propertyInfo: {
    padding: 15,
  },
  propertyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 5,
  },
  propertyLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  unassignButton: {
    backgroundColor: '#ffebee',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  unassignButtonText: {
    color: '#dc3545',
    fontWeight: '600',
  },
  backButtonText: {
    color: '#1da1f2',
    fontSize: 16,
    fontWeight: '600',
  },
}); 
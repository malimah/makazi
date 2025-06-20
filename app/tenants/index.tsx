import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { account, tenantsAPI, storage } from '../../utils/appwrite';
import { Tenant } from '../../types';

const BUCKET_ID = '682b32c2003a04448deb';

export default function TenantsScreen() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { action } = useLocalSearchParams();
  const isRemindMode = action === 'remind';

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      setLoading(true);
      const response = await tenantsAPI.list();
      setTenants((response.documents as unknown) as Tenant[]);
    } catch (error) {
      console.error('Error fetching tenants:', error);
      Alert.alert('Error', 'Failed to load tenants');
    } finally {
      setLoading(false);
    }
  };

  const getProfileImage = (imageId: string | undefined) => {
    if (!imageId) return undefined;
    return storage.getFileView(BUCKET_ID, imageId).toString();
  };

  const handleAddTenant = () => {
    router.push('/tenants/add');
  };

  const handleTenantPress = (tenant: Tenant) => {
    if (isRemindMode) {
      Alert.alert(
        'Send Reminder',
        `Are you sure you want to send a payment reminder to ${tenant.name}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Send',
            style: 'default',
            onPress: async () => {
              try {
                // TODO: Implement actual reminder sending logic here
                // For now, we'll just show a success message
                Alert.alert('Success', `Reminder sent to ${tenant.name}`);
                router.back(); // Go back to dashboard after sending
              } catch (error) {
                console.error('Error sending reminder:', error);
                Alert.alert('Error', 'Failed to send reminder');
              }
            },
          },
        ]
      );
    } else {
      router.push(`/tenants/${tenant.$id}`);
    }
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
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#1da1f2" />
        </TouchableOpacity>
        <Text style={styles.title}>
          {isRemindMode ? 'Select Tenant to Remind' : 'My Tenants'}
        </Text>
        {!isRemindMode && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddTenant}
          >
            <Ionicons name="add-circle" size={24} color="#1da1f2" />
            <Text style={styles.addButtonText}>Add Tenant</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={isRemindMode ? tenants.filter(t => t.status === 'Active') : tenants}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.tenantCard,
              isRemindMode && styles.tenantCardRemind
            ]}
            onPress={() => handleTenantPress(item)}
          >
            <View style={styles.tenantInfo}>
              <View style={styles.avatarContainer}>
                {item.profileImage ? (
                  <Image
                    source={{ uri: getProfileImage(item.profileImage) }}
                    style={styles.avatar}
                  />
                ) : (
                  <View style={[styles.avatar, styles.avatarPlaceholder]}>
                    <Text style={styles.avatarText}>
                      {item.name[0].toUpperCase()}
                    </Text>
                  </View>
                )}
                <View style={[styles.statusDot, 
                  item.status === 'Active' ? styles.statusActive : styles.statusInactive
                ]} />
              </View>
              <View style={styles.tenantDetails}>
                <Text style={styles.tenantName}>{item.name}</Text>
                <Text style={styles.tenantEmail}>{item.email}</Text>
                <Text style={styles.tenantPhone}>{item.phone}</Text>
                <Text style={[styles.statusText, 
                  item.status === 'Active' ? styles.statusTextActive : styles.statusTextInactive
                ]}>
                  {item.status}
                </Text>
              </View>
            </View>
            <Ionicons 
              name={isRemindMode ? "notifications" : "chevron-forward"} 
              size={24} 
              color={isRemindMode ? "#1da1f2" : "#ccc"} 
            />
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {isRemindMode ? 'No active tenants found' : 'No tenants found'}
            </Text>
            {!isRemindMode && (
              <TouchableOpacity
                style={styles.addFirstButton}
                onPress={handleAddTenant}
              >
                <Text style={styles.addFirstButtonText}>Add Your First Tenant</Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f8fa',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5fe',
    padding: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#1da1f2',
    fontWeight: '600',
    marginLeft: 5,
  },
  tenantCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Platform.select({
      web: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      },
      default: {
        elevation: 2,
      },
    }),
  },
  tenantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarPlaceholder: {
    backgroundColor: '#e8f5fe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1da1f2',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: '#fff',
  },
  statusActive: {
    backgroundColor: '#28a745',
  },
  statusInactive: {
    backgroundColor: '#dc3545',
  },
  tenantDetails: {
    flex: 1,
  },
  tenantName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  tenantEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  tenantPhone: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  statusTextActive: {
    backgroundColor: '#e8f5fe',
    color: '#1da1f2',
  },
  statusTextInactive: {
    backgroundColor: '#ffebee',
    color: '#dc3545',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  addFirstButton: {
    backgroundColor: '#1da1f2',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addFirstButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  tenantCardRemind: {
    borderWidth: 1,
    borderColor: '#1da1f2',
    backgroundColor: '#f8f9fa',
  },
}); 
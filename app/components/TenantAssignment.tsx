import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Platform,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { Tenant } from '../../types';

type Props = {
  propertyId: string;
  tenants: Tenant[];
  onAssignTenant: (tenantId: string) => void;
  onUnassignTenant: (tenantId: string) => void;
  onAddNewTenant: () => void;
};

const TenantAssignment = ({
  propertyId,
  tenants,
  onAssignTenant,
  onUnassignTenant,
  onAddNewTenant,
}: Props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return '#10b981';
      case 'Pending':
        return '#f59e0b';
      case 'Former':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  const filteredTenants = tenants
    .filter(tenant => {
      const matchesSearch =
        tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tenant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tenant.phone.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        selectedStatus === 'all' || tenant.status === selectedStatus;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      // Sort by status: Active first, then Pending, then Former
      const statusOrder = { Active: 0, Pending: 1, Former: 2 };
      return (
        statusOrder[a.status as keyof typeof statusOrder] -
        statusOrder[b.status as keyof typeof statusOrder]
      );
    });

  const statusCounts = {
    all: tenants.length,
    Active: tenants.filter(t => t.status === 'Active').length,
    Pending: tenants.filter(t => t.status === 'Pending').length,
    Former: tenants.filter(t => t.status === 'Former').length,
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tenant Assignment</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={onAddNewTenant}
        >
          <MaterialCommunityIcons name="plus" size={20} color="#fff" />
          <Text style={styles.addButtonText}>Add Tenant</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search tenants..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
      >
        {Object.entries(statusCounts).map(([status, count]) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.filterChip,
              selectedStatus === status && styles.filterChipActive,
            ]}
            onPress={() => setSelectedStatus(status)}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedStatus === status && styles.filterChipTextActive,
              ]}
            >
              {status} ({count})
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.tenantList}>
        {filteredTenants.map((tenant) => (
          <View key={tenant.$id} style={styles.tenantCard}>
            <View style={styles.tenantHeader}>
              <View style={styles.tenantInfo}>
                <Image
                  source={{ uri: tenant.avatar }}
                  style={styles.avatar}
                />
                <View>
                  <Text style={styles.tenantName}>{tenant.name}</Text>
                  <Text style={styles.tenantEmail}>{tenant.email}</Text>
                  <Text style={styles.tenantPhone}>{tenant.phone}</Text>
                </View>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(tenant.status) },
                ]}
              >
                <Text style={styles.statusText}>{tenant.status}</Text>
              </View>
            </View>

            <View style={styles.tenantDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Rent Amount:</Text>
                <Text style={styles.detailValue}>
                  {formatCurrency(tenant.rentAmount)}
                </Text>
              </View>
              {tenant.moveInDate && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Move-in Date:</Text>
                  <Text style={styles.detailValue}>
                    {formatDate(tenant.moveInDate)}
                  </Text>
                </View>
              )}
              {tenant.leaseStartDate && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Lease Start:</Text>
                  <Text style={styles.detailValue}>
                    {formatDate(tenant.leaseStartDate)}
                  </Text>
                </View>
              )}
              {tenant.leaseEndDate && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Lease End:</Text>
                  <Text style={styles.detailValue}>
                    {formatDate(tenant.leaseEndDate)}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.actions}>
              {tenant.status === 'Pending' && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.assignButton]}
                  onPress={() => onAssignTenant(tenant.$id)}
                >
                  <MaterialCommunityIcons
                    name="account-check"
                    size={16}
                    color="#fff"
                  />
                  <Text style={styles.actionButtonText}>Assign</Text>
                </TouchableOpacity>
              )}
              {tenant.status === 'Active' && (
                <TouchableOpacity
                  style={[styles.actionButton, styles.unassignButton]}
                  onPress={() => onUnassignTenant(tenant.$id)}
                >
                  <MaterialCommunityIcons
                    name="account-remove"
                    size={16}
                    color="#fff"
                  />
                  <Text style={styles.actionButtonText}>Unassign</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f8fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1da1f2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    marginLeft: 4,
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      },
      default: {
        elevation: 2,
      },
    }),
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
  },
  filtersContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 8,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      },
      default: {
        elevation: 1,
      },
    }),
  },
  filterChipActive: {
    backgroundColor: '#1da1f2',
  },
  filterChipText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#fff',
  },
  tenantList: {
    flex: 1,
  },
  tenantCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      },
      default: {
        elevation: 2,
      },
    }),
  },
  tenantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f8fa',
  },
  tenantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  tenantName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  tenantEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  tenantPhone: {
    fontSize: 14,
    color: '#666',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  tenantDetails: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f8fa',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  actionButtonText: {
    color: '#fff',
    marginLeft: 4,
    fontWeight: '500',
  },
  assignButton: {
    backgroundColor: '#10b981',
  },
  unassignButton: {
    backgroundColor: '#ef4444',
  },
});

export default TenantAssignment; 
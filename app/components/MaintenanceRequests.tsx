import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { MaintenanceRequest } from '../../types';

type Props = {
  requests: MaintenanceRequest[];
  onUpdateStatus: (requestId: string, newStatus: string) => void;
  onViewDetails: (requestId: string) => void;
};

const MaintenanceRequests = ({ requests, onUpdateStatus, onViewDetails }: Props) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return '#f59e0b';
      case 'In Progress':
        return '#3b82f6';
      case 'Completed':
        return '#10b981';
      case 'Cancelled':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent':
        return '#ef4444';
      case 'High':
        return '#f59e0b';
      case 'Medium':
        return '#3b82f6';
      case 'Low':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  const filteredRequests = selectedStatus === 'all'
    ? requests
    : requests.filter(request => request.status === selectedStatus);

  const statusCounts = {
    all: requests.length,
    Pending: requests.filter(r => r.status === 'Pending').length,
    'In Progress': requests.filter(r => r.status === 'In Progress').length,
    Completed: requests.filter(r => r.status === 'Completed').length,
    Cancelled: requests.filter(r => r.status === 'Cancelled').length,
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Maintenance Requests</Text>

      {/* Status Filters */}
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

      {/* Requests List */}
      <View style={styles.listContainer}>
        {filteredRequests.map((request) => (
          <View key={request.$id} style={styles.requestCard}>
            <View style={styles.requestHeader}>
              <View style={styles.tenantInfo}>
                <Image
                  source={{ uri: request.tenantAvatar }}
                  style={styles.tenantAvatar}
                />
                <View>
                  <Text style={styles.tenantName}>{request.tenantName}</Text>
                  <Text style={styles.propertyName}>{request.propertyName}</Text>
                </View>
              </View>
              <View style={styles.statusContainer}>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(request.status) },
                  ]}
                >
                  <Text style={styles.statusText}>{request.status}</Text>
                </View>
                <View
                  style={[
                    styles.priorityBadge,
                    { backgroundColor: getPriorityColor(request.priority) },
                  ]}
                >
                  <Text style={styles.priorityText}>{request.priority}</Text>
                </View>
              </View>
            </View>

            <View style={styles.requestContent}>
              <Text style={styles.description}>{request.description}</Text>
              <Text style={styles.date}>
                Submitted: {formatDate(request.dateSubmitted)}
              </Text>
              {request.dateUpdated && (
                <Text style={styles.date}>
                  Last Updated: {formatDate(request.dateUpdated)}
                </Text>
              )}
            </View>

            <View style={styles.requestActions}>
              {request.status !== 'Completed' && request.status !== 'Cancelled' && (
                <View style={styles.statusActions}>
                  {request.status === 'Pending' && (
                    <TouchableOpacity
                      style={[styles.actionButton, styles.startButton]}
                      onPress={() => onUpdateStatus(request.$id, 'In Progress')}
                    >
                      <MaterialCommunityIcons
                        name="play"
                        size={16}
                        color="#fff"
                      />
                      <Text style={styles.actionButtonText}>Start</Text>
                    </TouchableOpacity>
                  )}
                  {request.status === 'In Progress' && (
                    <TouchableOpacity
                      style={[styles.actionButton, styles.completeButton]}
                      onPress={() => onUpdateStatus(request.$id, 'Completed')}
                    >
                      <MaterialCommunityIcons
                        name="check"
                        size={16}
                        color="#fff"
                      />
                      <Text style={styles.actionButtonText}>Complete</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={[styles.actionButton, styles.cancelButton]}
                    onPress={() => onUpdateStatus(request.$id, 'Cancelled')}
                  >
                    <MaterialCommunityIcons
                      name="close"
                      size={16}
                      color="#fff"
                    />
                    <Text style={styles.actionButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              )}
              <TouchableOpacity
                style={[styles.actionButton, styles.viewButton]}
                onPress={() => onViewDetails(request.$id)}
              >
                <Ionicons name="eye" size={16} color="#fff" />
                <Text style={styles.actionButtonText}>View</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  filtersContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f8fa',
    marginRight: 8,
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
  listContainer: {
    marginTop: 8,
  },
  requestCard: {
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
  requestHeader: {
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
  tenantAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  tenantName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  propertyName: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  requestContent: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f8fa',
  },
  description: {
    fontSize: 14,
    color: '#1a1a1a',
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  requestActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  statusActions: {
    flexDirection: 'row',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  startButton: {
    backgroundColor: '#3b82f6',
  },
  completeButton: {
    backgroundColor: '#10b981',
  },
  cancelButton: {
    backgroundColor: '#ef4444',
  },
  viewButton: {
    backgroundColor: '#1da1f2',
  },
});

export default MaintenanceRequests; 
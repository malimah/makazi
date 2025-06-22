import React, { useEffect, useState } from 'react';
import {
  View, Text, Button, Image, TextInput,
  FlatList, TouchableOpacity, Alert, StyleSheet, ScrollView, Platform, useWindowDimensions,
  ViewStyle, TextStyle, ActivityIndicator
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5, Feather, AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { account, databases, storage, ID, tenantsAPI, maintenanceAPI, paymentsAPI, analyticsAPI, Query, storageAPI } from '../../utils/appwrite';
import { useRouter } from 'expo-router';
import { Property, Tenant, MaintenanceRequest, Payment, Analytics } from '../../types';
import PropertyList from '../components/PropertyList';
import PropertySearch from '../components/PropertySearch';
import PropertyAnalytics from '../components/PropertyAnalytics';
import TenantAssignment from '../components/TenantAssignment';
import MaintenanceRequests from '../components/MaintenanceRequests';
import PropertyForm from '../components/PropertyForm';
import { PropertyFilter } from '../components/PropertySearch';
import PropertyMap from '../components/PropertyMap';
import { RoomFeature } from '../utils/roomPlanningUtils';
import { sortPropertiesByDistance } from '../../utils/distance';
import UploadProgress from '../components/UploadProgress';

const BUCKET_ID = '682b32c2003a04448deb';
const DATABASE_ID = '68286dbc002bee374429';
const COLLECTION_ID = '68286efe002e00dbe24d';

// @ts-ignore
type File = any;

type RouteType = {
  label: string;
  icon: React.ReactNode;
  path: string;
};

const sidebarItems: RouteType[] = [
  { label: 'Dashboard', icon: <Ionicons name="grid-outline" size={22} color="#1da1f2" />, path: '.' },
  { label: 'New Request', icon: <MaterialIcons name="request-page" size={22} color="#1da1f2" />, path: 'new-request' },
  { label: 'My Tenants', icon: <FontAwesome5 name="users" size={20} color="#1da1f2" />, path: 'tenants' },
  { label: 'My Property', icon: <Feather name="home" size={22} color="#1da1f2" />, path: 'my-property' },
  { label: 'Reports', icon: <AntDesign name="filetext1" size={22} color="#1da1f2" />, path: 'reports' },
  { label: 'All Transactions', icon: <MaterialIcons name="receipt-long" size={22} color="#1da1f2" />, path: 'transactions' },
];

// Add custom web style types
type WebViewStyle = ViewStyle & {
  position?: 'fixed' | 'absolute' | 'relative';
  boxShadow?: string;
  elevation?: number;
};

// Web-specific styles for sidebars
const webStyles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f5f8fa',
    position: 'relative',
    height: '100%',
    minHeight: '100%',
  } as any,
  sidebar: {
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 60,
    borderRightWidth: 1,
    borderColor: '#e1e4e8',
    height: '100%',
    position: Platform.OS === 'web' ? 'fixed' : 'absolute',
    left: 0,
    top: 0,
    zIndex: 100,
    ...Platform.select({
      web: {
        boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
      },
      default: {
        elevation: 4,
      },
    }),
  } as any,
  rightSidebar: {
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 60,
    borderLeftWidth: 1,
    borderColor: '#e1e4e8',
    height: '100%',
    position: Platform.OS === 'web' ? 'fixed' : 'absolute',
    right: 0,
    top: 0,
    zIndex: 100,
    ...Platform.select({
      web: {
        boxShadow: '-2px 0 8px rgba(0,0,0,0.1)',
      },
      default: {
        elevation: 4,
      },
    }),
  } as any,
  mainContent: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
  } as WebViewStyle,
  sidebarTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#1da1f2',
  } as TextStyle,
  sidebarItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: 'transparent',
  } as WebViewStyle,
  sidebarItemActive: {
    backgroundColor: '#e8f5fe',
  } as WebViewStyle,
  sidebarLabel: {
    marginLeft: 12,
    fontSize: 16,
    color: '#444',
  } as TextStyle,
  sidebarLabelActive: {
    color: '#1da1f2',
    fontWeight: 'bold',
  } as TextStyle,
  logoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginTop: 'auto',
    marginBottom: 20,
  } as WebViewStyle,
  logoutLabel: {
    marginLeft: 12,
    fontSize: 16,
    color: '#b71c1c',
  } as TextStyle,
  fabSidebarHandleLeft: {
    position: Platform.OS === 'web' ? 'fixed' : 'absolute',
    left: 0,
    top: '50%',
    transform: [{ translateY: -25 }],
    backgroundColor: '#1da1f2',
    width: 25,
    height: 50,
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    ...Platform.select({
      web: {
        boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
      },
      default: {
        elevation: 4,
      },
    }),
  } as any,
  fabSidebarHandleRight: {
    position: Platform.OS === 'web' ? 'fixed' : 'absolute',
    right: 0,
    top: '50%',
    transform: [{ translateY: -25 }],
    backgroundColor: '#1da1f2',
    width: 25,
    height: 50,
    borderTopLeftRadius: 25,
    borderBottomLeftRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    ...Platform.select({
      web: {
        boxShadow: '-2px 0 8px rgba(0,0,0,0.1)',
      },
      default: {
        elevation: 4,
      },
    }),
  } as any,
  fabHandleText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  } as TextStyle,
});

// Dashboard-specific styles
const dashboardStyles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 15,
    color: '#1a1a1a',
  },
  profilePicContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    alignSelf: 'center',
    overflow: 'hidden',
  },
  profilePic: {
    width: '100%',
    height: '100%',
  },
  profilePicPlaceholder: {
    color: '#666',
    textAlign: 'center',
    padding: 10,
  },
  form: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      },
      default: {
        elevation: 2,
      },
    }),
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e1e4e8',
  },
  imagePicker: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#e1e4e8',
  },
  propertyImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
    alignItems: 'flex-end',
    flexWrap: 'wrap',
  },
  metricBox: { 
    marginRight: 18 
  },
  metricLabel: { 
    fontSize: 13, 
    color: '#888', 
    marginBottom: 2 
  },
  metricPending: { 
    color: '#b71c1c', 
    fontWeight: 'bold', 
    fontSize: 18 
  },
  metricValue: { 
    color: '#222', 
    fontWeight: 'bold', 
    fontSize: 18 
  },
  tenantCountBox: { 
    alignItems: 'center', 
    marginLeft: 10 
  },
  tenantCountText: { 
    fontSize: 12, 
    color: '#1da1f2', 
    fontWeight: 'bold', 
    marginBottom: 2 
  },
  tenantAvatarsRow: { 
    flexDirection: 'row' 
  },
  tenantAvatar: {
    width: 24, 
    height: 24, 
    borderRadius: 12, 
    marginRight: -8, 
    borderWidth: 2, 
    borderColor: '#fff'
  },
  progressSection: { 
    alignItems: 'center', 
    marginBottom: 18 
  },
  progressLabel: { 
    fontSize: 15, 
    color: '#888', 
    marginBottom: 4 
  },
  progressCirclePlaceholder: {
    width: 80, 
    height: 80, 
    borderRadius: 40, 
    borderWidth: 6, 
    borderColor: '#1da1f2',
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#e3f2fd'
  },
  reminderPanel: {
    backgroundColor: '#fff3e0',
    borderRadius: 10,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    justifyContent: 'space-between',
  },
  reminderText: { 
    color: '#b71c1c', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  remindButton: {
    backgroundColor: '#1da1f2',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 18,
  },
  remindButtonText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 14 
  },
  section: { 
    marginBottom: 18 
  },
  sectionTitle: { 
    fontWeight: 'bold', 
    fontSize: 16, 
    color: '#1da1f2', 
    marginBottom: 8 
  },
  requestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f8fa',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  requestAvatar: { 
    width: 36, 
    height: 36, 
    borderRadius: 18, 
    marginRight: 10 
  },
  requestName: { 
    fontWeight: 'bold', 
    fontSize: 15 
  },
  requestInfo: { 
    color: '#888', 
    fontSize: 12 
  },
  viewButton: {
    backgroundColor: '#1da1f2',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginLeft: 10,
  },
  viewButtonText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 13 
  },
  leaseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f8fa',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  leaseType: { 
    fontWeight: 'bold', 
    fontSize: 15, 
    color: '#1da1f2', 
    width: 60 
  },
  leaseInfo: { 
    color: '#444', 
    fontSize: 13, 
    width: 80 
  },
  leaseDays: { 
    color: '#b71c1c', 
    fontWeight: 'bold', 
    fontSize: 13 
  },
});

interface PropertyFormData {
  title: string;
  location: string;
  price: string;
  description: string;
  image: any;
  dimensions: {
    width: number;
    length: number;
    height: number;
  };
  features: RoomFeature[];
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export default function LandlordDashboard() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profileImageId, setProfileImageId] = useState<string | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<PropertyFormData>({
    title: '',
    location: '',
    price: '',
    description: '',
    image: null,
    dimensions: {
      width: 4,
      length: 5,
      height: 2.8,
    },
    features: [],
    coordinates: {
      latitude: -6.776012,
      longitude: 39.178326,
    },
  });
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);

  const { width } = useWindowDimensions();
  const isNarrow = Platform.OS === 'web' && width < 1100;

  // Sidebar visibility state
  const [leftVisible, setLeftVisible] = useState(!isNarrow);
  const [rightVisible, setRightVisible] = useState(!isNarrow);

  // Active sidebar item state
  const [activeSidebar, setActiveSidebar] = useState<string | null>(null);
  const router = useRouter();

  const [analyticsData, setAnalyticsData] = useState<Analytics>({
    totalProperties: 0,
    occupiedProperties: 0,
    totalRevenue: 0,
    monthlyRevenue: [],
    occupancyRate: 0,
    maintenanceRequests: 0,
    averageRent: 0,
    vacancyRate: 0,
    propertyTypes: [],
    maintenanceStats: {
      total: 0,
      pending: 0,
      inProgress: 0,
      completed: 0,
      byCategory: [],
    },
    revenueStats: {
      totalCollected: 0,
      pending: 0,
      overdue: 0,
      byMonth: [],
    },
  });

  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([]);
  const [propertyFilters, setPropertyFilters] = useState({
    search: '',
    status: '',
    priceMin: '',
    priceMax: '',
    type: '',
  });

  // Add new state for upload progress
  const [uploadProgress, setUploadProgress] = useState<{ progress: number; fileName: string; size: string } | null>(null);

  // Auto-hide/show sidebars on resize
  useEffect(() => {
    const handleResize = () => {
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        const isNarrowScreen = window.innerWidth < 1100;
        setLeftVisible(!isNarrowScreen);
        setRightVisible(!isNarrowScreen);
      }
    };

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      handleResize(); // Initial check
    }

    return () => {
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  // Calculate content padding based on sidebar visibility
  const contentStyle = Platform.OS === 'web' ? {
    marginLeft: leftVisible ? (isNarrow ? 60 : 220) : 0,
    marginRight: rightVisible ? (isNarrow ? 60 : 270) : 0,
    transition: 'all 0.3s ease',
  } : {};

  // Fetch all data
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const user = await account.get();
        setUser(user);
        setProfileImageId(user?.prefs?.profileImageId || null);

        // Fetch properties
        const propertiesResponse = await databases.listDocuments(
          DATABASE_ID,
          COLLECTION_ID,
          [
            Query.equal('landlordId', user.$id)
          ]
        );
        const properties = (propertiesResponse.documents as unknown) as Property[];
        setProperties(properties);

        // Fetch tenants
        const tenantsResponse = await tenantsAPI.list();
        setTenants((tenantsResponse.documents as unknown) as Tenant[]);

        // Fetch maintenance requests
        const maintenanceResponse = await maintenanceAPI.list();
        setMaintenanceRequests((maintenanceResponse.documents as unknown) as MaintenanceRequest[]);

        // Calculate analytics
        const occupied = properties.filter(p => p.status === 'Occupied').length;
        const totalProps = properties.length;

        // Fetch payments for revenue calculation
        const paymentsResponse = await paymentsAPI.list();
        const payments = (paymentsResponse.documents as unknown) as Payment[];

        // Calculate monthly revenue
        const monthlyRevenue = calculateMonthlyRevenue(payments);
        const totalRevenue = payments.reduce((sum, p) => sum + (p.status === 'Completed' ? p.amount : 0), 0);

        // Calculate property type distribution
        const propertyTypes = calculatePropertyTypes(properties);

        // Calculate maintenance stats
        const maintenanceStats = calculateMaintenanceStats((maintenanceResponse.documents as unknown) as MaintenanceRequest[]);

        // Calculate revenue stats
        const revenueStats = calculateRevenueStats(payments);

        setAnalyticsData({
          totalProperties: totalProps,
          occupiedProperties: occupied,
          totalRevenue,
          monthlyRevenue,
          occupancyRate: totalProps > 0 ? (occupied / totalProps) * 100 : 0,
          maintenanceRequests: maintenanceResponse.total,
          averageRent: calculateAverageRent(properties),
          vacancyRate: totalProps > 0 ? ((totalProps - occupied) / totalProps) * 100 : 0,
          propertyTypes,
          maintenanceStats,
          revenueStats,
        });
      } catch (error) {
        console.error('Error fetching data:', error);
        Alert.alert('Error', 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Calculation helper functions
  const calculateMonthlyRevenue = (payments: Payment[]) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    
    const monthlyTotals = months.map(month => {
      const amount = payments
        .filter(p => {
          const date = new Date(p.paidDate || p.createdAt);
          return date.getFullYear() === currentYear && 
                 date.getMonth() === months.indexOf(month) &&
                 p.status === 'Completed';
        })
        .reduce((sum, p) => sum + p.amount, 0);

      return { month, amount, percentage: 0 };
    });

    const maxAmount = Math.max(...monthlyTotals.map(m => m.amount));
    return monthlyTotals.map(m => ({
      ...m,
      percentage: maxAmount > 0 ? (m.amount / maxAmount) * 100 : 0,
    }));
  };

  const calculatePropertyTypes = (properties: Property[]) => {
    const types = {} as Record<string, number>;
    properties.forEach(p => {
      types[p.type] = (types[p.type] || 0) + 1;
    });
    return Object.entries(types).map(([type, count]) => ({ type, count }));
  };

  const calculateMaintenanceStats = (requests: MaintenanceRequest[]) => {
    const categories = {} as Record<string, number>;
    let pending = 0;
    let inProgress = 0;
    let completed = 0;

    requests.forEach(r => {
      categories[r.category] = (categories[r.category] || 0) + 1;
      if (r.status === 'Pending') pending++;
      else if (r.status === 'In Progress') inProgress++;
      else if (r.status === 'Completed') completed++;
    });

    return {
      total: requests.length,
      pending,
      inProgress,
      completed,
      byCategory: Object.entries(categories).map(([category, count]) => ({ category, count })),
    };
  };

  const calculateRevenueStats = (payments: Payment[]) => {
    const completed = payments.filter(p => p.status === 'Completed');
    const pending = payments.filter(p => p.status === 'Pending');
    const overdue = payments.filter(p => {
      return p.status === 'Pending' && new Date(p.dueDate) < new Date();
    });

    const byMonth = calculateMonthlyRevenue(payments).map(m => ({
      month: m.month,
      collected: m.amount,
      pending: pending
        .filter(p => {
          const date = new Date(p.dueDate);
          return date.getMonth() === ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(m.month);
        })
        .reduce((sum, p) => sum + p.amount, 0),
    }));

    return {
      totalCollected: completed.reduce((sum, p) => sum + p.amount, 0),
      pending: pending.reduce((sum, p) => sum + p.amount, 0),
      overdue: overdue.reduce((sum, p) => sum + p.amount, 0),
      byMonth,
    };
  };

  const calculateAverageRent = (properties: Property[]) => {
    if (properties.length === 0) return 0;
    return properties.reduce((sum, p) => sum + p.price, 0) / properties.length;
  };

  // Handler functions
  const handleFilterChange = (filters: PropertyFilter) => {
    // TODO: Implement property filtering
  };

  const handleAssignTenant = async (tenantId: string) => {
    try {
      if (!selectedPropertyId) {
        Alert.alert('Error', 'Please select a property first');
        return;
      }

      await tenantsAPI.update(tenantId, {
        propertyId: selectedPropertyId,
        status: 'Active',
        moveInDate: new Date().toISOString(),
      });

      // Refresh tenants list
      const response = await tenantsAPI.list();
      setTenants((response.documents as unknown) as Tenant[]);

      Alert.alert('Success', 'Tenant assigned successfully');
    } catch (error) {
      console.error('Error assigning tenant:', error);
      Alert.alert('Error', 'Failed to assign tenant');
    }
  };

  const handleUnassignTenant = async (tenantId: string) => {
    try {
      await tenantsAPI.update(tenantId, {
        propertyId: null,
        status: 'Former',
      });

      // Refresh tenants list
      const response = await tenantsAPI.list();
      setTenants((response.documents as unknown) as Tenant[]);

      Alert.alert('Success', 'Tenant unassigned successfully');
    } catch (error) {
      console.error('Error unassigning tenant:', error);
      Alert.alert('Error', 'Failed to unassign tenant');
    }
  };

  const handleUpdateRequestStatus = async (requestId: string, newStatus: string) => {
    try {
      await maintenanceAPI.update(requestId, {
        status: newStatus,
        dateUpdated: new Date().toISOString(),
        ...(newStatus === 'Completed' ? { completionDate: new Date().toISOString() } : {}),
      });

      // Refresh maintenance requests
      const response = await maintenanceAPI.list();
      setMaintenanceRequests((response.documents as unknown) as MaintenanceRequest[]);

      Alert.alert('Success', 'Request status updated');
    } catch (error) {
      console.error('Error updating request status:', error);
      Alert.alert('Error', 'Failed to update request status');
    }
  };

  const pickImage = async (useCamera: boolean = false) => {
    if (Platform.OS === 'web') {
      return new Promise<File | null>((resolve) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e: any) => {
          const file = e.target?.files?.[0];
          if (file) {
            // Validate file type and size
            if (!file.type.startsWith('image/')) {
              Alert.alert('Error', 'Please select an image file');
              resolve(null);
              return;
            }
            if (file.size > 10 * 1024 * 1024) { // 10MB limit
              Alert.alert('Error', 'Image size should be less than 10MB');
              resolve(null);
              return;
            }
            resolve(file);
          } else {
            resolve(null);
          }
        };
        input.click();
      });
    } else {
      const result = useCamera
        ? await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
          });

      if (
        !result.canceled &&
        result.assets &&
        result.assets[0] &&
        result.assets[0].fileSize !== undefined &&
        result.assets[0].fileSize >= 52428800
      ) {
        Alert.alert("File size cannot exceed 50MB");
        return null;
      }
      return result.canceled ? null : result.assets[0];
    }
  };

  const uploadImage = async (asset: ImagePicker.ImagePickerAsset | File) => {
    try {
      let fileObj: File;
      
      if (Platform.OS === 'web') {
        fileObj = asset as File;
        console.log('Web file object:', {
          name: fileObj.name,
          type: fileObj.type,
          size: fileObj.size
        });

        // Initialize upload progress
        setUploadProgress({
          progress: 0,
          fileName: fileObj.name,
          size: `${(fileObj.size / (1024 * 1024)).toFixed(2)} MB`
        });

        // Double-check file type and size
        if (!fileObj.type.startsWith('image/')) {
          throw new Error('Please upload an image file (JPEG, PNG, etc.)');
        }
        if (fileObj.size > 10 * 1024 * 1024) {
          throw new Error('Image size is too large. Please upload an image smaller than 10MB.');
        }
      } else {
        const imageAsset = asset as ImagePicker.ImagePickerAsset;
        console.log('Native image asset:', imageAsset);

        try {
          const response = await fetch(imageAsset.uri);
          if (!response.ok) {
            throw new Error(`Failed to process image: ${response.status} ${response.statusText}`);
          }
          
          const blob = await response.blob();
          console.log('Native blob:', {
            size: blob.size,
            type: blob.type
          });
          
          const fileName = `property_${Date.now()}_${Math.random().toString(36).slice(2, 11)}.jpg`;
          fileObj = new File([blob], fileName, {
            type: 'image/jpeg'
          });

          // Initialize upload progress for native platforms
          setUploadProgress({
            progress: 0,
            fileName: fileName,
            size: `${(blob.size / (1024 * 1024)).toFixed(2)} MB`
          });
        } catch (fetchError) {
          console.error('Error processing image:', fetchError);
          throw new Error('Failed to process the selected image. Please try another image.');
        }
      }

      console.log('Uploading file:', {
        name: fileObj.name,
        type: fileObj.type,
        size: fileObj.size
      });

      // Upload file using storageAPI with progress tracking
      const uploadedFile = await storageAPI.uploadFile(
        fileObj,
        (progress) => {
          setUploadProgress(prev => prev ? { ...prev, progress } : null);
        }
      );
      
      if (!uploadedFile?.$id) {
        throw new Error('Failed to get file ID after upload. Please try again.');
      }
      
      console.log('Upload successful:', uploadedFile);
      
      // Clear progress after successful upload
      setTimeout(() => {
        setUploadProgress(null);
      }, 1000);

      return uploadedFile.$id;
    } catch (error: any) {
      // Clear progress on error
      setUploadProgress(null);

      console.error('Image upload error:', {
        message: error.message,
        code: error.code,
        type: error.constructor.name,
        stack: error.stack,
        response: error.response
      });

      // Show a more user-friendly error message
      let errorMessage = 'Failed to upload image. ';
      if (error.code === 401) {
        errorMessage += 'Please log in again.';
      } else if (error.code === 403) {
        errorMessage += 'You don\'t have permission to upload images.';
      } else if (error.message.includes('Failed to fetch') || error.message.includes('Network error')) {
        errorMessage += 'Please check your internet connection and try again.';
      } else {
        errorMessage += error.message || 'Please try again.';
      }

      Alert.alert('Image Upload Failed', errorMessage);
      return null;
    }
  };

  const handleAddProperty = async (formData: PropertyFormData) => {
    if (!user) {
      Alert.alert('You must be logged in to add a property.');
      return;
    }

    const { title, location, price, description, image, dimensions, features, coordinates } = formData;
    if (!title || !location || !price || !description || !image || !dimensions || !coordinates) {
      Alert.alert('Please fill all required fields and add an image.');
      return;
    }

    try {
      const imageId = await uploadImage(image);
      if (!imageId) return;

      // Format features to match the expected structure
      const formattedFeatures = features.map(feature => ({
        name: feature.toString(),
        value: 'true'
      }));

      const propertyData = {
        title,
        location,
        price: parseFloat(price),
        description,
        imageUrl: imageId,
        status: 'Available',
        type: 'Apartment',
        beds: 0,
        baths: 0,
        guests: 0,
        dimensions: {
          width: dimensions.width,
          length: dimensions.length,
          height: dimensions.height
        },
        features: formattedFeatures,
        landlordId: user.$id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        coordinates: {
          latitude: coordinates.latitude,
          longitude: coordinates.longitude
        }
      };

      console.log('Creating property with data:', propertyData);

      const doc = await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        ID.unique(),
        propertyData
      );

      console.log('Property created successfully:', doc);

      const newProperty: Property = {
        $id: doc.$id,
        ...propertyData,
      };

      setProperties([...properties, newProperty]);
      setForm({
        title: '',
        location: '',
        price: '',
        description: '',
        image: null,
        dimensions: {
          width: 4,
          length: 5,
          height: 2.8,
        },
        features: [],
        coordinates: {
          latitude: -6.776012,
          longitude: 39.178326,
        },
      });
      setShowForm(false);
    } catch (error: any) {
      console.error('Error creating property:', error);
      Alert.alert('Error saving property', error.message || String(error));
    }
  };

  const handleDeleteProperty = async (id: string, imageId: string) => {
    try {
      await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, id);
      await storage.deleteFile(BUCKET_ID, imageId);
      setProperties(properties.filter(p => p.$id !== id));
    } catch (error: any) {
      Alert.alert('Error deleting property', error.message || String(error));
    }
  };

  const handlePickProfileImage = async () => {
    const asset = await pickImage(false);
    if (!asset) return;

    const id = await uploadImage(asset);
    if (!id) return;

    setProfileImageId(id);

    try {
      await account.updatePrefs({ profileImageId: id });
    } catch (error: any) {
      Alert.alert('Failed to save profile picture to account', error.message || String(error));
    }
  };

  const getImageUri = (imageId: string) => {
    if (!imageId) return undefined;
    return storage.getFileView(BUCKET_ID, imageId).toString();
  };

  const getUserGreeting = () => {
    if (user?.name) {
      return user.name.split(' ')[0];
    }
    return user?.email || 'Landlord';
  };

  const handleNavigation = (path: string, label: string) => {
    setActiveSidebar(label);
    if (path === '.') {
      router.push('/landlord-dashboard');
    } else if (path === 'tenants') {
      router.push('/tenants'); // Direct route to tenants page
    } else {
      router.push(`/landlord-dashboard/${path}` as any);
    }
  };

  const handleAddNewTenant = () => {
    // TODO: Navigate to add tenant form
    router.push('/landlord-dashboard/add-tenant');
  };

  const handleViewRequestDetails = (requestId: string) => {
    // TODO: Navigate to request details
    router.push(`/landlord-dashboard/maintenance/${requestId}`);
  };

  const handleRemindTenant = () => {
    // Navigate to tenants list with reminder flag
    router.push('/tenants?action=remind');
  };

  // Loading state
  if (loading) {
    return (
      <View style={[dashboardStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#1da1f2" />
      </View>
    );
  }

  return (
    <View style={webStyles.root}>
      {/* Left Sidebar */}
      {Platform.OS === 'web' && (
        <>
          {leftVisible && (
            <View style={[webStyles.sidebar, { width: isNarrow ? 60 : 220 }]}>
              <Text style={[webStyles.sidebarTitle, isNarrow ? { fontSize: 18, textAlign: 'center' } : {}]}>
                {!isNarrow && 'Makazi Fasta'}
              </Text>
              {sidebarItems.map((item) => (
                <TouchableOpacity
                  key={item.label}
                  style={[
                    webStyles.sidebarItem,
                    activeSidebar === item.label && webStyles.sidebarItemActive,
                  ]}
                  onPress={() => handleNavigation(item.path, item.label)}
                  accessibilityRole="button"
                  accessibilityLabel={item.label}
                >
                  {item.icon}
                  {!isNarrow && (
                    <Text style={[
                      webStyles.sidebarLabel,
                      activeSidebar === item.label && webStyles.sidebarLabelActive
                    ]}>
                      {item.label}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={webStyles.logoutItem}
                onPress={async () => {
                  await account.deleteSession('current');
                  router.replace('/');
                }}
              >
                <Feather name="log-out" size={22} color="#b71c1c" />
                {!isNarrow && <Text style={webStyles.logoutLabel}>Logout</Text>}
              </TouchableOpacity>
            </View>
          )}
          <TouchableOpacity
            style={[
              webStyles.fabSidebarHandleLeft,
              { left: leftVisible ? (isNarrow ? 60 : 220) : 0 }
            ]}
            onPress={() => setLeftVisible(!leftVisible)}
          >
            <Text style={webStyles.fabHandleText}>{leftVisible ? '‹' : '›'}</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Main Content */}
      <View style={[webStyles.mainContent, contentStyle]}>
        <ScrollView contentContainerStyle={dashboardStyles.container}>
          <Text style={dashboardStyles.title}>
            Welcome, {getUserGreeting()}!
          </Text>

          {/* Property Analytics */}
          <PropertyAnalytics
            totalProperties={analyticsData.totalProperties}
            occupiedProperties={analyticsData.occupiedProperties}
            totalRevenue={analyticsData.totalRevenue}
            monthlyRevenue={analyticsData.monthlyRevenue}
            occupancyRate={analyticsData.occupancyRate}
            maintenanceRequests={analyticsData.maintenanceRequests}
          />

          {/* Property Search and Filters */}
          <PropertySearch onFilterChange={handleFilterChange} />

          {/* Maintenance Requests Section */}
          <MaintenanceRequests
            requests={maintenanceRequests}
            onUpdateStatus={handleUpdateRequestStatus}
            onViewDetails={handleViewRequestDetails}
          />

          {/* Properties Section */}
          <Text style={dashboardStyles.subtitle}>Your Properties</Text>
          {/* PropertyMap temporarily disabled due to interface issues */}
          {/* <PropertyMap
            properties={properties}
            onMarkerPress={(property) => {
              setSelectedPropertyId(property.$id);
            }}
          /> */}
          {showForm ? (
            <PropertyForm
              onSubmit={handleAddProperty}
              initialValues={form}
            />
          ) : (
            <Button
              title="Add New Property"
              onPress={() => setShowForm(true)}
            />
          )}
          <PropertyList
            properties={properties}
            onDelete={handleDeleteProperty}
            getImageUri={getImageUri}
          />

          {/* Upload Progress */}
          {uploadProgress && (
            <UploadProgress
              progress={uploadProgress.progress}
              fileName={uploadProgress.fileName}
              size={uploadProgress.size}
            />
          )}

          {/* Tenant Assignment Section */}
          {selectedPropertyId && (
            <TenantAssignment
              propertyId={selectedPropertyId}
              tenants={tenants}
              onAssignTenant={handleAssignTenant}
              onUnassignTenant={handleUnassignTenant}
              onAddNewTenant={handleAddNewTenant}
            />
          )}

          {/* Reminder Panel */}
          <View style={dashboardStyles.reminderPanel}>
            <Text style={dashboardStyles.reminderText}>
              {analyticsData.revenueStats.overdue > 0
                ? `${analyticsData.revenueStats.overdue.toLocaleString()} Tsh in overdue payments`
                : 'No overdue payments'}
            </Text>
            {analyticsData.revenueStats.overdue > 0 && (
              <TouchableOpacity
                style={dashboardStyles.remindButton}
                onPress={handleRemindTenant}
              >
                <Text style={dashboardStyles.remindButtonText}>Send Reminder</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </View>

      {/* Right Sidebar */}
      {Platform.OS === 'web' && (
        <>
          {rightVisible && (
            <View style={[webStyles.rightSidebar, { width: isNarrow ? 60 : 270 }]}>
              {/* Profile Picture */}
              <View style={{ alignItems: 'center', marginBottom: 18 }}>
                {profileImageId ? (
                  <Image
                    source={{ uri: getImageUri(profileImageId) }}
                    style={{ width: 70, height: 70, borderRadius: 35, marginBottom: 8 }}
                  />
                ) : (
                  <View style={{
                    width: 70, height: 70, borderRadius: 35, backgroundColor: '#f0f0f0',
                    alignItems: 'center', justifyContent: 'center', marginBottom: 8
                  }}>
                    <Text style={{ color: '#aaa', fontSize: 24 }}>
                      {user?.name ? user.name[0].toUpperCase() : 'U'}
                    </Text>
                  </View>
                )}
              </View>
              {/* Greeting */}
              <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 10, color: '#222' }}>
                Hi, {user?.name?.split(' ')[0] || 'User'}
                {'\n'}
                <Text style={{ fontSize: 14, fontWeight: 'normal', color: '#888' }}>Good morning</Text>
              </Text>
              {/* Vacant/Occupied Bar */}
              <View style={{
                flexDirection: 'row', justifyContent: 'space-between',
                backgroundColor: '#f5f8fa', borderRadius: 10, marginBottom: 18,
                paddingVertical: 12, paddingHorizontal: 10, width: '100%'
              }}>
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#1da1f2' }}>3</Text>
                  <Text style={{ fontSize: 13, color: '#555' }}>Vacant</Text>
                </View>
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#222' }}>7</Text>
                  <Text style={{ fontSize: 13, color: '#555' }}>Occupied</Text>
                </View>
              </View>
              {/* Activity List */}
              <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#1da1f2', alignSelf: 'flex-start', marginBottom: 6 }}>Recent Activity</Text>
              <View style={{ marginBottom: 10, alignSelf: 'flex-start', width: '100%' }}>
                <Text style={{ fontSize: 13, color: '#444', marginBottom: 2 }}>• Tenant John paid rent</Text>
                <Text style={{ fontSize: 13, color: '#444', marginBottom: 2 }}>• New request from Alice</Text>
                <Text style={{ fontSize: 13, color: '#444', marginBottom: 2 }}>• Property "Green Villa" marked as vacant</Text>
              </View>
              {/* Alerts */}
              <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#1da1f2', alignSelf: 'flex-start', marginBottom: 6 }}>Alerts</Text>
              <View style={{ alignSelf: 'flex-start', width: '100%' }}>
                <Text style={{ fontSize: 13, color: '#b71c1c', marginBottom: 2 }}>• Rent overdue: Tenant Mike</Text>
                <Text style={{ fontSize: 13, color: '#b71c1c', marginBottom: 2 }}>• Maintenance needed: Blue House</Text>
              </View>
            </View>
          )}
          <TouchableOpacity
            style={[
              webStyles.fabSidebarHandleRight,
              { right: rightVisible ? (isNarrow ? 60 : 270) : 0 }
            ]}
            onPress={() => setRightVisible(!rightVisible)}
          >
            <Text style={webStyles.fabHandleText}>{rightVisible ? '›' : '‹'}</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

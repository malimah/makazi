import React, { useCallback, useState, useMemo } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Text } from 'react-native';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Property } from '../../types';

type WebPropertyMapProps = {
  properties: Property[];
  onMarkerPress?: (property: Property) => void;
};

type FilterOptions = {
  priceMin: string;
  priceMax: string;
  propertyType: string;
  status: string;
};

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '10px'
};

const propertyTypes = ['All', 'Apartment', 'House', 'Villa', 'Office'];
const statusOptions = ['All', 'Available', 'Occupied', 'Under Maintenance'];

const WebPropertyMap: React.FC<WebPropertyMapProps> = ({ properties, onMarkerPress }) => {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    priceMin: '',
    priceMax: '',
    propertyType: 'All',
    status: 'All'
  });
  const [showFilters, setShowFilters] = useState(false);

  if (properties.length === 0) {
    return null;
  }

  const center = properties[0]?.coordinates || { lat: -6.776012, lng: 39.178326 };

  const filteredProperties = useMemo(() => {
    return properties.filter(property => {
      const matchesPrice = (!filters.priceMin || property.price >= parseFloat(filters.priceMin)) &&
                          (!filters.priceMax || property.price <= parseFloat(filters.priceMax));
      const matchesType = filters.propertyType === 'All' || property.type === filters.propertyType;
      const matchesStatus = filters.status === 'All' || property.status === filters.status;
      
      return matchesPrice && matchesType && matchesStatus;
    });
  }, [properties, filters]);

  const handleMarkerClick = useCallback((property: Property) => {
    setSelectedProperty(property);
    if (onMarkerPress) {
      onMarkerPress(property);
    }
  }, [onMarkerPress]);

  const handleInfoWindowClose = useCallback(() => {
    setSelectedProperty(null);
  }, []);

  const handleFilterChange = (key: keyof FilterOptions, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      priceMin: '',
      priceMax: '',
      propertyType: 'All',
      status: 'All'
    });
  };

  return (
    <View style={styles.container}>
      {/* Filter Controls */}
      <View style={styles.filterContainer}>
        <TouchableOpacity 
          style={styles.filterToggle}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Text style={styles.filterToggleText}>
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Text>
        </TouchableOpacity>

        {showFilters && (
          <View style={styles.filterControls}>
            <View style={styles.filterRow}>
              <TextInput
                style={styles.priceInput}
                placeholder="Min Price"
                value={filters.priceMin}
                onChangeText={(value) => handleFilterChange('priceMin', value)}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.priceInput}
                placeholder="Max Price"
                value={filters.priceMax}
                onChangeText={(value) => handleFilterChange('priceMax', value)}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.filterRow}>
              <View style={styles.selectContainer}>
                <Text style={styles.selectLabel}>Type:</Text>
                <View style={styles.selectOptions}>
                  {propertyTypes.map(type => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.selectOption,
                        filters.propertyType === type && styles.selectOptionActive
                      ]}
                      onPress={() => handleFilterChange('propertyType', type)}
                    >
                      <Text style={[
                        styles.selectOptionText,
                        filters.propertyType === type && styles.selectOptionTextActive
                      ]}>
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.filterRow}>
              <View style={styles.selectContainer}>
                <Text style={styles.selectLabel}>Status:</Text>
                <View style={styles.selectOptions}>
                  {statusOptions.map(status => (
                    <TouchableOpacity
                      key={status}
                      style={[
                        styles.selectOption,
                        filters.status === status && styles.selectOptionActive
                      ]}
                      onPress={() => handleFilterChange('status', status)}
                    >
                      <Text style={[
                        styles.selectOptionText,
                        filters.status === status && styles.selectOptionTextActive
                      ]}>
                        {status}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.clearButton}
              onPress={clearFilters}
            >
              <Text style={styles.clearButtonText}>Clear Filters</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Map */}
      <LoadScript googleMapsApiKey={process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={{
            lat: center.latitude,
            lng: center.longitude
          }}
          zoom={13}
          options={{
            styles: [
              {
                featureType: 'all',
                elementType: 'geometry',
                stylers: [{ color: '#242f3e' }]
              },
              {
                featureType: 'all',
                elementType: 'labels.text.stroke',
                stylers: [{ color: '#242f3e' }]
              },
              {
                featureType: 'all',
                elementType: 'labels.text.fill',
                stylers: [{ color: '#746855' }]
              },
              {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [{ color: '#17263c' }]
              }
            ],
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false
          }}
        >
          {filteredProperties.map((property) => (
            <Marker
              key={property.$id}
              position={{
                lat: property.coordinates.latitude,
                lng: property.coordinates.longitude
              }}
              onClick={() => handleMarkerClick(property)}
              icon={{
                url: getMarkerIcon(property.status),
                scaledSize: new window.google.maps.Size(40, 40)
              }}
            >
              {selectedProperty && selectedProperty.$id === property.$id && (
                <InfoWindow
                  position={{
                    lat: property.coordinates.latitude,
                    lng: property.coordinates.longitude
                  }}
                  onCloseClick={handleInfoWindowClose}
                >
                  <div style={{
                    padding: '8px',
                    maxWidth: '200px'
                  }}>
                    <h3 style={{
                      margin: '0 0 8px 0',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      color: '#1a1a1a'
                    }}>{property.title}</h3>
                    <p style={{
                      margin: '0',
                      fontSize: '14px',
                      color: '#666'
                    }}>{property.description}</p>
                    <p style={{
                      margin: '8px 0 0 0',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      color: '#1da1f2'
                    }}>TSh {property.price.toLocaleString()}</p>
                    <p style={{
                      margin: '4px 0 0 0',
                      fontSize: '12px',
                      color: getStatusColor(property.status)
                    }}>Status: {property.status}</p>
                  </div>
                </InfoWindow>
              )}
            </Marker>
          ))}
        </GoogleMap>
      </LoadScript>
    </View>
  );
};

const getMarkerIcon = (status: string) => {
  switch (status) {
    case 'Available':
      return 'https://maps.google.com/mapfiles/ms/icons/green-dot.png';
    case 'Occupied':
      return 'https://maps.google.com/mapfiles/ms/icons/red-dot.png';
    case 'Under Maintenance':
      return 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
    default:
      return 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Available':
      return '#4caf50';
    case 'Occupied':
      return '#f44336';
    case 'Under Maintenance':
      return '#ff9800';
    default:
      return '#666666';
  }
};

const styles = StyleSheet.create({
  container: {
    height: 300,
    width: '100%',
    marginVertical: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  filterContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  filterToggle: {
    backgroundColor: '#1da1f2',
    padding: 8,
    borderRadius: 4,
  },
  filterToggleText: {
    color: 'white',
    fontWeight: 'bold',
  },
  filterControls: {
    marginTop: 10,
    width: 280,
  },
  filterRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  priceInput: {
    flex: 1,
    marginRight: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  selectContainer: {
    flex: 1,
  },
  selectLabel: {
    marginBottom: 5,
    color: '#666',
  },
  selectOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
  },
  selectOption: {
    padding: 6,
    borderRadius: 4,
    backgroundColor: '#f0f0f0',
    marginRight: 5,
    marginBottom: 5,
  },
  selectOptionActive: {
    backgroundColor: '#1da1f2',
  },
  selectOptionText: {
    color: '#666',
    fontSize: 12,
  },
  selectOptionTextActive: {
    color: 'white',
  },
  clearButton: {
    backgroundColor: '#ff4444',
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 5,
  },
  clearButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default WebPropertyMap; 
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Property } from '../../types';

export type PropertyFilter = {
  search: string;
  status: string;
  priceMin: string;
  priceMax: string;
  type: string;
};

type Props = {
  onFilterChange: (filters: PropertyFilter) => void;
  properties?: Property[];
};

const PropertySearch = ({ onFilterChange, properties }: Props) => {
  const [filters, setFilters] = useState<PropertyFilter>({
    search: '',
    status: '',
    priceMin: '',
    priceMax: '',
    type: '',
  });

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    onFilterChange(filters);
  }, [filters]);

  const handleFilterChange = (key: keyof PropertyFilter, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: '',
      priceMin: '',
      priceMax: '',
      type: '',
    });
  };

  const propertyTypes = ['Apartment', 'House', 'Villa', 'Studio'];
  const statusTypes = ['Available', 'Occupied', 'Under Maintenance'];

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search properties..."
          value={filters.search}
          onChangeText={(text) => handleFilterChange('search', text)}
        />
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Ionicons
            name={showFilters ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#1da1f2"
          />
          <Text style={styles.filterButtonText}>Filters</Text>
        </TouchableOpacity>
      </View>

      {showFilters && (
        <View style={styles.filtersContainer}>
          <View style={styles.filterRow}>
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Status</Text>
              <View style={styles.buttonGroup}>
                {statusTypes.map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.filterChip,
                      filters.status === status && styles.filterChipActive,
                    ]}
                    onPress={() =>
                      handleFilterChange('status', filters.status === status ? '' : status)
                    }
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        filters.status === status && styles.filterChipTextActive,
                      ]}
                    >
                      {status}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.filterRow}>
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Property Type</Text>
              <View style={styles.buttonGroup}>
                {propertyTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.filterChip,
                      filters.type === type && styles.filterChipActive,
                    ]}
                    onPress={() =>
                      handleFilterChange('type', filters.type === type ? '' : type)
                    }
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        filters.type === type && styles.filterChipTextActive,
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.filterRow}>
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Price Range</Text>
              <View style={styles.priceInputs}>
                <TextInput
                  style={styles.priceInput}
                  placeholder="Min"
                  value={filters.priceMin}
                  onChangeText={(text) => handleFilterChange('priceMin', text)}
                  keyboardType="numeric"
                />
                <Text style={styles.priceSeparator}>-</Text>
                <TextInput
                  style={styles.priceInput}
                  placeholder="Max"
                  value={filters.priceMax}
                  onChangeText={(text) => handleFilterChange('priceMax', text)}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
            <Text style={styles.clearButtonText}>Clear Filters</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
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
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    borderLeftWidth: 1,
    borderLeftColor: '#e1e4e8',
  },
  filterButtonText: {
    marginLeft: 4,
    color: '#1da1f2',
    fontWeight: '500',
  },
  filtersContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginTop: 8,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      },
      default: {
        elevation: 2,
      },
    }),
  },
  filterRow: {
    marginBottom: 16,
  },
  filterGroup: {
    marginBottom: 8,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#444',
    marginBottom: 8,
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f5f8fa',
    marginHorizontal: 4,
    marginBottom: 8,
  },
  filterChipActive: {
    backgroundColor: '#1da1f2',
  },
  filterChipText: {
    color: '#444',
    fontSize: 14,
  },
  filterChipTextActive: {
    color: '#fff',
  },
  priceInputs: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#e1e4e8',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  priceSeparator: {
    marginHorizontal: 8,
    color: '#666',
  },
  clearButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f5f8fa',
  },
  clearButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default PropertySearch; 
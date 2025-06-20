import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  ScrollView,
} from 'react-native';
import { Analytics } from '../../types';
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

type Props = {
  totalProperties: number;
  occupiedProperties: number;
  totalRevenue: number;
  monthlyRevenue: {
    month: string;
    amount: number;
    percentage: number;
  }[];
  occupancyRate: number;
  maintenanceRequests: number;
};

const PropertyAnalytics = ({ 
  totalProperties,
  occupiedProperties,
  totalRevenue,
  monthlyRevenue,
  occupancyRate,
  maintenanceRequests 
}: Props) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${Math.round(value)}%`;
  };

  return (
    <View style={styles.container}>
      {/* Overview Cards */}
      <View style={styles.overviewContainer}>
        <View style={styles.card}>
          <MaterialCommunityIcons name="home-group" size={24} color="#1da1f2" />
          <View style={styles.cardContent}>
            <Text style={styles.cardValue}>{totalProperties}</Text>
            <Text style={styles.cardLabel}>Total Properties</Text>
          </View>
        </View>

        <View style={styles.card}>
          <MaterialCommunityIcons name="home" size={24} color="#1da1f2" />
          <View style={styles.cardContent}>
            <Text style={styles.cardValue}>{occupiedProperties}</Text>
            <Text style={styles.cardLabel}>Occupied</Text>
          </View>
        </View>

        <View style={styles.card}>
          <FontAwesome5 name="percentage" size={20} color="#1da1f2" />
          <View style={styles.cardContent}>
            <Text style={styles.cardValue}>{formatPercentage(occupancyRate)}</Text>
            <Text style={styles.cardLabel}>Occupancy Rate</Text>
          </View>
        </View>

        <View style={styles.card}>
          <MaterialCommunityIcons name="cash" size={24} color="#1da1f2" />
          <View style={styles.cardContent}>
            <Text style={styles.cardValue}>{formatCurrency(totalRevenue)}</Text>
            <Text style={styles.cardLabel}>Total Revenue</Text>
          </View>
        </View>
      </View>

      {/* Revenue Chart */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Monthly Revenue</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.chart}>
            {monthlyRevenue.map((item, index) => (
              <View key={item.month} style={styles.chartColumn}>
                <View
                  style={[
                    styles.chartBar,
                    { height: `${item.percentage}%` },
                  ]}
                />
                <Text style={styles.chartLabel}>{item.month}</Text>
                <Text style={styles.chartValue}>
                  {formatCurrency(item.amount)}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Additional Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Average Rent</Text>
            <Text style={styles.statValue}>{formatCurrency(totalRevenue / totalProperties)}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Vacancy Rate</Text>
            <Text style={styles.statValue}>{formatPercentage(1 - occupancyRate)}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Pending Maintenance</Text>
            <Text style={styles.statValue}>{maintenanceRequests}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Overdue Payments</Text>
            <Text style={styles.statValue}>
              {formatCurrency(totalRevenue * (1 - occupancyRate))}
            </Text>
          </View>
        </View>
      </View>

      {/* Property Types Distribution */}
      <View style={styles.distributionContainer}>
        <Text style={styles.sectionTitle}>Property Types</Text>
        <View style={styles.distributionContent}>
          {/* Implementation of property types distribution */}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  overviewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
    marginBottom: 24,
  },
  card: {
    flex: 1,
    minWidth: 200,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 8,
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      },
      default: {
        elevation: 2,
      },
    }),
  },
  cardContent: {
    marginLeft: 12,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  cardLabel: {
    fontSize: 14,
    color: '#666',
  },
  chartContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      },
      default: {
        elevation: 2,
      },
    }),
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  chart: {
    flexDirection: 'row',
    height: 200,
    paddingVertical: 16,
  },
  chartColumn: {
    alignItems: 'center',
    marginRight: 24,
    height: '100%',
    justifyContent: 'flex-end',
  },
  chartBar: {
    width: 40,
    backgroundColor: '#1da1f2',
    borderRadius: 4,
    marginBottom: 8,
  },
  chartLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  chartValue: {
    fontSize: 12,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  statsContainer: {
    marginBottom: 24,
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: -8,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 8,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      },
      default: {
        elevation: 2,
      },
    }),
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  distributionContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      },
      default: {
        elevation: 2,
      },
    }),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  distributionContent: {
    marginTop: 8,
  },
  distributionItem: {
    marginBottom: 16,
  },
  distributionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  distributionLabel: {
    fontSize: 14,
    color: '#666',
  },
  distributionValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  distributionBar: {
    height: 8,
    backgroundColor: '#f5f8fa',
    borderRadius: 4,
    overflow: 'hidden',
  },
  distributionProgress: {
    height: '100%',
    backgroundColor: '#1da1f2',
    borderRadius: 4,
  },
});

export default PropertyAnalytics; 
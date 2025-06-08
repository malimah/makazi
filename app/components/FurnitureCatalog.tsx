import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
} from 'react-native';

// Sample furniture catalog data
const FURNITURE_CATALOG = [
  {
    id: 'bed-single',
    name: 'Single Bed',
    category: 'Bedroom',
    dimensions: { width: 0.9, length: 2.0, height: 0.5 },
    modelUrl: '/models/bed-single.glb', // These will need to be actual model URLs
    thumbnail: '/thumbnails/bed-single.png',
  },
  {
    id: 'sofa-3seater',
    name: '3-Seater Sofa',
    category: 'Living Room',
    dimensions: { width: 2.0, length: 0.85, height: 0.7 },
    modelUrl: '/models/sofa-3seater.glb',
    thumbnail: '/thumbnails/sofa-3seater.png',
  },
  {
    id: 'dining-table',
    name: 'Dining Table',
    category: 'Dining Room',
    dimensions: { width: 1.5, length: 0.9, height: 0.75 },
    modelUrl: '/models/dining-table.glb',
    thumbnail: '/thumbnails/dining-table.png',
  },
  {
    id: 'wardrobe',
    name: 'Wardrobe',
    category: 'Bedroom',
    dimensions: { width: 1.2, length: 0.6, height: 2.0 },
    modelUrl: '/models/wardrobe.glb',
    thumbnail: '/thumbnails/wardrobe.png',
  },
];

interface FurnitureCatalogProps {
  onSelectFurniture: (furniture: any) => void;
}

export default function FurnitureCatalog({ onSelectFurniture }: FurnitureCatalogProps) {
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const categories = ['All', ...new Set(FURNITURE_CATALOG.map(item => item.category))];
  
  const filteredFurniture = selectedCategory === 'All'
    ? FURNITURE_CATALOG
    : FURNITURE_CATALOG.filter(item => item.category === selectedCategory);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Furniture Catalog</Text>
      
      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
      >
        {categories.map(category => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.categoryButtonActive
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[
              styles.categoryButtonText,
              selectedCategory === category && styles.categoryButtonTextActive
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Furniture Grid */}
      <ScrollView style={styles.furnitureGrid}>
        <View style={styles.gridContainer}>
          {filteredFurniture.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.furnitureItem}
              onPress={() => onSelectFurniture(item)}
            >
              <View style={styles.thumbnailContainer}>
                <Image
                  source={{ uri: item.thumbnail }}
                  style={styles.thumbnail}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.furnitureName}>{item.name}</Text>
              <Text style={styles.dimensionsText}>
                {`${item.dimensions.width}m × ${item.dimensions.length}m × ${item.dimensions.height}m`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#14171a',
  },
  categoryScroll: {
    marginBottom: 15,
  },
  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f8fa',
    marginRight: 10,
  },
  categoryButtonActive: {
    backgroundColor: '#1da1f2',
  },
  categoryButtonText: {
    color: '#657786',
    fontSize: 14,
  },
  categoryButtonTextActive: {
    color: '#fff',
  },
  furnitureGrid: {
    maxHeight: 400,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },
  furnitureItem: {
    width: '50%',
    padding: 5,
  },
  thumbnailContainer: {
    aspectRatio: 1,
    backgroundColor: '#f5f8fa',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  furnitureName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#14171a',
    marginBottom: 4,
  },
  dimensionsText: {
    fontSize: 12,
    color: '#657786',
  },
}); 
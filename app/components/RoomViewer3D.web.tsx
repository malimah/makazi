import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Room dimensions in meters
interface RoomDimensions {
  width: number;
  length: number;
  height: number;
}

interface RoomViewerProps {
  dimensions: RoomDimensions;
  furniture?: any[]; // Array of furniture objects with position, rotation, and model info
}

// Web fallback component for RoomViewer3D
export default function RoomViewer3D({ dimensions, furniture = [] }: RoomViewerProps) {
  const { width, length, height } = dimensions;
  
  return (
    <View style={styles.container}>
      <View style={styles.roomContainer}>
        {/* Room representation */}
        <View style={[styles.room, { width: width * 20, height: length * 20 }]}>
          <View style={styles.floor} />
          <View style={styles.walls}>
            <View style={[styles.wall, styles.backWall]} />
            <View style={[styles.wall, styles.leftWall]} />
            <View style={[styles.wall, styles.rightWall]} />
          </View>
          
          {/* Dimensions display */}
          <View style={styles.dimensions}>
            <Text style={styles.dimensionText}>Width: {width.toFixed(2)}m</Text>
            <Text style={styles.dimensionText}>Length: {length.toFixed(2)}m</Text>
            <Text style={styles.dimensionText}>Height: {height.toFixed(2)}m</Text>
          </View>
          
          {/* Furniture count */}
          {furniture.length > 0 && (
            <View style={styles.furnitureInfo}>
              <Text style={styles.furnitureText}>
                {furniture.length} furniture item{furniture.length !== 1 ? 's' : ''}
              </Text>
            </View>
          )}
        </View>
      </View>
      
      <Text style={styles.note}>
        3D Viewer is not available on web. This is a 2D representation.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 500,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  roomContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  room: {
    position: 'relative',
    backgroundColor: '#f0f0f0',
    borderWidth: 2,
    borderColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  floor: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#e0e0e0',
  },
  walls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  wall: {
    position: 'absolute',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  backWall: {
    top: 0,
    left: 0,
    right: 0,
    height: 10,
  },
  leftWall: {
    top: 0,
    left: 0,
    width: 10,
    bottom: 0,
  },
  rightWall: {
    top: 0,
    right: 0,
    width: 10,
    bottom: 0,
  },
  dimensions: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 10,
    borderRadius: 5,
  },
  dimensionText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  furnitureInfo: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 8,
    borderRadius: 5,
  },
  furnitureText: {
    fontSize: 12,
    color: '#fff',
  },
  note: {
    marginTop: 20,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
}); 
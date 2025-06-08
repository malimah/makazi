import { Platform } from 'react-native';
import { suggestOptimalArrangement, RoomLayout, RoomFeature } from './roomPlanningUtils';

export interface FurnitureDimensions {
  width: number;
  length: number;
  height: number;
}

export interface FurnitureItem {
  id: string;
  name: string;
  category: string;
  dimensions: FurnitureDimensions;
  price: string;
}

export const loadFurnitureCatalog = async (): Promise<FurnitureItem[]> => {
  try {
    if (Platform.OS === 'web') {
      const response = await fetch('/furniture-catalog.json');
      return await response.json();
    } else {
      // For mobile, we'll use the static catalog
      return STATIC_CATALOG;
    }
  } catch (error) {
    console.error('Error loading furniture catalog:', error);
    return STATIC_CATALOG;
  }
};

// Fallback static catalog
const STATIC_CATALOG: FurnitureItem[] = [
  {
    id: 'bed-single',
    name: 'Single Bed',
    category: 'Bedroom',
    dimensions: { width: 0.9, length: 2.0, height: 0.5 },
    price: 'TSh 250,000'
  },
  {
    id: 'sofa-3seater',
    name: '3-Seater Sofa',
    category: 'Living Room',
    dimensions: { width: 2.0, length: 0.85, height: 0.7 },
    price: 'TSh 450,000'
  },
  {
    id: 'dining-table',
    name: 'Dining Table',
    category: 'Dining Room',
    dimensions: { width: 1.5, length: 0.9, height: 0.75 },
    price: 'TSh 300,000'
  },
  {
    id: 'wardrobe',
    name: 'Wardrobe',
    category: 'Bedroom',
    dimensions: { width: 1.2, length: 0.6, height: 2.0 },
    price: 'TSh 400,000'
  }
];

// Helper function to create a basic furniture mesh
export const createFurnitureMesh = (dimensions: FurnitureDimensions) => {
  const { width, length, height } = dimensions;
  
  // Return dimensions for a basic box geometry
  return {
    geometry: { width, height, depth: length },
    material: { color: '#cccccc' }
  };
};

// Helper function to calculate if furniture fits in a room
export const doesFurnitureFit = (
  furniture: FurnitureItem,
  roomDimensions: FurnitureDimensions,
  existingFurniture: Array<{
    item: FurnitureItem;
    position: [number, number, number];
  }>
): boolean => {
  // Create a basic room layout without features
  const layout: RoomLayout = {
    dimensions: roomDimensions,
    features: []
  };

  // Convert existing furniture to the format expected by canPlaceFurniture
  const existingWithRotation = existingFurniture.map(ef => ({
    ...ef,
    rotation: [0, 0, 0] as [number, number, number]
  }));

  // Try different rotations
  for (const rotation of [0, Math.PI / 2, Math.PI, 3 * Math.PI / 2]) {
    const rot: [number, number, number] = [0, rotation, 0];
    
    // Try each grid position
    for (const pos of generateGridPositions(roomDimensions)) {
      const position: [number, number, number] = [pos[0], 0, pos[1]];
      
      if (canPlaceFurniture(furniture, position, rot, layout, existingWithRotation)) {
        return true;
      }
    }
  }

  return false;
};

// Helper function to suggest furniture arrangement
export const suggestFurnitureArrangement = (
  furniture: FurnitureItem[],
  roomDimensions: FurnitureDimensions,
  features: RoomFeature[] = []
): Array<{
  item: FurnitureItem;
  position: [number, number, number];
  rotation: [number, number, number];
  score: number;
}> => {
  // Create room layout with features
  const layout: RoomLayout = {
    dimensions: roomDimensions,
    features
  };

  // Use the optimal arrangement algorithm
  return suggestOptimalArrangement(furniture, layout);
};

// Helper function to generate grid positions
function generateGridPositions(dimensions: FurnitureDimensions): Array<[number, number]> {
  const gridSize = 0.5; // 0.5m grid
  const positions: Array<[number, number]> = [];
  
  for (let x = 0; x <= dimensions.width; x += gridSize) {
    for (let z = 0; z <= dimensions.length; z += gridSize) {
      positions.push([x, z]);
    }
  }
  
  return positions;
}

// Helper function to check if a position is occupied by existing furniture
function isPositionOccupied(
  position: [number, number, number],
  item: FurnitureItem,
  existingPosition: [number, number, number]
): boolean {
  const [x1, _, z1] = position;
  const [x2, __, z2] = existingPosition;
  
  return !(
    x1 + item.dimensions.width <= x2 ||
    x2 + item.dimensions.width <= x1 ||
    z1 + item.dimensions.length <= z2 ||
    z2 + item.dimensions.length <= z1
  );
}

// Helper function to check if furniture can be placed at position
function canPlaceFurniture(
  item: FurnitureItem,
  position: [number, number, number],
  rotation: [number, number, number],
  layout: RoomLayout,
  existingFurniture: Array<{
    item: FurnitureItem;
    position: [number, number, number];
    rotation: [number, number, number];
  }>
): boolean {
  // Check room boundaries
  const [x, _, z] = position;
  const rotated = rotation[1] % Math.PI !== 0;
  const width = rotated ? item.dimensions.length : item.dimensions.width;
  const length = rotated ? item.dimensions.width : item.dimensions.length;

  if (
    x < 0 || x + width > layout.dimensions.width ||
    z < 0 || z + length > layout.dimensions.length
  ) {
    return false;
  }

  // Check collision with existing furniture
  for (const existing of existingFurniture) {
    if (isPositionOccupied(position, item, existing.position)) {
      return false;
    }
  }

  return true;
} 
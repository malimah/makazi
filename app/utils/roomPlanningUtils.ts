import { FurnitureItem, FurnitureDimensions } from './furnitureUtils';

export interface RoomFeature {
  type: 'window' | 'door';
  wall: 'north' | 'south' | 'east' | 'west';
  position: number; // Position along the wall (0-1)
  width: number;
  height: number;
}

export interface RoomLayout {
  dimensions: FurnitureDimensions;
  features: RoomFeature[];
}

// Best practices for furniture placement
const PLACEMENT_RULES = {
  BED: {
    preferredWalls: ['north', 'east'], // Best walls for bed placement
    avoidWalls: [], // Walls to avoid
    minDistanceFromDoor: 1.0, // Meters
    windowPreference: 'adjacent', // 'adjacent' | 'avoid' | 'neutral'
  },
  SOFA: {
    preferredWalls: ['north', 'south'],
    avoidWalls: [],
    minDistanceFromDoor: 0.5,
    windowPreference: 'facing',
  },
  'DINING-TABLE': {
    preferredWalls: [],
    avoidWalls: [],
    minDistanceFromDoor: 1.0,
    windowPreference: 'neutral',
    preferNaturalLight: true,
  },
  WARDROBE: {
    preferredWalls: ['south', 'west'],
    avoidWalls: [],
    minDistanceFromDoor: 0.3,
    windowPreference: 'avoid',
  },
};

// Score a potential furniture position based on rules
function scorePosition(
  item: FurnitureItem,
  position: [number, number, number],
  rotation: [number, number, number],
  layout: RoomLayout
): number {
  let score = 0;
  const rules = PLACEMENT_RULES[item.category.toUpperCase()] || {};

  // Check distance from features
  layout.features.forEach(feature => {
    // Convert position to wall coordinates
    const [x, y, z] = position;
    const featurePos = getFeaturePosition(feature, layout.dimensions);
    
    // Score based on distance from doors
    if (feature.type === 'door') {
      const distance = calculateDistance([x, z], featurePos);
      if (distance < rules.minDistanceFromDoor) {
        score -= 10; // Heavy penalty for blocking doors
      }
    }

    // Score based on window preferences
    if (feature.type === 'window') {
      const distance = calculateDistance([x, z], featurePos);
      switch (rules.windowPreference) {
        case 'adjacent':
          score += 5 / (distance + 1); // Higher score for closer to windows
          break;
        case 'avoid':
          score -= 3 / (distance + 1); // Lower score for closer to windows
          break;
        case 'facing':
          // Check if furniture faces the window
          const facingScore = isFacingWindow(position, rotation, feature) ? 5 : 0;
          score += facingScore;
          break;
      }
    }
  });

  // Score based on wall preferences
  const nearestWall = findNearestWall(position, layout.dimensions);
  if (rules.preferredWalls?.includes(nearestWall)) {
    score += 5;
  }
  if (rules.avoidWalls?.includes(nearestWall)) {
    score -= 5;
  }

  return score;
}

// Helper function to calculate distance between points
function calculateDistance(point1: [number, number], point2: [number, number]): number {
  const [x1, y1] = point1;
  const [x2, y2] = point2;
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

// Helper function to convert feature position to room coordinates
function getFeaturePosition(feature: RoomFeature, dimensions: FurnitureDimensions): [number, number] {
  switch (feature.wall) {
    case 'north':
      return [dimensions.width * feature.position, dimensions.length];
    case 'south':
      return [dimensions.width * feature.position, 0];
    case 'east':
      return [dimensions.width, dimensions.length * feature.position];
    case 'west':
      return [0, dimensions.length * feature.position];
  }
}

// Helper function to check if furniture faces a window
function isFacingWindow(
  position: [number, number, number],
  rotation: [number, number, number],
  window: RoomFeature
): boolean {
  // Calculate furniture facing direction based on rotation
  const facingDirection = getFacingDirection(rotation);
  const windowDirection = window.wall;
  
  // Compare facing direction with window direction
  return (
    (facingDirection === 'north' && windowDirection === 'south') ||
    (facingDirection === 'south' && windowDirection === 'north') ||
    (facingDirection === 'east' && windowDirection === 'west') ||
    (facingDirection === 'west' && windowDirection === 'east')
  );
}

// Helper function to determine facing direction from rotation
function getFacingDirection(rotation: [number, number, number]): 'north' | 'south' | 'east' | 'west' {
  const [_, yRotation, __] = rotation;
  const normalizedRotation = ((yRotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
  
  if (normalizedRotation < Math.PI / 4 || normalizedRotation >= 7 * Math.PI / 4) return 'north';
  if (normalizedRotation < 3 * Math.PI / 4) return 'east';
  if (normalizedRotation < 5 * Math.PI / 4) return 'south';
  return 'west';
}

// Helper function to find nearest wall
function findNearestWall(
  position: [number, number, number],
  dimensions: FurnitureDimensions
): 'north' | 'south' | 'east' | 'west' {
  const [x, _, z] = position;
  const distanceToWalls = {
    north: Math.abs(z - dimensions.length),
    south: Math.abs(z),
    east: Math.abs(x - dimensions.width),
    west: Math.abs(x),
  };
  
  return Object.entries(distanceToWalls)
    .reduce((nearest, [wall, distance]) => 
      distance < distanceToWalls[nearest] ? wall as 'north' | 'south' | 'east' | 'west' : nearest
    , 'north');
}

// Main function to suggest optimal furniture arrangement
export function suggestOptimalArrangement(
  furniture: FurnitureItem[],
  layout: RoomLayout,
  maxIterations: number = 100
): Array<{
  item: FurnitureItem;
  position: [number, number, number];
  rotation: [number, number, number];
  score: number;
}> {
  let bestArrangement = [];
  let bestScore = -Infinity;

  // Try different arrangements
  for (let i = 0; i < maxIterations; i++) {
    const arrangement = [];
    let totalScore = 0;
    let availableSpace = [...generateGridPositions(layout.dimensions)];

    // Sort furniture by size (larger items first)
    const sortedFurniture = [...furniture].sort((a, b) => 
      (b.dimensions.width * b.dimensions.length) - (a.dimensions.width * a.dimensions.length)
    );

    // Place each piece of furniture
    for (const item of sortedFurniture) {
      let bestPositionForItem = null;
      let bestScoreForItem = -Infinity;
      let bestRotationForItem: [number, number, number] = [0, 0, 0];

      // Try each available position
      for (const position of availableSpace) {
        // Try different rotations
        for (const rotation of [0, Math.PI / 2, Math.PI, 3 * Math.PI / 2]) {
          const pos: [number, number, number] = [position[0], 0, position[1]];
          const rot: [number, number, number] = [0, rotation, 0];
          
          if (canPlaceFurniture(item, pos, rot, layout, arrangement)) {
            const score = scorePosition(item, pos, rot, layout);
            if (score > bestScoreForItem) {
              bestScoreForItem = score;
              bestPositionForItem = pos;
              bestRotationForItem = rot;
            }
          }
        }
      }

      // Add best position to arrangement
      if (bestPositionForItem) {
        arrangement.push({
          item,
          position: bestPositionForItem,
          rotation: bestRotationForItem,
          score: bestScoreForItem,
        });
        totalScore += bestScoreForItem;
        
        // Remove used space from available positions
        availableSpace = availableSpace.filter(pos => 
          !isPositionOccupied([pos[0], 0, pos[1]], item, bestPositionForItem!)
        );
      }
    }

    // Update best arrangement if current is better
    if (totalScore > bestScore) {
      bestScore = totalScore;
      bestArrangement = arrangement;
    }
  }

  return bestArrangement;
}

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
    if (checkCollision(
      item, position, rotation,
      existing.item, existing.position, existing.rotation
    )) {
      return false;
    }
  }

  // Check minimum distance from doors
  for (const feature of layout.features) {
    if (feature.type === 'door') {
      const featurePos = getFeaturePosition(feature, layout.dimensions);
      const distance = calculateDistance([x, z], featurePos);
      const rules = PLACEMENT_RULES[item.category.toUpperCase()] || {};
      
      if (distance < rules.minDistanceFromDoor) {
        return false;
      }
    }
  }

  return true;
}

// Helper function to check collision between furniture items
function checkCollision(
  item1: FurnitureItem,
  pos1: [number, number, number],
  rot1: [number, number, number],
  item2: FurnitureItem,
  pos2: [number, number, number],
  rot2: [number, number, number]
): boolean {
  // Simple box collision check
  const [x1, _, z1] = pos1;
  const [x2, __, z2] = pos2;
  
  const rotated1 = rot1[1] % Math.PI !== 0;
  const rotated2 = rot2[1] % Math.PI !== 0;
  
  const width1 = rotated1 ? item1.dimensions.length : item1.dimensions.width;
  const length1 = rotated1 ? item1.dimensions.width : item1.dimensions.length;
  const width2 = rotated2 ? item2.dimensions.length : item2.dimensions.width;
  const length2 = rotated2 ? item2.dimensions.width : item2.dimensions.length;

  return !(
    x1 + width1 <= x2 ||
    x2 + width2 <= x1 ||
    z1 + length1 <= z2 ||
    z2 + length2 <= z1
  );
}

// Default export to fix expo-router warning
export default {}; 
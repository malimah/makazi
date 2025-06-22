import { databases } from '../../utils/appwrite';

const DATABASE_ID = '68286dbc002bee374429';
const COLLECTION_ID = '68286efe002e00dbe24d';

export interface PropertyDimensions {
  width: number;
  length: number;
  height: number;
}

export interface FurnitureItem {
  id: string;
  modelUrl: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
}

export const updatePropertyDimensions = async (
  propertyId: string,
  dimensions: PropertyDimensions
) => {
  try {
    await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_ID,
      propertyId,
      { dimensions }
    );
    return true;
  } catch (error) {
    console.error('Error updating property dimensions:', error);
    return false;
  }
};

export const updatePropertyFurniture = async (
  propertyId: string,
  furniture: FurnitureItem[]
) => {
  try {
    await databases.updateDocument(
      DATABASE_ID,
      COLLECTION_ID,
      propertyId,
      { furniture }
    );
    return true;
  } catch (error) {
    console.error('Error updating property furniture:', error);
    return false;
  }
};

export type PropertyType = 'Studio' | 'One Bedroom' | 'Two Bedroom' | 'Three Bedroom' | 'Apartment' | 'House';

// Helper function to get default dimensions based on property type
export const getDefaultDimensions = (propertyType: PropertyType): PropertyDimensions => {
  const dimensions: Record<PropertyType, PropertyDimensions> = {
    'Studio': { width: 4, length: 5, height: 2.8 },
    'One Bedroom': { width: 6, length: 8, height: 2.8 },
    'Two Bedroom': { width: 8, length: 10, height: 2.8 },
    'Three Bedroom': { width: 10, length: 12, height: 2.8 },
    'Apartment': { width: 8, length: 10, height: 2.8 },
    'House': { width: 12, length: 15, height: 2.8 },
  };
  
  return dimensions[propertyType] || { width: 6, length: 8, height: 2.8 };
};

// Default export to fix expo-router warning
export default {}; 
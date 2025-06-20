import { Client, Account, ID, Databases, Storage, Permission, Role, Query, Models } from 'react-native-appwrite';

// Ensure we're using the environment variables
const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('682865cf003e73ffa31e');  // Updated project ID

// Initialize services
const account = new Account(client);
const databases = new Databases(client);
const storage = new Storage(client);

// Database and Collection IDs from environment variables
const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID || '68286dbc002bee374429';
const PROPERTIES_COLLECTION = process.env.EXPO_PUBLIC_APPWRITE_PROPERTIES_COLLECTION || '68286efe002e00dbe24d';
const TENANTS_COLLECTION = process.env.EXPO_PUBLIC_APPWRITE_TENANTS_COLLECTION || '682d7c0c7a3606c1f0d0';
const MAINTENANCE_COLLECTION = process.env.EXPO_PUBLIC_APPWRITE_MAINTENANCE_COLLECTION || '682d7c1d7a9e7c4a0d3f';
const PAYMENTS_COLLECTION = process.env.EXPO_PUBLIC_APPWRITE_PAYMENTS_COLLECTION || '682d7c2e7a0a0c1f0d3f';
const ANALYTICS_COLLECTION = process.env.EXPO_PUBLIC_APPWRITE_ANALYTICS_COLLECTION || '682d7c3f7a3606c1f0d0';

// Storage configuration
const STORAGE_BUCKET_ID = '682b32c2003a04448deb';

// Storage helper functions
export const storageAPI = {
  uploadFile: async (file: File, onProgress?: (progress: number) => void) => {
    try {
      console.log('Preparing to upload file:', {
        size: file.size,
        type: file.type,
        name: file.name
      });

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File size exceeds 10MB limit');
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Invalid file type. Only images are allowed');
      }

      // Create a custom upload function that tracks progress
      const uploadWithProgress = async () => {
        try {
          // Create file with proper permissions
          const uploadedFile = await storage.createFile(
            STORAGE_BUCKET_ID,
            ID.unique(),
            file,
            ['read("any")']  // Simple read permission for anyone
          );

          // Simulate progress since we can't track actual progress with the SDK
          if (onProgress) {
            onProgress(30);
            await new Promise(resolve => setTimeout(resolve, 300));
            onProgress(60);
            await new Promise(resolve => setTimeout(resolve, 300));
            onProgress(90);
            await new Promise(resolve => setTimeout(resolve, 300));
            onProgress(100);
          }

          return uploadedFile;
        } catch (error) {
          console.error('Upload error:', error);
          throw error;
        }
      };

      const uploadedFile = await uploadWithProgress();
      console.log('File uploaded successfully:', uploadedFile);
      return uploadedFile;
    } catch (error: any) {
      console.error('Storage API Error:', {
        message: error.message,
        code: error.code,
        type: error.constructor.name,
        response: error.response,
        status: error.response?.status,
        statusText: error.response?.statusText
      });

      // Handle specific error cases
      if (error.code === 401) {
        throw new Error('Authentication failed. Please log in again.');
      } else if (error.code === 403) {
        throw new Error('Permission denied. Please check your access rights.');
      } else if (error.message.includes('Failed to fetch')) {
        throw new Error('Network error. Please check your internet connection and try again.');
      }

      throw new Error(`File upload failed: ${error.message}`);
    }
  },

  deleteFile: async (fileId: string) => {
    try {
      await storage.deleteFile(STORAGE_BUCKET_ID, fileId);
    } catch (error: any) {
      console.error('Error deleting file:', error);
      throw new Error(`File deletion failed: ${error.message}`);
    }
  },

  getFileView: (fileId: string) => {
    try {
      return storage.getFileView(STORAGE_BUCKET_ID, fileId);
    } catch (error: any) {
      console.error('Error getting file view:', error);
      throw new Error(`Failed to get file view: ${error.message}`);
    }
  },

  getFilePreview: (fileId: string) => {
    try {
      return storage.getFilePreview(STORAGE_BUCKET_ID, fileId);
    } catch (error: any) {
      console.error('Error getting file preview:', error);
      throw new Error(`Failed to get file preview: ${error.message}`);
    }
  }
};

// Helper functions for tenants
export const tenantsAPI = {
  list: () => databases.listDocuments(DATABASE_ID, TENANTS_COLLECTION),
  create: (data: any) => databases.createDocument(DATABASE_ID, TENANTS_COLLECTION, ID.unique(), data),
  get: (id: string) => databases.getDocument(DATABASE_ID, TENANTS_COLLECTION, id),
  update: (id: string, data: any) => databases.updateDocument(DATABASE_ID, TENANTS_COLLECTION, id, data),
  delete: (id: string) => databases.deleteDocument(DATABASE_ID, TENANTS_COLLECTION, id),
};

// Helper functions for maintenance requests
export const maintenanceAPI = {
  list: () => databases.listDocuments(DATABASE_ID, MAINTENANCE_COLLECTION),
  create: (data: any) => databases.createDocument(DATABASE_ID, MAINTENANCE_COLLECTION, ID.unique(), data),
  get: (id: string) => databases.getDocument(DATABASE_ID, MAINTENANCE_COLLECTION, id),
  update: (id: string, data: any) => databases.updateDocument(DATABASE_ID, MAINTENANCE_COLLECTION, id, data),
  delete: (id: string) => databases.deleteDocument(DATABASE_ID, MAINTENANCE_COLLECTION, id),
};

// Helper functions for payments
export const paymentsAPI = {
  list: () => databases.listDocuments(DATABASE_ID, PAYMENTS_COLLECTION),
  create: (data: any) => databases.createDocument(DATABASE_ID, PAYMENTS_COLLECTION, ID.unique(), data),
  get: (id: string) => databases.getDocument(DATABASE_ID, PAYMENTS_COLLECTION, id),
  update: (id: string, data: any) => databases.updateDocument(DATABASE_ID, PAYMENTS_COLLECTION, id, data),
  delete: (id: string) => databases.deleteDocument(DATABASE_ID, PAYMENTS_COLLECTION, id),
};

// Helper functions for analytics
export const analyticsAPI = {
  list: () => databases.listDocuments(DATABASE_ID, ANALYTICS_COLLECTION),
  create: (data: any) => databases.createDocument(DATABASE_ID, ANALYTICS_COLLECTION, ID.unique(), data),
  get: (id: string) => databases.getDocument(DATABASE_ID, ANALYTICS_COLLECTION, id),
  update: (id: string, data: any) => databases.updateDocument(DATABASE_ID, ANALYTICS_COLLECTION, id, data),
  delete: (id: string) => databases.deleteDocument(DATABASE_ID, ANALYTICS_COLLECTION, id),
  
  // Custom analytics functions
  getPropertyAnalytics: async (propertyId: string) => {
    const [property, tenants, payments, maintenance] = await Promise.all([
      databases.getDocument(DATABASE_ID, PROPERTIES_COLLECTION, propertyId),
      databases.listDocuments(DATABASE_ID, TENANTS_COLLECTION, [
        Query.equal('propertyId', propertyId)
      ]),
      databases.listDocuments(DATABASE_ID, PAYMENTS_COLLECTION, [
        Query.equal('propertyId', propertyId)
      ]),
      databases.listDocuments(DATABASE_ID, MAINTENANCE_COLLECTION, [
        Query.equal('propertyId', propertyId)
      ])
    ]);

    return {
      property,
      tenants: tenants.documents,
      payments: payments.documents,
      maintenance: maintenance.documents,
    };
  },
};

export { client, account, ID, databases, storage, Permission, Role, Query, DATABASE_ID, STORAGE_BUCKET_ID };

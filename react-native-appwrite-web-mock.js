// Mock implementation of react-native-appwrite for web environment
// This provides a realistic simulation of Appwrite services for web development

// Mock Client class
export class Client {
  constructor() {
    this.endpoint = '';
    this.project = '';
  }

  setEndpoint(endpoint) {
    this.endpoint = endpoint;
    return this;
  }

  setProject(project) {
    this.project = project;
    return this;
  }

  setKey(key) {
    this.key = key;
    return this;
  }
}

// Mock Account class
export class Account {
  constructor(client) {
    this.client = client;
    this.currentUser = null;
    this.sessions = new Map();
    
    // Load existing user data from localStorage
    this.loadUserData();
  }

  loadUserData() {
    try {
      const storedUser = localStorage.getItem('mock-appwrite-user');
      if (storedUser) {
        this.currentUser = JSON.parse(storedUser);
      }
      
      const storedSessions = localStorage.getItem('mock-appwrite-sessions');
      if (storedSessions) {
        this.sessions = new Map(JSON.parse(storedSessions));
      }
    } catch (error) {
      console.warn('Failed to load mock user data:', error);
    }
  }

  saveUserData() {
    try {
      if (this.currentUser) {
        localStorage.setItem('mock-appwrite-user', JSON.stringify(this.currentUser));
      }
      localStorage.setItem('mock-appwrite-sessions', JSON.stringify(Array.from(this.sessions.entries())));
    } catch (error) {
      console.warn('Failed to save mock user data:', error);
    }
  }

  async create(userId, email, password, name) {
    console.log('Mock: Creating account for', email);
    
    const user = {
      $id: userId,
      email,
      name,
      prefs: { userType: 'landlord' },
      status: true,
      registration: new Date().toISOString(),
      emailVerification: true,
      phoneVerification: false,
    };
    
    this.currentUser = user;
    this.saveUserData();
    
    return user;
  }

  async createEmailPasswordSession(email, password) {
    console.log('Mock: Creating email password session for', email);
    
    // If no user exists, create a mock user
    if (!this.currentUser) {
      this.currentUser = {
        $id: 'mock-user-' + Date.now(),
        email: email,
        name: email.split('@')[0], // Use email prefix as name
        prefs: { userType: 'landlord' },
        status: true,
        registration: new Date().toISOString(),
        emailVerification: true,
        phoneVerification: false,
      };
      this.saveUserData();
    }
    
    const session = {
      $id: 'mock-session-' + Date.now(),
      userId: this.currentUser.$id,
      expire: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      provider: 'email',
      providerUid: email,
      current: true,
    };
    
    this.sessions.set(session.$id, session);
    this.saveUserData();
    
    return session;
  }

  async getSession(sessionId = 'current') {
    console.log('Mock: Getting session', sessionId);
    
    if (sessionId === 'current') {
      // Return the most recent session
      const sessions = Array.from(this.sessions.values());
      if (sessions.length > 0) {
        return sessions[sessions.length - 1];
      }
    }
    
    const session = this.sessions.get(sessionId);
    if (session) {
      return session;
    }
    
    throw new Error('Session not found');
  }

  async get() {
    console.log('Mock: Getting current user');
    
    if (!this.currentUser) {
      // Return a default user for development
      this.currentUser = {
        $id: 'mock-user-' + Date.now(),
        email: 'developer@example.com',
        name: 'Developer User',
        prefs: { userType: 'landlord' },
        status: true,
        registration: new Date().toISOString(),
        emailVerification: true,
        phoneVerification: false,
      };
      this.saveUserData();
    }
    
    return this.currentUser;
  }

  async updateName(name) {
    console.log('Mock: Updating name to', name);
    
    if (this.currentUser) {
      this.currentUser.name = name;
      this.saveUserData();
      return this.currentUser;
    }
    
    throw new Error('No user logged in');
  }

  async updateEmail(email) {
    console.log('Mock: Updating email to', email);
    
    if (this.currentUser) {
      this.currentUser.email = email;
      this.saveUserData();
      return this.currentUser;
    }
    
    throw new Error('No user logged in');
  }

  async updatePrefs(prefs) {
    console.log('Mock: Updating prefs', prefs);
    
    if (this.currentUser) {
      this.currentUser.prefs = { ...this.currentUser.prefs, ...prefs };
      this.saveUserData();
      return this.currentUser;
    }
    
    throw new Error('No user logged in');
  }

  async deleteSession(sessionId) {
    console.log('Mock: Deleting session', sessionId);
    this.sessions.delete(sessionId);
    this.saveUserData();
    return {};
  }

  async deleteSessions() {
    console.log('Mock: Deleting all sessions');
    this.sessions.clear();
    this.saveUserData();
    return {};
  }

  // Other methods that return empty promises
  async updatePassword() {
    return Promise.resolve({});
  }

  async createEmailSession() {
    return Promise.resolve({});
  }

  async createAnonymousSession() {
    return Promise.resolve({});
  }

  async createJWT() {
    return Promise.resolve({});
  }

  async createMagicURLSession() {
    return Promise.resolve({});
  }

  async createOAuth2Session() {
    return Promise.resolve({});
  }

  async createPhoneSession() {
    return Promise.resolve({});
  }

  async createPhoneVerification() {
    return Promise.resolve({});
  }

  async createRecovery() {
    return Promise.resolve({});
  }

  async createVerification() {
    return Promise.resolve({});
  }

  async getLogs() {
    return Promise.resolve([]);
  }

  async getPrefs() {
    return Promise.resolve(this.currentUser?.prefs || {});
  }

  async getSessions() {
    return Promise.resolve(Array.from(this.sessions.values()));
  }

  async listIdentities() {
    return Promise.resolve([]);
  }

  async listSessions() {
    return Promise.resolve(Array.from(this.sessions.values()));
  }

  async updatePhone() {
    return Promise.resolve({});
  }

  async updatePhoneSession() {
    return Promise.resolve({});
  }

  async updateRecovery() {
    return Promise.resolve({});
  }

  async updateSession() {
    return Promise.resolve({});
  }

  async updateVerification() {
    return Promise.resolve({});
  }
}

// Mock Databases class
export class Databases {
  constructor(client) {
    this.client = client;
  }

  async createDocument(databaseId, collectionId, documentId, data, permissions = []) {
    return Promise.resolve({ $id: documentId, ...data });
  }

  async updateDocument(databaseId, collectionId, documentId, data) {
    return Promise.resolve({ $id: documentId, ...data });
  }

  async deleteDocument(databaseId, collectionId, documentId) {
    return Promise.resolve({});
  }

  async getDocument(databaseId, collectionId, documentId) {
    return Promise.resolve({ $id: documentId });
  }

  async listDocuments(databaseId, collectionId, queries = []) {
    return Promise.resolve({ documents: [], total: 0 });
  }

  async createCollection(databaseId, collectionId, name, permissions = []) {
    return Promise.resolve({ $id: collectionId, name });
  }

  async updateCollection(databaseId, collectionId, name, permissions = []) {
    return Promise.resolve({ $id: collectionId, name });
  }

  async deleteCollection(databaseId, collectionId) {
    return Promise.resolve({});
  }

  async getCollection(databaseId, collectionId) {
    return Promise.resolve({ $id: collectionId });
  }

  async listCollections(databaseId) {
    return Promise.resolve({ collections: [] });
  }
}

// Mock Storage class
export class Storage {
  constructor(client) {
    this.client = client;
  }

  async createFile(bucketId, fileId, file, permissions = []) {
    return Promise.resolve({ $id: fileId, name: file.name });
  }

  async updateFile(bucketId, fileId, file) {
    return Promise.resolve({ $id: fileId, name: file.name });
  }

  async deleteFile(bucketId, fileId) {
    return Promise.resolve({});
  }

  async getFile(bucketId, fileId) {
    return Promise.resolve({ $id: fileId });
  }

  async listFiles(bucketId, queries = []) {
    return Promise.resolve({ files: [], total: 0 });
  }

  getFileView(bucketId, fileId) {
    return `https://mock-storage.example.com/${bucketId}/${fileId}`;
  }

  getFileDownload(bucketId, fileId) {
    return `https://mock-storage.example.com/${bucketId}/${fileId}/download`;
  }

  getFilePreview(bucketId, fileId) {
    return `https://mock-storage.example.com/${bucketId}/${fileId}/preview`;
  }
}

// Mock ID utility
export const ID = {
  unique: () => `mock-id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  custom: (id) => id,
};

// Mock Permission and Role
export const Permission = {
  read: (role) => `read("${role}")`,
  write: (role) => `write("${role}")`,
  delete: (role) => `delete("${role}")`,
  update: (role) => `update("${role}")`,
};

export const Role = {
  any: () => 'any',
  user: (userId) => `user:${userId}`,
  team: (teamId, role = '') => `team:${teamId}${role ? `/${role}` : ''}`,
};

// Mock Query
export const Query = {
  equal: (attribute, value) => ({ attribute, operator: 'equal', value }),
  notEqual: (attribute, value) => ({ attribute, operator: 'notEqual', value }),
  lessThan: (attribute, value) => ({ attribute, operator: 'lessThan', value }),
  lessThanEqual: (attribute, value) => ({ attribute, operator: 'lessThanEqual', value }),
  greaterThan: (attribute, value) => ({ attribute, operator: 'greaterThan', value }),
  greaterThanEqual: (attribute, value) => ({ attribute, operator: 'greaterThanEqual', value }),
  search: (attribute, value) => ({ attribute, operator: 'search', value }),
  orderDesc: (attribute) => ({ attribute, operator: 'orderDesc' }),
  orderAsc: (attribute) => ({ attribute, operator: 'orderAsc' }),
  limit: (limit) => ({ operator: 'limit', value: limit }),
  offset: (offset) => ({ operator: 'offset', value: offset }),
  cursorAfter: (documentId) => ({ operator: 'cursorAfter', value: documentId }),
  cursorBefore: (documentId) => ({ operator: 'cursorBefore', value: documentId }),
};

// Mock Models (if needed)
export const Models = {
  // Add any model types that might be used
};

// Legacy exports for backward compatibility
export const AppwriteProvider = ({ children }) => {
  return children;
};

export const useAppwrite = () => ({
  account: new Account(new Client()),
  databases: new Databases(new Client()),
  storage: new Storage(new Client()),
});

export default {
  Client,
  Account,
  Databases,
  Storage,
  ID,
  Permission,
  Role,
  Query,
  Models,
  AppwriteProvider,
  useAppwrite,
};

// Utility function to clear mock data (useful for testing)
export const clearMockData = () => {
  try {
    localStorage.removeItem('mock-appwrite-user');
    localStorage.removeItem('mock-appwrite-sessions');
    console.log('Mock data cleared');
  } catch (error) {
    console.warn('Failed to clear mock data:', error);
  }
};

// Utility function to set mock user data (useful for testing)
export const setMockUser = (userData) => {
  try {
    localStorage.setItem('mock-appwrite-user', JSON.stringify(userData));
    console.log('Mock user data set:', userData);
  } catch (error) {
    console.warn('Failed to set mock user data:', error);
  }
};

// Development helper for testing different user scenarios
if (typeof window !== 'undefined') {
  window.mockAppwrite = {
    clearData: clearMockData,
    setUser: setMockUser,
    createTestUser: (name = 'Test User', email = 'test@example.com') => {
      const userData = {
        $id: 'test-user-' + Date.now(),
        email: email,
        name: name,
        prefs: { userType: 'landlord' },
        status: true,
        registration: new Date().toISOString(),
        emailVerification: true,
        phoneVerification: false,
      };
      setMockUser(userData);
      return userData;
    },
    getCurrentUser: () => {
      try {
        const storedUser = localStorage.getItem('mock-appwrite-user');
        return storedUser ? JSON.parse(storedUser) : null;
      } catch (error) {
        return null;
      }
    }
  };
  
  console.log('Mock Appwrite development helpers available at window.mockAppwrite');
  console.log('Usage:');
  console.log('- window.mockAppwrite.clearData() - Clear all mock data');
  console.log('- window.mockAppwrite.setUser(userData) - Set specific user data');
  console.log('- window.mockAppwrite.createTestUser("John Doe", "john@example.com") - Create test user');
  console.log('- window.mockAppwrite.getCurrentUser() - Get current mock user');
} 
// Mock implementation for react-native-appwrite on web

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
}

// Mock Account class
export class Account {
  constructor(client) {
    this.client = client;
  }

  async create(userId, email, password, name) {
    console.log('Mock: Creating account for', email);
    return {
      $id: userId,
      email,
      name,
      prefs: {},
      status: true,
      registration: new Date().toISOString(),
      emailVerification: false,
      phoneVerification: false,
    };
  }

  async createEmailPasswordSession(email, password) {
    console.log('Mock: Creating email password session for', email);
    return {
      $id: 'mock-session-id',
      userId: 'mock-user-id',
      expire: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      provider: 'email',
      providerUid: email,
      current: true,
    };
  }

  async getSession(sessionId = 'current') {
    console.log('Mock: Getting session', sessionId);
    if (sessionId === 'current') {
      return {
        $id: 'mock-session-id',
        userId: 'mock-user-id',
        expire: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        provider: 'email',
        providerUid: 'mock@example.com',
        current: true,
      };
    }
    throw new Error('Session not found');
  }

  async get() {
    console.log('Mock: Getting current user');
    return {
      $id: 'mock-user-id',
      email: 'mock@example.com',
      name: 'Mock User',
      prefs: { userType: 'landlord' },
      status: true,
      registration: new Date().toISOString(),
      emailVerification: true,
      phoneVerification: false,
    };
  }

  async deleteSession(sessionId) {
    console.log('Mock: Deleting session', sessionId);
    return {};
  }

  async updateEmail() {
    return Promise.resolve({});
  }

  async updatePassword() {
    return Promise.resolve({});
  }

  async updateName() {
    return Promise.resolve({});
  }

  async deleteSessions() {
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
    return Promise.resolve({});
  }

  async getSessions() {
    return Promise.resolve([]);
  }

  async listIdentities() {
    return Promise.resolve([]);
  }

  async listSessions() {
    return Promise.resolve([]);
  }

  async updatePrefs() {
    return Promise.resolve({});
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
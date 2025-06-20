import {
  Client,
  Account,
  ID,
  Databases,
  OAuthProvider,
  Avatars,
  Query,
  Storage,
} from "react-native-appwrite";
import * as Linking from "expo-linking";
import { openAuthSessionAsync } from "expo-web-browser";

// ✅ Appwrite Config
export const config = {
  platform: "com.monopolyinc.makazifasta",
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
  galleriesCollectionId: process.env.EXPO_PUBLIC_APPWRITE_GALLERIES_COLLECTION_ID!,
  reviewsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID!,
  agentsCollectionId: process.env.EXPO_PUBLIC_APPWRITE_AGENTS_COLLECTION_ID!,
  propertiesCollectionId: process.env.EXPO_PUBLIC_APPWRITE_PROPERTIES_COLLECTION_ID!,
  bucketId: process.env.EXPO_PUBLIC_APPWRITE_BUCKET_ID!,
};

// ✅ Initialize SDK
export const client = new Client()
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platform);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const avatar = new Avatars(client);
export { ID }; // ✅ Export ID here

// ✅ OAuth Login
export async function login() {
  try {
    const redirectUri = Linking.createURL("/");

    const response = await account.createOAuth2Token(
      OAuthProvider.Google,
      redirectUri
    );
    if (!response) throw new Error("Create OAuth2 token failed");

    const browserResult = await openAuthSessionAsync(
      response.toString(),
      redirectUri
    );
    if (browserResult.type !== "success") throw new Error("OAuth flow failed");

    const url = new URL(browserResult.url);
    const secret = url.searchParams.get("secret")?.toString();
    const userId = url.searchParams.get("userId")?.toString();
    if (!secret || !userId) throw new Error("OAuth callback missing data");

    
    

    return true;
  } catch (error) {
    console.error("OAuth login error:", error);
    return false;
  }
}

// ✅ Logout
export async function logout() { 
  try {
    return await account.deleteSession("current");
  } catch (error) {
    console.error("Logout error:", error);
    return false;
  }
}

// ✅ Get current user
export async function getCurrentUser() {
  try {
    const result = await account.get();
    if (result?.$id) {
      const userAvatar = avatar.getInitials(result.name);
      return { ...result, avatar: userAvatar.toString() };
    }
    return null;
  } catch (error) {
    console.log("Get user error:", error);
    return null;
  }
}

// ✅ Latest properties
export async function getLatestProperties() {
  try {
    const result = await databases.listDocuments(
      config.databaseId,
      config.propertiesCollectionId,
      [Query.orderAsc("$createdAt"), Query.limit(5)]
    );
    return result.documents;
  } catch (error) {
    console.error("Fetch latest properties error:", error);
    return [];
  }
}

// ✅ Search properties
export async function getProperties({
  filter,
  query,
  limit,
}: {
  filter: string;
  query: string;
  limit?: number;
}) {
  try {
    const buildQuery = [Query.orderDesc("$createdAt")];

    if (filter && filter !== "All") {
      buildQuery.push(Query.equal("type", filter));
    }

    if (query) {
      buildQuery.push(
        Query.or([
          Query.search("name", query),
          Query.search("address", query),
          Query.search("type", query),
        ])
      );
    }

    if (limit) buildQuery.push(Query.limit(limit));

    const result = await databases.listDocuments(
      config.databaseId,
      config.propertiesCollectionId,
      buildQuery
    );

    return result.documents;
  } catch (error) {
    console.error("Get properties error:", error);
    return [];
  }
}

// ✅ Get property by ID
export async function getPropertyById({ id }: { id: string }) {
  try {
    return await databases.getDocument(
      config.databaseId,
      config.propertiesCollectionId,
      id
    );
  } catch (error) {
    console.error("Get property by ID error:", error);
    return null;
  }
}

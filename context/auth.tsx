import { useRootNavigation, useRouter, useSegments } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { client, account, ID } from "../utils/appwrite";
import { Models } from "appwrite";

// Define the AuthContextValue interface
interface SignInResponse {
  data: Models.User<Models.Preferences> | undefined;
  error: Error | undefined;
}

interface SignOutResponse {
  error: any | undefined;
  data: {} | undefined;
}

interface AuthContextValue {
  signIn: (e: string, p: string) => Promise<SignInResponse>;
  signUp: (e: string, p: string, n: string) => Promise<SignInResponse>;
  signOut: () => Promise<SignOutResponse>;
  user: Models.User<Models.Preferences> | null;
  authInitialized: boolean;
}

// Define the Provider component
interface ProviderProps {
  children: React.ReactNode;
}

// Create the AuthContext
const AuthContext = React.createContext<AuthContextValue | undefined>(
  undefined
);

export function AuthContextProvider(props: ProviderProps) {
  const [user, setAuth] =
    React.useState<Models.User<Models.Preferences> | null>(null);
  const [authInitialized, setAuthInitialized] = React.useState<boolean>(false);

  const useProtectedRoute = (user: Models.User<Models.Preferences> | null) => {
    const segments = useSegments();
    const router = useRouter();

    React.useEffect(() => {
      if (!authInitialized) return;

      const inAuthGroup = segments[0] === "(auth)";

      // Only redirect to welcome page if not authenticated and not in auth group
      if (!user && !inAuthGroup) {
        router.replace("/");
      }
    }, [user, segments, authInitialized]);
  };

  useEffect(() => {
    (async () => {
      try {
        const user = await account.get();
        console.log(user);
        setAuth(user);
      } catch (error) {
        console.log("error", error);
        setAuth(null);
      }

      setAuthInitialized(true);
      console.log("initialize ", user);
    })();
  }, []);

  const logout = async (): Promise<SignOutResponse> => {
    try {
      const response = await account.deleteSession("current");
      return { error: undefined, data: response };
    } catch (error) {
      return { error, data: undefined };
    } finally {
      setAuth(null);
    }
  };

  const login = async (
    email: string,
    password: string
  ): Promise<SignInResponse> => {
    try {
      // First, try to delete the current session
      await account.deleteSession('current')
        .catch(() => {
          // Ignore error if no session exists
        });

      // Now create a new session
      await account.createEmailPasswordSession(email, password);
      const user = await account.get();
      setAuth(user);
      return { data: user, error: undefined };
    } catch (error) {
      setAuth(null);
      return { error: error as Error, data: undefined };
    }
  };

  const createAcount = async (
    email: string,
    password: string,
    username: string
  ): Promise<SignInResponse> => {
    try {
      // First, try to delete the current session
      await account.deleteSession('current')
        .catch(() => {
          // Ignore error if no session exists
        });

      // Create account
      await account.create(ID.unique(), email, password, username);
      
      // Create session
      await account.createEmailPasswordSession(email, password);
      const user = await account.get();
      setAuth(user);
      return { data: user, error: undefined };
    } catch (error) {
      setAuth(null);
      return { error: error as Error, data: undefined };
    }
  };

  useProtectedRoute(user);

  return (
    <AuthContext.Provider
      value={{
        signIn: login,
        signOut: logout,
        signUp: createAcount,
        user,
        authInitialized,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }

  return authContext;
};

// Helper function to determine user type
function userTypeIsLandlord(user: Models.User<Models.Preferences>) {
  return user.prefs?.userType === "landlord" || 
         (!user.prefs?.userType && user.email?.includes("landlord"));
}
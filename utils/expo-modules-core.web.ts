// Mock implementation of expo-modules-core for web
export function requireOptionalNativeModule(name: string) {
  return {
    get: () => {
      console.warn(`Native module "${name}" is not available on web platform`);
      return null;
    }
  };
}

export function requireNativeModule(name: string) {
  return {
    get: () => {
      console.warn(`Native module "${name}" is not available on web platform`);
      return null;
    }
  };
}

export function requireNativeViewManager(name: string) {
  return {
    get: () => {
      console.warn(`Native view manager "${name}" is not available on web platform`);
      return null;
    }
  };
}

export const NativeModulesProxy = {
  ExponentConstants: {
    getWebViewUserAgentAsync: async () => navigator.userAgent,
    platform: { web: true },
    sessionId: 'web',
    statusBarHeight: 0,
    systemFonts: [],
    manifest: {},
  },
};

export default {
  requireOptionalNativeModule,
  requireNativeModule,
  requireNativeViewManager,
  NativeModulesProxy,
}; 
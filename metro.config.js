// Learn more https://docs.expo.io/guides/customizing-metro

// Extends the default Expo Metro config
const { getDefaultConfig } = require('@expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // [Web-only]: Enables CSS support.
  isCSSEnabled: true,
});

// Add resolution for web packages
config.resolver.sourceExts = process.env.RN_TARGET_ENV === 'web' 
  ? ['web.tsx', 'tsx', 'web.ts', 'ts', 'web.jsx', 'jsx', 'web.js', 'js', 'json', 'cjs', 'mjs']
  : ['tsx', 'ts', 'jsx', 'js', 'json', 'cjs', 'mjs'];

// Add fallback resolutions
config.resolver.resolverMainFields = ['browser', 'module', 'main'];

// Ensure packages use correct environment
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Handle react-native-maps on web
  if (moduleName === 'react-native-maps' && platform === 'web') {
    return {
      filePath: path.resolve(__dirname, './react-native-maps-web-mock.js'),
      type: 'sourceFile',
    };
  }

  // Handle React Three Fiber compatibility issues on web
  if (platform === 'web' && (
    moduleName === '@react-three/fiber' ||
    moduleName === '@react-three/drei'
  )) {
    // Return a mock implementation for web to avoid React 19 compatibility issues
    return {
      filePath: path.resolve(__dirname, './react-three-fiber-web-mock.js'),
      type: 'sourceFile',
    };
  }

  // Handle react-native-appwrite on web
  if (moduleName === 'react-native-appwrite' && platform === 'web') {
    return {
      filePath: path.resolve(__dirname, './react-native-appwrite-web-mock.js'),
      type: 'sourceFile',
    };
  }

  // Handle Radix UI packages on web
  if (platform === 'web' && (
    moduleName === '@radix-ui/react-slot' ||
    moduleName === '@radix-ui/react-compose-refs'
  )) {
    return {
      filePath: path.resolve(__dirname, './radix-ui-web-mock.js'),
      type: 'sourceFile',
    };
  }

  // Handle Three.js related packages on web
  if (platform === 'web' && (
    moduleName === 'three' ||
    moduleName === 'three-stdlib' ||
    moduleName === '@react-spring/three' ||
    moduleName === '@react-spring/core' ||
    moduleName === '@react-spring/shared' ||
    moduleName === '@react-spring/animated' ||
    moduleName === '@react-spring/types' ||
    moduleName === '@react-spring/rafz' ||
    moduleName === 'hls.js' ||
    moduleName === 'stats-gl' ||
    moduleName === 'fflate' ||
    moduleName === 'react-use-measure'
  )) {
    // Return the original module for web - these should work on web
    return context.resolveRequest(context, moduleName, platform);
  }

  // Handle debug package
  if (moduleName === 'debug' && platform === 'web') {
    return {
      filePath: path.resolve(__dirname, 'node_modules/debug/src/browser.js'),
      type: 'sourceFile',
    };
  }
  
  // Handle expo-file-system
  if (moduleName.includes('expo-file-system') && platform === 'web') {
    return {
      filePath: path.resolve(__dirname, './expo-file-system-mock.js'),
      type: 'sourceFile',
    };
  }

  // Handle Platform module for web - all possible import paths
  if (platform === 'web' && (
    moduleName === '../Utilities/Platform' ||
    moduleName === '../../Utilities/Platform' ||
    moduleName === 'react-native/Libraries/Utilities/Platform' ||
    moduleName === 'react-native/Utilities/Platform' ||
    moduleName === './Platform'
  )) {
    return {
      filePath: path.resolve(__dirname, 'app/utils/platform.web.js'),
      type: 'sourceFile',
    };
  }

  // Handle AccessibilityInfo module for web
  if (moduleName === '../Components/AccessibilityInfo/legacySendAccessibilityEvent' && platform === 'web') {
    return {
      filePath: path.resolve(__dirname, 'app/utils/accessibility.web.js'),
      type: 'sourceFile',
    };
  }

  // Handle PlatformColorValueTypes module for web
  if (moduleName === './PlatformColorValueTypes' && platform === 'web') {
    return {
      filePath: path.resolve(__dirname, 'app/utils/platform-color.web.js'),
      type: 'sourceFile',
    };
  }

  // Handle RCTAlertManager module for web
  if (moduleName === './RCTAlertManager' && platform === 'web') {
    return {
      filePath: path.resolve(__dirname, 'app/utils/alert-manager.web.js'),
      type: 'sourceFile',
    };
  }

  // Handle RCTNetworking module for web
  if (moduleName === './RCTNetworking' && platform === 'web') {
    return {
      filePath: path.resolve(__dirname, 'app/utils/networking.web.js'),
      type: 'sourceFile',
    };
  }

  // Handle DevToolsSettingsManager module for web
  if (moduleName === '../DevToolsSettings/DevToolsSettingsManager' && platform === 'web') {
    return {
      filePath: path.resolve(__dirname, 'node_modules/react-native/Libraries/Core/DevToolsSettings/DevToolsSettingsManager.web.js'),
      type: 'sourceFile',
    };
  }

  return context.resolveRequest(context, moduleName, platform);
};

// Optimize bundling
config.transformer = {
  ...config.transformer,
  minifierPath: require.resolve('metro-minify-terser'),
  minifierConfig: {
    // Terser options
    compress: {
      reduce_vars: true,
      inline: 1,
    },
    mangle: true,
  },
};

// Handle Node.js specific modules
config.resolver.extraNodeModules = {
  'hls.js': require.resolve('hls.js'),
  // Use custom tty mock
  'tty': path.resolve(__dirname, './tty-mock.js'),
  // Other Node.js built-in modules
  'util': require.resolve('util/'),
  'os': require.resolve('os-browserify/browser.js'),
  'path': require.resolve('path-browserify'),
  'stream': require.resolve('stream-browserify'),
  'crypto': require.resolve('crypto-browserify'),
  // Three.js related modules
  'three': require.resolve('three'),
  'three-stdlib': require.resolve('three-stdlib'),
  '@react-spring/three': require.resolve('@react-spring/three'),
  '@react-spring/core': require.resolve('@react-spring/core'),
  '@react-spring/shared': require.resolve('@react-spring/shared'),
  '@react-spring/animated': require.resolve('@react-spring/animated'),
  '@react-spring/types': require.resolve('@react-spring/types'),
  '@react-spring/rafz': require.resolve('@react-spring/rafz'),
  'stats-gl': require.resolve('stats-gl'),
  'fflate': require.resolve('fflate'),
  'react-use-measure': require.resolve('react-use-measure'),
  // Explicitly mark unavailable modules
  'fs': false,
  'net': false,
};

// Add resolver alias for web platform
config.resolver.alias = {
  ...config.resolver.alias,
  // Mock react-native-maps for web
  'react-native-maps': 'react-native-maps-web-mock.js',
  // Mock Three.js and related packages for web
  'three': 'react-three-fiber-web-mock.js',
  '@react-three/fiber': 'react-three-fiber-web-mock.js',
  '@react-spring/three': 'react-three-fiber-web-mock.js',
  // Mock react-native-appwrite for web
  'react-native-appwrite': 'react-native-appwrite-web-mock.js',
  // Mock Radix UI packages for web
  '@radix-ui/react-slot': 'radix-ui-web-mock.js',
  '@radix-ui/react-compose-refs': 'radix-ui-web-mock.js',
  '@radix-ui/react-dialog': 'radix-ui-web-mock.js',
  '@radix-ui/react-dropdown-menu': 'radix-ui-web-mock.js',
  '@radix-ui/react-popover': 'radix-ui-web-mock.js',
  '@radix-ui/react-select': 'radix-ui-web-mock.js',
  '@radix-ui/react-tabs': 'radix-ui-web-mock.js',
  '@radix-ui/react-toast': 'radix-ui-web-mock.js',
  '@radix-ui/react-tooltip': 'radix-ui-web-mock.js',
  '@radix-ui/react-accordion': 'radix-ui-web-mock.js',
  '@radix-ui/react-alert-dialog': 'radix-ui-web-mock.js',
  '@radix-ui/react-aspect-ratio': 'radix-ui-web-mock.js',
  '@radix-ui/react-avatar': 'radix-ui-web-mock.js',
  '@radix-ui/react-checkbox': 'radix-ui-web-mock.js',
  '@radix-ui/react-collapsible': 'radix-ui-web-mock.js',
  '@radix-ui/react-context-menu': 'radix-ui-web-mock.js',
  '@radix-ui/react-hover-card': 'radix-ui-web-mock.js',
  '@radix-ui/react-label': 'radix-ui-web-mock.js',
  '@radix-ui/react-menubar': 'radix-ui-web-mock.js',
  '@radix-ui/react-navigation-menu': 'radix-ui-web-mock.js',
  '@radix-ui/react-progress': 'radix-ui-web-mock.js',
  '@radix-ui/react-radio-group': 'radix-ui-web-mock.js',
  '@radix-ui/react-scroll-area': 'radix-ui-web-mock.js',
  '@radix-ui/react-separator': 'radix-ui-web-mock.js',
  '@radix-ui/react-slider': 'radix-ui-web-mock.js',
  '@radix-ui/react-switch': 'radix-ui-web-mock.js',
  '@radix-ui/react-toggle': 'radix-ui-web-mock.js',
  '@radix-ui/react-toggle-group': 'radix-ui-web-mock.js',
  '@radix-ui/react-visually-hidden': 'radix-ui-web-mock.js',
};

module.exports = config;

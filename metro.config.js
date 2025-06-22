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
  // Explicitly mark unavailable modules
  'fs': false,
  'net': false,
};

module.exports = config;

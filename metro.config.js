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

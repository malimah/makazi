// Mock implementation of expo-file-system for web environment
class FileSystemManager {}

export default {
  FileSystemManager,
  documentDirectory: '/',
  cacheDirectory: '/cache',
  bundleDirectory: '/bundle',
  downloadAsync: async () => ({ uri: '' }),
  getInfoAsync: async () => ({ exists: false, isDirectory: false }),
  readAsStringAsync: async () => '',
  writeAsStringAsync: async () => {},
  deleteAsync: async () => {},
  moveAsync: async () => {},
  copyAsync: async () => {},
  makeDirectoryAsync: async () => {},
  readDirectoryAsync: async () => [],
  createDownloadResumable: () => ({
    downloadAsync: async () => ({ uri: '' }),
    pauseAsync: async () => ({}),
    resumeAsync: async () => ({ uri: '' }),
    savable: () => ({})
  })
}; 
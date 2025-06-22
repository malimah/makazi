<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 7d4c60d015541a4f25748aad69741d4a011bf74c
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
<<<<<<< HEAD
=======
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
>>>>>>> 07f5fb1884e5e59842ddd2d4f473ffffd327cd6e
=======
>>>>>>> 7d4c60d015541a4f25748aad69741d4a011bf74c
}; 
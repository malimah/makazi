# Makazi Project

## Configuration and Setup Guide

### Project Overview
A React Native Expo project with web support, using React Three Fiber and Appwrite integration.

### Key Configurations

#### Metro Configuration
The project uses a custom Metro configuration (`metro.config.js`) to handle web compatibility:

- Custom module resolution for web platform
- Node.js polyfills and mocks
- Optimized bundling configuration
- Proper handling of problematic packages (three.js, react-use-measure)

#### Mock Implementations
Custom mocks have been implemented to ensure web compatibility:

1. `tty-mock.js`: Provides TTY functionality for web environment
2. `expo-file-system-mock.js`: Mocks Expo's file system for web platform

### Development Guidelines

#### Package Management
- Use exact versions in package.json
- Verify web compatibility before adding new packages
- Prefer Expo SDK packages when available
- Test packages in web environment before implementation

#### Code Organization
```
project/
├── app/                  # Main application code
├── components/          # Reusable components
├── constants/          # App constants
├── context/           # React context files
├── hooks/            # Custom hooks
├── lib/             # Third-party integrations
├── styles/         # Style definitions
├── types/         # TypeScript type definitions
└── utils/        # Utility functions
```

#### Configuration Files
- `metro.config.js`: Metro bundler configuration
- `tty-mock.js`: TTY implementation for web
- `expo-file-system-mock.js`: File system mock for web
- `babel.config.js`: Babel configuration
- `tsconfig.json`: TypeScript configuration

### Current Working Dependencies
```json
{
  "expo": "~50.0.6",
  "react": "18.2.0",
  "react-native": "0.73.6",
  "react-native-web": "~0.19.10",
  "@react-three/fiber": "^8.15.19",
  "@react-three/drei": "^9.99.0",
  "react-native-appwrite": "^0.9.0"
}
```

### Best Practices

#### Error Handling
- Implement try-catch blocks for async operations
- Use error boundaries for component error handling
- Provide fallback UI for error states
- Log errors appropriately

#### Performance
- Lazy load heavy components
- Implement proper loading states
- Use web-specific optimizations when needed
- Monitor bundle size

#### Web Compatibility
- Test features in both native and web environments
- Use platform-specific files (.web.tsx) when needed
- Handle browser-specific features gracefully
- Maintain polyfills and mocks up-to-date

### Common Issues and Solutions

1. **Module Resolution Issues**
   - Use the configured mock files
   - Check package web compatibility
   - Update metro.config.js if needed

2. **Performance Issues**
   - Clear Metro cache: `expo start --clear`
   - Use production builds for testing
   - Monitor bundle size

3. **Development Workflow**
   - Regular testing on web platform
   - Clear cache when adding new packages
   - Follow error logs and warnings

### Maintenance

#### Regular Maintenance Tasks
- Keep dependencies updated
- Monitor and update mock implementations
- Review and update polyfills
- Check for deprecated features

#### Before Adding New Features
1. Verify package compatibility
2. Test in web environment
3. Update configuration if needed
4. Document changes

### Troubleshooting

If you encounter issues:

1. Clear Expo cache:
```bash
expo start --clear
```

2. Check for package conflicts:
```bash
npm ls <package-name>
```

3. Verify web compatibility:
- Test in web environment
- Check console for errors
- Review package documentation

### Contributing

When adding new features:
1. Follow existing code structure
2. Test web compatibility
3. Update documentation
4. Add appropriate error handling

### License
[Your License Here] 
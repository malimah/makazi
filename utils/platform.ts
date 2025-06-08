import { Platform, Dimensions } from 'react-native';

export const isWeb = Platform.OS === 'web';
export const isIOS = Platform.OS === 'ios';
export const isAndroid = Platform.OS === 'android';

export const platformSelect = <T extends Record<string, any>>(options: {
  web?: T,
  ios?: T,
  android?: T,
  default: T
}): T => {
  if (isWeb && options.web) return options.web;
  if (isIOS && options.ios) return options.ios;
  if (isAndroid && options.android) return options.android;
  return options.default;
};

export const getWindowDimensions = () => {
  const { width, height } = Dimensions.get('window');
  return { width, height };
};

// Platform specific styles
export const platformStyles = {
  // Shadow implementation for all platforms
  shadow: {
    ...platformSelect({
      web: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
    }),
  },
  
  // Touch feedback
  touchFeedback: {
    ...platformSelect({
      ios: {
        opacity: 0.7,
      },
      android: {
        ripple: true,
        rippleColor: 'rgba(0, 0, 0, 0.1)',
      },
      web: {
        cursor: 'pointer',
        transition: 'transform 0.2s',
        ':hover': {
          transform: 'scale(1.02)',
        },
      },
      default: {},
    }),
  },

  // Font families
  fontFamily: platformSelect({
    ios: {
      regular: 'System',
      medium: 'System',
      bold: 'System',
    },
    android: {
      regular: 'Roboto',
      medium: 'Roboto-Medium',
      bold: 'Roboto-Bold',
    },
    web: {
      regular: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      medium: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      bold: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    },
    default: {
      regular: 'System',
      medium: 'System',
      bold: 'System',
    },
  }),
}; 
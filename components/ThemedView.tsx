import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  const theme = useTheme();
  return <View style={[{ backgroundColor: theme.background }, style]} {...otherProps} />;
}
// components/ThemedView.tsx
import { useTheme } from "../theme";


// hooks/useThemeColor.ts
import Colors from '@/constants/Colors';
import { useColorScheme } from './useColorScheme';

type ThemeProps = { light?: string; dark?: string };

export function useThemeColor(
  props: ThemeProps,
  colorName: keyof typeof Colors['light']
) {
  const theme = useColorScheme();
  return props[theme] ?? Colors[theme][colorName];
}

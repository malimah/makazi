// hooks/useColorScheme.web.ts
import { useEffect, useState } from 'react';
import { Appearance } from 'react-native';

export function useColorScheme(): 'light' | 'dark' {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const colorScheme = Appearance.getColorScheme();
    setTheme(colorScheme === 'dark' ? 'dark' : 'light');
  }, []);

  return theme;

}

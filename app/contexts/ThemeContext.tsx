import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { lightColors, darkColors, ThemeColors } from '../theme';

export type ThemeMode = 'light' | 'dark' | 'system';

export type { ThemeColors };

interface ThemeContextData {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  colors: ThemeColors;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemColorScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>('system');

  const isDark = mode === 'system' ? systemColorScheme === 'dark' : mode === 'dark';

  // Definição das cores dinâmicas (claro vs escuro)
  const colors: ThemeColors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ mode, setMode, colors, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
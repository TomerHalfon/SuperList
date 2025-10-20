'use client';

import { createContext, useContext } from 'react';
import { ThemeMode, THEME_MODES, THEME_INFO } from '@/types/theme';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  availableThemes: ThemeMode[];
  themeInfo: typeof THEME_INFO;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export { ThemeContext };

'use client';

import React, { useEffect, useState, ReactNode } from 'react';
import { ThemeMode, THEME_MODES, THEME_INFO, STORAGE_KEY } from '@/types/theme';
import { ThemeContext } from '@/hooks/useTheme';

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>('light');
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const initializeTheme = () => {
      try {
        // Check localStorage first
        const storedTheme = localStorage.getItem(STORAGE_KEY) as ThemeMode;
        
        if (storedTheme && THEME_MODES.includes(storedTheme)) {
          setThemeState(storedTheme);
        } else {
          // Detect system preference for light/dark only
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          const systemTheme: ThemeMode = prefersDark ? 'dark' : 'light';
          setThemeState(systemTheme);
          
          // Store the detected preference
          localStorage.setItem(STORAGE_KEY, systemTheme);
        }
      } catch (error) {
        console.warn('Failed to initialize theme:', error);
        // Fallback to light theme
        setThemeState('light');
      } finally {
        setIsInitialized(true);
      }
    };

    initializeTheme();
  }, []);

  const setTheme = (newTheme: ThemeMode) => {
    try {
      setThemeState(newTheme);
      localStorage.setItem(STORAGE_KEY, newTheme);
      
      // Future: Sync with database when user authentication is implemented
      // await syncThemeWithDatabase(newTheme);
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }
  };

  const value = {
    theme,
    setTheme,
    availableThemes: THEME_MODES,
    themeInfo: THEME_INFO,
  };

  // Don't render children until theme is initialized to prevent flash
  if (!isInitialized) {
    return null;
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

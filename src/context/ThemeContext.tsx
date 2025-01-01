import React, { createContext, useContext, useState, useEffect } from 'react';
import { Theme, ThemeContextType } from '../types/theme';
import { useSettings } from '../hooks/useSettings';
import { settingsService } from '../services/settings/settings.service';

const THEME_STORAGE_KEY = 'theme-preference';
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useSettings();
  const [theme, setTheme] = useState<Theme>(() => {
    // First check localStorage
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (storedTheme === 'light' || storedTheme === 'dark') {
      return storedTheme;
    }
    // Fallback to settings or default
    return settings?.defaultTheme || 'dark';
  });

  // Apply theme class
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Initialize theme from settings when they load
  useEffect(() => {
    if (!localStorage.getItem(THEME_STORAGE_KEY) && settings?.defaultTheme) {
      setTheme(settings.defaultTheme);
    }
  }, [settings?.defaultTheme]);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    
    // Always update localStorage
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
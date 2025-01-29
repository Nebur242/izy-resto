import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSettings } from '../hooks/useSettings';
import { Theme, ThemeContextType } from '../types/theme';
const THEME_STORAGE_KEY = 'theme-preference';
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useSettings();
  const [theme, setTheme] = useState<Theme>(() => {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (storedTheme === 'light' || storedTheme === 'dark') {
      return storedTheme;
    }
    return settings?.defaultTheme || 'dark';
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    if (theme === 'dark') {
      if (settings?.theme?.paletteColor?.colors[0]?.darkBgColor) {
        document.documentElement.style.setProperty('--dark-bg', `#111827`);
      } else {
        document.documentElement.style.setProperty('--dark-bg', '#111827');
      }
    } else {
      document.documentElement.style.setProperty('--dark-bg', '#F9FAFB');
    }
  }, [theme, settings]);

  useEffect(() => {
    if (!localStorage.getItem(THEME_STORAGE_KEY) && settings?.defaultTheme) {
      setTheme(settings.defaultTheme);
    }
  }, [settings?.defaultTheme]);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
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

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSettings } from '../hooks/useSettings';
import { Theme, ThemeContextType } from '../types/theme';

const THEME_STORAGE_KEY = 'theme-preference';
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useSettings();

  // Fonction pour extraire la couleur hexadécimale
  function extractHexColor(className: string) {
    const regex = /bg-\[#([0-9A-Fa-f]{6})\]/;
    const match = className.match(regex);
    return match ? match[1] : null; // Retourne le code hex ou null si aucune correspondance
  }

  // Initialisation du thème, avec gestion de l'état par défaut
  const [theme, setTheme] = useState<Theme>(() => {
    // Premier contrôle: vérifier le localStorage
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (storedTheme === 'light' || storedTheme === 'dark') {
      return storedTheme;
    }
    // Sinon, retour à settings ou valeur par défaut
    return settings?.defaultTheme || 'dark';
  });

  // Appliquer la classe de thème et changer la couleur de fond en fonction du thème
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');

    // Appliquer la couleur de fond personnalisée en fonction du thème
    if (theme === 'dark') {
      // Utiliser la couleur de fond définie dans les paramètres
      if (settings?.theme?.paletteColor?.colors[0]?.darkBgColor) {
        const bgColor = extractHexColor(
          settings?.theme?.paletteColor?.colors[0]?.class as string
        );
        document.documentElement.style.setProperty(
          '--dark-bg',
          bgColor ? `#${bgColor}` : '#111827' // Couleur de fond par défaut si non définie
        );
      } else {
        document.documentElement.style.setProperty(
          '--dark-bg',
          '#111827' // Couleur de fond par défaut si non définie
        );
      }
    } else {
      document.documentElement.style.setProperty(
        '--dark-bg',
        '#F9FAFB' // Couleur de fond par défaut si non définie
      );
    }
  }, [theme, settings?.theme?.paletteColor?.colors]);

  // Initialiser le thème depuis les paramètres lorsque ceux-ci sont chargés
  useEffect(() => {
    if (!localStorage.getItem(THEME_STORAGE_KEY) && settings?.defaultTheme) {
      setTheme(settings.defaultTheme);
    }
  }, [settings?.defaultTheme]);

  // Fonction pour basculer le thème
  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';

    // Mise à jour du localStorage
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

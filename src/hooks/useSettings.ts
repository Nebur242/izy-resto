import { useState, useEffect } from 'react';
import { settingsService } from '../services/settings/settings.service';

export interface RestaurantSettings {
  name: string;
  description: string;
  coverImage: string;
  email?: string;
  currency: 'USD' | 'EUR' | 'XOF';
  openingHours: {
    [key: string]: { open: string; close: string; closed: boolean };
  };
}

export function useSettings() {
  const [settings, setSettings] = useState<RestaurantSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const data = await settingsService.getSettings();
      setSettings(data);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (newSettings: RestaurantSettings) => {
    try {
      await settingsService.updateSettings(newSettings);
      setSettings(newSettings);
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  };

  return { settings, isLoading, updateSettings };
}

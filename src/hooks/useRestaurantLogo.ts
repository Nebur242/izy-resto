import { useState, useEffect } from 'react';
import { settingsService } from '../services/settings/settings.service';
import toast from 'react-hot-toast';

export function useRestaurantLogo() {
  const [logo, setLogo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLogo = async () => {
      try {
        setIsLoading(true);
        const settings = await settingsService.getSettings();
        setLogo(settings?.logo || null);
      } catch (error) {
        console.error('Error loading restaurant logo:', error);
        toast.error('Echec du chargement du logo');
      } finally {
        setIsLoading(false);
      }
    };

    loadLogo();
  }, []);

  return { logo, isLoading };
}
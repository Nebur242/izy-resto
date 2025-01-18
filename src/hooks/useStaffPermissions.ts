import { useState, useEffect } from 'react';
import { settingsService } from '../services/settings/settings.service';

export function useStaffPermissions() {
  const [allowedRoutes, setAllowedRoutes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStaffPermissions();
  }, []);

  const loadStaffPermissions = async () => {
    try {
      const settings = await settingsService.getSettings();
      setAllowedRoutes(settings?.staffPermissions || []);
    } catch (error) {
      console.error('Error loading staff permissions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStaffPermissions = async (routes: string[]) => {
    try {
      await settingsService.updateSettings({ staffPermissions: routes });
      setAllowedRoutes(routes);
    } catch (error) {
      console.error('Error updating staff permissions:', error);
      throw error;
    }
  };

  return {
    allowedRoutes,
    isLoading,
    updateStaffPermissions
  };
}